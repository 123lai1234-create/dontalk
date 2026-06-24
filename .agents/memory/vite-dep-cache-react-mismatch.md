---
name: Vite dep cache React version mismatch
description: Stale Vite pre-bundled deps cache causes two React instances (different ?v= hashes), producing "Invalid hook call" on new routes.
---

When Vite rebuilds its pre-bundled deps (node_modules/.vite/deps/), it assigns new version hash suffixes (e.g. react_jsx-dev-runtime.js?v=fecd17eb vs ?v=fda16f2f). If old compiled module files (cached by a Service Worker or browser cache) reference the old hash while new modules use the new hash, React detects two separate instances and throws "Invalid hook call".

**Why:** The Service Worker had cached old module responses referencing the old hash. Vite's dep optimizer had re-hashed. New routes got the new hash; SW-cached routes got the old hash.

**How to apply:** When "Invalid hook call" appears on only some routes in a Vite+React app, check whether different pages import react_jsx-dev-runtime.js with different ?v= suffixes (`curl http://localhost:<port>/src/pages/<page>.tsx | grep react_jsx`). Fix by deleting `node_modules/.vite/` and restarting Vite. Also ensure the Service Worker never caches Vite dev module URLs (/@vite/, /src/, /@react-refresh, ?v=, .tsx, .ts, .js).
