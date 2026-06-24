---
name: Portfolio app-config API discovery contract
description: How resolveApiBase must resolve so client scripts' ${base}/api/... URLs hit the same-origin Express API.
---

In the portfolio, the Express API is mounted at `/api` on the **same origin** (health at `/api/healthz`). Every browser script builds requests as `${apiBase}/api/...`.

**Rule:** `resolveApiBase` (in `public/scripts/app-config.js`) must resolve `apiBase` to the **origin root** (empty / current origin), NOT `/api`. The discovery probe must check `${candidate}/api/healthz`.

**Why:** If the resolved base is `/api`, callers produce doubled `/api/api/...` paths (all 404). The original design pointed at an external root host (`donttalk-api.fly.dev`) that served `/healthz` at root and `/api/*` below it; that host is dead and caused `ERR_NAME_NOT_RESOLVED` on every page load. Same-origin has no root `/healthz` (root is the static site), so the probe must target `/api/healthz`.

**How to apply:** Keep `defaultApiCandidates` empty (current origin is auto-added) and probe `/api/healthz`. Verify via api-server logs that data calls are single-prefix `/api/...`. Note: gene-ai data endpoints (sequences/knowledge/etc.) and contact/inquiries are intentionally not implemented and 404 — that is expected, not a discovery bug.
