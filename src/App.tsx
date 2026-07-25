import React from 'react';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { isPublicGuideRoute } from './lib/publicRoute';

const AppCore = React.lazy(() => import('./AppCore'));
const PublicGuideApp = React.lazy(() => import('./PublicGuideApp'));

const RouteLoading = () => (
  <main className="flex min-h-screen items-center justify-center bg-dbd-surface px-6 text-center">
    <div role="status" aria-live="polite">
      <img
        src="/dbd-logo-with-pin.png"
        alt="DinnerByDesign"
        className="mx-auto h-[34px] w-auto max-w-[207px] object-contain mix-blend-multiply"
      />
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
