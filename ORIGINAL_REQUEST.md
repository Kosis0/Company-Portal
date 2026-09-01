# Original User Request

## Initial Request — 2026-09-01T00:53:58+01:00

You are the Project Orchestrator for the complete visual and front-end overhaul of the ERP application to precisely replicate the design, layouts, color system, and components from the uploaded reference screenshots.

Working directory: c:\Users\kosiu\Desktop\Work\ERP
Authoritative request: c:\Users\kosiu\Desktop\Work\ERP\.agents\ORIGINAL_REQUEST.md

Key requirements:
1. Visual Design System & Component Styling:
   - Deep Slate Navy sidebar (`#1E293B`) with Monolith / Apex logo and Sage Green active pills (`#3D644B` / `#4E7A5D`).
   - Warm Editorial Cream / Oatmeal canvas background (`#F6F4EE` / `#FAF8F3`).
   - Crisp White content cards (`#FFFFFF`) with 14px radius and soft border (`1px solid #EAE6DB`).
   - Top navigation bar with rounded search bar, notification bell with indicator dot, live clock/shift chip, and circular user avatar.
   - Light & Dark mode support.
   - Alert tones: Terracotta / Coral (`#D96B43`) for overdue/reorder alerts, Warm Sand (`#C8A27A` / `#D4A373`) for secondary chart metrics.
2. Core Overview & Operational Screens:
   - Organization Overview (4 Metric Cards, Revenue vs. Expenses Multi-line trend chart, Sales by Region Donut chart, Recent Activities audit table).
   - Financial Performance (4 Metric Cards, Cash Flow Forecast grouped bar chart, Top Operating Expenses horizontal bar chart, Unpaid Customer Invoices table with overdue badges).
   - Inventory & Supply Chain (4 Metric Cards, Stock Level Alerts table with sage green 'Create PO' buttons, Incoming Shipments vertical connected timeline, Top Selling Products table).
3. Interactive Data Visualizations & Timeline:
   - SVG/Canvas responsive multi-line trend chart with interactive hover tooltips.
   - Donut chart with segmented percentage arcs and right-hand legend.
   - Grouped bar chart and horizontal ranked progress bar charts.
   - Vertical connected shipment timeline component with connected step nodes.
4. RBAC & Supabase Sync:
   - Seamlessly preserve all 5 authority tiers (Tier 1 Staff to Tier 5 CEO) and HR/Lead approval queues.
   - Maintain live multi-device sync with Supabase PostgreSQL.
5. Verification:
   - npm run lint passes with 0 errors and 0 warnings.
   - npm run build passes with 0 errors.

Your working directory for agent metadata is `c:\Users\kosiu\Desktop\Work\ERP\.agents\orchestrator_1` (or successor directory).
Execute the project pattern, dispatch specialists, ensure rigorous verification, and report victory when all acceptance criteria are fully met.
