---
name: BasePage inline script execution ordering
description: Inline <script> tags in page HTML must run after external scripts (e.g. Chart.js) have finished loading.
---

When BasePage executes inline <script> tags found in dangerouslySetInnerHTML HTML, those scripts may depend on external libraries (Chart.js, etc.) that are loaded separately via pageScripts array. If inline scripts run before external scripts are loaded, they crash trying to use APIs that don't exist yet (e.g. waitChartJs pattern queries for a <script src="chart.js"> tag that hasn't been appended yet → returns null → .addEventListener throws).

**Why:** The original code ran inline scripts first, then loaded external scripts. Inline script in stem_cell page had a waitChartJs() helper that queried `document.querySelector('script[src*="chart.js"]')` — null before the tag was appended.

**How to apply:** Always load external scripts (pageScripts) fully before executing inline scripts. Also guard with `if (oldScript.parentNode)` instead of `?.` to avoid swallowing bugs.
