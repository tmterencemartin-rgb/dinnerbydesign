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

const NATIVE_SCROLL_MULTIPLIER = 4;

const shouldIgnoreManualScroll = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
};

const canScrollElement = (element: HTMLElement) =>
  element.scrollHeight > element.clientHeight;

const findScrollableAncestor = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return null;

  let current: Element | null = target;
  while (current && current !== document.body && current !== document.documentElement) {
    if (current instanceof HTMLElement && canScrollElement(current)) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
};

const installNativeScrollBridge = () => {
  let lastTouchY: number | null = null;

  const scrollElement = (element: Element, deltaY: number) => {
    if (!(element instanceof HTMLElement) || !canScrollElement(element)) return false;

    const movement = deltaY * NATIVE_SCROLL_MULTIPLIER;
    const maxScrollTop = element.scrollHeight - element.clientHeight;
    const nextScrollTop = Math.max(0, Math.min(maxScrollTop, element.scrollTop + movement));

    if (nextScrollTop !== element.scrollTop) {
      element.scrollTop = nextScrollTop;
      return true;
    }

    return false;
  };

  const scrollNativePage = (target: EventTarget | null, deltaY: number) => {
    const localScrollRoot = findScrollableAncestor(target);
    if (localScrollRoot && scrollElement(localScrollRoot, deltaY)) return true;

    const scrollRoot = getNativeScrollRoot();
    if (scrollRoot && scrollElement(scrollRoot, deltaY)) return true;

    const documentScroller = document.scrollingElement || document.documentElement;
    return scrollElement(documentScroller, deltaY);
  };

  document.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1 || shouldIgnoreManualScroll(event.target)) {
      lastTouchY = null;
      return;
    }

    lastTouchY = event.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (event) => {
    if (lastTouchY === null || event.touches.length !== 1 || shouldIgnoreManualScroll(event.target)) return;

    const nextTouchY = event.touches[0].clientY;
    const deltaY = lastTouchY - nextTouchY;
    lastTouchY = nextTouchY;

    if (scrollNativePage(event.target, deltaY)) {
      event.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', () => {
    lastTouchY = null;
  }, { passive: true });

  document.addEventListener('wheel', (event) => {
    if (shouldIgnoreManualScroll(event.target)) return;

    if (scrollNativePage(event.target, event.deltaY)) {
      event.preventDefault();
    }
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
