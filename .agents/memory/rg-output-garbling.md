---
name: ripgrep output can be silently garbled in this environment
description: When rg output looks wrong, trust the read tool — observed substring substitution in grep results.
---

In at least one session, `rg` (ripgrep) returned **garbled/substituted text** in matched lines: e.g. `buildChart('boChart', ...)` printed as `buildChart('ln', ...)`, and a `pageScripts` array containing `/scripts/index-charts.js` printed with `/scripts/n.js` instead. The underlying files were actually correct — confirmed via the `read` tool.

**Why it matters:** acting on garbled grep output leads to wrong conclusions (e.g. "this script isn't loaded anywhere" when it actually is). The corruption was silent — no error, just altered characters in otherwise-real lines.

**How to apply:** if an `rg` result looks surprising or contradicts what you expect (missing-but-should-exist references, odd short tokens like `ln`/`n` where longer identifiers belong), **verify with the `read` tool before deciding**. The read tool has been reliable; rg was not. Prefer read/explore for anything load-bearing in a decision.
