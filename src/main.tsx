import './polyfill';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';
import { configureNativeApp, isNativeApp } from './lib/native';
import { getClientErrorKind, reportClientError } from './lib/clientErrorTelemetry';

configureNativeApp();

// Add global error handlers to help debug "Script error" issues
window.addEventListener('error', (event) => {
  const { message, filename, lineno, colno, error } = event;
  
  // Filter out and prevent default logging of common noise in development/restricted environments
  if (message === 'Script error.' || (message && message.includes('Script error'))) {
    event.preventDefault();
    return;
  }

  reportClientError({
    kind: event.filename ? 'resource' : getClientErrorKind(message),
    message,
    stack: error?.stack,
    source: filename,
  });

  console.error('[Global Error Listener]', {
    message,
    source: filename,
    lineno,
    colno,
    error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const msg = (reason?.message || String(reason || "")).toLowerCase();
  
  // Filter out common low-noise issues (HMR, connectivity drops, etc.)
  if (
    msg.includes("websocket") || 
    msg.includes("hmr") || 
    msg.includes("failed to fetch") || 
    msg.includes("failed to connect") ||
    msg.includes("transport-base")
  ) {
    return;
  }

  reportClientError({
    kind: 'unhandled_rejection',
    message: reason instanceof Error ? reason.message : String(reason || 'Unhandled promise rejection'),
    stack: reason?.stack,
  });

  console.error('[Unhandled Rejection]', reason);
});

// Register Service Worker for PWA. Native builds use Capacitor's shell instead.
if (import.meta.env.PROD && !isNativeApp() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
