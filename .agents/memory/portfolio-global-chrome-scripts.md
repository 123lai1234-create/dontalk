---
name: Portfolio global chrome scripts (Netlify parity)
description: Which site-wide scripts the Astro→Replit migration dropped, how to restore them, and what to deliberately exclude
---

# Netlify-global chrome scripts in the portfolio migration

The original Astro/Netlify site loaded a set of **global** chrome scripts on every
page. The Replit (Vite+React) migration only wired two of them globally in
`App.tsx` SHARED_SCRIPTS (`site-shell-config.js`, `nav.js`); the rest were dropped.
When a page looks "less alive" than the Netlify original, this is usually why.

Self-initializing, safe to wire into a page's `pageScripts` (they are IIFEs / have
a `readyState` guard, so they run even though `DOMContentLoaded` already fired in
the SPA): `app-config.js` (API base config), `theme-randomizer.js` (per-session
accent CSS vars on `:root`; does NOT touch the music page's orange), `shader-bg.js`
(WebGL animated background).

The 🎨 palette toggle button lives **inside** `dynamic-features.js` (`initThemeToggle`)
and is styled by `#theme-toggle-btn` in `dynamic.css`. It was extracted into a small
standalone `theme-toggle.js` rather than loading the whole file.

**Deliberately excluded — do not wire in without a strong reason:**
- `dynamic-features.js` — 1356 lines, pulls heavy CDN libs (Vanta/GSAP/Pyodide/…),
  `DOMContentLoaded`-only so it won't init in the SPA anyway. High regression risk.
- `admin-mode.js` — ships hardcoded demo credentials and an `?admin=` URL param that
  stores a `_sync_secret`; flagged in `threat_model.md`. Security risk, leave out.

**3D structure viewer (ProteinMPNN page) — symptom of the two recurring migration traps.**
A `$3Dmol is not defined` failure was caused by both at once: a third-party loader
(`window.load3Dmol`) that was a dropped Netlify global with no CDN anywhere, AND init logic
gated on `DOMContentLoaded` (never fires under SPA late-injection). Lesson: when a migrated
page's JS feature silently does nothing, suspect a missing global script first and a
`DOMContentLoaded`-gated init second. Also: 3Dmol (and any WebGL feature) cannot render in
the headless Playwright test browser (`webgl:false`) — treat its `getParameter of null` as an
env limitation, verify WebGL features in a real browser instead.

**SPA gotcha — nav persists across routes.** The nav is rendered once and is NOT
re-created on SPA navigation. So any element a page-scoped script appends to the nav
(e.g. the 🎨 button) leaks onto every other route. Page-scoped nav additions must
**add on their page and remove elsewhere**, re-syncing on the `basepage:mounted`
event (which carries `detail.page`).
