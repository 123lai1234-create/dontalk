---
name: Expo mobile artifact prod BASE_PATH
description: Why the mobile artifact's production root path 404s, and the required env fix
---

# Expo mobile artifact must set BASE_PATH in services.env

A path-routed mobile (expo) artifact served at `previewPath = "/portfolio-mobile/"`
returns **404 at its root path in production** unless `services.env` includes
`BASE_PATH = "/portfolio-mobile"` (the previewPath without trailing slash).

**Why:** The deployment router forwards the *full* path (it does NOT strip the
prefix — same as the api-server receiving `/api/...`). `server/serve.js` strips
the prefix itself using `basePath = (process.env.BASE_PATH || "/").replace(/\/+$/, "")`.
When BASE_PATH is unset it collapses to `""` (falsy), the prefix is never stripped,
so `/portfolio-mobile/` never matches `/` and falls through to the static-file
handler → 404. The same value also feeds `scripts/build.js` so bundle/asset URLs
are built with the correct prefix.

**How to apply:** Any path-routed artifact's `services.env` must set `BASE_PATH`
to its mount prefix. The web artifact already had `BASE_PATH = "/"`; the expo
scaffold shipped without it. Edit `artifact.toml` only via
`verifyAndReplaceArtifactToml` (temp-file flow), then the user must redeploy —
env changes only take effect on the next production deploy.
