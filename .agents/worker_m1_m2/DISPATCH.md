## 2026-09-01T00:00:00Z

You are teamwork_preview_worker_m1_m2 (UI, Design System & Operational Dashboards Specialist).
Your working directory is: c:\Users\kosiu\Desktop\Work\ERP\.agents\worker_m1_m2

Read the authoritative specifications at:
- c:\Users\kosiu\Desktop\Work\ERP\ORIGINAL_REQUEST.md
- c:\Users\kosiu\Desktop\Work\ERP\PROJECT.md
- c:\Users\kosiu\Desktop\Work\ERP\.agents\explorer_survey_1\analysis.md
- c:\Users\kosiu\Desktop\Work\ERP\.agents\explorer_survey_2\analysis.md
- c:\Users\kosiu\Desktop\Work\ERP\.agents\explorer_survey_3\analysis.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write Ownership (You exclusively own):
- `src/index.css`
- `src/App.css`
- `src/components/EnterpriseShell.jsx`
- `src/components/AnalyticsCharts.jsx`
- `src/components/ShipmentTimeline.jsx`

Tasks:
1. **Design System & Theme Tokens (`src/index.css`, `src/App.css`)**:
   - Deep Slate Navy sidebar (`#1E293B`) with Monolith / Apex branding and Sage Green active pills (`#3D644B` / `#4E7A5D`).
   - Warm Editorial Cream / Oatmeal canvas background (`#F6F4EE` / `#FAF8F3`).
   - Crisp White content cards (`#FFFFFF`) with 14px radius (`--radius-card: 14px`) and soft border (`1px solid #EAE6DB`).
   - Alert tones: Terracotta / Coral (`#D96B43`) for overdue/reorder alerts, Warm Sand (`#C8A27A` / `#D4A373`) for secondary chart metrics.
   - Light & Dark mode support.
2. **Top Navigation Bar & Shell Layout (`src/components/EnterpriseShell.jsx`)**:
   - Top navbar with rounded search bar, notification bell with indicator dot, live clock/shift chip, and circular user avatar.
   - Sidebar navigation updated with the active pill styling and navigation tabs for Overview, Financials, Inventory, Departments, Team Lead Hub, Executive Cockpit, Org Tree, ESS Workspace.
3. **Operational Dashboards Integration (`src/components/EnterpriseShell.jsx`)**:
   - **Organization Overview**: 4 Metric Cards (Total Revenue, Headcount, Operational Burn, System Uptime/Efficiency with trends), `RevenueExpensesTrendChart` (interactive hover tooltips, Bezier curves), `SalesByRegionDonutChart` (segmented arcs & legend), Recent Activities audit table.
   - **Financial Performance**: 4 Metric Cards (Monthly Inflow, Outflow, Net Cash Position, Outstanding Receivables), `CashFlowForecastChart` (Weeks 1-4 grouped bars), `TopOperatingExpensesChart` (horizontal ranked bars), Unpaid Customer Invoices table with Terracotta overdue badges.
   - **Inventory & Supply Chain**: 4 Metric Cards (SKUs in Stock, Low Stock Items, Active Shipments, Supplier Fulfillment), Stock Level Alerts table with Sage Green 'Create PO' buttons, `ShipmentTimeline` (connected vertical step nodes), Top Selling Products table.
4. **Code Quality & Linter Remediation**:
   - In `src/components/AnalyticsCharts.jsx`: remove unused variables (`revenuePoints`, `expensesPoints`), fix `cumulativeAngle` mutation in render loop.
   - In `src/components/ShipmentTimeline.jsx`: remove unused icon imports (`Truck`, `CheckCircle2`, `Clock`, `Calendar`).
   - Ensure `npm run lint` passes with 0 errors and 0 warnings.
   - Ensure `npm run build` passes with exit code 0.
   - Ensure `npm test` passes 100%.

Deliverables:
- Implement the changes cleanly in the assigned files.
- Run `npm run lint`, `npm run build`, and `npm test` in the terminal to verify.
- Write your complete handoff report to `c:\Users\kosiu\Desktop\Work\ERP\.agents\worker_m1_m2\handoff.md`.
- Send a completion message back to the orchestrator.
