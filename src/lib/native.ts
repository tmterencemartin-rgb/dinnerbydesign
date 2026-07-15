import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

export const isNativeApp = () => Capacitor.isNativePlatform();

export const openExternalUrl = async (url: string) => {
  if (!url) return;

  if (!isNativeApp()) {
    window.location.href = url;
    return;
  }

  await Browser.open({ url, presentationStyle: 'fullscreen' });
};

const isExternalHttpUrl = (url: string) => {
  if (!/^https?:\/\//i.test(url)) return false;

  try {
    const target = new URL(url);
    return target.origin !== window.location.origin;
  } catch {
    return false;
  }
};

export const configureNativeApp = async () => {
  if (!isNativeApp()) return;

  document.documentElement.classList.add('native-app');

  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#F7F5F0' });
  } catch (err) {
    console.warn('[Native] Status bar configuration failed:', err);
  }

  try {
    await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
  } catch (err) {
    console.warn('[Native] Keyboard configuration failed:', err);
  }

  try {
    await SplashScreen.hide();
  } catch (err) {
    console.warn('[Native] Splash screen hide failed:', err);
  }

  document.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('a[href]');
    if (!(link instanceof HTMLAnchorElement)) return;

    const href = link.href;
    if (!isExternalHttpUrl(href)) return;

    event.preventDefault();
    event.stopPropagation();
    await openExternalUrl(href);
  });
};
