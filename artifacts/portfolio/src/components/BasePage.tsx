import { useEffect, useRef } from 'react';

interface BasePageProps {
  title: string;
  bodyPage: string;
  pageStyles?: string[];
  pageScripts?: string[];
  html: string;
}

// Cache-busting token for page-specific static assets under public/styles and
// public/scripts (referenced by fixed, non-hashed URLs). Injected at build time
// by Vite (see `define` in vite.config.ts) so it changes on every build/deploy
// automatically — returning visitors never serve a stale cached copy.
declare const __ASSET_VERSION__: string;
const ASSET_VERSION = typeof __ASSET_VERSION__ !== 'undefined' ? __ASSET_VERSION__ : 'dev';

function withVersion(url: string): string {
  if (/^https?:\/\//.test(url) || url.startsWith('//')) return url;
  return url.includes('?') ? `${url}&v=${ASSET_VERSION}` : `${url}?v=${ASSET_VERSION}`;
}

// Global registry: scripts that have already been loaded (never remove them)
const loadedScripts = new Set<string>();

function loadScriptOnce(src: string): Promise<void> {
  if (loadedScripts.has(src)) return Promise.resolve();
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[data-page-script="${CSS.escape(src)}"]`);
    if (existing) { loadedScripts.add(src); resolve(); return; }
    const script = document.createElement('script');
    script.src = src;
    script.dataset.pageScript = src;
    script.onload = () => { loadedScripts.add(src); resolve(); };
    script.onerror = () => { loadedScripts.add(src); resolve(); };
    document.body.appendChild(script);
  });
}

function runRenderShell() {
  if (typeof (window as any).__renderSiteShell !== 'function') return;
  (window as any).__renderSiteShell();
  // Bind scroll-top button once
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn && !(scrollBtn as any)._scrollBound) {
    (scrollBtn as any)._scrollBound = true;
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 420);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // Scroll reveal for elements not yet visible
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  if (typeof IntersectionObserver !== 'undefined' && reveals.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.07 });
    reveals.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
      else revealObs.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }
  // Fallback: force-reveal after 1s
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 1000);
}

export default function BasePage({ title, bodyPage, pageStyles = [], pageScripts = [], html }: BasePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inlineScriptsRan = useRef(false);

  // Update title + body page key + load/keep styles
  useEffect(() => {
    document.title = title;
    document.body.dataset.page = bodyPage;

    // Add page-specific styles (never removed — kept permanently to avoid flash)
    pageStyles.forEach(href => {
      const versioned = withVersion(href);
      if (!document.querySelector(`link[data-page-style="${versioned}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = versioned;
        link.dataset.pageStyle = versioned;
        document.head.appendChild(link);
      }
    });
  }, [title, bodyPage, pageStyles.join(',')]);

  // Execute inline scripts and load external scripts
  useEffect(() => {
    if (!containerRef.current) return;

    // Load external scripts first, then run inline scripts.
    // Inline scripts may depend on external libs (e.g. Chart.js), so they must run after.
    (async () => {
      for (const src of pageScripts) {
        await loadScriptOnce(withVersion(src));
      }

      // Execute inline <script> tags exactly once per mount.
      // React's dangerouslySetInnerHTML does NOT execute them.
      if (!inlineScriptsRan.current && containerRef.current) {
        inlineScriptsRan.current = true;
        const inlineScripts = containerRef.current.querySelectorAll('script:not([src])');
        inlineScripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          if (oldScript.textContent) newScript.textContent = oldScript.textContent;
          if (oldScript.parentNode) oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      }

      runRenderShell();
      setTimeout(runRenderShell, 400);

      // Notify page scripts that the page DOM has (re)mounted. Scripts loaded via
      // loadScriptOnce are not re-executed on SPA navigation, so they listen for
      // this event to (re)initialize against the fresh DOM nodes.
      window.dispatchEvent(new CustomEvent('basepage:mounted', { detail: { page: bodyPage } }));
    })();
  }, [html]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
