export const isNativeApp = () => {
  const capacitor = (globalThis as any).Capacitor;
  return Boolean(capacitor?.isNativePlatform?.());
};
