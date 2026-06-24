---
name: Taiwan stock signal clone (/stock)
description: Non-obvious decisions behind the cloned 台股均線買賣訊號 SPA — auth posture, data-source fallbacks, yahoo-finance2 v3 quirk
---

# /stock — Taiwan-stock MA buy/sell signal clone

A verbatim clone of an external Taiwan-stock SPA, served as a full-bleed iframe page
in the portfolio, backed by ~32 `/api/*` Express endpoints using real market data.

## Operator auth is closed-by-default and server-side (see stock-operator-auth.md)
`operatorOk()` returns **false** when `STOCK_OPERATOR_PASSWORD` is unset (NOT open mode).
ALL privileged/PII/expensive endpoints require the secret and 403 on failure:
`stocks/add`, `stocks/remove`, `intraday_scan/toggle`, `GET /recipients` (PII list, via
`x-operator-password` header), `recipients/add`, `recipients/remove`, and `scan_and_email`
(fan-out + email blast). The frontend no longer compares a password client-side — it sends
the typed password to the backend and reuses it in-session.
**Why:** the reference shipped a cosmetic client-side gate (hardcoded `RECIPIENTS_PASSWORD`)
that the threat model forbids; rate-limiting alone (`lib/ratelimit.ts`) is NOT sufficient for
these flows — it stays as defense-in-depth on top of auth. `scan_and_email` also no-ops
safely when SMTP env is unset.
**How to apply:** any new privileged stock endpoint must call `operatorOk(...)` first and
403 on failure. Don't reintroduce client-side comparison or an "open when unconfigured" shortcut.
`markers/record` is the one intentional exception — rate-limited only (low-impact cache write
fired on every normal page view; gating it would break the faithful clone).

## Data-source fallbacks are intentional
`foreign_futures` returns `is_limited:true`; `events`, `etf_membership`, `conference`
return graceful empty payloads. These depend on paid/unavailable sources — empty/limited
is by design, not a bug.

## Multi-page suite: 21 static sub-pages cloned into public/stock-app/
The reference is a 21-page suite (etf, macro, signal-filter, etf-filter, stock-damo-filter,
warming, exdiv, heatmap, rebalance, revenue, conference, ai-capex, sold-too-early,
uptrend-watch, price-compare, etf_holdings, etf_holdings_tracker, etf_holdings_pivot,
admin_logs, marker_history, sitemap). Each is a self-contained HTML file dropped into
`public/stock-app/` alongside `index.html` (the stock page). Navigation is iframe-internal:
the stock page lives at portfolio route `/stock` → iframe → `stock-app/index.html`; sub-page
links are **relative .html files** so navigation stays inside the iframe.
**Link rewriting (when re-cloning from reference):** the reference uses absolute routes
(`/etf`, `/etf_holdings/tracker`, `/admin/logs`), bare home `/`, and deep-links `/?code=NNNN`.
Rewrite exact quoted route tokens → `<file>.html`, bare `"/"`/`'/'` → `index.html`, and
`/?code=` → `index.html?code=`. NEVER touch `/api/*` or `/static/*` tokens. Strip the
replit-pill `<script>` and map `/static/` → `static/` (favicon lives at
`stock-app/static/favicon.svg`). Verify zero leftover absolute app routes after.
**Why:** these pages share the SAME backend `/api/*` contract as the stock page, so the
frontend clone is mechanical; the hard part is the ~70 sub-page endpoints (etf_holdings,
macro_data, revenue, heatmap, rebalance, signal_filter, warming_zone_scan, etc.) — most do
NOT exist yet, so data-heavy pages render full UI but show "載入失敗 / Unexpected token '<'"
(404 HTML instead of JSON) until those endpoints are built. The stock page nav bar is
collapsible (☰ 選單) — matches reference responsive behavior.

## yahoo-finance2 is v3 — must instantiate
`import YahooFinance from "yahoo-finance2"; const yf = new YahooFinance();` — the default
singleton pattern is gone. `suppressNotices` is not on the typed instance. Cast
`chart()`/`quoteSummary()` results via `as unknown as`.

## Symptom: "載入失敗" / "Unexpected token '<', \"<!DOCTYPE\"... is not valid JSON"
Every stock-app page hardcodes `/api/...` (no base resolver). If the **api-server workflow is stopped**, `/api/*` falls through to the portfolio SPA → returns index.html → `r.json()` throws this exact error across ALL data categories at once (加權指數, foreign_futures, macro, heatmap, revenue, etc.). It is NOT a per-category code bug. Fix = restart `artifacts/api-server: API Server` workflow. Verified: all ~97 frontend `/api` calls map to registered routes in `artifacts/api-server/src/routes/`; the dev workflow tends to be "not started" at session start.
