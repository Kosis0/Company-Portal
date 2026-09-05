# 🏛️ MONOLITH • Apex Enterprise ERP & Human Capital Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-company--portal--kosi.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://company-portal-kosi.vercel.app)
[![CI Quality Gate](https://github.com/Kosis0/Company-Portal/actions/workflows/ci.yml/badge.svg)](https://github.com/Kosis0/Company-Portal/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20Realtime-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-100%25%20Passing-success)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **A production-grade, full-stack Enterprise Resource Planning (ERP) & Human Capital Operating System.**  
> Built with React 19, Vite, and Supabase PostgreSQL with WebSocket realtime synchronization, offline dual-write persistence, and an editorial design system.

🚀 **Live Application:** [https://company-portal-kosi.vercel.app](https://company-portal-kosi.vercel.app)  
🔗 **GitHub Repository:** [https://github.com/Kosis0/Company-Portal](https://github.com/Kosis0/Company-Portal)

---

## ⚡ Highlights & Key Capabilities

* 🌐 **Full-Stack Supabase Cloud Backend:** Backed by 13 relational PostgreSQL tables, complete foreign key integrity, Row Level Security (RLS) policies, and WebSocket subscriptions for instant multi-device live sync.
* 🛡️ **5-Tier Role-Based Access Control (RBAC):** True hierarchical authority tiers spanning Staff (Tier 1), Senior Contributor (Tier 2), Lead / Manager (Tier 3), Director / Head of Dept (Tier 4), and Executive C-Suite / CEO (Tier 5).
* 📊 **Pure SVG Analytics Engine:** Handcrafted, high-performance data visualizations with zero third-party chart bundle bloat—including Bézier multi-line revenue/expenses trend curves, interactive donut charts with breakdown legends, cash flow forecast grouped bar charts, and horizontal OpEx charts.
* 🚚 **Live Supply Chain & Inventory Operations:** Real-time stock reorder monitoring, automatic stock health alerts, 1-click Purchase Order generation, and vertical connected timeline tracking for incoming international freight.
* 👥 **Interactive Organizational Chart:** Dynamic SVG hierarchy tree rendering direct reporting chains, departmental clusters, and executive leadership paths.
* 🔄 **Resilient Dual-Write Offline Persistence:** Seamless failover between Supabase Cloud and local state caching—guaranteeing zero data loss during network interruptions.
* 🎨 **Editorial Design System:** Warm oatmeal / editorial cream canvas (`#F6F4EE`), Deep Slate Navy sidebar navigation (`#1E293B`), Sage Green status accents (`#3D644B`), and Terracotta overdue alerts (`#D96B43`) with full Light & Dark mode support.

---

## 🧭 Operational Modules

```
Monolith Apex ERP
├── 🏢 Organization Overview       # Live burn rate, active headcount, SVG revenue/expenses Bézier chart, regional donut breakdown
├── 💰 Financial Performance       # Cash flow forecast grouped bar chart, OpEx breakdown, unpaid invoice ledger with aging badges
├── 📦 Inventory & Supply Chain    # Real-time stock alerts, 1-click PO generator, vertical connected shipment timeline
├── 🏛️ Department Hubs             # Dedicated operational workspaces for Engineering, HR, Finance, and IT Operations
├── 🌲 Organizational Tree         # Visual interactive company hierarchy and direct reporting graph
├── 👑 Executive Cockpit           # High-level organizational KPIs, departmental budget allocations, and strategic metrics
└── 👤 Employee Self-Service (ESS) # Shift clock with geolocation, multi-stage leave approvals, 2-tier expense claims, support tickets
```

### 1. Organization Overview & Executive Cockpit
* **Executive Metrics:** Live financial burn rate, headcount breakdown, pending approval queues, and SLA performance.
* **Revenue vs. Expenses Trend:** Custom SVG Bézier curve visualization with gradient area fills and dynamic month markers.
* **Sales by Region:** Interactive Donut chart displaying regional distribution with dynamic legend badges.
* **Enterprise Audit Stream:** Chronological feed tracking organization-wide payroll batches, claims, and ticket updates.

### 2. Financial Management & Invoicing
* **Cash Flow Forecast:** Grouped bar chart comparing weekly projected cash inflows vs. operating outflows.
* **Operating Expense (OpEx) Distribution:** Horizontal bar chart highlighting major cost drivers.
* **Customer Invoice Ledger:** Real-time accounts receivable tracking with Terracotta overdue badges and 1-click reconciliation.

### 3. Inventory & Supply Chain Dashboard
* **Stock Health Monitoring:** Automated reorder threshold flags with instant "Create PO" triggers.
* **Shipment Tracking:** Pure React vertical timeline illustrating carrier milestones, customs clearance, and delivery ETAs.
* **Top Selling Products:** Real-time volume, unit pricing, and remaining warehouse inventory.

### 4. Human Capital Management & Approvals Workflow
* **Multi-Stage Leave Requests:** Annual, sick, and casual leave workflows with automatic balance deduction upon approval.
* **2-Stage Expense Reimbursements:** Multi-tier approvals requiring Team Lead sign-off followed by Finance disbursement verification.
* **Statutory Payroll Engine:** Automated company-wide payroll runs computing PAYE taxes, pension deductions (8%), health coverage, and net pay.
* **IT Asset Registry:** Complete hardware inventory tracking workstations, monitors, serials, and staff assignments.

---

## 🔑 Verified Demo Credentials

Test any authority level using the pre-seeded credentials below:

| Tier | Role | Corporate Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 5** | **Chief Executive Officer** | `ceo@company.com` | `password123` | Full enterprise cockpit, company-wide payroll, organizational tree, budget overrides |
| **Tier 4** | **VP of Engineering** | `vpeng@company.com` | `password123` | Engineering department sprints, team budgets, senior contributor reviews |
| **Tier 4** | **VP of People Operations** | `admin@company.com` | `password123` | Organization staff roster, company broadcasts, department budget allocations |
| **Tier 3** | **Engineering Lead** | `sarah.chen@company.com` | `password123` | Team approvals queue, direct reports subtree, leave & claim sign-offs |
| **Tier 2** | **Senior Data Engineer** | `kofi.mensah@company.com` | `password123` | Senior contributor workspace, sprint execution, self-service tools |
| **Tier 1** | **Core Staff Developer** | `employee@company.com` | `password123` | Shift clock in/out, leave requests, expense claims, IT tickets, payslips |

*You can also register new staff accounts on the fly via the registration screen.*

---

## 🗄️ Relational Database Architecture (Supabase / PostgreSQL)

The platform is backed by **13 interconnected PostgreSQL tables** with full foreign key constraints and Row Level Security:

```
                  ┌───────────────┐
                  │ public.users  │◄──────────────┐
                  └───┬───────┬───┘               │
                      │       │                   │
         ┌────────────┘       └─────────────┐     │
         ▼                                  ▼     │
┌──────────────────┐               ┌──────────────────┐
│public.departments│               │  public.assets   │
└────────┬─────────┘               └──────────────────┘
         │
         ├────────────────────────────────┬──────────────────────────────┐
         ▼                                ▼                              ▼
┌──────────────────┐             ┌──────────────────┐           ┌──────────────────┐
│  public.leaves   │             │  public.claims   │           │ public.attendance│
└──────────────────┘             └──────────────────┘           └──────────────────┘
         │                                │                              │
         ▼                                ▼                              ▼
┌──────────────────┐             ┌──────────────────┐           ┌──────────────────┐
│  public.tickets  │             │  public.sprints  │           │  public.invoices │
└──────────────────┘             └──────────────────┘           └──────────────────┘
         │                                │                              │
         ▼                                ▼                              ▼
┌──────────────────┐             ┌──────────────────┐           ┌──────────────────┐
│public.inventory  │◄────────────┤public.purchase_  │           │ public.shipments │
└──────────────────┘             │     orders       │           └──────────────────┘
                                 └──────────────────┘
```

* **Realtime Sync:** Subscribed to PostgreSQL changes on `supabase_realtime` via WebSocket channels.
* **RLS Policies:** Fully configured for public and authenticated operations with 0 database lints.
* **Migrations & DDL:** Defined in [`supabase_schema.sql`](supabase_schema.sql).

---

## 🛠️ Tech Stack & Tooling

* **Frontend:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
* **Database & Cloud:** [Supabase](https://supabase.com/) (PostgreSQL 15+, PostgREST, Realtime WebSockets)
* **Iconography:** [Lucide React](https://lucide.dev/)
* **Code Quality:** [ESLint 10](https://eslint.org/) (Flat Config, 0 warnings)
* **Testing:** Custom zero-dependency Node.js test runner covering 41+ test specifications across unit, boundary, and pairwise flows.

---

## 🚀 Local Quickstart

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch
```bash
# 1. Clone the repository
git clone https://github.com/Kosis0/Company-Portal.git
cd Company-Portal

# 2. Install dependencies
npm install

# 3. Configure environment variables (or use defaults)
cp .env.example .env

# 4. Start the local Vite development server
npm run dev

# 5. Run test suite
npm test

# 6. Run linter and production build
npm run lint
npm run build
```

---

## 🌐 Live Cloud Deployment & Hosting

The application is deployed and available live on **Vercel**:  
👉 **Live Preview**: [https://company-portal-kosi.vercel.app](https://company-portal-kosi.vercel.app)

This repository also includes zero-config deployment manifests for self-hosting on **Vercel** (`vercel.json`) and **Netlify** (`netlify.toml`):

### Deploy your own copy to Vercel in 1-Click:
1. Push or import [`Kosis0/Company-Portal`](https://github.com/Kosis0/Company-Portal) into your [Vercel Dashboard](https://vercel.com/new).
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in project environment settings.
3. Click **Deploy** — Vite builds and optimizes production bundles automatically.

---

## 🧑‍💻 Author
**Kosi Udeh (Udeh Kosisochukwu Emmanuel)**  
*Full-Stack Developer & Systems Architect*  
* **Portfolio:** [portfolio-lac-seven-pykd0ipign.vercel.app](https://portfolio-lac-seven-pykd0ipign.vercel.app)  
* **GitHub:** [@Kosis0](https://github.com/Kosis0)  
* **Contact:** [kosiudeh627@gmail.com](mailto:kosiudeh627@gmail.com) | [+234 911 795 0895](https://wa.me/2349117950895)

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
