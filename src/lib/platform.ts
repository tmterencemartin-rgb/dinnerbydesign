export const isNativeApp = () => {
  const capacitor = (globalThis as any).Capacitor;
  return Boolean(capacitor?.isNativePlatform?.());
};

export const isNativeTestBuild = () =>
  isNativeApp() && import.meta.env.VITE_NATIVE_TEST_BUILD === 'true';
