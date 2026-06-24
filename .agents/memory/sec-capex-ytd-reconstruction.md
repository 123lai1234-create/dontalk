---
name: SEC EDGAR capex quarterly reconstruction
description: Why /ai_capex must reconstruct discrete quarters from cumulative YTD SEC data, and how to aggregate across companies correctly
---

# SEC EDGAR capex — discrete-quarter reconstruction

`/ai_capex` (markets.ts) pulls `us-gaap/PaymentsToAcquirePropertyPlantAndEquipment`
(NVDA/AMZN also expose `PaymentsToAcquireProductiveAssets`) from SEC
`data.sec.gov/api/xbrl/companyconcept/CIK{10digit}/...`.

**Trap:** companies report capex CUMULATIVELY (YTD) in 10-Qs — Q1=3mo, H1=6mo,
9M=9mo, FY=12mo all share the SAME fiscal-year `start` date with increasing `end`.
If you naively keep only ~90-day single-quarter entries, most companies yield only
ONE quarter per year (NVDA→only its fiscal Q2, GOOGL/META→only Q1), so any TTM
built from "last 4 entries" silently sums 4 non-consecutive years = garbage.

**Correct reconstruction:** group entries by `start`; within each group sort by
`end` and difference adjacent cumulative values (first entry = its own discrete
quarter); keep only pieces whose span (end − prevEnd) is ~80–100 days; map to a
calendar quarter via end month. For duplicate (start,end), prefer the entry with
the latest `filed` (amendments).

**Aggregation across companies:** their fiscal calendars differ, so a strict
common raw-quarter intersection is fragile. Instead: (a) total TTM = sum of each
company's own last-4-consecutive-quarter TTM; (b) **YoY must use a single cohort** —
sum current TTM and prior-year TTM only over companies that have BOTH, else a
company missing prior-year history inflates the aggregate YoY. Chart series is
built per calendar quarter where all companies have a rolling TTM (best-effort,
may have gaps — that's honest).

**Why:** verified live — the 5 hyperscalers' reconstructed TTMs match real-world
figures (NVDA ~$6.6B, MSFT ~$97B, GOOGL ~$110B, AMZN ~$151B, META ~$76B).
