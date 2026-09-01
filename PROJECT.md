# Project: ERP Visual Overhaul & Operational Dashboards

## Architecture
- **Framework**: React 19.2.8 + Vite 8.2.0.
- **Styling**: Native CSS custom properties in `src/index.css` and `src/App.css` (Editorial Cream canvas `#F6F4EE`, Slate Navy sidebar `#1E293B`, Sage Green `#3D644B`, White cards `#FFFFFF` with 14px radius and `#EAE6DB` border).
- **Component Hierarchy**:
  - `App.jsx`: State management, Supabase WebSocket synchronization, toast notifications, auth routing.
  - `EnterpriseShell.jsx`: Main application shell containing:
    * Sidebar navigation with Monolith / Apex branding and Sage Green active pills (`#3D644B`).
    * Top navbar with rounded search bar, notification bell with unread dot, live clock/shift chip, and circular user avatar.
    * Operational Dashboards:
      - `OverviewDashboard`: 4 Metric cards, `RevenueExpensesTrendChart`, `SalesByRegionDonutChart`, Recent Activities audit table.
      - `FinancialDashboard`: 4 Metric cards, `CashFlowForecastChart`, `TopOperatingExpensesChart`, Unpaid Customer Invoices table with Terracotta overdue badges (`#D96B43`).
      - `InventoryDashboard`: 4 Metric cards, Stock Level Alerts table with Sage Green 'Create PO' buttons, `ShipmentTimeline`, Top Selling Products table.
      - Department Hubs, Team Lead Hub, Executive Cockpit, Org Tree, ESS Workspace.
  - `AnalyticsCharts.jsx`: Pure SVG data visualizations (`RevenueExpensesTrendChart`, `SalesByRegionDonutChart`, `CashFlowForecastChart`, `TopOperatingExpensesChart`).
  - `ShipmentTimeline.jsx`: Pure React vertical connected timeline with step nodes.
- **Backend & Data Layer**:
  - `src/services/db.js`: Relational store (9 tables: users, departments, assets, sprints, attendance, leaves, claims, tickets, announcements + operational records), localStorage fallback, Supabase client sync.
  - `src/services/auth.js`: 5 authority tiers (Tier 1 Staff to Tier 5 CEO) & authentication session management.
  - `src/services/supabase.js`: Supabase JS client and realtime channel.

## Feature Inventory
Every feature from the Survey phase is mapped to a designated milestone:
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Design Tokens & Theme Foundation | Root CSS variables for Cream canvas `#F6F4EE`, Slate Navy sidebar `#1E293B`, Sage Green `#3D644B`, White cards `#FFFFFF` (14px radius, `#EAE6DB` border), Terracotta `#D96B43`, Warm Sand `#C8A27A`, and Light/Dark theme switching | M1 | Survey | DONE |
| 2 | Top Navigation Bar & Shell Layout | Top navbar with rounded search bar, notification bell with indicator dot, live clock/shift chip, circular user avatar, and Deep Slate Navy sidebar with Sage Green active pills | M1 | Survey | DONE |
| 3 | Chart Code Quality & Linter Fixes | Fix 7 ESLint errors in `AnalyticsCharts.jsx` and `ShipmentTimeline.jsx` (remove unused vars, immutable arc computation) for 0 errors/0 warnings | M2 | Survey | DONE |
| 4 | Organization Overview Dashboard | 4 Metric cards, interactive multi-line trend chart (`RevenueExpensesTrendChart`), regional donut chart (`SalesByRegionDonutChart`), Recent Activities audit table | M2 | Survey | DONE |
| 5 | Financial Performance Dashboard | 4 Metric cards, cash flow forecast grouped bar chart (`CashFlowForecastChart`), top OpEx horizontal bar chart (`TopOperatingExpensesChart`), Unpaid Customer Invoices table with Terracotta overdue badges | M2 | Survey | DONE |
| 6 | Inventory & Supply Chain Dashboard | 4 Metric cards, Stock Level Alerts table with Sage Green 'Create PO' buttons, incoming shipments vertical connected timeline (`ShipmentTimeline`), Top Selling Products table | M2 | Survey | DONE |
| 7 | RBAC 5-Tier Preservation & Actions | Verify and ensure Tier 1–5 role switching, manager subtree filtering, leave/claim multi-stage approvals, and operational action handling across all views | M3 | Survey | DONE |
| 8 | Multi-device Supabase Realtime Sync | Realtime channel `monolith-enterprise-sync` and dual-write durability verification with live PostgreSQL fallback | M3 | Survey | DONE |
| 9 | Comprehensive E2E & Tier 1-4 Test Suite | Opaque-box automated test suite covering feature coverage, boundaries, pairwise combinations, and real-world scenarios (159+ tests) | E2E-Track | Survey | DONE |
| 10 | Final Quality & Build Verification | Pass 100% test suites, `npm run lint` (0 errors, 0 warnings), `npm run build` (exit code 0), Forensic Integrity Audit CLEAN | M4 | Survey | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status | Key Outputs |
|---|------|-------|-------------|--------|-------------|
| M1 | Design System & Shell Styling | `src/index.css`, `src/App.css`, and `EnterpriseShell.jsx` top navbar & sidebar pill styling | none | DONE | CSS variables, top navbar search/bell/avatar, Deep Slate Navy sidebar |
| M2 | Operational Dashboards & Chart Integration | `src/components/AnalyticsCharts.jsx`, `src/components/ShipmentTimeline.jsx`, `src/components/EnterpriseShell.jsx` (Overview, Financials, Inventory screens) | M1 | DONE | 3 Operational views, SVG Bezier & Donut charts, Shipment timeline, 0 lint errors |
| M3 | RBAC & Realtime Sync Verification | Role-switching, action integration ('Create PO', approvals), Supabase sync across new views | M2 | DONE | 5 authority tiers, 2-stage claims, leave auto-deductions, offline dual-write cache |
| M4 | Final Build & Quality Gate | 100% passing test suites, 0 lint errors/warnings, 0 build errors, CLEAN forensic audit | M3, E2E-Track | DONE | 184/184 tests pass, Vite build 0 errors, 0 ESLint warnings |

## Interface Contracts
### Design Tokens ↔ Shell & Components
- CSS Variables in `src/index.css`:
  * `--bg-canvas`: `#F6F4EE` (Dark: `#0F172A`)
  * `--bg-canvas-warm`: `#FAF8F3` (Dark: `#1E293B`)
  * `--bg-sidebar`: `#1E293B`
  * `--brand-sage`: `#3D644B`
  * `--brand-sage-light`: `#4E7A5D`
  * `--brand-sage-subtle`: `rgba(61, 100, 75, 0.12)`
  * `--border-card`: `#EAE6DB` (Dark: `#334155`)
  * `--radius-card`: `14px`
  * `--accent-terracotta`: `#D96B43`
  * `--accent-sand`: `#C8A27A`

### EnterpriseShell ↔ Dashboard Views & AnalyticsCharts
- `RevenueExpensesTrendChart`: props: `{ data?: Array<{ month: string, revenue: number, expenses: number }> }`
- `SalesByRegionDonutChart`: props: `{ data?: Array<{ region: string, percentage: number, color: string }> }`
- `CashFlowForecastChart`: props: `{ data?: Array<{ week: string, inflow: number, outflow: number }> }`
- `TopOperatingExpensesChart`: props: `{ data?: Array<{ category: string, amount: number, percentage: number }> }`
- `ShipmentTimeline`: props: `{ shipments?: Array<{ id: string, origin: string, destination: string, carrier: string, status: string, date: string, progress: number }> }`

## Code Layout
```
c:\Users\kosiu\Desktop\Work\ERP\
├── src/
│   ├── components/
│   │   ├── EnterpriseShell.jsx      # Main application shell, top navbar, sidebar, operational tabs
│   │   ├── AnalyticsCharts.jsx      # Pure SVG charts (Trend, Donut, Grouped Bar, Horizontal Bar)
│   │   ├── ShipmentTimeline.jsx     # Pure React vertical connected timeline
│   │   ├── DepartmentHubs.jsx       # Engineering, HR, Finance, IT tabs
│   │   ├── TeamLeadHub.jsx          # Direct reports, approvals
│   │   ├── ExecutiveCockpit.jsx     # C-suite overview
│   │   └── OrgChart.jsx             # Visual hierarchy tree
│   ├── services/
│   │   ├── db.js                    # Relational data layer, Supabase sync, offline caching
│   │   ├── auth.js                  # RBAC 5-tier auth and session
│   │   └── supabase.js              # Supabase client
│   ├── App.jsx                      # App root, realtime subscription, toast notifications
│   ├── index.css                    # CSS tokens, theme variables, base typography & resets
│   └── App.css                      # Component styling, cards, tables, navbars, buttons
├── tests/                           # E2E & unit test suites
│   ├── m1_database_relational.test.js
│   ├── tier1_features/
│   ├── tier2_boundaries/
│   ├── tier3_combinations/
│   └── tier4_applications/
└── PROJECT.md                       # Master architecture and milestone index
```
