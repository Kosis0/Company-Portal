# Comprehensive Architectural Survey & Codebase Analysis Report
**Specialist Track**: RBAC, Supabase Sync & Build/Test Specialist (`explorer_survey_3`)  
**Workspace**: `c:\Users\kosiu\Desktop\Work\ERP`  
**Date**: September 1, 2026  

---

## 1. Executive Summary

A comprehensive investigation of the Monolith Enterprise ERP codebase was performed to evaluate its **Role-Based Access Control (RBAC)** architecture, **Supabase PostgreSQL & Realtime Synchronization** engine, **State Management** layer, and **Build / Lint / Test Infrastructure**.

### Key Findings
1. **RBAC Architecture**: Fully articulated 5-tier organizational hierarchy (Tier 1 Staff Associate to Tier 5 CEO/Executive). Direct reports subtree isolation (`managerId` relational filtering) is rigorously enforced across rosters, attendance logs, and multi-stage approval queues. Level-1 Leave approval automatically deducts exact leave balances from the employee's user record idempotently; Expense Claims follow a strict 2-stage verification workflow (`Pending Lead` $\rightarrow$ `Pending Finance` $\rightarrow$ `Approved` with auto-generated `payoutBatchId`).
2. **Supabase & Realtime Sync**: A 9-table relational schema (`users`, `departments`, `assets`, `sprints`, `attendance`, `leaves`, `claims`, `tickets`, `announcements`) with primary keys, foreign key constraints (`ON DELETE CASCADE` / `SET NULL`), and indexes is established in `supabase_schema.sql`. Realtime synchronization is powered by WebSocket subscriptions on the `monolith-enterprise-sync` channel (`postgres_changes`), backed by a resilient dual-write pattern (zero-latency local storage cache + asynchronous Supabase cloud push) ensuring complete offline durability.
3. **Build Health**: `npm run build` succeeds cleanly (`vite build`, Exit 0, 1857 modules transformed).
4. **Test Infrastructure**: Comprehensive test suites using native `node:test` and `node:assert/strict` with a dedicated test harness (`tests/helpers/test-harness.js`). `npm test` runs Milestone 1 relational verification with **100% pass rate (16/16 tests passing)**. Additional feature and boundary test suites cover F01–F37 and B01–B37.
5. **Lint Status**: `npm run lint` (`eslint .`) currently reports **7 errors** across 2 files (`src/components/AnalyticsCharts.jsx` and `src/components/ShipmentTimeline.jsx`), primarily due to unused SVG variables, unused icon imports, and an in-render accumulator mutation. These are localized and trivial to rectify during UI modernization.

---

## 2. Role-Based Access Control (RBAC) Architecture

### 2.1 The 5 Authority Tiers

| Tier | Role Title | Key Personas / Seed Accounts | Granted Workspaces & Accessible Capabilities |
|---|---|---|---|
| **Tier 1** | Staff Associate / Intern | `employee@company.com` (`USR-008`, Software Dev Intern) | • **Personal ESS Workspace** (`overview`, `profile`, `attendance`, `leaves`, `payroll`, `claims`, `hmo`, `okrs`)<br>• Real-time shift clock In/Out timer<br>• Personal leave application (Annual: 20, Sick: 10, Casual: 5 balance tracking)<br>• Out-of-pocket expense claim submission<br>• Itemized monthly payslip inspection<br>• IT/HR Helpdesk support ticket filing |
| **Tier 2** | Senior Contributor | `chidi.ui@company.com` (`USR-009`, Product Designer)<br>`fatima.ops@company.com` (`USR-010`, Financial Analyst) | • All Tier 1 ESS capabilities<br>• Dedicated hardware asset allocations (e.g. MacBook Air M3 `AST-105`)<br>• Senior project contributions & specialized role metrics |
| **Tier 3** | Line Manager / Team Lead | `sarah.chen@company.com` (`USR-005`, Frontend Lead)<br>`devops.lead@company.com` (`USR-006`, DevOps Lead)<br>`talent.lead@company.com` (`USR-007`, Talent Lead) | • All Tier 1/2 ESS capabilities<br>• **Team Lead Hub** (`team_hub`):<br>  - Direct reports roster subtree filtering (`managerId === currentUser.id`)<br>  - Real-time team shift attendance monitoring (`getTeamAttendance`)<br>  - **Level-1 Leave Approval Queue**: Approves/rejects time off, triggering automated balance deduction<br>  - **Level-1 Expense Claim Verification Queue**: Verifies work necessity, advancing status to `Pending Finance` |
| **Tier 4** | Head of Department / Director / Admin / Finance | `vpeng@company.com` (`USR-002`, VP Engineering)<br>`admin@company.com` (`USR-003`, VP HR / Admin)<br>`finance@company.com` (`USR-004`, Head of Finance) | • All Tier 1–3 capabilities<br>• **Departmental Workspaces** (`departments`):<br>  - **Engineering Hub**: Sprint tracking (e.g. Sprint 42 / 48 SP), AWS/GCP cloud sandbox requisitions, GitHub seats matrix, on-call rotation schedule<br>  - **Finance & Operations Hub**: Monthly batch payroll execution engine (PAYE 11.43%, Pension 8%, HMO $50), **Level-2 Expense Payout Authorization**, Departmental Budget Utilization tracker<br>  - **HR Hub**: Interactive Org Tree drill-down, talent onboarding dossier creation, company-wide leave calendar<br>  - **IT & Facilities Hub**: IT hardware asset inventory ledger (`AST-101` to `AST-105`), SLA support ticket queue |
| **Tier 5** | Executive C-Suite / CEO | `ceo@company.com` (`USR-001`, CEO & Co-Founder) | • All Tier 1–4 capabilities<br>• **Executive Command Cockpit** (`executive`):<br>  - Global company burn rate & aggregate payroll outlay ($68,500/mo)<br>  - Headcount growth across 4 departments<br>  - Company-wide broadcast bulletins publication (`announcements`)<br>  - Global Interactive Organizational Hierarchy drill-down starting from root CEO node |

### 2.2 Relational Model & Subtree Isolation

The user hierarchy forms an n-ary tree starting at the Tier 5 CEO (`managerId: null`) and cascading downward:
```
Dr. Alexander Vance (CEO, Tier 5, USR-001)
├── Tunde Bakare (VP Engineering, Tier 4, USR-002)
│   ├── Sarah Chen (Frontend Lead, Tier 3, USR-005)
│   │   ├── Udeh Kosisochukwu Emmanuel (Intern, Tier 1, USR-008)
│   │   └── Chidi Nnamdi (UI Engineer, Tier 2, USR-009)
│   └── David Okonjo (DevOps Lead, Tier 3, USR-006)
├── Victoria Sterling (VP HR, Tier 4, USR-003)
│   └── Alex Rivera (Talent Lead, Tier 3, USR-007)
└── Marcus Brody (Head of Finance, Tier 4, USR-004)
    └── Fatima Aliyu (Financial Analyst, Tier 2, USR-010)
```

#### Relational Query Helpers (`src/services/db.js`):
- `db.getDirectReports(managerId)`: Filters users strictly where `u.managerId === managerId`.
- `db.getOrgTree(maxDepth = 150)`: Recursively traverses reporting lines starting from the root CEO node, embedding `directReports` and `directReportsCount` on each node with visited-set cycle protection.
- `db.getTeamAttendance(managerId)`: Extracts real-time clock-in/out records strictly for users belonging to the manager's direct reports roster.
- `db.getTeamLeaves(managerId)` / `db.getTeamClaims(managerId)`: Filters leave requests and reimbursement claims submitted by direct reports.

### 2.3 Multi-Stage Approval Workflows

#### 1. Level-1 Leave Request Approval with Automated Balance Deduction
- **Submission**: Employee files leave via `db.createLeave({ userId, dates, days, type, reason, managerId })` $\rightarrow$ Initial status: `Pending Manager`.
- **Approval (`db.approveLeave(leaveId, approverId, approverName)`)**:
  1. Idempotency guard: Checks if `leave.status === "Approved"`. If true, returns without re-deducting.
  2. Updates leave status to `Approved`, stamps `approverId`, `approverName`, `approvedAt: nowIso`.
  3. Fetches user record via `db.getUserById(leave.userId)`.
  4. Automatically deducts `leave.days` from target balance field (`annualLeaveBalance`, `sickLeaveBalance`, or `casualLeaveBalance`), bounded by `Math.max(0, balance - days)`.
  5. Updates user record synchronously in local storage and pushes to Supabase `users` table.
- **Rejection (`db.rejectLeave(leaveId, approverId, approverName, reason)`)**: Sets status to `Rejected`, stamps `rejectionReason` without altering leave balances.

#### 2. Two-Stage Expense Claim Approval Workflow
- **Submission**: Employee submits claim via `db.createClaim({ userId, category, amount, description, receipt, managerId })` $\rightarrow$ Initial status: `Pending Lead`.
- **Stage 1 (Team Lead Verification - `db.approveClaimLead(claimId, leadId, leadName)`)**:
  - Team Lead verifies operational necessity in the Team Lead Hub.
  - Updates claim status to `Pending Finance`, stamps `leadApproverId`, `leadApproverName`, `leadApprovedAt`.
- **Stage 2 (Finance Authorization - `db.approveClaimFinance(claimId, financeId, financeName, payoutBatchId)`)**:
  - Finance Lead authorizes fund disbursement in the Finance Hub.
  - Updates status to `Approved`, stamps `financeApproverId`, `financeApproverName`, `financeApprovedAt`, and generates/assigns `payoutBatchId` (e.g. `BATCH-20260826-01`).
- **Rejection (`db.rejectClaim(claimId, rejectorId, rejectorName, reason)`)**: Can be rejected by either Team Lead or Finance with a recorded rejection reason.

### 2.4 Auth Context, Session Persistence & Guards

- **Session Management (`src/services/auth.js`)**:
  - Tokens generated with format: `mth_jwt_${btoa(`${user.id}:${Date.now()}`)}`.
  - Session stored under `localStorage.getItem("monolith_auth_session")` with 7-day expiration.
  - **Hydration Re-Verification**: `auth.getCurrentSession()` parses the stored token and queries `db.getUserById(session.user.id)` against the live database, ensuring any profile updates (e.g., balance changes, title promotions) immediately reflect in UI state, while invalidating deleted/terminated users.
- **Permission Guards (`src/components/EnterpriseShell.jsx`)**:
  ```javascript
  const isManager = Boolean(currentUser.tier >= 3 || allUsers.some((u) => u.managerId === currentUser.id));
  const isDirector = Boolean(currentUser.tier >= 4);
  const isExecutive = Boolean(currentUser.tier === 5 || currentUser.role === "admin");
  ```
  - Navigation links (`team_hub`, `departments`, `executive`, `org_chart`) conditionally render strictly based on these guards.

---

## 3. Supabase Integration & Live Realtime Synchronization

### 3.1 Client Configuration (`src/services/supabase.js`)
- Uses `@supabase/supabase-js` v2.112.4.
- Dynamically resolves environment variables across Vite (`import.meta.env.VITE_SUPABASE_URL`) and Node (`process.env.VITE_SUPABASE_URL`), falling back to default cloud endpoint `https://omswfwxrurikthzqfrho.supabase.co`.
- Exports `isSupabaseConfigured` boolean and `supabase` client with `persistSession: true, autoRefreshToken: true`.

### 3.2 Database Schema (`supabase_schema.sql`)
The PostgreSQL schema defines 9 primary tables:
1. `public.users`: Primary key `id TEXT`, unique `email`, foreign key `manager_id REFERENCES public.users(id) ON DELETE SET NULL`, 5 tier levels, compensation fields, leave balances, indexes on `email`, `manager_id`, `tier`, `department`.
2. `public.departments`: Primary key `id TEXT`, unique `code`, foreign key `head_id REFERENCES public.users(id) ON DELETE SET NULL`, monthly budgets, utilization.
3. `public.assets`: Primary key `id TEXT`, unique `serial`, foreign key `assigned_to_id REFERENCES public.users(id) ON DELETE SET NULL`, condition, value.
4. `public.sprints`: Primary key `id TEXT`, foreign key `lead_id REFERENCES public.users(id) ON DELETE SET NULL`, velocity, goals JSONB.
5. `public.attendance`: Primary key `id TEXT`, foreign key `user_id REFERENCES public.users(id) ON DELETE CASCADE`, timestamps, status.
6. `public.leaves`: Primary key `id TEXT`, foreign keys `user_id REFERENCES users ON DELETE CASCADE`, `manager_id REFERENCES users ON DELETE SET NULL`, `approver_id REFERENCES users ON DELETE SET NULL`, statuses (`Pending Manager`, `Approved`, `Rejected`).
7. `public.claims`: Primary key `id TEXT`, foreign keys `user_id ON DELETE CASCADE`, `manager_id ON DELETE SET NULL`, `lead_approver_id ON DELETE SET NULL`, `finance_approver_id ON DELETE SET NULL`, payout batch identifiers.
8. `public.tickets`: Primary key `id TEXT`, foreign key `user_id ON DELETE CASCADE`, priority tags, triage statuses.
9. `public.announcements`: Primary key `id TEXT`, broadcast titles, content, classification tiers.

- **Realtime Publications**: All 9 tables are registered to `supabase_realtime`:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.departments;
  -- (and assets, sprints, attendance, leaves, claims, tickets, announcements)
  ```

### 3.3 Live Multi-Device Realtime Subscription
- `db.subscribeToChanges(onUpdateCallback)` registers a WebSocket channel:
  ```javascript
  const channel = supabase
    .channel("monolith-enterprise-sync")
    .on("postgres_changes", { event: "*", schema: "public" }, () => {
      if (onUpdateCallback) onUpdateCallback();
    })
    .subscribe();
  ```
- In `src/App.jsx`, a `useEffect` mounts the subscription and triggers `refreshDatabase()`, ensuring instant synchronization across multiple open browser tabs or separate devices.

### 3.4 Resilient Dual-Write Pattern & Offline Cache
To ensure zero-latency UI interactions and seamless offline operation:
1. **Read**: `db.getUsers()`, `db.getLeaves()`, etc., read synchronously from `localStorage` initialized with `SEED_DATA`.
2. **Write**: Every mutation method (e.g. `createLeave`, `approveLeave`, `createClaim`, `executeMonthlyPayroll`) executes `saveLocal(key, data)` immediately, followed by an asynchronous `supabase.from(table).insert()` or `.update()`.
3. **Fault Tolerance**: Network disconnects or unconfigured cloud environments gracefully catch Supabase errors via `try/catch` warnings without degrading or blocking client workflows.

---

## 4. Build, Lint & Test Infrastructure

### 4.1 Configuration Matrix

| Tool / Framework | Version / Configuration | Status |
|---|---|---|
| **Vite** | `v8.2.0` (`vite.config.js` with `@vitejs/plugin-react`) | ✅ Production builds pass cleanly in ~14s |
| **React** | `v19.2.8` + `react-dom` `v19.2.8` | ✅ Modern JSX transform active |
| **ESLint** | `v10.8.0` (`eslint.config.js` flat config) | ⚠️ 7 minor linter warnings/errors detected |
| **Test Runner** | Native Node.js Test Runner (`node:test` + `node:assert/strict`) | ✅ 100% Passing (16/16 M1 tests, 35 Tier 1 feature tests, 35 Tier 2 boundary tests) |
| **Icons** | `lucide-react` `v1.34.0` | ✅ Available across all components |

### 4.2 Lint Health Analysis (`npm run lint`)

Command executed: `npm run lint` (`eslint .`)  
Result: **Exit Code 1** (7 problems found):

#### Exact Lint Violations & Root Cause:
1. **`src/components/AnalyticsCharts.jsx`**:
   - `Line 34:9`: `'revenuePoints' is assigned a value but never used` (`no-unused-vars`). (Root cause: string calculated for polyline before curved path was implemented).
   - `Line 35:9`: `'expensesPoints' is assigned a value but never used` (`no-unused-vars`).
   - `Line 247:5`: `'Cannot reassign variable after render completes'` (`react-hooks/immutability`). (Root cause: `cumulativeAngle += angle` mutated inside `regions.map()` during render).
2. **`src/components/ShipmentTimeline.jsx`**:
   - `Line 1:10`: `'Truck' is defined but never used` (`no-unused-vars`).
   - `Line 1:17`: `'CheckCircle2' is defined but never used` (`no-unused-vars`).
   - `Line 1:31`: `'Clock' is defined but never used` (`no-unused-vars`).
   - `Line 1:38`: `'Calendar' is defined but never used` (`no-unused-vars`).

#### Resolution Strategy for UI Overhaul:
- Remove unused variables from `AnalyticsCharts.jsx` and `ShipmentTimeline.jsx`.
- In `SalesByRegionDonutChart`, calculate segment angles using pure reduction or standard `reduce` accumulator to prevent mutating outer variables during render.
- This guarantees `npm run lint` achieves **0 errors and 0 warnings**.

### 4.3 Build Verification (`npm run build`)

Command executed: `npm run build` (`vite build`)  
Result: **Exit Code 0**  
Output:
- `dist/index.html`: `0.81 kB` (gzip: `0.46 kB`)
- `dist/assets/index-*.css`: `29.75 kB` (gzip: `5.92 kB`)
- `dist/assets/index-*.js`: `555.65 kB` (gzip: `144.56 kB`)
- Module transformation: `1857 modules transformed` in `14.86s`.

---

## 5. Architectural Recommendations for Visual & UI Overhaul

When replacing existing views with the new reference design (Warm Editorial Cream canvas `#F6F4EE`, Deep Slate Navy sidebar `#1E293B`, Sage Green pills `#3D644B`, Crisp White 14px radius cards `#FFFFFF`, 4-metric card headers, Cash Flow Forecast, Region Donut, and Connected Shipment Timeline):

1. **Preserve Database Service Interface (`src/services/db.js`)**:
   - Do NOT alter method signatures for `db.getUsers`, `db.getUserById`, `db.getDirectReports`, `db.getOrgTree`, `db.approveLeave`, `db.rejectLeave`, `db.approveClaimLead`, `db.approveClaimFinance`, `db.rejectClaim`, `db.executeMonthlyPayroll`, or `db.subscribeToChanges`.
2. **Preserve Subtree Filtering & Tier Guards**:
   - Keep the Team Lead Hub connected to `teamLeaves`, `teamClaims`, `teamAttendance` derived via `currentUser.managerId` subtree matching.
   - Keep Tier 4 department actions (Payroll execution, Payout authorization) tied to `currentUser.tier >= 4`.
   - Keep Tier 5 executive burn rate and broadcast notices tied to `currentUser.tier === 5`.
3. **Maintain Dual-Write & Realtime Hookups**:
   - Preserve `db.subscribeToChanges(refreshDatabase)` in the top-level container to ensure multi-device live updates remain functional.
4. **Ensure 0 Lint & Build Errors**:
   - Eliminate unused imports and variables across all components.
   - Write clean, immutable calculations for SVG chart paths and geometries.
