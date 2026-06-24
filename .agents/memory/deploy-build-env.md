---
name: Deployment build vs root build
description: Why root `pnpm run build` fails locally but production deploy still builds fine
---

# Deployment builds per-artifact, not via root `pnpm run build`

Production builds run each artifact's own `[services.production].build` command from
its `.replit-artifact/artifact.toml`, NOT the root `pnpm run build`. So a failing
root build does not necessarily mean deployment is broken.

Two traps that make root `pnpm run build` fail while deploy is fine:

1. **vite.config.ts throws without `PORT`/`BASE_PATH`.** Both the `portfolio` (web)
   and `mockup-sandbox` vite configs `throw` at config-load time if `PORT` (and for
   portfolio `BASE_PATH`) is unset. `vite build` doesn't actually need a port, but the
   throw still fires. The deploy platform supplies these from the artifact's
   `[services.env]` (portfolio: `PORT=21113`, `BASE_PATH=/`). To reproduce a prod build
   locally: `NODE_ENV=production PORT=21113 BASE_PATH=/ pnpm --filter @workspace/portfolio run build`.

2. **`mockup-sandbox` is dev-only (Canvas, kind=design) and never deployed.** Its build
   failing in the root build is irrelevant to production.

**Why:** confirmed while getting the repo into a publishable state — the only truly
deployed artifacts are `portfolio` (static, `dist/public`) and `api-server`
(node `dist/index.mjs`); both build cleanly with their per-artifact commands.

**How to apply:** before suggesting deploy, verify the *deployed* artifacts build with
their artifact.toml commands + service env, rather than trusting/distrusting root
`pnpm run build`.
