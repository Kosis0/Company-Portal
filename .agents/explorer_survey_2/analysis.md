# Comprehensive Analysis & Codebase Survey: Core Screens, Visualizations & Operational Workflows

**Specialist Role:** Core Screens, Visualizations & Operational Workflows Specialist (`explorer_survey_2`)  
**Workspace:** `c:\Users\kosiu\Desktop\Work\ERP`  
**Date:** 2026-09-01  
**Status:** Completed & Verified  

---

## Executive Summary

This investigation delivers a deep architectural and visual audit of the Monolith ERP codebase, evaluating existing screen components, responsive SVG charting engines, operational workflows, and data contracts against the authoritative design specifications in `ORIGINAL_REQUEST.md`.

### Core Highlights:
1. **Existing Visualization Code**: High-quality pure React + SVG chart components (`RevenueExpensesTrendChart`, `SalesByRegionDonutChart`, `CashFlowForecastChart`, `TopOperatingExpensesChart` in `src/components/AnalyticsCharts.jsx` and `ShipmentTimeline` in `src/components/ShipmentTimeline.jsx`) already exist in the codebase, but are currently **orphaned/unmounted** and not wired into the main UI shell (`EnterpriseShell.jsx`).
2. **Current Screen Gaps**: The current application shell is structured around workforce tier hubs (Employee Self-Service, Team Lead Hub, Department Workspaces, Executive Cockpit) but **lacks the 3 dedicated operational dashboards** required by `ORIGINAL_REQUEST.md`:
   - **Organization Overview Dashboard** (4 KPI metric cards, Trend Chart, Donut Chart, Recent Activities Audit Table)
   - **Financial Performance Dashboard** (4 KPI metric cards, Cash Flow Forecast Grouped Bar Chart, Top Operating Expenses Progress Bars, Unpaid Invoices Table with Terracotta Overdue Badges)
   - **Inventory & Supply Chain Dashboard** (4 KPI metric cards, Stock Level Alerts with Sage Green 'Create PO' Buttons, Vertical Connected Shipment Timeline, Top Selling Products Table)
3. **Design System & Styling Tokens**: The theme tokens in `src/index.css` require an overhaul to match the target reference palette:
   - Deep Slate Navy sidebar (`#1E293B`) with Monolith / Apex branding and Sage Green active pills (`#3D644B` / `#4E7A5D`)
   - Warm Editorial Cream / Oatmeal canvas background (`#F6F4EE` / `#FAF8F3`)
   - Crisp White content cards (`#FFFFFF`) with 14px border radius and soft warm border (`1px solid #EAE6DB`)
   - Alert color tokens: Terracotta / Coral (`#D96B43`) for overdue/reorder alerts, Warm Sand (`#C8A27A` / `#D4A373`) for secondary charts, Sage Green (`#3D644B`) for primary buttons and active indicators
   - Top navbar with rounded search input, notification bell with indicator dot, and circular avatar chip
4. **Data Service Extension**: `src/services/db.js` possesses robust 5-tier relational workforce methods (users, departments, assets, sprints, attendance, leaves, claims, tickets, announcements, payroll engine) and needs auxiliary mock/live data tables for **Recent Activities**, **Customer Invoices**, **Inventory Products / Stock Alerts**, **Purchase Orders**, and **Shipments**.

---

## 1. Deep Screen-by-Screen & Component Audit

### 1.1 Existing Dashboard Structure vs Target Dashboards

| Component / Screen | File Path | Current Status & Functionality | Target State / Missing Elements |
| :--- | :--- | :--- | :--- |
| **EnterpriseShell** | `src/components/EnterpriseShell.jsx` (1,578 lines) | Unified adaptive shell coordinating navigation across personal dashboard, profile, attendance, leaves, payroll, claims, team lead hub, department toolkits, org tree, and executive cockpit. | Needs navigation items for the 3 target operational dashboards (**Organization Overview**, **Financial Performance**, **Inventory & Supply Chain**), styled with Sage Green active pills (`#3D644B`) and Deep Slate Navy sidebar (`#1E293B`). Top navbar needs rounded search bar & notification bell. |
| **Organization Overview** | *Missing as standalone view* (Currently personal dashboard in `EnterpriseShell.jsx:460-651`) | Displays personal employee metrics (Leave Balance, Pending Claims, Salary, Performance Rating) and user leave requests table. | Needs dedicated view featuring **4 Organization Metric Cards** (Revenue, Operating Costs, Cash Balance, Headcount/Efficiency), **Revenue vs Expenses Multi-line Trend Chart**, **Sales by Region Donut Chart**, and **Recent Activities Audit Table**. |
| **Financial Performance** | `src/components/DepartmentHubs.jsx:244-380` (Finance tab) | Displays internal HR gross payroll, statutory deductions, Level-2 expense claims, and batch payroll trigger. | Needs dedicated view featuring **4 Financial Metric Cards** (Net Margin, Operating Cash Flow, Accounts Receivable, Monthly Burn Rate), **Cash Flow Forecast Grouped Bar Chart** (Weeks 1-4), **Top Operating Expenses Horizontal Bar Chart**, and **Unpaid Customer Invoices Table** with Terracotta overdue badges. |
| **Inventory & Supply Chain** | *Missing as standalone view* (`ShipmentTimeline.jsx` orphaned; IT Asset table in `DepartmentHubs.jsx:500-650`) | Only IT hardware registry (laptops, monitors) exists in IT hub. `ShipmentTimeline.jsx` is not rendered anywhere. | Needs dedicated view featuring **4 Supply Chain Metric Cards** (Inventory Value, Low Stock Alerts, Inbound Shipments, Fulfillment Rate), **Stock Level Alerts Table** with Sage Green 'Create PO' buttons, **Incoming Shipments Vertical Connected Timeline**, and **Top Selling Products Table**. |
| **Executive Cockpit** | `src/components/ExecutiveCockpit.jsx` (284 lines) | C-suite view showing headcount, total payroll outlay, retention, performance score, department budgets, and strategic broadcast notices. | Preserve seamlessly for Tier 5 users; link into the overarching operational navigation. |
| **Team Lead Hub** | `src/components/TeamLeadHub.jsx` (409 lines) | Line manager portal for direct reports roster, team shifts, Level-1 leave approvals (with balance deduction), and Level-1 claim verification. | Fully functional; preserve RBAC access for Tier 3+ users. |
| **Department Hubs** | `src/components/DepartmentHubs.jsx` (651 lines) | Engineering (sprints, sandboxes), Finance (payroll batch engine, claims signoff), HR (talent roster), IT (hardware registry). | Fully functional; keep as specialized operational toolkits alongside main dashboards. |
| **Org Chart Tree** | `src/components/OrgChart.jsx` (278 lines) | Interactive drill-down hierarchy tree from CEO down to Staff Associates with expandable nodes and tier badges. | Fully functional; preserve visual styling and tier hierarchy. |

---

## 2. Visualization Engine & Custom SVG Implementation Audit

The repository contains a custom SVG visualization engine in `src/components/AnalyticsCharts.jsx` and `src/components/ShipmentTimeline.jsx`. No external charting libraries (e.g. Chart.js, Recharts, D3) are installed in `package.json`, keeping bundle size lightweight and eliminating external dependencies.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             CUSTOM SVG VISUALIZATION ENGINE                              │
├────────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ Multi-line Trend Chart     │ Segmented Donut Chart       │ Grouped Bar Chart             │
│ - Bezier curved paths      │ - Trig segment arcs         │ - Multi-series rect bars      │
│ - Interactive hover dots   │ - Dynamic center cutout     │ - Discrete weekly buckets     │
│ - Floating dynamic tooltip │ - Color-coded dot legend    │ - Gridlines & dual legend     │
├────────────────────────────┴─────────────────────────────┴───────────────────────────────┤
│ Horizontal Ranked Bar Chart                              Vertical Connected Timeline     │
│ - Ranked percentage progress bars                        - Continuous vertical rail      │
│ - Monospace numerical alignment                          - Status-colored node halos     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Multi-line Trend Chart (`RevenueExpensesTrendChart`)
- **File & Lines:** `src/components/AnalyticsCharts.jsx:6-222`
- **ViewBox & Geometry:** `viewBox="0 0 580 220"`, padding `left: 45px`, `right: 20px`, `top: 25px`, `bottom: 35px`.
- **Curve Math:** Smooth cubic Bezier curves via control points:
  $$\text{cpX} = \frac{p0.x + p1.x}{2}, \quad \text{Path} = \text{M } p0.x \text{ } p0.y \text{ C } \text{cpX } p0.y, \text{ cpX } p1.y, \text{ } p1.x \text{ } p1.y$$
- **Color Styling:**
  * Revenue Line: `#3D644B` (Forest / Sage Green, 2.5px stroke)
  * Expenses Line: `#C8A27A` (Warm Sand, 2.5px stroke)
  * Gridlines: `var(--border-subtle)` dashed `2 2`
- **Interactivity:** State `hoveredIdx` highlights vertical dashed indicator line, expands dot radius ($r=5.5$), and displays absolute floating tooltip with month, revenue, and expense metrics.

### 2.2 Donut Chart (`SalesByRegionDonutChart`)
- **File & Lines:** `src/components/AnalyticsCharts.jsx:227-372`
- **ViewBox & Geometry:** `viewBox="0 0 180 180"`, radius $R=68$, inner cutout radius $r=46$, center $(90, 90)$.
- **Arc Trigonometry:**
  $$x = \text{center} + R \cdot \cos\left(\frac{(\text{angle} - 90)\pi}{180}\right), \quad y = \text{center} + R \cdot \sin\left(\frac{(\text{angle} - 90)\pi}{180}\right)$$
  Generates closed SVG path: `M (outer_start) A R R 0 largeArc 1 (outer_end) L (inner_end) A r r 0 largeArc 0 (inner_start) Z`.
- **Color Styling & Data:**
  * North America: $50\%$ (`#3D644B` - Forest/Sage Green)
  * Europe: $30\%$ (`#78C6B1` - Mint/Teal)
  * Asia: $20\%$ (`#D4A373` - Warm Sand)
- **Interactivity:** State `hoveredSegment` scales hovered segment (`scale(1.04)`), dims non-hovered segments (`opacity: 0.6`), updates center typography percentage, and highlights legend.

### 2.3 Grouped Bar Chart (`CashFlowForecastChart`)
- **File & Lines:** `src/components/AnalyticsCharts.jsx:377-506`
- **ViewBox & Geometry:** `viewBox="0 0 560 210"`, pad left $45$, height $210$, max scale $\$20\text{M}$.
- **Bar Clustering:** Calculates 4 group centers (Week 1, Week 2, Week 3, Week 4) with bar width $28\text{px}$ and rounded tops (`rx="3"`):
  * Cash In Bar: `#3D644B` (Sage Green)
  * Cash Out Bar: `#9C948B` (Warm Slate/Sand)
- **Scale:** Y-ticks at $\$0$, $\$5\text{M}$, $\$10\text{M}$, $\$15\text{M}$, $\$20\text{M}$.

### 2.4 Horizontal Ranked Progress Bar Chart (`TopOperatingExpensesChart`)
- **File & Lines:** `src/components/AnalyticsCharts.jsx:511-585`
- **Data Series:**
  1. Payroll: $\$320,000$
  2. Software: $\$95,000$
  3. Rent: $\$75,000$
  4. Marketing: $\$15,000$
  5. Others: $\$8,000$
- **Layout & Animation:** Horizontal flex rows with label (80px), container track (`--bg-surface-elevated`), animated bar fill (`backgroundColor: #3D644B`, `transition: width 0.6s ease`), and formatted monospace amount (75px).

### 2.5 Vertical Connected Shipment Timeline (`ShipmentTimeline`)
- **File & Lines:** `src/components/ShipmentTimeline.jsx:1-70`
- **Structure:**
  * Continuous vertical connector rail: `width: 2px`, `backgroundColor: var(--brand-green-subtle)` positioned behind nodes (`left: 14px`).
  * Circular node dots ($10\text{px}$) with status ring shadows and gradient sage green shades (`#3D644B`, `#5A8B6B`, `#8FBBA0`).
  * Shipment entries: Carrier/Supplier, relative timing badge ("Tomorrow", "Friday"), and monospace date ("Sept 02, 2026", "Sept 05, 2026", etc.).

---

## 3. Comprehensive Gap Analysis against ORIGINAL_REQUEST.md

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   GAP ANALYSIS MATRIX                                  │
├─────────────────────────┬──────────────────────────┬───────────────────────────────────┤
│ Target Requirement      │ Current Implementation   │ Action Required                   │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 1. Deep Slate Navy      │ White (#FFFFFF) in light │ Update CSS --bg-sidebar to        │
│    Sidebar (#1E293B)    │ mode, #0e0e13 in dark    │ #1E293B, brand header text, and   │
│    & Sage Green Active  │ mode. Active item is     │ active item pills to #3D644B with │
│    Navigation Pills     │ dark gray/black.         │ crisp white icons and text.       │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 2. Warm Editorial Cream │ --bg-canvas is cool gray │ Update --bg-canvas to #F6F4EE     │
│    Canvas Background    │ #f8f9fb in light mode.   │ (light) / #0F172A (dark).         │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 3. Crisp White Cards    │ 12px radius, cool gray   │ Update card radius to 14px and    │
│    with 14px radius &   │ border (#eeeff2).        │ border to 1px solid #EAE6DB.      │
│    #EAE6DB soft border  │                          │                                   │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 4. Terracotta / Coral   │ Generic danger red       │ Add --color-terracotta: #D96B43   │
│    Alert Tone (#D96B43) │ (#e11d48).               │ for overdue badges & stock alerts.│
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 5. Top Navigation Bar   │ Has breadcrumb & user    │ Add rounded search bar input and  │
│    Search & Alerts      │ avatar, but no search.   │ notification bell with dot.       │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 6. Organization         │ Missing; only employee   │ Create OrganizationOverview view  │
│    Overview Dashboard   │ personal stats shown.    │ with 4 KPI cards, Trend Chart,    │
│                         │                          │ Donut Chart & Activity Table.     │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 7. Financial            │ Only internal payroll    │ Create FinancialPerformance view  │
│    Performance          │ runner in Dept Hubs.     │ with 4 KPI cards, Cash Flow Bar   │
│    Dashboard            │                          │ Chart, Expense Bar & Invoices.    │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 8. Inventory & Supply   │ Unmounted timeline, no   │ Create InventorySupplyChain view  │
│    Chain Dashboard      │ stock alert/PO table.    │ with 4 KPI cards, Stock Alerts +  │
│                         │                          │ 'Create PO' btns, Timeline, Prods.│
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 9. Sage Green 'Create   │ None currently in the    │ Implement .btn-sage buttons and   │
│    PO' Buttons & Flow   │ UI.                      │ PO Creation Dialog + DB mutation. │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ 10. Unpaid Customer     │ None currently in the    │ Implement Customer Invoices table │
│     Invoices Table      │ UI.                      │ with Overdue Badges & reminders.  │
└─────────────────────────┴──────────────────────────┴───────────────────────────────────┘
```

---

## 4. Component Reusability & Visual Pattern Specifications

### 4.1 Metric / KPI Card Pattern
Across all three dashboards, the 4-card KPI grid follows a uniform, responsive layout:
- **Card Structure**:
  ```jsx
  <div className="stat-card">
    <div className="stat-card-header">
      <span className="stat-card-label">{label}</span>
      <div className={`stat-icon-wash ${iconWashColor}`}>
        <Icon size={16} />
      </div>
    </div>
    <div className="stat-card-value">{formattedValue}</div>
    {progressPercent !== undefined && (
      <div className="micro-progress-track">
        <div className="micro-progress-fill" style={{ width: `${progressPercent}%`, backgroundColor: fillColor }} />
      </div>
    )}
    <div className="stat-card-footer">
      <span className={`trend-badge ${trendDirection}`}>{trendText}</span>
      <span>{secondaryNote}</span>
    </div>
  </div>
  ```

### 4.2 Table Styling & Badge Patterns
- **Table Container**: Wrapped in `.table-responsive` with `.custom-table` styling.
- **Badge Classes**:
  * `.badge-overdue` / `.badge-terracotta`: `background-color: rgba(217, 107, 67, 0.12); color: #D96B43; border: 1px solid rgba(217, 107, 67, 0.3);`
  * `.badge-sage` / `.badge-approved`: `background-color: rgba(61, 100, 75, 0.12); color: #3D644B; border: 1px solid rgba(61, 100, 75, 0.3);`
  * `.badge-warning` / `.badge-pending`: `background-color: rgba(217, 119, 6, 0.12); color: #D97706;`
  * `.badge-in-transit`: `background-color: rgba(120, 198, 177, 0.15); color: #2D7A68;`

### 4.3 Interactive Action Controls
- **Sage Green Button (`.btn-sage`)**:
  ```css
  .btn-sage {
    background-color: #3D644B;
    color: #FFFFFF;
    border: 1px solid #32533E;
    border-radius: var(--radius-sm);
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .btn-sage:hover {
    background-color: #2D4A37;
  }
  ```

---

## 5. Data Schema & Relational Model Expansion Plan

To back the 3 target operational screens while retaining full offline cache resilience and Supabase synchronization, `src/services/db.js` should be augmented with the following collections and helpers:

### 5.1 New Data Entities (`db.js`)
1. **`recentActivities`**:
   - Fields: `id`, `actor`, `action`, `target`, `department`, `timestamp`, `type` (`"financial"`, `"inventory"`, `"hr"`, `"system"`).
2. **`customerInvoices`**:
   - Fields: `id` (e.g. `INV-2026-089`), `customerName`, `customerEmail`, `issueDate`, `dueDate`, `amount`, `status` (`"Overdue"`, `"Due Soon"`, `"Paid"`), `daysOverdue`, `reminderSent`.
   - Method: `sendInvoiceReminder(id)`, `markInvoicePaid(id)`.
3. **`stockAlerts` & `inventoryProducts`**:
   - Fields: `sku`, `name`, `category`, `stockLevel`, `reorderThreshold`, `unitCost`, `supplierName`, `status` (`"Critical"`, `"Low Stock"`, `"Adequate"`).
   - Method: `createPurchaseOrder({ sku, quantity, supplierId })`.
4. **`purchaseOrders`**:
   - Fields: `id` (e.g. `PO-8821`), `sku`, `productName`, `quantity`, `supplierName`, `totalAmount`, `status` (`"Requisitioned"`, `"Approved"`, `"Shipped"`), `createdDate`.
5. **`shipments`**:
   - Fields: `id`, `carrier`, `supplier`, `origin`, `destination`, `expectedTiming`, `expectedDate`, `status` (`"Active"`, `"In Transit"`, `"Scheduled"`), `trackingNumber`.
6. **`topProducts`**:
   - Fields: `id`, `sku`, `name`, `category`, `unitsSold`, `revenue`, `marginPercent`, `trend`.

---

## 6. Recommended Implementation Roadmap per Screen

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 IMPLEMENTATION ROADMAP                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: Design Tokens & Palette Foundations                                            │
│   - Update src/index.css with #1E293B sidebar, #F6F4EE canvas, #FFFFFF 14px cards,      │
│     #EAE6DB soft borders, #3D644B sage buttons/pills, #D96B43 terracotta alert badges.  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Core Operational Dashboard Components                                          │
│   - Create src/components/OrganizationOverview.jsx (KPIs, Trend Chart, Donut, Audit)   │
│   - Create src/components/FinancialPerformance.jsx (KPIs, Cash Flow, Expenses, Invoices)│
│   - Create src/components/InventorySupplyChain.jsx (KPIs, Stock Alerts, PO, Timeline)   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Shell Navigation & Data Binding                                                │
│   - Wire views into src/components/EnterpriseShell.jsx with Deep Slate Navy sidebar     │
│   - Add Top Navigation Bar search input, notification bell with dot, and live shift chip│
│   - Add data methods and PO creation flow into src/services/db.js                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Verification & Quality Assurance                                               │
│   - Fix existing 7 lint issues in AnalyticsCharts.jsx and ShipmentTimeline.jsx          │
│   - Run npm run lint (0 errors / 0 warnings)                                            │
│   - Run npm run build (0 errors)                                                        │
│   - Run node tests/m1_database_relational.test.js (16/16 passed)                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Pre-Existing Linter Errors & Remediation Guide

Running `npm run lint` identified 7 pre-existing ESLint issues in the unmounted visualization files:

| File | Line | Issue Description | Remediation |
| :--- | :--- | :--- | :--- |
| `src/components/AnalyticsCharts.jsx` | 34:9 | `revenuePoints` unused variable | Remove unused variable `revenuePoints` |
| `src/components/AnalyticsCharts.jsx` | 35:9 | `expensesPoints` unused variable | Remove unused variable `expensesPoints` |
| `src/components/AnalyticsCharts.jsx` | 247:5 | `react-hooks/immutability`: `cumulativeAngle += angle` inside render | Compute start angles via `reduce` or calculate cumulative offset within pure map/iteration structure without reassigning local outer closure variable |
| `src/components/ShipmentTimeline.jsx` | 1:10 | `Truck` imported but unused | Remove unused import |
| `src/components/ShipmentTimeline.jsx` | 1:17 | `CheckCircle2` imported but unused | Remove unused import |
| `src/components/ShipmentTimeline.jsx` | 1:31 | `Clock` imported but unused | Remove unused import |
| `src/components/ShipmentTimeline.jsx` | 1:38 | `Calendar` imported but unused | Remove unused import |

