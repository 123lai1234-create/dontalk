---
name: Static asset cache busting (portfolio)
description: Why page-specific CSS/JS under public/ must be version-stamped, and the failure it caused
---

# Stale cached `public/` assets on the portfolio

Page-specific styles/scripts (e.g. `/styles/music.css`, `/scripts/music-player.js`) are
injected at runtime by `BasePage` via fixed, **non-hashed** URLs and served with
`cache-control: private`. The Vite JS bundle is content-hashed, but these `public/`
files are not — so a returning visitor's browser can keep serving an **old cached copy**
even after a new deploy.

**Symptom seen:** after deploying a redesigned `/music` page, mobile users saw a
"破版" layout with giant unconstrained SVG icons (album-fallback / modal note overflowing
full-width). Production served the correct CSS (byte-identical to repo), and a fresh
`vite preview` rendered fine — proving it was the user's cached old `music.css`
(which lacked the newer icon-sizing rules), not a server or CSS bug.

**Fix / how to apply:** `BasePage` appends `?v=<ASSET_VERSION>` to every injected
page style/script. `ASSET_VERSION` is injected at build time via a Vite `define`
(`__ASSET_VERSION__`, a timestamp) so it changes automatically on every build/deploy —
no manual bump needed. External (http/https) URLs are left untouched.

**Why:** non-hashed static assets + browser heuristic caching = stale CSS/JS that
silently breaks layout for repeat visitors while looking perfect to anyone testing
with a clean cache.
