# Comprehensive Domain Analysis, Schema Specification, and Workflow Architecture

**Project:** Enterprise Multi-Tier Workforce & Organization Operating System (Monolith ERP)  
**Agent:** Survey Explorer 2  
**Date:** 2026-08-31  
**Working Directory:** `c:\Users\kosiu\Desktop\Work\ERP\.agents\explorer_survey_2`  
**Reference Document:** `c:\Users\kosiu\Desktop\Work\ERP\.agents\ORIGINAL_REQUEST.md`

---

## 1. Executive Summary & Architecture Blueprint

This report provides the exhaustive domain requirements, relational data schemas, role-based access control (RBAC) matrices, state machines, and persistence strategies for Monolith ERP.

The platform unifies 5 organizational tiers, 4 specialized department toolkits, multi-stage approval routing, interactive visual organization hierarchies, real-time multi-device synchronization via Supabase PostgreSQL WebSockets, and zero-latency offline caching.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           ADAPTIVE UNIFIED PORTAL SHELL                           │
├─────────────────┬─────────────────┬───────────────────┬───────────────────────────┤
│ Tier 1 & 2 ESS  │ Tier 3 Lead Hub │ Tier 4 Dept Hubs  │ Tier 5 Executive Cockpit  │
│ Self-Service    │ Direct Reports  │ Eng / Fin / HR/IT │ Global Org Tree & KPIs    │
└────────┬────────┴────────┬────────┴─────────┬─────────┴─────────────┬─────────────┘
         │                 │                  │                       │
┌────────▼─────────────────▼──────────────────▼───────────────────────▼─────────────┐
│                    UNIFIED CLIENT-SIDE DATA & STATE LAYER (db.js)                 │
│   - Dual-Write Pattern (Optimistic LocalStorage Cache + Supabase Async Push)       │
│   - Multi-device Real-Time WebSocket Channel ('monolith-enterprise-sync')         │
└──────────────────────────────────────┬────────────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼────────────────────────────────────────────┐
│                         SUPABASE POSTGRESQL DATABASE                              │
│   users | departments | assets | attendance | leaves | claims | tickets | ...    │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. R1: 5-Tier Organizational Hierarchy & RBAC Rules

### 2.1 Tier Definitions and Scopes

| Tier | Tier Name | Typical Job Titles | Role Key | Primary Workspace | Data Access Scope | Approval Authorities |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | Staff / Associate / Intern | Developer Intern, Junior Associate, Support Analyst | `employee`, `associate`, `intern` | Employee Self-Service (ESS) | Self only (`userId === currentUser.id`) | None |
| **Tier 2** | Mid / Senior Contributor | Senior UI Engineer, Product Designer, DevOps Specialist | `senior_contributor`, `employee` | ESS + Project / Ticket Assignments | Self + Assigned Project/Tickets | None |
| **Tier 3** | Line Manager / Team Lead | Frontend Lead, DevOps Lead, Talent Lead | `manager`, `team_lead` | ESS + Dedicated Team Lead Hub | Self + Direct Reports (`user.managerId === lead.id`) | Level-1 Leaves (direct reports), Level-1 Expense Claims (`Pending Lead` -> `Pending Finance`) |
| **Tier 4** | Head of Department / Director / Admin | VP of Engineering, VP of HR, Head of Finance, IT Director | `director`, `admin`, `finance`, `vp` | Department Functional Hub + Cross-Dept Hubs | Entire Department + All Direct Reports | Level-2 Expense Claims (Finance), Payroll Batch Run (Finance), Asset Assignment (IT), Org & Personnel Admin (HR) |
| **Tier 5** | Executive / C-Suite | CEO, COO, Chief Architect, Managing Director | `executive`, `ceo`, `coo` | Executive Command Cockpit + Full Portal Drill-down | Global Enterprise (All 5 tiers, all departments, all records) | Final Executive Approvals, Company-wide Policy & Broadcasts |

### 2.2 RBAC Permission Matrix

| Feature / Action | Tier 1 (Staff) | Tier 2 (Senior) | Tier 3 (Team Lead) | Tier 4 (Director) | Tier 5 (CEO/Exec) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Clock In / Out & Personal Attendance** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Personal Leave Balance & Application** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Personal Payslip Breakdown** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Personal Expense Claim Submission** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Personal HMO Health Card & Directory** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Personal Support Ticket Filing** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Assigned Sprints & Tasks** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Cloud Sandbox Requisition (Eng)** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **View Direct Reports Roster** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Real-time Team Attendance Monitor** | ❌ | ❌ | ✅ (Direct reports) | ✅ (Department) | ✅ (Global) |
| **Approve/Reject Direct Report Leaves** | ❌ | ❌ | ✅ (Direct reports) | ✅ (Dept/Direct) | ✅ (Global) |
| **Level-1 Expense Claim Approval** | ❌ | ❌ | ✅ (Direct reports) | ✅ (Dept/Direct) | ✅ (Global) |
| **Quarterly OKR & Performance Reviews** | ❌ | ❌ | ✅ (Direct reports) | ✅ (Department) | ✅ (Global) |
| **Engineering Hub (Cloud/GitHub/Sprints)** | ❌ | View assigned | Lead view | ✅ (VP Eng) | ✅ |
| **Finance Hub & Monthly Payroll Engine** | ❌ | ❌ | ❌ | ✅ (Finance Dir) | ✅ |
| **Level-2 Expense Payout Authorization** | ❌ | ❌ | ❌ | ✅ (Finance Dir) | ✅ |
| **Department Budget Utilization Tracking** | ❌ | ❌ | ❌ | ✅ (Dept Budget) | ✅ (All Budgets) |
| **HR Hub (Org Chart, Onboarding Pipeline)** | ❌ | ❌ | ❌ | ✅ (HR Dir) | ✅ |
| **IT Asset Inventory & Hardware Registry** | ❌ | ❌ | ❌ | ✅ (IT Admin) | ✅ |
| **IT Support Ticket SLA Queue Resolution** | ❌ | ❌ | ❌ | ✅ (IT Admin) | ✅ |
| **Executive Burn Rate & Financial Metrics** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Interactive Global Org Tree Drill-down** | ❌ | ❌ | ❌ | ✅ (HR/Admin) | ✅ |
| **Broadcast Company-wide Announcements** | ❌ | ❌ | ❌ | ✅ (HR/Admin) | ✅ (CEO/Exec) |

### 2.3 Hierarchical Invariants and Edge Cases
1. **Root Node**: The CEO (Tier 5) has `managerId: null` and reports only to the Board of Directors.
2. **Strict Manager Scoping**: Team Leads (Tier 3) cannot view or approve leave/claim requests of peers or employees whose `managerId` does not match their `id`.
3. **Multi-Role Scoping**: A Director (Tier 4) may also have direct reports (Tier 3 Leads or senior staff); the UI must allow them to toggle between Department Management and Team Lead Direct Reports views.
4. **Dual Reporting / Delegation**: If a Team Lead is on leave, their pending approval queue can be escalated to the Department Director (Tier 4).

---

## 3. R2: Department-Specific Functional Toolkits

### 3.1 Engineering & Tech Hub
- **Purpose**: Infrastructure management, cloud resources, sprint velocity, and on-call reliability.
- **Key Modules**:
  1. **Developer Cloud Sandbox Requisitions**:
     - Cloud providers: AWS, GCP.
     - Parameters: Account type, project name, environment ('Development' | 'Staging' | 'Sandbox'), monthly budget cap ($200 - $1,500), auto-teardown policy.
     - Lifecycle: `Requested` -> `Approved by VP Eng` -> `Active / Provisioned` -> `Terminated`.
  2. **API Keys & GitHub Seat Allocations**:
     - Tool inventory: GitHub Enterprise, OpenAI API, Datadog, AWS IAM, Vercel Enterprise.
     - License usage tracker: Seats assigned vs total organization quota.
  3. **Sprint Tracking & Velocity Metrics**:
     - Sprint entity: Sprint title, active status, start/end dates, total story points, completed points, velocity, sprint goals.
  4. **On-Call Rotation Schedules**:
     - Primary and Secondary on-call engineers per week, escalation policies, pager coverage.

### 3.2 Finance & Accounting Hub
- **Purpose**: Corporate compensation, statutory compliance, expense reimbursement, and departmental fiscal health.
- **Key Modules**:
  1. **Monthly Payroll Execution Engine**:
     - Calculation formula for every active employee:
       $$\text{Gross Pay} = \text{Monthly Base Salary} + \text{Allowances}$$
       $$\text{PAYE Tax} = \text{Standardized Statutory Bracket (e.g. 11.43\% of Gross)}$$
       $$\text{Pension (Employee)} = 8\% \times \text{Gross Pay}$$
       $$\text{HMO Withholding} = \$50.00 \text{ (Standard Corporate Premium)}$$
       $$\text{Net Pay} = \text{Gross Pay} - \text{PAYE Tax} - \text{Pension} - \text{HMO Withholding}$$
     - Batch payroll execution: Processes payslips for all active employees and generates timestamped disbursement logs.
  2. **Expense Reimbursement Payout Authorizations (Level-2)**:
     - Aggregates claims verified by Team Leads (`status: 'Pending Finance'`).
     - Authorizes batch bank payouts, marking claims as `Approved` or `Paid`.
  3. **Departmental Budget Utilization & Cost Center Tracking**:
     - Live tracking of monthly allocated budget vs actual spent per department (Engineering, HR, Finance, IT/Operations, Product).

### 3.3 HR & People Operations Hub
- **Purpose**: Human capital governance, talent pipelines, organizational structure, and time-off tracking.
- **Key Modules**:
  1. **Interactive Organization Chart (Visual Org Tree)**:
     - Recursive hierarchical visualization starting from CEO (Tier 5) -> VPs/Directors (Tier 4) -> Team Leads (Tier 3) -> Mid/Senior Staff (Tier 2) -> Interns/Staff (Tier 1).
     - Interactive node expansion, department badges, avatar initials, direct report counts, and direct modal profile drill-down.
  2. **Talent Onboarding & Offboarding Pipeline**:
     - Stages: `Offer Accepted` -> `Background & KYC` -> `IT Provisioning` -> `Day-1 Orientation` -> `Active`.
  3. **Company-Wide Leave Calendar**:
     - Unified schedule mapping all approved employee leaves across departments to prevent project scheduling conflicts.
  4. **Personnel Directory & Record Governance**:
     - Onboarding new employees, updating compensation, banking, HMO, and contact details.

### 3.4 IT & Facilities Operations Hub
- **Purpose**: Hardware assets lifecycle, security keys, workstation provisioning, and helpdesk SLA queues.
- **Key Modules**:
  1. **Company Hardware Inventory & Asset Registry**:
     - Tracked attributes: Asset ID, device name, hardware category ('Workstation' | 'Display & Peripheral' | 'Security Token' | 'Networking'), serial number, assigned employee, department, deployment date, hardware condition ('New' | 'Excellent' | 'Good' | 'Fair' | 'Retired'), asset value.
  2. **Support Ticket SLA Resolution Queue**:
     - Triage queue for IT and Facilities tickets.
     - Priority levels: `Low` (72h SLA), `Medium` (24h SLA), `High` (8h SLA), `Critical` (2h SLA).
     - Actions: Assign technician, update status (`Open` -> `In Progress` -> `Resolved` -> `Closed`), log resolution notes.

---

## 4. R3: Multi-Stage Chain of Command Workflow & State Machines

### 4.1 Leave Approval Workflow & Automated Balance Deduction

```
  [Employee Submits Leave]
             │
             ▼
   Status: 'Pending Manager' (or 'Pending Lead')
             │
             ├─────────────────────────────────────────┐
             ▼ (Approved by Lead)                      ▼ (Rejected by Lead)
   Status: 'Approved'                        Status: 'Rejected'
   - Deducts days from user leave balance    - No balance deducted
     (annualLeaveBalance -= days)            - Rejection reason recorded
   - Adds to Company Leave Calendar
   - Persists approverName & timestamp
```

**State Transition Rules**:
- **Initial State**: `Draft`
- **Trigger**: `submitLeave(userId, type, dates, days, reason)` -> Transition to `Pending Manager`.
- **Authorization Guard**: Only the user whose `id === leave.managerId` (or HR Admin / Tier 5) can execute approval or rejection.
- **Approval Execution**:
  - `leave.status = 'Approved'`
  - `leave.approverId = currentLead.id`
  - `leave.approverName = currentLead.name`
  - `leave.approvedAt = NOW()`
  - **Live Balance Mutation**:
    - If `leave.type === 'Annual Leave'`: `user.annualLeaveBalance = max(0, user.annualLeaveBalance - leave.days)`
    - If `leave.type === 'Sick Leave'`: `user.sickLeaveBalance = max(0, user.sickLeaveBalance - leave.days)`
    - If `leave.type === 'Casual Leave'`: `user.casualLeaveBalance = max(0, user.casualLeaveBalance - leave.days)`

---

### 4.2 Expense Claim 2-Stage Approval Workflow

```
  [Employee Submits Claim with Receipt]
                     │
                     ▼
        Status: 'Pending Lead' (Stage 1)
                     │
         ┌───────────┴───────────┐
         ▼ (Lead Approves)       ▼ (Lead Rejects)
  Status: 'Pending Finance'   Status: 'Rejected'
         │                    - Reason logged
         ▼ (Stage 2)
  [Finance Lead Verifies in Batch]
         │
         ├───────────────────────┐
         ▼ (Finance Approves)    ▼ (Finance Rejects)
  Status: 'Approved' / 'Paid'  Status: 'Rejected'
  - Included in Payroll Run    - Reason logged
  - Payment timestamp logged
```

**State Transition Rules**:
- **Stage 1 (Team Lead Review)**:
  - Guard: `currentUser.id === claim.managerId || currentUser.tier >= 4`
  - Action `approveLead`: Transitions `status` from `Pending Lead` to `Pending Finance`. Sets `leadApproverId`, `leadApproverName`, `leadApprovedAt`.
  - Action `rejectLead`: Transitions `status` to `Rejected`. Sets `rejectionReason`.
- **Stage 2 (Finance Lead Authorization)**:
  - Guard: `currentUser.role === 'finance' || currentUser.department === 'Finance & Operations' || currentUser.tier >= 4`
  - Action `approveFinance`: Transitions `status` from `Pending Finance` to `Approved` (or `Paid`). Sets `financeApproverId`, `financeApproverName`, `financeApprovedAt`, `payoutBatchId`.
  - Action `rejectFinance`: Transitions `status` to `Rejected`. Sets `rejectionReason`.

---

### 4.3 Shift Attendance & Real-Time Clock Lifecycle

```
  [Clocked Out]
        │
        ▼ (Employee clicks 'Clock In')
  [Clocked In - Active Shift]
  - Inserts Attendance record (date, in_time, status: 'In Progress')
  - Starts 1000ms client interval timer calculating elapsed seconds (HH:MM:SS)
        │
        ▼ (Employee clicks 'Clock Out')
  [Shift Completed]
  - Calculates total elapsed hours (e.g. "8h 15m")
  - Updates Attendance record (out_time, hours, status: 'On Time' | 'Present')
  - Stops interval timer
```

---

## 5. R5: Supabase PostgreSQL Schema & Entity Relationship Model

### 5.1 Full Relational Database DDL (`supabase_schema.sql`)

```sql
-- =========================================================================
-- MONOLITH ENTERPRISE ERP • COMPLETE SUPABASE DATABASE SCHEMA (V2.0)
-- Full 5-Tier Hierarchy, Department Toolkits, Assets, and Multi-Stage Workflows
-- =========================================================================

-- 1. USERS & HIERARCHY TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT DEFAULT 'Staff Member',
  department TEXT DEFAULT 'Engineering',
  role TEXT DEFAULT 'employee', -- 'employee' | 'senior_contributor' | 'manager' | 'director' | 'finance' | 'admin' | 'executive'
  tier INT DEFAULT 1,           -- 1: Staff, 2: Senior, 3: Lead, 4: Director, 5: CEO/Exec
  manager_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  manager_name TEXT,
  phone TEXT DEFAULT '+234 800 000 0000',
  location TEXT DEFAULT 'Port Harcourt, Nigeria',
  bank_name TEXT DEFAULT 'First Bank of Nigeria',
  account_number TEXT DEFAULT '3049283482',
  tax_id TEXT DEFAULT 'TIN-98234711',
  pension_pin TEXT DEFAULT 'PEN-100293847',
  salary TEXT DEFAULT '$3,500/mo',
  monthly_base_pay NUMERIC DEFAULT 3500.00,
  score TEXT DEFAULT '4.5 / 5.0',
  status TEXT DEFAULT 'Active', -- 'Active' | 'On Leave' | 'Terminated'
  annual_leave_balance INT DEFAULT 20,
  sick_leave_balance INT DEFAULT 10,
  casual_leave_balance INT DEFAULT 5,
  avatar_initials TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY,          -- e.g. 'DEP-ENG', 'DEP-HR', 'DEP-FIN', 'DEP-PRD'
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  head_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  head_name TEXT,
  head_title TEXT,
  headcount INT DEFAULT 0,
  monthly_budget TEXT DEFAULT '$25,000',
  budget_utilization TEXT DEFAULT '0%',
  primary_location TEXT DEFAULT 'Headquarters',
  lead_objective TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. IT & FACILITIES ASSETS REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY,          -- e.g. 'AST-101'
  name TEXT NOT NULL,
  category TEXT NOT NULL,       -- 'Workstation' | 'Display & Peripheral' | 'Security Token' | 'Networking'
  serial TEXT UNIQUE NOT NULL,
  assigned_to_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  assigned_to_name TEXT,
  department TEXT NOT NULL,
  deployed_date TEXT NOT NULL,
  condition TEXT DEFAULT 'Excellent', -- 'New' | 'Excellent' | 'Good' | 'Fair' | 'Retired'
  status TEXT DEFAULT 'Deployed',     -- 'Deployed' | 'In Stock' | 'Maintenance' | 'Decommissioned'
  value TEXT DEFAULT '$1,500.00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENGINEERING SPRINTS TABLE
CREATE TABLE IF NOT EXISTS public.sprints (
  id TEXT PRIMARY KEY,          -- e.g. 'SPR-42'
  title TEXT NOT NULL,
  department TEXT DEFAULT 'Engineering',
  lead_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  lead_name TEXT,
  status TEXT DEFAULT 'Active', -- 'Upcoming' | 'Active' | 'Completed'
  progress TEXT DEFAULT '0%',
  velocity TEXT DEFAULT '40 Story Points',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  goals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ATTENDANCE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
  id TEXT PRIMARY KEY,          -- e.g. 'ATT-101'
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  date TEXT NOT NULL,
  in_time TEXT NOT NULL,
  out_time TEXT DEFAULT '—',
  hours TEXT DEFAULT 'In Progress',
  location TEXT DEFAULT 'Office',
  status TEXT DEFAULT 'On Time', -- 'On Time' | 'Present' | 'Late' | 'Half Day'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEAVE REQUESTS TABLE (With Multi-Tier Approval Support)
CREATE TABLE IF NOT EXISTS public.leaves (
  id TEXT PRIMARY KEY,          -- e.g. 'LV-201'
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  manager_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,           -- 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity Leave'
  dates TEXT NOT NULL,
  days INT DEFAULT 1,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'Pending Manager', -- 'Pending Manager' | 'Approved' | 'Rejected' | 'Cancelled'
  applied_on TEXT NOT NULL,
  approver_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  approver_name TEXT,
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EXPENSE CLAIMS TABLE (2-Stage Approval Routing)
CREATE TABLE IF NOT EXISTS public.claims (
  id TEXT PRIMARY KEY,          -- e.g. 'CLM-301'
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  manager_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  amount TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  receipt TEXT DEFAULT 'receipt_invoice.pdf',
  status TEXT DEFAULT 'Pending Lead', -- 'Pending Lead' | 'Pending Finance' | 'Approved' | 'Rejected'
  lead_approver_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  lead_approver_name TEXT,
  lead_approved_at TIMESTAMPTZ,
  finance_approver_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  finance_approver_name TEXT,
  finance_approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  payout_batch_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUPPORT TICKETS TABLE (IT & HR Helpdesk)
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,          -- e.g. 'TCK-401'
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,       -- 'IT Hardware' | 'Software & Access' | 'Network / VPN' | 'HR Inquiry'
  priority TEXT DEFAULT 'Medium', -- 'Low' | 'Medium' | 'High' | 'Critical'
  details TEXT,
  assigned_to_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  assigned_to TEXT DEFAULT 'Dennis V. (IT Support)',
  status TEXT DEFAULT 'Open',   -- 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  sla_hours INT DEFAULT 24,
  date TEXT NOT NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ANNOUNCEMENTS TABLE (Company Broadcasts)
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,          -- e.g. 'ANN-501'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'Important', -- 'Important' | 'General' | 'Policy' | 'Executive'
  author TEXT NOT NULL,
  author_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  target_department TEXT DEFAULT 'All',
  date TEXT NOT NULL,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REALTIME PUBLICATION SETUP
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.departments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sprints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaves;
ALTER PUBLICATION supabase_realtime ADD TABLE public.claims;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- INDEXES FOR HIGH QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_manager ON public.users(manager_id);
CREATE INDEX IF NOT EXISTS idx_users_tier ON public.users(tier);
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users(department);
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON public.attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_leaves_user_status ON public.leaves(user_id, status);
CREATE INDEX IF NOT EXISTS idx_leaves_manager ON public.leaves(manager_id);
CREATE INDEX IF NOT EXISTS idx_claims_user_status ON public.claims(user_id, status);
CREATE INDEX IF NOT EXISTS idx_claims_manager ON public.claims(manager_id);
CREATE INDEX IF NOT EXISTS idx_assets_assigned ON public.assets(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.tickets(user_id);
```

### 5.2 Entity Relationship Diagram (Conceptual)

```
       ┌────────────────────────┐
       │      public.users      │◄───────────┐ (Self-reference manager_id)
       └───────────┬────────────┘            │
                   │                         │
       ┌───────────┼─────────────────────────┼────────────────────────┐
       │ 1:N       │ 1:N                     │ 1:N                    │ 1:N
       ▼           ▼                         ▼                        ▼
┌──────────────┐ ┌──────────────┐     ┌──────────────┐         ┌──────────────┐
│  attendance  │ │    leaves    │     │    claims    │         │   tickets    │
└──────────────┘ └──────────────┘     └──────────────┘         └──────────────┘
       ▲
       │ 1:N
┌──────┴───────┐ ┌──────────────┐     ┌──────────────┐         ┌──────────────┐
│  departments │ │    assets    │     │   sprints    │         │announcements │
│ (head_id FK) │ │(assigned_to) │     │ (lead_id FK) │         │(author_id FK)│
└──────────────┘ └──────────────┘     └──────────────┘         └──────────────┘
```

---

## 6. Real-Time Sync & Resilient Offline Caching Architecture

### 6.1 Dual-Write Mutation Pattern

To ensure instantaneous UI response (< 1ms) and 100% offline resilience while maintaining cross-device live sync, all mutations follow this cycle:

```
[User Action in UI]
        │
        ├───────────────────────────────────────────────────────┐
        ▼ (Sync Step 1: Immediate Local Mutation)               │ (Sync Step 2: Async Cloud Push)
  1. Update in-memory JavaScript state                          ▼
  2. Write updated collection to localStorage            3. supabase.from(table).upsert() / .insert()
  3. Trigger React state re-render                       4. Supabase triggers Postgres WAL event
  4. Display optimistic success toast                    5. Supabase broadcasts via Realtime WebSocket
        │                                                       │
        │                                                       ▼
        │                                                [Other Connected Devices / Browsers]
        │                                                - Receive postgres_changes event
        │                                                - Invalidate & refresh local memory
        │                                                - UI updates seamlessly without reload
```

### 6.2 Realtime Subscription Implementation
In `src/services/db.js`:
```javascript
subscribeToChanges(onUpdateCallback) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel("monolith-enterprise-sync")
    .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
      // Invalidate local memory and notify active React components
      if (onUpdateCallback) onUpdateCallback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
```

### 6.3 Local Offline Storage Keys
All local tables are segregated with prefixed keys:
- `monolith_db_users`
- `monolith_db_departments`
- `monolith_db_assets`
- `monolith_db_attendance`
- `monolith_db_leaves`
- `monolith_db_claims`
- `monolith_db_tickets`
- `monolith_db_announcements`
- `monolith_db_sprints`

If `localStorage` is empty upon application mount, the database service automatically initializes from `SEED_DATA` containing a complete 10-person enterprise roster across all 5 tiers and all 4 departments.

---

## 7. Gap Analysis & Concrete Recommendations for Dev Team

### 7.1 Current Code State vs. Target Requirements

| Area | Current Code State | Target Architecture Required | Action Needed |
| :--- | :--- | :--- | :--- |
| **Routing / Portal Shell** | Binary check in `App.jsx`: `currentUser.role === 'admin' ? <HRDashboard/> : <ESSDashboard/>` | Adaptive unified portal shell dynamically loading navigation & hubs by `tier` (1 to 5), `department`, and `directReports.length > 0`. | Refactor `App.jsx` and introduce adaptive navigation bar, Team Lead Hub, Department Hubs, and Executive Cockpit. |
| **SQL Schema** | `supabase_schema.sql` only defines `users`, `attendance`, `leaves`, `claims`, `tickets`, `announcements`. Missing `departments`, `assets`, `sprints`, and Tier/Manager columns. | Complete 9-table schema with Tier, `manager_id`, `approver_id`, `lead_approver_id`, `finance_approver_id`, and `departments`/`assets`/`sprints` tables. | Update `supabase_schema.sql` to v2.0 schema as detailed in Section 5.1. |
| **Leave Approval Logic** | `db.updateLeaveStatus` updates status and balance, but UI in `HRDashboard` assumes single-tier admin review. | Team Lead (Tier 3) Hub must filter leave requests by direct reports (`managerId === lead.id`), and approving must deduct balance and trigger visual toast. | Ensure Team Lead hub has direct report filter and approval buttons wire up to `updateLeaveStatus`. |
| **Expense Claim Logic** | `updateClaimStatus` has single status change. UI doesn't clearly support the 2-stage workflow (`Pending Lead` -> `Pending Finance` -> `Approved`). | Stage 1 (Lead verifies work necessity) -> `Pending Finance`; Stage 2 (Finance Lead authorizes payout) -> `Approved`. | Add dedicated 2-stage state transition methods in `db.js` (`approveClaimLead`, `approveClaimFinance`, `rejectClaim`) and wire to Team Lead & Finance Hubs. |
| **Interactive Org Tree** | Static mockup in HRDashboard or ESS. `db.getOrgTree()` exists in `db.js` but needs full visual drill-down rendering in HR Hub & Executive Cockpit. | Interactive recursive visual tree component with avatar initials, department pill, tier level, direct report counter, and drill-down modal. | Connect `db.getOrgTree()` to an interactive tree visualization component. |
| **Engineering Hub** | Missing Cloud sandbox requisition form, GitHub seat allocator, and On-Call schedule widget. | Complete Engineering & Tech Hub inside Tier 4 / VP Eng and Tier 2 Contributor workspaces. | Implement Engineering Hub sub-modules in department toolkit. |
| **Finance Hub & Payroll** | Basic payslip view in ESS and static payroll list in HR. | Dynamic Payroll Execution Engine calculating statutory PAYE, 8% Pension, HMO deductions, and Net pay batch disbursement. | Implement interactive Payroll batch runner in Finance Hub. |

---

## 8. Summary of Findings

1. **Hierarchy & RBAC**: The 5-tier architecture requires strict scoping formulas: Staff (Tier 1) self-only; Contributor (Tier 2) self + assigned projects; Team Lead (Tier 3) direct reports only (`managerId === lead.id`); Department Director (Tier 4) full departmental tools + budget; Executive CEO (Tier 5) organization-wide drill-down and global cockpit.
2. **Workflows**: Multi-stage state machines are fully mapped: Leave approval automatically decrements balances and syncs to company calendar; Expense claims enforce Level-1 Lead -> Level-2 Finance authorization.
3. **Data Schema & Real-Time Sync**: A unified 9-table PostgreSQL schema with real-time replication and resilient dual-write offline caching guarantees seamless multi-device persistence and sub-millisecond local UI interactions.
