---
name: Vercel frontend + Replit backend split deploy
description: How donttalk.vercel.app serves the new Vite frontend while the API stays on the Replit Reserved VM
---

# donttalk.vercel.app = new Vite frontend; /api proxied to Replit

The project is published to TWO live sites the user uses simultaneously:
- **Replit Reserved VM** (`ddd-8888uhiuh.replit.app`) — serves the whole app incl.
  the always-on Express api-server at `/api`. This is the backend's permanent home.
- **Vercel** (`donttalk.vercel.app`) — serves ONLY the static React/Vite frontend
  build and proxies `/api/*` to the Replit backend via a `vercel.json` rewrite.

**Why this shape:** The legacy site was Astro-on-Vercel + a Railway backend; both
are dead/removed. The rebuilt app has an always-on Express backend that Vercel
(serverless/static) cannot host. So Vercel hosts the static frontend and forwards
data calls to the Replit VM. Server-side rewrite (not redirect) means the browser
sees same-origin `/api/*` → no CORS needed.

**How it works / gotchas:**
- Root `vercel.json`: build runs `PORT=3000 BASE_PATH=/ pnpm --filter @workspace/portfolio run build`; outputDirectory `artifacts/portfolio/dist/public`; single catch-all rewrite `/:path*` → `/index.html` (SPA fallback). Static files and functions are served before rewrites, so assets/stock-app/scripts/styles aren't clobbered.
- **`/api` proxy must be a Vercel Edge Function, NOT a rewrite.** A `rewrites` entry to the external Replit URL forwards the ORIGINAL Host (`donttalk.vercel.app`) to the backend. Replit (and Railway) route deployments by HTTP Host header, so they answer `{"status":"error","code":404,"message":"Application not found"}`. The fix is `api/[...path].js` (edge runtime) that `fetch`es the Replit URL — fetch sets the correct Host automatically. The function lives at repo-root `/api` (not globbed by pnpm-workspace, not in any tsconfig, so it's left alone by Replit tooling). Drop `content-encoding`/`content-length` on the proxied response since fetch already decompressed the body.
- `vite.config.ts` THROWS if `PORT` or `BASE_PATH` is unset — both must be provided at build time even though PORT is only used by the dev/preview server.
- Root `package.json` must pin `packageManager: pnpm@10.x` so Vercel's pnpm supports `catalog:` workspace deps. `@workspace/api-client-react` exports TS source (no prebuild needed).
- Frontend API-base resolution (`public/scripts/app-config.js`) probes `currentOrigin + /api/healthz` and requires JSON `{status:"ok"}`. The Replit `/api/healthz` returns exactly that, so via the rewrite it resolves API base to the Vercel origin.
- If the Replit deployment URL ever changes or the VM is stopped, the Vercel site's data breaks (hard dependency on the rewrite target).
- User-side steps only the user can do: `git push` from the Replit Git pane, and in the Vercel dashboard verify Root Directory = repo root, Framework = Other, production branch correct.
- **Stale-old-site symptom:** if the live site still shows the OLD build (e.g. `data-astro-cid-*` / `/_assets/page.*.js` in homepage HTML) after a push, the Vercel dashboard **Root Directory is still set to the old subdir (`astro`)**. The rebuild deleted `astro/`, so that build fails and Vercel keeps serving the last-good old deploy. Root Directory must be cleared to the repo root before the new `vercel.json` is ever read. Diagnose by curling the homepage and grepping for astro markers vs Vite `assets/index-*` hashes.
