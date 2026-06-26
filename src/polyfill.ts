if (typeof window !== 'undefined') {
  const g = globalThis as any;
  g.process = g.process || {};
  g.process.env = g.process.env || {};
  if (!g.process.env.NODE_ENV) {
    g.process.env.NODE_ENV = import.meta.env?.MODE || 'development';
  }
  (window as any).process = (window as any).process || g.process;
}
export {};
