// Dependency-free Core Web Vitals measurement (LCP / CLS / INP).
// Results are kept on `window.__webVitals` for inspection and logged in dev.
// Wiring these values to Vercel Analytics / a real analytics endpoint is a
// separate step (it needs the @vercel/analytics package + dashboard setup);
// this hook at least makes before/after measurement possible without one.
export interface WebVitals {
  lcp?: number;
  cls?: number;
  inp?: number;
}

declare global {
  interface Window {
    __webVitals?: WebVitals;
  }
}

let started = false;

export function initWebVitals(): void {
  if (started || typeof PerformanceObserver === 'undefined') return;
  started = true;
  const vitals: WebVitals = {};
  window.__webVitals = vitals;

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Largest Contentful Paint: last entry wins.
        vitals.lcp = entry.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    /* unsupported entry type */
  }

  try {
    let cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!shift.hadRecentInput && typeof shift.value === 'number') {
          cls += shift.value;
          vitals.cls = cls;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {
    /* unsupported entry type */
  }

  try {
    new PerformanceObserver((list) => {
      let worst = 0;
      for (const entry of list.getEntries()) {
        const ev = entry as PerformanceEntry & { processingStart?: number };
        if (typeof ev.processingStart === 'number') {
          worst = Math.max(worst, ev.processingStart - entry.startTime);
        }
      }
      if (worst > 0) vitals.inp = worst;
    }).observe({ type: 'event', buffered: true });
  } catch {
    /* unsupported entry type */
  }
}
