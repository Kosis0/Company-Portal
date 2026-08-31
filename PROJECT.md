# Project: Enterprise-Grade Multi-Tiered ERP System (Monolith ERP)

## Architecture
Monolith ERP is an enterprise workforce and operations platform built with React 19, Vite 8, Pure CSS Nordic Minimalist Design System, and Supabase PostgreSQL with real-time multi-device sync and local offline storage fallback.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              ADAPTIVE UNIFIED PORTAL SHELL                              │
│         Dynamic Sidebar / Mobile Bottom Bar / Persona Switcher / Theme Controller        │
├───────────────────┬───────────────────┬─────────────────────┬───────────────────────────┤
│ Tier 1 & 2 ESS    │ Tier 3 Lead Hub   │ Tier 4 Dept Hubs    │ Tier 5 Executive Cockpit  │
│ Self-Service      │ Direct Reports    │ Eng, Fin, HR, IT    │ Global Org Tree & KPIs    │
└─────────┬─────────┴─────────┬─────────┴──────────┬──────────┴─────────────┬─────────────┘
          │                   │                    │                        │
┌─────────▼───────────────────▼────────────────────▼────────────────────────▼─────────────┐
│                       UNIFIED CLIENT DATA SERVICE (src/services/db.js)                  │
│       - Dual-Write Pattern (Optimistic LocalStorage Cache + Supabase Async Push)         │
│       - Relational Helpers: getDirectReports, getOrgTree, getTeamAttendance, etc.       │
│       - Multi-Device WebSocket Sync: 'monolith-enterprise-sync' channel                  │
└────────────────────────────────────────────┬────────────────────────────────────────────┘
                                             │
┌────────────────────────────────────────────▼────────────────────────────────────────────┐
│                              SUPABASE POSTGRESQL DATABASE                               │
│     users | departments | assets | sprints | attendance | leaves | claims | tickets ...  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Code Layout
- `src/main.jsx`: Application bootstrap and React DOM root rendering
- `src/App.jsx`: Root application coordinator, theme provider, and adaptive routing
- `src/components/Login.jsx`: Split-panel corporate sign-in and registration portal
- `src/components/PortalShell.jsx`: Adaptive layout with responsive sidebar, header, persona switcher, and mobile bottom bar
- `src/components/ESSDashboard.jsx`: Tier 1 & 2 Employee Self-Service workspace
- `src/components/TeamLeadHub.jsx`: Tier 3 Line Manager / Team Lead dedicated portal
- `src/components/DepartmentHubs.jsx`: Tier 4 Department functional toolkits (Engineering, Finance, HR, IT)
- `src/components/ExecutiveCockpit.jsx`: Tier 5 C-Suite Executive Command Cockpit
- `src/components/OrgTree.jsx`: Interactive visual organization hierarchy chart drill-down component
- `src/services/auth.js`: Authentication, session persistence, and role resolution
- `src/services/db.js`: Relational database operations, multi-stage approval logic, and local caching
- `src/services/supabase.js`: Supabase PostgreSQL client and realtime subscription setup
- `src/index.css`: Master design system, typography tokens, light/dark themes, mobile bottom sheets, and responsive card styles
- `supabase_schema.sql`: Full 9-table PostgreSQL DDL with indexes, foreign keys, and realtime publications
- `tests/`: Automated unit, integration, and end-to-end acceptance tests

---

## Feature Inventory

Every feature identified during the Survey phase is mapped below with its assigned milestone:

| # | Feature | Description | Milestone | Source |
|---|---|---|---|---|
| F01 | 5-Tier User Authentication | Corporate email/password login with JWT session token & tier mapping (1-5) | M1 | ORIGINAL_REQUEST §R1 |
| F02 | New Staff Registration | Self-service registration assigning Tier 1, department, and default leave balances | M1 | ORIGINAL_REQUEST §R1 |
| F03 | Session Persistence & Auto-Refresh | Persistent token in localStorage re-verifying against database on mount | M1 | ORIGINAL_REQUEST §R5 |
| F04 | Direct Reports Subtree Filtering | Filters workforce data strictly where `managerId === currentLead.id` | M1 | ORIGINAL_REQUEST §R1 |
| F05 | Dynamic Shell Navigation | Adaptive navigation rendering tabs/menus by user tier, department, and direct reports | M2 | ORIGINAL_REQUEST §R4 |
| F06 | Real-Time Shift Clock In/Out | Live ticking timer calculating `HH:MM:SS` duration with location tracking | M3 | ORIGINAL_REQUEST §R1 |
| F07 | Leave Balance Countdown | Real-time tracks showing remaining Annual (20), Sick (10), Casual (5) days | M3 | ORIGINAL_REQUEST §R1 |
| F08 | Leave Application Submission | Request time off with start date, end date, leave type, and justification | M3 | ORIGINAL_REQUEST §R3 |
| F09 | Itemized Payslip Breakdown | Monthly salary slip displaying Gross, PAYE Tax, 8% Pension, HMO, and Net Take-home | M3 | ORIGINAL_REQUEST §R1 |
| F10 | Out-of-Pocket Expense Filing | Submit reimbursement claim with category, dollar amount, description, and receipt | M3 | ORIGINAL_REQUEST §R3 |
| F11 | Helpdesk Ticket Creation | Log IT hardware/software support ticket with priority level and issue details | M3 | ORIGINAL_REQUEST §R1 |
| F12 | HMO & Corporate Benefits Directory | View health insurance tier, policy number, hospital directory, and 24/7 hotline | M3 | ORIGINAL_REQUEST §R1 |
| F13 | OKRs & Quarterly Performance Rating | View manager performance score (e.g. 4.5/5.0) and quarterly goal progress | M3 | ORIGINAL_REQUEST §R1 |
| F14 | Personnel Profile Self-Update | Edit phone number, residential location, and bank account details | M3 | ORIGINAL_REQUEST §R1 |
| F15 | Direct Reports Attendance Monitor | Real-time team attendance log showing who is currently clocked in/out for Lead | M3 | ORIGINAL_REQUEST §R1 |
| F16 | Level-1 Leave Approval Queue | Action queue for Team Leads to approve/reject leaves with automated balance deduction | M3 | ORIGINAL_REQUEST §R3 |
| F17 | Level-1 Expense Claim Verification | Action queue for Team Leads to verify expense necessity, advancing to Finance | M3 | ORIGINAL_REQUEST §R3 |
| F18 | Engineering Cloud Sandbox Requisitions | Developer request portal for AWS/GCP development environments with quota tiers | M4 | ORIGINAL_REQUEST §R2 |
| F19 | GitHub Seats & API Keys Registry | Software license & credential allocation matrix with seat counts | M4 | ORIGINAL_REQUEST §R2 |
| F20 | Engineering Sprint Velocity Board | Active sprint tracker showing story points (e.g. 48 SP), velocity, and goals | M4 | ORIGINAL_REQUEST §R2 |
| F21 | On-Call Rotation Schedule | Engineer on-call schedule with primary/secondary designations and shift times | M4 | ORIGINAL_REQUEST §R2 |
| F22 | Monthly Batch Payroll Execution | Automated engine executing statutory deductions and marking all salaries as paid | M4 | ORIGINAL_REQUEST §R2 |
| F23 | Level-2 Finance Payout Authorization | Final financial authorization for verified expense claims to release funds | M4 | ORIGINAL_REQUEST §R2 |
| F24 | Departmental Budget Utilization | Live budget tracker comparing monthly allocated funds against current spend | M4 | ORIGINAL_REQUEST §R2 |
| F25 | Interactive Organizational Tree | Visual hierarchy chart starting from CEO down to staff with drilldown nodes | M4 | ORIGINAL_REQUEST §R2 |
| F26 | Staff Onboarding & Dossier Creation | Onboard new employee with auto-generated ID, compensation, and manager link | M4 | ORIGINAL_REQUEST §R2 |
| F27 | Company-Wide Leave Calendar | Visual cross-department calendar aggregating all approved employee time-offs | M4 | ORIGINAL_REQUEST §R2 |
| F28 | IT Hardware Asset Registry | Asset inventory ledger tracking serial numbers, assignees, values, and condition | M4 | ORIGINAL_REQUEST §R2 |
| F29 | IT Support SLA Triage Queue | Helpdesk management queue with priority tags (Low/Med/High) and SLA tracking | M4 | ORIGINAL_REQUEST §R2 |
| F30 | Executive Command Cockpit | C-Suite bird's eye dashboard showing burn rate, payroll outlay, and headcount | M5 | ORIGINAL_REQUEST §R1 |
| F31 | Company-Wide Broadcast Bulletins | Publish high-priority notices visible on all staff dashboards | M5 | ORIGINAL_REQUEST §R1 |
| F32 | Nordic Minimalist Theme Toggle | Persistent light / dark theme toggle with instant stylesheet transition | M2 | ORIGINAL_REQUEST §R4 |
| F33 | Mobile Bottom Navigation Bar | Thumb-friendly fixed bottom bar on screens <= 900px | M2 | ORIGINAL_REQUEST §R4 |
| F34 | Stacked Mobile Data Cards | Responsive alternative to wide data tables preventing horizontal scrolling | M2 | ORIGINAL_REQUEST §R4 |
| F35 | Native Bottom Sheet Modals | Touch-friendly bottom sheet dialogs for forms on mobile devices | M2 | ORIGINAL_REQUEST §R4 |
| F36 | Supabase Realtime Synchronization | WebSocket updates syncing changes across multi-device sessions without reload | M1 | ORIGINAL_REQUEST §R5 |
| F37 | Resilient Offline Local Storage Cache | Instant zero-latency local cache storing and serving all data offline | M1 | ORIGINAL_REQUEST §R5 |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| **M1** | Database Schema, Relational Model & Sync Engine | Complete 9-table schema in `supabase_schema.sql`, full relational methods in `src/services/db.js`, 2-stage claim & leave deduction mutations, Supabase realtime channels, offline cache fallback | none | PLANNED |
| **M2** | Adaptive Unified Portal Shell & Ergonomic UI/UX | Adaptive unified portal shell, dynamic sidebar/bottom navigation based on Tier (1-5) and Department, quick persona switcher for testing all 10 seed users, theme persistence, mobile cards, bottom sheets | M1 | PLANNED |
| **M3** | Workforce Core Hubs (ESS & Team Lead Hub) | Tier 1/2 Employee Self-Service workspace (clock-in, leave balances, itemized payslips, claims, tickets, HMO, OKRs) and Tier 3 Team Lead Hub (direct reports roster, team attendance, L1 leave approval with auto balance deduction, L1 claim verification) | M1, M2 | PLANNED |
| **M4** | Department-Specific Toolkits (Eng, Finance, HR, IT) | Tier 4 Hubs: Engineering Hub (cloud sandboxes, GitHub seats, sprints, on-call), Finance Hub (automated payroll execution engine, L2 expense payout authorization, budget utilization), HR Hub (Interactive Visual Org Tree drill-down, talent onboarding, leave calendar), IT Hub (hardware asset registry, SLA ticket queue) | M1, M2, M3 | PLANNED |
| **M5** | Tier 5 Executive Command Cockpit & Integration | Tier 5 Executive Cockpit (company burn rate, monthly payroll outlay, headcount growth, departmental health, broadcasts, global org tree drill-down), full end-to-end integration, real-time cross-device sync verification | M1, M2, M3, M4 | PLANNED |
| **M6** | E2E Acceptance & Adversarial Hardening (Final Milestone) | Pass 100% of E2E test suite (Tiers 1-4) produced by E2E Testing Track, followed by Tier 5 Adversarial Coverage Hardening | M1..M5, TEST_READY.md | PLANNED |

---

## Interface Contracts

### 1. User & Hierarchy Entity Contract (`db.js` / Supabase `users`)
```typescript
interface User {
  id: string;                    // e.g. 'USR-001'
  email: string;                 // unique corporate email
  password: string;
  name: string;
  title: string;
  department: 'Engineering' | 'Finance & Operations' | 'Human Resources' | 'IT & Facilities' | 'Product & Design' | 'Executive';
  role: 'employee' | 'senior_contributor' | 'manager' | 'director' | 'finance' | 'admin' | 'executive';
  tier: 1 | 2 | 3 | 4 | 5;       // 1: Staff, 2: Senior, 3: Lead, 4: Director, 5: CEO
  managerId: string | null;      // ID of direct manager
  managerName?: string;
  salary: string;
  monthlyBasePay: number;
  annualLeaveBalance: number;
  sickLeaveBalance: number;
  casualLeaveBalance: number;
  avatarInitials: string;
  status: 'Active' | 'On Leave' | 'Terminated';
}
```

### 2. Multi-Stage Leave & Expense Workflow Contracts
```typescript
interface LeaveRequest {
  id: string;                    // e.g. 'LV-201'
  userId: string;
  name: string;
  department: string;
  managerId: string;             // Direct Lead ID
  type: 'Annual Leave' | 'Sick Leave' | 'Casual Leave';
  dates: string;
  days: number;
  reason: string;
  status: 'Pending Manager' | 'Approved' | 'Rejected';
  appliedOn: string;
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

interface ExpenseClaim {
  id: string;                    // e.g. 'CLM-301'
  userId: string;
  name: string;
  department: string;
  managerId: string;             // Direct Lead ID
  category: string;
  amount: string;
  date: string;
  description: string;
  receipt?: string;
  status: 'Pending Lead' | 'Pending Finance' | 'Approved' | 'Rejected';
  leadApproverId?: string;
  leadApproverName?: string;
  leadApprovedAt?: string;
  financeApproverId?: string;
  financeApproverName?: string;
  financeApprovedAt?: string;
  payoutBatchId?: string;
}
```

### 3. Department Functional Entities Contracts
```typescript
interface ITAsset {
  id: string;                    // e.g. 'AST-101'
  name: string;
  category: 'Workstation' | 'Display & Peripheral' | 'Security Token' | 'Networking';
  serial: string;
  assignedToId: string | null;
  assignedToName: string | null;
  department: string;
  deployedDate: string;
  condition: 'New' | 'Excellent' | 'Good' | 'Fair' | 'Retired';
  status: 'Deployed' | 'In Stock' | 'Maintenance';
  value: string;
}

interface EngineeringSprint {
  id: string;                    // e.g. 'SPR-42'
  title: string;
  department: string;
  leadId: string;
  leadName: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  progress: string;
  velocity: string;
  startDate: string;
  endDate: string;
  goals: string[];
}

interface Department {
  id: string;                    // e.g. 'DEP-ENG'
  name: string;
  code: string;
  headId: string;
  headName: string;
  headTitle: string;
  headcount: number;
  monthlyBudget: string;
  budgetUtilization: string;
  leadObjective: string;
}
```

---
