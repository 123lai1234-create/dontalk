---
name: /etf/api prefix is a dead namespace
description: Static stock-app pages must call /api/*, never /etf/api/* — the backend never serves /etf/api and the app-router won't route it there.
---

Static stock-app pages (`artifacts/portfolio/public/stock-app/*.html`) must fetch from `/api/*`. The `/etf/api/*` prefix is a leftover from the pre-migration deployment and is served by **no** backend.

**Why:** The api-server mounts its router only at `app.use("/api", router)`. In prod, `.replit` uses `router = "application"`, so the application router sends `/api/*` to the api-server and **everything else (including `/etf/api/*`) to the portfolio static SPA**, which returns `index.html`. The page then does `JSON.parse("<!DOCTYPE html>…")` → `Unexpected token '<'`. Symptom seen: `❌ 載入 0050 失敗: Unexpected token '<'`. Confirmed empirically: prod `/api/stocks` → JSON, prod `/etf/api/stocks` → HTML.

**How to apply:** There is only ONE backend watchlist/router, so `/etf/api/X` and `/api/X` would hit identical handlers anyway — there is no separate "ETF namespace" data despite old comments like `// ← ETF 專用路徑`. Always use `/api/`. Mounting the router at `/etf/api` on the api-server does NOT help, because the app-router never forwards `/etf/api` to the api-server in the first place. The static pages use absolute paths (app-config.js does NOT patch `window.fetch`), so they only work same-origin where `/api` routes to the api-server (Replit dev preview, Replit prod app-router, and Vercel via the `/api` edge proxy).
