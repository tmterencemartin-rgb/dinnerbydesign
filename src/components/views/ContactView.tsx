import React from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { getApiUrl } from '../../lib/api';

export const ContactView: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = React.useState('');

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'We could not send your enquiry just now. Please try again shortly.');
      }

      setStatus('sent');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'We could not send your enquiry just now. Please try again shortly.');
      setStatus('error');
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Contact</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight text-dbd-ink sm:text-4xl">Get in touch</h1>
      <p className="mt-4 max-w-xl text-[15px] leading-7 text-dbd-ink-3">Questions, feedback or a problem with the app? Send a message and we will get back to you by email.</p>

      {status === 'sent' ? (
        <section className="mt-8 border border-dbd-accent/20 bg-white p-6" aria-live="polite">
          <CheckCircle2 className="h-6 w-6 text-dbd-accent" aria-hidden="true" />
          <h2 className="mt-3 text-xl font-semibold text-dbd-ink">Your message has been sent</h2>
          <p className="mt-2 text-sm leading-6 text-dbd-ink-3">Thank you. We will reply to {email}.</p>
        </section>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold text-dbd-ink">Name</label>
            <input id="contact-name" value={name} onChange={event => setName(event.target.value)} required autoComplete="name" maxLength={120} className="mt-2 min-h-11 w-full border border-dbd-rule bg-white px-3 text-sm text-dbd-ink outline-none transition-colors focus:border-dbd-accent" />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-semibold text-dbd-ink">Email address</label>
            <input id="contact-email" type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" maxLength={254} className="mt-2 min-h-11 w-full border border-dbd-rule bg-white px-3 text-sm text-dbd-ink outline-none transition-colors focus:border-dbd-accent" />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-semibold text-dbd-ink">Message</label>
            <textarea id="contact-message" value={message} onChange={event => setMessage(event.target.value)} required maxLength={4000} rows={7} className="mt-2 w-full border border-dbd-rule bg-white px-3 py-2.5 text-sm leading-6 text-dbd-ink outline-none transition-colors focus:border-dbd-accent" />
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-company">Company</label>
            <input id="contact-company" value={company} onChange={event => setCompany(event.target.value)} tabIndex={-1} autoComplete="off" />
          </div>
          {status === 'error' && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <p className="text-xs leading-5 text-dbd-ink-3">We use your details only to respond to this enquiry. See our <a href="/privacy" className="font-semibold text-dbd-accent hover:underline">privacy information</a>.</p>
          <button type="submit" disabled={status === 'sending'} className="inline-flex min-h-11 items-center justify-center gap-2 bg-dbd-accent px-5 text-xs font-semibold text-white transition-colors hover:bg-dbd-accent-mid disabled:cursor-not-allowed disabled:opacity-70">
            <Send size={15} aria-hidden="true" />
            {status === 'sending' ? 'Sending' : 'Send'}
          </button>
        </form>
      )}
    </main>
  );
};
