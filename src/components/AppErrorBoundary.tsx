import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { safeStorage } from '../lib/storage';
import { getClientErrorKind, reportClientError } from '../lib/clientErrorTelemetry';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isRecovering: boolean;
}

const STALE_BUNDLE_RECOVERY_KEY = 'dbd_stale_bundle_recovery_at';
const STALE_BUNDLE_RETRY_WINDOW_MS = 60_000;

const isStaleBundleError = (error: Error | null) => {
  const message = (error?.message || '').toLowerCase();
  return message.includes('failed to fetch dynamically imported module')
    || message.includes('importing a module script failed')
    || message.includes('loading chunk') && message.includes('failed')
    || message.includes('unable to preload css');
};

const hasRecentRecoveryAttempt = () => {
  const attemptedAt = Number(safeStorage.session.getItem(STALE_BUNDLE_RECOVERY_KEY));
  return Number.isFinite(attemptedAt) && Date.now() - attemptedAt < STALE_BUNDLE_RETRY_WINDOW_MS;
};

const clearStaleClientCaches = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister().catch(() => false)));
  }

  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  }
};

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isRecovering: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isRecovering: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    reportClientError({
      kind: getClientErrorKind(error.message),
      message: error.message,
      stack: `${error.stack || ''}\n${errorInfo.componentStack || ''}`,
    });

    if (isStaleBundleError(error) && !hasRecentRecoveryAttempt()) {
      safeStorage.session.setItem(STALE_BUNDLE_RECOVERY_KEY, Date.now().toString());
      this.setState({ isRecovering: true });
      void this.recoverFromStaleBundle();
    }
  }

  private recoverFromStaleBundle = async () => {
    try {
      await clearStaleClientCaches();
    } catch (recoveryError) {
      console.warn('[AppErrorBoundary] Could not clear stale browser caches:', recoveryError);
    } finally {
      window.location.reload();
    }
  };

  private handleReload = () => {
    if (isStaleBundleError(this.state.error)) {
      safeStorage.session.setItem(STALE_BUNDLE_RECOVERY_KEY, Date.now().toString());
      void this.recoverFromStaleBundle();
      return;
    }

    window.location.reload();
  };

  private handleReset = () => {
    safeStorage.removeItem('dbd_has_started');
    safeStorage.session.removeItem('dbd_temporary_preferences');
    window.location.href = '/';
  };

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      let errorMessage = "Something went wrong.";
      const staleBundleError = isStaleBundleError(error);
      if (staleBundleError) {
        errorMessage = this.state.isRecovering
          ? 'The app has been updated. Clearing the old cached version and refreshing.'
          : 'The app has been updated. Reload to continue.';
      }

      try {
        // Attempt to extract JSON from the error message. 
        // Firestore errors often come wrapped in a string or as a raw JSON string.
        const jsonMatch = error?.message?.match(/\{.*\}/);
        const jsonToParse = jsonMatch ? jsonMatch[0] : "";
        
        if (staleBundleError) {
          // Keep the plain-English stale-bundle message above.
        } else if (jsonToParse) {
          const parsedError = JSON.parse(jsonToParse);
          if (parsedError.error) {
            errorMessage = `Service Error: ${parsedError.error}\nOperation: ${parsedError.operationType}\nPath: ${parsedError.path}`;
          } else if (parsedError.message) {
            errorMessage = parsedError.message;
          }
        } else {
          errorMessage = error?.message || errorMessage;
        }
      } catch (e) {
        // If parsing fails, use the raw message
        errorMessage = error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {this.state.isRecovering ? 'Refreshing Application' : 'Reload Application'}
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm font-medium hover:text-gray-900 py-2 transition-colors underline decoration-gray-200 underline-offset-4"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset & Clear State
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
