import { Resend } from 'resend';

let resendClient: Resend | null = null;

/**
 * Returns a lazily initialized Resend client.
 * This prevents the application from crashing on startup if the API key is missing.
 */
export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required for email delivery. Please configure it in your Settings or .env file.');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

/**
 * Converts technical Resend errors (domain validation, sandbox restrictions, API key issues)
 * into friendly, clear, plain-English messages for non-technical users.
 */
function translateResendError(error: any): Error {
  if (!error) {
    return new Error("The email delivery service is experiencing a temporary issue. Please try again later or copy the details directly.");
  }

  const errMsg = (error.message || '').toLowerCase();
  const errName = (error.name || '').toLowerCase();
  const errCode = (error.code || '').toLowerCase();
  
  const isValidationError = errName.includes('validation') || 
                           errName.includes('verify') || 
                           errName.includes('restriction') ||
                           errCode.includes('restriction') ||
                           errCode.includes('validation') ||
                           errMsg.includes('verify') || 
                           errMsg.includes('restriction') || 
                           errMsg.includes('not verified') || 
                           errMsg.includes('unauthorized') || 
                           errMsg.includes('onboarding') ||
                           errMsg.includes('registered') ||
                           errMsg.includes('sandbox') ||
                           errMsg.includes('domain not verified');
                           
  if (isValidationError) {
    const e = new Error("This email is currently restricted to verified recipients. Please copy the details manually if you cannot verify this address in your email provider settings.");
    (e as any).code = "EMAIL_DELIVERY_FAILURE";
    (e as any).status = 403;
    (e as any).name = "validation_error";
    return e;
  }
  
  const isAuthError = errName.includes('auth') || 
                      errName.includes('invalid_api') || 
                      errMsg.includes('api key') || 
                      errMsg.includes('unauthorized') || 
                      errMsg.includes('forbidden') ||
                      errMsg.includes('api_key');
                      
  if (isAuthError) {
    const e = new Error("Our email service is currently offline. Please configure your API key in the settings panel.");
    (e as any).code = "EMAIL_AUTH_FAILURE";
    (e as any).status = 401;
    return e;
  }
  
  const e = new Error("The email delivery service is experiencing a temporary issue. Please try again later or copy the details directly.");
  (e as any).code = "EMAIL_GENERAL_FAILURE";
  return e;
}

/**
 * Resolves a sender address dynamically. If the environment variable RESEND_FROM_EMAIL is set,
 * its email part overrides the hardcoded domain-specific part while preserving display names.
 */
function resolveFromAddress(requestedFrom: string): string {
  const envFrom = process.env.RESEND_FROM_EMAIL;
  
  // Extract display name from requestedFrom if present
  // e.g., "DinnerByDesign Support <support@dinnerbydesign.com>" -> "DinnerByDesign Support"
  let displayName = "";
  const match = requestedFrom.match(/^(.*?)\s*<.*?>/);
  if (match && match[1]) {
    displayName = match[1].trim();
  } else if (!requestedFrom.includes('<') && !requestedFrom.includes('@')) {
    displayName = requestedFrom.trim();
  }

  if (!envFrom) {
    // If no custom verified sender is provided in the environment, we MUST use onboarding@resend.dev
    // to ensure successful delivery for sandbox environments and standard free tier users.
    if (displayName) {
      return `${displayName} <onboarding@resend.dev>`;
    }
    return 'DinnerByDesign <onboarding@resend.dev>';
  }
  
  // If envFrom already has a display name, use it as is
  if (envFrom.includes('<')) {
    return envFrom;
  }
  
  // Otherwise, pair the requested display name with the env email
  if (displayName) {
    return `${displayName} <${envFrom}>`;
  }
  
  return envFrom;
}

/**
 * Simple helper to send an email with fallback.
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = 'DinnerByDesign <chef@dinnerbydesign.app>',
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  const resend = getResendClient();
  const resolvedFrom = resolveFromAddress(from);
  
  try {
    console.log(`[Resend] Attempting standard email send to: ${to}, subject: ${subject}, from: ${resolvedFrom}`);
    const { data, error } = await resend.emails.send({
      from: resolvedFrom,
      to,
      subject,
      html,
    });

    if (!error) {
      console.log(`[Resend] Email successfully sent from standard sender: ${from}`);
      return data;
    }

    console.log('[Resend] Standard send returned fallback-eligible status:', JSON.stringify(error, null, 2));
    
    // Check if validation/verification error occurred and can be bypassed using onboarding sender
    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = (error as any).code?.toLowerCase() || '';
    const isValidationError = (error as any).name === 'validation_error' ||
                             (error as any).name === 'RESEND_RESTRICTION' ||
                             (error as any).name === 'restriction_error' || 
                             errorCode.includes('validation') ||
                             errorCode.includes('restriction') ||
                             errorMessage.includes('verify') || 
                             errorMessage.includes('restriction') || 
                             errorMessage.includes('not verified') ||
                             errorMessage.includes('unauthorized') ||
                             errorMessage.includes('sandbox') ||
                             errorMessage.includes('registered');

    if (isValidationError && resolvedFrom !== 'DinnerByDesign <onboarding@resend.dev>' && resolvedFrom !== 'onboarding@resend.dev') {
      console.log('[Resend] Domain verification/validation issue detected. Retrying with onboarding@resend.dev...');
      const fallbackFrom = 'DinnerByDesign <onboarding@resend.dev>';
      const retryResult = await resend.emails.send({
        from: fallbackFrom,
        to,
        subject,
        html,
      });
      
      if (retryResult.error) {
        console.log('[Resend] Fallback retry also returned status:', JSON.stringify(retryResult.error, null, 2));
        throw translateResendError(retryResult.error);
      }
      
      console.log('[Resend] Email successfully sent using fallback sender onboarding@resend.dev!');
      return retryResult.data;
    }
    
    throw translateResendError(error);
  } catch (err: any) {
    const isSandboxError = err.message?.toLowerCase().includes("restricted") || (err as any).name === "RESEND_RESTRICTION" || (err as any).name === "validation_error";
    
    if (isSandboxError) {
      console.log('[Resend Sandbox Notice]:', err.message);
    } else {
      console.warn('[Resend Handled Exception]:', err.message || err);
    }
    // If it's already one of our translated friendly errors, throw it directly
    const errorMsg = err.message || '';
    if (errorMsg.includes("could not be delivered") || 
        errorMsg.includes("currently offline") || 
        errorMsg.includes("experiencing a temporary issue")) {
      throw err;
    }
    
    // Fallback try in catch block as well for general errors
    if (resolvedFrom !== 'DinnerByDesign <onboarding@resend.dev>' && resolvedFrom !== 'onboarding@resend.dev') {
      try {
        console.log('[Resend] Attempting retry from onboarding@resend.dev inside catch clause...');
        const fallbackFrom = 'DinnerByDesign <onboarding@resend.dev>';
        const retryResult = await resend.emails.send({
          from: fallbackFrom,
          to,
          subject,
          html,
        });
        
        if (retryResult.error) {
          throw retryResult.error;
        }
        
        console.log('[Resend] Email successfully sent using fallback sender in catch clause!');
        return retryResult.data;
      } catch (retryErr: any) {
        console.log('[Resend] Catch block fallback retry returned status:', retryErr.message || retryErr);
        throw translateResendError(retryErr);
      }
    }
    
    throw translateResendError(err);
  }
}
