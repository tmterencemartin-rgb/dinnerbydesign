import React from 'react';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { Wordmark } from './components/Wordmark';
import { isPublicGuideRoute } from './lib/publicRoute';

const AppCore = React.lazy(() => import('./AppCore'));
const PublicGuideApp = React.lazy(() => import('./PublicGuideApp'));

const RouteLoading = () => (
  <main className="flex min-h-screen items-center justify-center bg-dbd-surface px-6 text-center">
    <div role="status" aria-live="polite">
      <Wordmark className="mx-auto text-[34px]" />
      <p className="mt-4 text-xs font-medium text-dbd-ink-3">Loading…</p>
    </div>
  </main>
);

const App = () => {
  const pathName = typeof window === 'undefined' ? '/' : window.location.pathname;
  const RouteApp = isPublicGuideRoute(pathName) ? PublicGuideApp : AppCore;

  return (
    <AppErrorBoundary>
      <React.Suspense fallback={<RouteLoading />}>
        <RouteApp />
      </React.Suspense>
    </AppErrorBoundary>
  );
};

export default App;
