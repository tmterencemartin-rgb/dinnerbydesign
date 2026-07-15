import { Browser } from '@capacitor/browser';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { isNativeApp } from './platform';

export { isNativeApp } from './platform';

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

const getNativeScrollRoot = () =>
  document.querySelector<HTMLElement>('.native-scroll-root');

const shouldIgnoreManualScroll = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
};

const installNativeScrollBridge = () => {
  let lastTouchY: number | null = null;

  document.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1 || shouldIgnoreManualScroll(event.target)) {
      lastTouchY = null;
      return;
    }

    lastTouchY = event.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (event) => {
    const scrollRoot = getNativeScrollRoot();
    if (!scrollRoot || lastTouchY === null || event.touches.length !== 1 || shouldIgnoreManualScroll(event.target)) return;

    const nextTouchY = event.touches[0].clientY;
    const deltaY = lastTouchY - nextTouchY;
    lastTouchY = nextTouchY;

    if (scrollRoot.scrollHeight <= scrollRoot.clientHeight) return;

    scrollRoot.scrollTop += deltaY;
    event.preventDefault();
  }, { passive: false });

  document.addEventListener('touchend', () => {
    lastTouchY = null;
  }, { passive: true });

  document.addEventListener('wheel', (event) => {
    const scrollRoot = getNativeScrollRoot();
    if (!scrollRoot || shouldIgnoreManualScroll(event.target) || scrollRoot.scrollHeight <= scrollRoot.clientHeight) return;

    scrollRoot.scrollTop += event.deltaY;
    event.preventDefault();
  }, { passive: false });
};

export const configureNativeApp = async () => {
  if (!isNativeApp()) return;

  document.documentElement.classList.add('native-app');
  installNativeScrollBridge();

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
