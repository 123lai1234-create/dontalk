/**
 * Floating 🎨 theme toggle button — cycles accent palettes.
 * Extracted from dynamic-features.js and made SPA-safe. The nav is rendered
 * after page scripts load, so we (re)sync on `basepage:mounted`.
 *
 * Scoped to the music page only: this script is wired into /music's pageScripts,
 * but the nav it appends to is global and persists across SPA navigation, so we
 * must add the button on /music and remove it on any other route.
 * Styling lives in dynamic.css (#theme-toggle-btn).
 */
(function () {
  const THEMES_ORDER = ['neon-tokyo', 'bio-lab', 'cyber-rose', 'deep-space'];

  function createButton(nav) {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.setAttribute('aria-label', '切換主題');
    btn.innerHTML = '🎨';
    nav.appendChild(btn);

    const root = document.documentElement;
    btn.addEventListener('click', () => {
      const current = root.dataset.theme || 'deep-space';
      const idx = THEMES_ORDER.indexOf(current);
      const next = THEMES_ORDER[(idx + 1) % THEMES_ORDER.length];

      // Ripple flash transition
      const flash = document.createElement('div');
      flash.style.cssText =
        'position:fixed;inset:0;z-index:10000;pointer-events:none;' +
        'background:radial-gradient(circle at center, rgba(88,215,255,0.2), transparent 70%);' +
        'opacity:0;transition:opacity 0.25s;';
      document.body.appendChild(flash);
      requestAnimationFrame(() => { flash.style.opacity = '1'; });
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 260);
      }, 200);

      root.dataset.theme = next;
      try { sessionStorage.setItem('portfolio_theme_v1', next); } catch (_) {}
      // Reload to re-run the randomizer and apply the full palette vars.
      window.location.reload();
    });
  }

  function sync(page) {
    const onMusic = page ? page === 'music' : document.body.dataset.page === 'music';
    const existing = document.getElementById('theme-toggle-btn');
    if (onMusic) {
      if (existing) return;
      const nav = document.querySelector('nav');
      if (nav) createButton(nav);
    } else if (existing) {
      existing.remove();
    }
  }

  sync();
  window.addEventListener('basepage:mounted', (e) => sync(e && e.detail && e.detail.page));
})();
