## 2026-09-01T00:18:13Z
You are teamwork_preview_auditor_1 (Forensic Integrity Auditor).
Your working directory is: c:\Users\kosiu\Desktop\Work\ERP\.agents\auditor_1

Read the authoritative specifications at:
- c:\Users\kosiu\Desktop\Work\ERP\ORIGINAL_REQUEST.md
- c:\Users\kosiu\Desktop\Work\ERP\PROJECT.md
- c:\Users\kosiu\Desktop\Work\ERP\TEST_READY.md

Your mission:
Perform an exhaustive Forensic Integrity Audit across the entire codebase:
1. Check for Cheating / Hardcoding:
   - Are any test expectations or return values hardcoded in source files?
   - Are there dummy/facade implementations that fake data or bypass calculations?
2. Static and Dynamic Verification:
   - Verify that `RevenueExpensesTrendChart`, `SalesByRegionDonutChart`, `CashFlowForecastChart`, and `TopOperatingExpensesChart` implement authentic SVG coordinate mapping, Bezier math, and trigonometry.
   - Verify that `ShipmentTimeline` implements genuine connected nodes and status rendering.
   - Verify that `EnterpriseShell.jsx` genuinely renders the top navbar search, notification bell with unread dot, live clock/shift chip, circular avatar, and the 3 operational views.
   - Verify that `src/services/db.js` and `src/services/auth.js` genuinely enforce 5 RBAC tiers, approval queues, and Supabase sync.
3. Build & Test Audit:
   - Run `npm run lint` (must be 0 errors, 0 warnings).
   - Run `npm run build` (must pass with exit code 0).
   - Run `node --test tests/**/*.test.js` (must pass 100%).

Output requirements:
- Write full audit report to `c:\Users\kosiu\Desktop\Work\ERP\.agents\auditor_1\analysis.md`
- Write handoff report to `c:\Users\kosiu\Desktop\Work\ERP\.agents\auditor_1\handoff.md` with an explicit binary verdict: `CLEAN` or `INTEGRITY VIOLATION`.
- Send completion message to orchestrator.
