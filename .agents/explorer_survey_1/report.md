# Workspace Survey & Architectural Analysis Report

**Target Project:** Monolith Enterprise ERP (Company Portal)  
**Workspace Path:** `c:\Users\kosiu\Desktop\Work\ERP`  
**Date:** 2026-08-31  
**Author:** Survey Explorer 1  
**Status:** Completed & Verified  

---

## 1. Executive Summary & Architectural Baseline

The project is an enterprise-grade, multi-tiered workforce and organization operating system (**Monolith ERP**) built with **React 19** and **Vite 8**. It incorporates an enriched high-contrast **Nordic Minimalist / Monolith** design system with dark and light mode persistence, responsive mobile-first navigation (including thumb-friendly bottom bars and bottom sheets), and a hybrid persistence model combining **Supabase PostgreSQL** with resilient local caching (`localStorage`).

### Technical Stack & Tooling

| Domain | Technology / Library | Version | Details & Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | React / React-DOM | `^19.2.8` | Modern React 19 functional components with hooks |
| **Build Tooling** | Vite | `^8.2.0` | Fast ESM build tool with `@vitejs/plugin-react` (`^6.0.4`) |
| **Language** | JavaScript (ESM) / JSX | ES2022+ | Standard JSX modules (`.jsx`, `.js`) |
| **Icons** | Lucide React | `^1.34.0` | High-quality minimalist vector iconography |
| **Database / Sync** | `@supabase/supabase-js` | `^2.112.4` | Supabase cloud PostgreSQL client with realtime channel subscriptions |
| **Linting & QA** | ESLint | `^10.8.0` | Flat config (`eslint.config.js`) with React Hooks & Refresh plugins |
| **Styling** | Pure CSS3 Variables | Custom | Nordic design tokens, `Inter` + `JetBrains Mono` fonts, theme persistence |
| **Hosting Config** | Vercel & Netlify | Custom | `vercel.json` and `netlify.toml` configured for SPA routing |

---

## 2. Workspace File System & Directory Structure

```
c:\Users\kosiu\Desktop\Work\ERP\
├── .agents/                      # Agent system workspace & metadata
│   ├── ORIGINAL_REQUEST.md       # Target ERP specifications and requirements (R1 - R5)
│   ├── explorer_survey_1/        # Survey Explorer 1 working folder
│   │   ├── BRIEFING.md
│   │   ├── DISPATCH.md
│   │   ├── progress.md
│   │   ├── report.md             # This comprehensive report
│   │   └── handoff.md            # Standard handoff report
├── dist/                         # Vite production build artifacts
│   ├── assets/
│   │   ├── index-3wH_aYF9.css
│   │   └── index-BmGSI4cn.js
│   ├── favicon.svg
│   ├── icons.svg
│   └── index.html
├── docs/
│   └── preview.png               # Visual design preview artifact
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── ESSDashboard.jsx      # Employee Self-Service Dashboard (Tier 1 & 2 workspace)
│   │   ├── HRDashboard.jsx       # HR & People Operations Admin Console
│   │   └── Login.jsx             # Split-panel corporate sign-in & registration portal
│   ├── services/
│   │   ├── auth.js               # Authentication & token session management
│   │   ├── db.js                 # Multi-Tier database abstraction & local fallback engine
│   │   └── supabase.js           # Supabase client instantiation & env verification
│   ├── styles/
│   │   └── styles.css            # Legacy reset / baseline stylesheet
│   ├── App.css                   # Component-specific layout, toast, and modal utilities
│   ├── App.jsx                   # Root application coordinator & state manager
│   ├── index.css                 # Master design system & CSS variables (Nordic theme)
│   └── main.jsx                  # React DOM root mounting script
├── .env                          # Local Supabase credentials configuration
├── .env.example                  # Environment variable blueprint
├── .gitignore                    # Git ignore file
├── eslint.config.js              # ESLint flat configuration
├── index.html                    # HTML5 template with Google Fonts (Inter, JetBrains Mono)
├── netlify.toml                  # Netlify deployment configuration
├── package-lock.json             # Locked npm dependencies
├── package.json                  # Project manifest and build scripts
├── README.md                     # Comprehensive product documentation
├── supabase_schema.sql           # Supabase PostgreSQL schema and seed migration
└── vite.config.js                # Vite build configuration
```

---

## 3. Deep-Dive Codebase Inventory & Current Capabilities

### 3.1. Authentication & Session Flow (`src/services/auth.js`, `src/components/Login.jsx`)
- **Session Lifecycle:** `auth.getCurrentSession()` reads `monolith_auth_session` from `localStorage` and validates against the database.
- **Login Flow:** Case-insensitive email lookup with password matching. Sets 7-day token session.
- **Registration Flow:** Validates corporate email uniqueness, auto-generates statutory IDs (`TIN`, `PEN`), sets default salary and leave balances, and immediately authenticates.
- **Login UI:** Modern split-screen layout with Nordic branding on left, toggleable Sign In / Register tabs on right, password reveal toggle, error alerts, and quick-reference seed test accounts.

### 3.2. Data Architecture & Hybrid Storage Engine (`src/services/db.js`, `src/services/supabase.js`)
- **Hybrid Strategy:** Local storage caching (`monolith_db_*`) provides instant 0ms latency offline capability. When Supabase is configured (`isSupabaseConfigured === true`), data writes push to PostgreSQL, and `db.subscribeToChanges` listens to `postgres_changes` on the `monolith-enterprise-sync` channel.
- **5-Tier Enterprise Seed Data:** 10 pre-configured staff members representing the full corporate hierarchy:
  - *Tier 5 (CEO):* Dr. Alexander Vance (`ceo@company.com`)
  - *Tier 4 (Directors/VPs):* Tunde Bakare (VP Eng), Victoria Sterling (VP HR), Marcus Brody (Head of Finance)
  - *Tier 3 (Leads/Managers):* Sarah Chen (Frontend Lead), David Okonjo (DevOps Lead), Alex Rivera (HR Lead)
  - *Tier 1 & 2 (Contributors/Interns):* Udeh Kosisochukwu Emmanuel (Developer Intern), Chidi Nnamdi (UI Designer), Fatima Aliyu (Financial Analyst)
- **Entities Seeded:** Users, Departments (ENG, HR, FIN, PRD), IT Assets (AST-101 to AST-105), Engineering Sprints (SPR-42, SPR-43), Attendance Logs, Leave Requests, Expense Claims, Support Tickets, and Company Announcements.
- **Relational Query Methods:**
  - `getDirectReports(managerId)`: Resolves immediate subordinates.
  - `getOrgTree()`: Recursively constructs complete organizational tree starting from Tier 5 CEO.
  - `getTeamAttendance(managerId)`, `getTeamLeaves(managerId)`, `getTeamClaims(managerId)`: Scoped team queries for Tier 3 Line Managers.

### 3.3. UI Components & Layout System
- **`App.jsx`:** Main coordinator. Manages theme state (`light` / `dark`), toast notifications, live shift clock state, and data subscriptions.
- **`ESSDashboard.jsx` (2,095 lines):** Comprehensive Employee Self-Service portal with 9 tabs:
  1. *Dashboard:* Live shift widget, key stat metrics (Annual Leave, Pending Claims, Net Salary, OKR score), quick shortcuts, company broadcasts, recent leave table.
  2. *Personnel Profile:* Dossier card, contact info, employment details, banking & tax metadata, profile editor modal.
  3. *Shift Attendance:* Real-time active clock timer (`HH:MM:SS`), monthly punctuality stats, shift logs table.
  4. *Leave Manager:* Category balances countdown, leave history, multi-day application modal with date calculations.
  5. *Payroll & Payslips:* Compensation breakdown, itemized payslip modal (Gross, PAYE tax, 8% pension, HMO withholdings, Net pay), PDF download trigger.
  6. *Reimbursements:* Expense claim submission modal with category selection, receipt attachment, claim status tracking.
  7. *Helpdesk Support:* Ticket creation modal (IT Hardware, Software Access, HR, Facilities), priority tagging, SLA tracking.
  8. *HMO & Benefits:* Healthcare tier details, coverage limits, certified hospital directory, emergency contacts.
  9. *Performance & OKRs:* Quarterly objectives progress bars, manager ratings, KPI milestones.
- **`HRDashboard.jsx` (1,490 lines):** HR Administration and People Ops portal with 7 tabs:
  1. *Command Center / Overview:* Headcount KPIs, pending leave queue, reimbursement liabilities, actionable approval cards.
  2. *Employee Roster:* Searchable, department-filtered directory table with employee dossier viewer modal.
  3. *Company Attendance:* Organization-wide punctuality metrics, daily attendance feed.
  4. *Leave Approvals:* Batch leave authorization and rejection queue with reactive balance update triggers.
  5. *Payroll & Claims:* Reimbursement verification queue with payout authorization buttons.
  6. *Helpdesk Queue:* Central triage board for IT/HR support tickets.
  7. *Broadcasts:* Company-wide announcement publisher modal.

---

## 4. Gap Analysis Against Requirements (R1 – R5)

| Requirement | Specification | Current Workspace Implementation Status | Gap & Required Work |
| :--- | :--- | :--- | :--- |
| **R1. 5-Tier Organizational Hierarchy & RBAC** | Tier 1 (Staff/Intern), Tier 2 (Senior), Tier 3 (Line Manager/Team Lead), Tier 4 (Director/Head of Dept), Tier 5 (CEO/C-Suite) with strict RBAC | **Partial**<br>Data structures & seed models in `db.js` fully support 5 tiers (`tier: 1..5`, `managerId`). However, `App.jsx` routes purely on `currentUser.role === 'admin' ? <HRDashboard /> : <ESSDashboard />`. | **Missing UI Hubs & Tier Gateways:**<br>• Tier 3 needs dedicated **Team Lead Hub** showing only direct reports, team shift presence, L1 leave/claim approvals, team OKRs.<br>• Tier 4 needs dedicated **Department Hubs** (Engineering Hub, Finance Hub, HR Talent Hub, IT Assets).<br>• Tier 5 needs dedicated **Executive Command Cockpit** (Company burn rate, payroll outlay, headcount growth, departmental health). |
| **R2. Department-Specific Functional Toolkits** | Engineering Hub (Cloud sandboxes, API keys, Sprints, On-call), Finance Hub (Payroll execution engine, statutory withholdings, budgets), HR Hub (Interactive Org Tree drill-down, Onboarding/Offboarding), IT Hub (Hardware inventory by serial, SLA queue) | **Partial**<br>`db.js` has seed data for departments, assets, and sprints. Basic HR and IT functions exist inside HRDashboard. | **Missing Functional Modules:**<br>• Engineering Sandbox requisitions (AWS/GCP), API keys & GitHub seat allocations, Sprint kanban/tracking, On-call rotation roster.<br>• Finance Monthly Payroll Engine (gross pay calculation, PAYE, 8% pension, HMO, batch disbursement) and Department Budget Utilization tracking.<br>• HR Interactive Organization Chart (visual hierarchical drill-down tree from CEO to staff using `getOrgTree()`).<br>• IT Asset Registry (hardware tracking with serial number, assignee status, condition). |
| **R3. Multi-Stage Chain of Command Workflow** | Leaves: Staff -> Team Lead L1 -> HR Calendar L2.<br>Claims: Staff -> Direct Manager L1 -> Finance Lead L2 payout. | **Partial**<br>`db.js` has status constants (`Pending Lead`, `Pending Manager`, `Pending Finance`) and deductions on approval. | **Missing Dynamic Routing:**<br>• Leads must only see and approve direct reports (`managerId === lead.id`).<br>• Multi-stage workflow UI states: 2-stage status transitions (Pending Lead -> Pending Finance -> Approved/Paid) needs full UI visualization across Lead, Finance, and HR views. |
| **R4. Adaptive Unified Portal Shell** | Dynamic sidebar navigation, mobile bottom bars, and active modules based on tier, department, and direct reports. Preserving Nordic Minimalist design. | **Partial**<br>Nordic design tokens and mobile layouts exist in ESSDashboard and HRDashboard independently. | **Missing Unified Shell:**<br>• Needs a single adaptive portal shell that dynamically injects sidebar nav items, switcher tabs, and bottom bar buttons based on authenticated user's tier, department, and direct reports. |
| **R5. Supabase Persistence & Real-Time Sync** | PostgreSQL schema with real-time websocket sync across devices and offline caching. | **Partial**<br>`supabase_schema.sql` creates 6 basic tables. `db.js` subscribes to changes and persists locally. | **Schema & Sync Expansion:**<br>• Schema needs columns for `tier`, `manager_id`, `approver_name`, and new tables for `departments`, `assets`, `sprints`.<br>• Complete bidirectional Supabase synchronization across all entities with resilient offline fallback. |

---

## 5. Technical Quality & Build Verification

### 5.1. Linting Verification (`npm run lint`)
- **Command:** `npm run lint` (`eslint .`)
- **Result:** **PASSED with 0 errors and 0 warnings** (Exit code: 0).
- ESLint flat configuration is healthy and checks all `.js` and `.jsx` files.

### 5.2. Build Verification (`npm run build`)
- **Command:** `npm run build` (`vite build`)
- **Result:** **PASSED with 0 compilation errors** (Exit code: 0).
- Build output generated in `dist/`:
  - `dist/index.html` (0.81 kB)
  - `dist/assets/index-3wH_aYF9.css` (29.75 kB)
  - `dist/assets/index-BmGSI4cn.js` (558.13 kB)
- Transform & render completed in 1.36s.

### 5.3. Environment & Configuration Check
- `.env` contains live Supabase test connection parameters (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- `supabase.js` properly checks `isSupabaseConfigured`.
- Fallback local storage ensures full offline functionality if cloud credentials are not supplied or network drops.

---

## 6. Recommendations & Architecture Implementation Roadmap

To fulfill the complete requirements (R1–R5) with enterprise precision:

### Phase 1: Database & Schema Synchronization
1. Expand `supabase_schema.sql` to include columns `tier`, `manager_id`, `approver_name`, `receipt_url` and create `departments`, `assets`, and `sprints` tables with realtime publication.
2. Update `src/services/db.js` to ensure complete CRUD operations, multi-stage approval status transitions (`Pending Lead` -> `Pending Finance` / `Pending HR` -> `Approved`), and live Supabase synchronization across all tables.

### Phase 2: Unified Adaptive Shell & Dynamic Navigation
1. Create a unified, adaptive portal shell (`src/components/PortalShell.jsx` or expanded `App.jsx`) that renders modular navigation based on:
   - User Tier (Tier 1..5)
   - User Department (`Engineering`, `Finance & Operations`, `Human Resources`, `Product & Design`, `Executive`)
   - Direct reports count (`db.getDirectReports(user.id).length > 0` unlocks Team Lead Hub)
2. Preserve high-contrast Nordic Minimalist theme, seamless mobile bottom navigation, and quick role/persona previews for testing.

### Phase 3: Dedicated 5-Tier Functional Modules & Hubs
1. **Tier 1 & 2 Workspace (Self-Service):** Refine employee workspace with attendance, leave balances, itemized payslips, expense claims, HMO health card, support tickets.
2. **Tier 3 Team Lead Hub:** Dedicated view for Line Managers with direct report cards, team live shift presence, L1 leave and claim approvals, and quarterly team OKR reviews.
3. **Tier 4 Department Management Hubs:**
   - *Engineering & Tech Hub:* Cloud sandboxes (AWS/GCP), API keys/GitHub seat allocations, Sprint board, On-call rotation.
   - *Finance & Accounting Hub:* Automated payroll execution engine, statutory tax/pension calculator, reimbursement payout authorizations, departmental budget tracking.
   - *HR & People Operations Hub:* Interactive Organization Chart (visual tree drill-down from CEO to staff), talent onboarding/offboarding, company leave calendar.
   - *IT & Facilities Hub:* Hardware asset registry (serial numbers, condition, assignee status), SLA support ticket resolution queue.
4. **Tier 5 Executive Command Cockpit (CEO / COO):** Company burn rate, monthly payroll outlay, headcount growth, departmental health matrix, company-wide broadcasts, and interactive company-wide Org Tree.

### Phase 4: Multi-Stage Chain of Command Workflow
1. Implement 2-stage approval flows:
   - Leave: Employee submits -> Direct Team Lead reviews/approves -> HR updates leave balance and calendar.
   - Claims: Employee submits -> Direct Manager verifies necessity -> Finance Lead authorizes payout in payroll batch.
2. Ensure strict scoping so leads only see their direct reports (`managerId === lead.id`).

### Phase 5: Verification & Production Polish
1. Run `npm run lint` and `npm run build` to maintain 0 errors / 0 warnings.
2. Verify multi-device real-time sync across sessions.
