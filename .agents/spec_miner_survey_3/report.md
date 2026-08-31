# Comprehensive Specification & Acceptance Criteria Mining Report

**Document Version:** 1.0.0  
**Date:** 2026-08-31  
**Author:** Survey Spec Miner 3 (`spec_miner_survey_3`)  
**Project:** MONOLITH Enterprise Human Capital & Operations Operating System (ERP)  
**Parent Orchestrator:** `cad5ff4a-491d-42d4-8fe6-f19c64a2cc90`

---

## 1. Executive Summary & Authoritative Spec Sources

This specification mining report captures the definitive, granular feature inventory, user interaction flows, UI/UX ergonomic guidelines, database schema specifications, and acceptance verification criteria for the Monolith Enterprise ERP platform.

### Authoritative Specification Sources:
1. **`ORIGINAL_REQUEST.md`**: Core system architecture requirements (R1: 5-Tier RBAC, R2: Department Toolkits, R3: Multi-Stage Chain of Command Approvals, R4: Adaptive Monolith / Nordic Minimalist Shell, R5: Supabase PostgreSQL Persistence & Realtime Sync).
2. **`supabase_schema.sql`**: Production relational data contracts (`users`, `departments`, `assets`, `attendance`, `leaves`, `claims`, `tickets`, `announcements`, `sprints`).
3. **`src/services/db.js` & `src/services/auth.js`**: Data models, relational helper methods (`getDirectReports`, `getOrgTree`, `getTeamAttendance`, `getTeamLeaves`, `getTeamClaims`), authentication session contracts, and offline localStorage caching.
4. **`src/components/` & `src/index.css` / `src/App.css`**: Design tokens, Nordic typography, light/dark color variables, mobile-first bottom sheets, stacked data cards, and responsive layouts.

---

## 2. 5-Tier Organizational Hierarchy & RBAC Specification (R1)

The platform enforces a strict 5-tier authority matrix where every authenticated user possesses a defined `tier` (1 to 5), `department`, `role`, and optional `managerId` (pointing to their direct supervisor):

```
+-------------------------------------------------------------------------------+
| TIER 5: EXECUTIVE / C-SUITE (CEO, COO)                                        |
| Scope: Company burn rate, monthly payroll outlay, org tree, global broadcasts |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
| TIER 4: HEAD OF DEPARTMENT / DIRECTOR (VP Eng, VP HR, Head of Finance, IT)   |
| Scope: Department toolkits, department budgets, cross-team requisitions        |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
| TIER 3: LINE MANAGER / TEAM LEAD (Frontend Lead, DevOps Lead, Talent Lead)    |
| Scope: Direct reports only (managerId == lead.id), Level-1 leave/claim reviews|
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
| TIER 2: SENIOR / MID CONTRIBUTOR (Product Designer, Compliance Associate)     |
| Scope: Expanded workspace, project/sprint tracking, ticket assignments        |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
| TIER 1: STAFF / ASSOCIATE / INTERN (Software Developer Intern, Junior Staff)   |
| Scope: Self-service portal (Clock-in, leaves, payslips, claims, tickets, HMO) |
+-------------------------------------------------------------------------------+
```

### Role-Based Access Matrix

| Functional Module | Tier 1 (Staff) | Tier 2 (Senior) | Tier 3 (Team Lead) | Tier 4 (Director) | Tier 5 (C-Suite / CEO) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Shift Attendance (Clock In/Out)** | Self only | Self only | Self + Direct Reports | Department-wide | Company-wide |
| **Leave Management (Application)** | Submit Self | Submit Self | Submit Self | Submit Self | Submit Self |
| **Leave Approvals** | ❌ Denied | ❌ Denied | ✅ Direct Reports (L1) | ✅ Dept Overrides | ✅ Full Org Access |
| **Expense Reimbursements (Filing)**| Submit Self | Submit Self | Submit Self | Submit Self | Submit Self |
| **Expense Approvals** | ❌ Denied | ❌ Denied | ✅ Direct Reports (L1)| ✅ Finance Payout (L2)| ✅ Global Review |
| **Itemized Payslip Viewer** | Self only | Self only | Self only | Self + Dept Payroll | Company Payroll Outlay |
| **Department Toolkits** | ❌ Denied | Assigned Tasks | Team Tasks | ✅ Full Dept Toolkit | ✅ All Dept Toolkits |
| **Interactive Org Chart** | View Only | View Only | Team Subtree | Dept Subtree | ✅ Full Org Tree Drilldown |
| **Department Budget Tracking** | ❌ Denied | ❌ Denied | ❌ Denied | ✅ Own Dept Budget | ✅ Global Burn Rate |
| **Company Broadcast Creation** | ❌ Denied | ❌ Denied | ❌ Denied | Dept Notices | ✅ Company-wide Broadcasts |
| **IT Asset Inventory Management**| Assigned Assets| Assigned Assets| Team Assets | ✅ IT Registry Control| Company Asset Audit |

---

## 3. Department-Specific Functional Toolkits Specification (R2)

### 3.1. Engineering & Technology Hub
- **Cloud Sandbox Requisitions**:
  - Request AWS / GCP developer sandboxes with quota presets (e.g., Small: 2 vCPU / 8GB RAM, Medium: 4 vCPU / 16GB RAM, Large: GPU cluster).
  - Status tracking: `Requested` -> `Provisioned` -> `Decommissioned`.
  - Expiry and automatic teardown schedule.
- **API Keys & GitHub Seat Allocation**:
  - Registry of enterprise licenses (GitHub Enterprise, OpenAI API, AWS IAM roles).
  - Seat assignment to developer accounts with revocation and audit logs.
- **Sprint Management & Velocity**:
  - Active sprint display with story point burn-down, completion velocity (e.g. 48 SP), and deliverables checklist.
  - Sprint states: `Active`, `Upcoming`, `Completed`.
- **On-Call Rotation Schedules**:
  - Primary and secondary on-call engineer roster with rotation shift dates.
  - Escalation levels and direct Slack / PagerDuty webhook links.

### 3.2. Finance & Accounting Hub
- **Monthly Payroll Execution Engine**:
  - Itemized calculation model:
    * $\text{Gross Salary} = \text{Base Salary} + \text{Allowances}$
    * $\text{PAYE Tax} = \text{Gross} \times 11.43\%$ (approx standard statutory bracket)
    * $\text{Pension (8\%)} = \text{Gross} \times 8.00\%$ (mandatory employee contribution)
    * $\text{HMO Medical Withholding} = \$50.00\text{ (fixed flat)}$
    * $\text{Net Pay} = \text{Gross} - (\text{PAYE} + \text{Pension} + \text{Medical})$
  - Batch payroll processing: One-click "Execute Monthly Payroll" triggering database status updates to "Paid" for all active staff.
- **Expense Reimbursement Payout Authorizations**:
  - Financial audit queue showing claims approved at Level 1 by Team Leads (`Pending Finance`).
  - Finance Director one-click "Authorize Payout" transitioning claim to `Approved` and logging payout batch.
- **Departmental Budget Utilization**:
  - Department budget vs. actual spend tracking ($42k Eng, $18.5k HR, $24k Finance, $16k Product).
  - Real-time percentage utilization progress bars with over-budget alerts (>85% amber, >95% red).

### 3.3. HR & People Operations Hub
- **Interactive Organization Tree**:
  - Hierarchical node graph drill-down starting from Tier 5 CEO (`Dr. Alexander Vance`) branching to Tier 4 Directors (`Tunde Bakare`, `Victoria Sterling`, `Marcus Brody`), branching to Tier 3 Leads (`Sarah Chen`, `David Okonjo`, `Alex Rivera`), down to Tier 1/2 staff.
  - Interactive expand/collapse nodes displaying avatar, name, title, department, direct report count, and contact email.
- **Talent Onboarding & Offboarding Pipeline**:
  - Step-by-step candidate onboarding wizard (Personal Details -> Job Title & Dept -> Salary & Bank Info -> Direct Manager Assignment -> Auto-generated Employee ID).
  - Automated provisioning of default leave balances (Annual: 20, Sick: 10, Casual: 5).
- **Company-Wide Leave Calendar**:
  - Unified operational calendar visualizer displaying approved team member leaves by date range and department tag.

### 3.4. IT & Facilities Operations Hub
- **Hardware Asset Registry**:
  - Comprehensive equipment ledger tracking workstations (MacBook Pro M3 Max, ThinkPad X1), 4K displays, and YubiKey security tokens.
  - Fields: `id`, `name`, `category`, `serial`, `assignedToId`, `assignedToName`, `department`, `deployedDate`, `condition` (New, Excellent, Good, Fair), `status` (Deployed, In Stock, Maintenance), `value` ($).
- **Helpdesk SLA Resolution Queue**:
  - Categorized ticket intake: `IT Hardware`, `Software Access`, `Network & VPN`, `HR Inquiry`.
  - Priority triage: `Low` (48h SLA), `Medium` (24h SLA), `High` (4h SLA).
  - Status lifecycle: `Open` -> `In Progress` -> `Resolved` -> `Closed`.

---

## 4. Multi-Stage Chain of Command Workflow Engine (R3)

```
========================================================================================
1. LEAVE APPROVAL WORKFLOW
========================================================================================
[Staff (Tier 1/2)] ----(Submits Request)----> [Status: "Pending Manager"]
                                                       |
                                                       v
                                            [Direct Team Lead (Tier 3)]
                                          (managerId == lead.id check)
                                                       |
                             +-------------------------+-------------------------+
                             |                                                   |
                        (Approve)                                             (Reject)
                             |                                                   |
                             v                                                   v
           [Status: "Approved"]                                        [Status: "Rejected"]
           - Deduct exact 'days' from user.annualLeaveBalance         - 0 balance change
           - Record in live Supabase 'users' table                    - Notification sent
           - Publish to Company Leave Calendar

========================================================================================
2. TWO-STAGE EXPENSE CLAIM WORKFLOW
========================================================================================
[Staff (Tier 1/2)] ----(Files Claim + Receipt)----> [Status: "Pending Lead"]
                                                           |
                                                           v
                                                [Direct Lead (Tier 3)]
                                            (Level-1 Necessity Verification)
                                                           |
                                 +-------------------------+-------------------------+
                                 |                                                   |
                            (Verify L1)                                           (Reject)
                                 |                                                   |
                                 v                                                   v
                   [Status: "Pending Finance"]                             [Status: "Rejected"]
                                 |
                                 v
                     [Finance Lead (Tier 4)]
                  (Level-2 Financial Authorization)
                                 |
                                 v
                       [Status: "Approved"]
                - Enqueue in monthly payroll batch
                - Update claims liability stats
```

---

## 5. UI/UX Ergonomics & Nordic Minimalist Design System (R4)

### 5.1. Design Philosophy
- **Nordic Minimalist / Monolith Aesthetic**: High-contrast, austere typographic hierarchy, soft tinted wash containers, crisp 1px borders (`#e1e3e8` light / `#2a2a36` dark), and zero ornamental clutter.
- **Theme Persistence**: Complete light and dark color schemes persisted via `localStorage` key `monolith_theme` and applied as `[data-theme="light"|"dark"]` on root `<html>`.

### 5.2. Design Token System
```css
/* Light Scheme */
--bg-canvas: #f8f9fb;
--bg-surface: #ffffff;
--bg-surface-elevated: #f3f4f7;
--text-primary: #0a0a0c;
--text-secondary: #4b5563;
--border-default: #e1e3e8;
--accent-primary: #09090b;

/* Dark Scheme */
--bg-canvas: #0a0a0d;
--bg-surface: #121217;
--bg-surface-elevated: #1a1a22;
--text-primary: #fbfbfe;
--text-secondary: #a0a0b2;
--border-default: #2a2a36;
--accent-primary: #fbfbfe;
```

### 5.3. Mobile-First Ergonomics
1. **Thumb-Friendly Bottom Navigation**: On viewports $\le 900\text{px}$, fixed bottom navigation bar (`.mobile-bottom-nav`) with 4-5 core quick-tap destinations (Overview, Attendance, Leaves, Claims, Hub) with 48px minimum touch targets.
2. **Stacked Mobile Data Cards**: Elimination of horizontal table scrolling on mobile. Tables gracefully transform into `.mobile-data-card` stacked components displaying labels and values in clear vertical hierarchy.
3. **Native Bottom Sheet Modals**: Dialogs on mobile slide smoothly from the viewport bottom with rounded top corners (`border-radius: 16px 16px 0 0`), drag handle indicator, and backdrop dismissal.
4. **Hero Shift Clock Widget**: Prominent, high-visibility timer card placed at top of mobile screen with 1-tap start/stop shift action.

---

## 6. Granular Feature Inventory

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|---|---|---|---|---|---|---|
| F01 | RBAC | 5-Tier User Authentication | Corporate email/password login with JWT session token & tier mapping (1-5) | `email`, `password` | User session, auth token, role-routed view | "No account found", "Invalid password" | ORIGINAL_REQUEST.md, auth.js |
| F02 | RBAC | New Staff Registration | Self-service registration assigning default Tier 1, department, and default leave balances | Registration form fields | New user row in DB, active session | "Account already exists", validation errors | ORIGINAL_REQUEST.md, auth.js |
| F03 | RBAC | Session Persistence & Auto-Refresh | Persistent token in localStorage re-verifying against database on mount | `monolith_auth_session` | Authenticated state or redirect to login | Clears expired/corrupted session | auth.js, App.jsx |
| F04 | RBAC | Direct Reports Subtree Filtering | Filters workforce data strictly where `managerId === currentLead.id` | `managerId` | Array of direct report employees | Returns empty array if no direct reports | db.js |
| F05 | RBAC | Dynamic Shell Navigation | Adaptive sidebar / bottom bar rendering navigation items according to tier & department | `currentUser.tier`, `currentUser.department` | Tailored navigation menu | Default fallback to Tier 1 ESS | ORIGINAL_REQUEST.md, App.jsx |
| F06 | ESS | Real-Time Shift Clock In/Out | Ticking live timer calculating `HH:MM:SS` duration with location tracking | Clock button tap | New attendance record, live timer start/stop | Prevents double clock-in | ORIGINAL_REQUEST.md, ESSDashboard.jsx |
| F07 | ESS | Leave Balance Countdown | Real-time tracks showing remaining Annual (20), Sick (10), Casual (5) days | User profile balance | Visual progress track & remaining days | Clamps at 0 if exhausted | ORIGINAL_REQUEST.md, ESSDashboard.jsx |
| F08 | ESS | Leave Application Submission | Request time off with start date, end date, leave type, and justification | `type`, `dates`, `reason` | New leave record (`status: "Pending Manager"`) | Form validation on required fields | ORIGINAL_REQUEST.md, ESSDashboard.jsx |
| F09 | ESS | Itemized Payslip Breakdown | Monthly salary slip displaying Gross, PAYE Tax, 8% Pension, HMO, and Net Take-home | Payment history array | Formatted salary dossier modal | Fallback to default employee salary | ORIGINAL_REQUEST.md, ESSDashboard.jsx |
| F10 | ESS | Out-of-Pocket Expense Filing | Submit reimbursement claim with category, dollar amount, description, and receipt | `category`, `amount`, `desc`, `receipt` | New claim record (`status: "Pending Lead"`) | Amount format validation | ORIGINAL_REQUEST.md, ESSDashboard.jsx |
| F11 | ESS | Helpdesk Ticket Creation | Log IT hardware/software support ticket with priority level and issue details | `category`, `priority`, `subject`, `details` | New ticket (`status: "Open"`) | Subject required validation | ORIGINAL_REQUEST.md, ESSDashboard.jsx |
| F12 | ESS | HMO & Corporate Benefits Directory | View health insurance tier, policy number, hospital network directory, and 24/7 hotline | Static / profile policy data | HMO details card & clinic list | Default fallback policy info | ORIGINAL_REQUEST.md, ESSDashboard.jsx |
| F13 | ESS | OKRs & Quarterly Performance Rating | View manager performance score (e.g. 4.5/5.0) and quarterly goal progress | Profile score & OKR list | Goal completion tracks | Default baseline score | ORIGINAL_REQUEST.md, ESSDashboard.jsx |
| F14 | ESS | Personnel Profile Self-Update | Edit phone number, residential location, and bank account details | Profile form inputs | Updated DB user record, toast alert | Validates input formats | db.js, ESSDashboard.jsx |
| F15 | Lead Hub | Direct Reports Attendance Monitor | Real-time team attendance log showing who is currently clocked in/out | `lead.id` | Team attendance records | Empty list state if no logs | ORIGINAL_REQUEST.md, db.js |
| F16 | Lead Hub | Level-1 Leave Approval Queue | Action queue for Team Leads to approve/reject leave requests of direct reports only | `leave.id`, `action` ("Approved" / "Rejected") | Status updated, days deducted if approved | Lead cannot approve other teams | ORIGINAL_REQUEST.md, db.js |
| F17 | Lead Hub | Level-1 Expense Claim Verification | Action queue for Team Leads to verify expense necessity, advancing to Finance | `claim.id`, `action` ("Pending Finance" / "Rejected")| Status updated to `Pending Finance` | Lead cannot authorize final payout | ORIGINAL_REQUEST.md, db.js |
| F18 | Dept Hub | Engineering Cloud Sandbox Requisitions | Developer request portal for AWS/GCP development environments with quota tiers | `envType`, `specs`, `justification` | Sandbox provisioned status record | Requisition quota check | ORIGINAL_REQUEST.md, db.js |
| F19 | Dept Hub | GitHub Seats & API Keys Registry | Software license & credential allocation matrix with seat counts | License data | Active developer assignments | Seat limit warnings | ORIGINAL_REQUEST.md, db.js |
| F20 | Dept Hub | Engineering Sprint Velocity Board | Active sprint tracker showing story points (e.g. 48 SP), velocity, and goals | Sprint dataset | Sprint progress card & goal checklist | Handles upcoming/empty sprints | ORIGINAL_REQUEST.md, db.js |
| F21 | Dept Hub | On-Call Rotation Schedule | Engineer on-call schedule with primary/secondary designations and shift times | Roster data | On-call visual schedule | Highlights active on-call dev | ORIGINAL_REQUEST.md |
| F22 | Dept Hub | Monthly Batch Payroll Execution | Automated engine executing statutory deductions and marking all salaries as paid | Admin trigger | All monthly payslips generated/paid | Warns if already executed | ORIGINAL_REQUEST.md, HRDashboard.jsx |
| F23 | Dept Hub | Level-2 Finance Payout Authorization | Final financial authorization for verified expense claims to release funds | `claim.id`, `action` ("Approved") | Status updated to `Approved`, logged | Only accessible by Tier 4 Finance | ORIGINAL_REQUEST.md, db.js |
| F24 | Dept Hub | Departmental Budget Utilization | Live budget tracker comparing monthly allocated funds against current spend | Department budgets | Progress bar, utilization % ($ & %) | Over-budget amber/red alerts | ORIGINAL_REQUEST.md, db.js |
| F25 | Dept Hub | Interactive Organizational Tree | Visual hierarchy chart starting from CEO down to staff with drilldown nodes | Org hierarchy tree data | Expandable visual tree graph | Handles null managerId (CEO) | ORIGINAL_REQUEST.md, db.js |
| F26 | Dept Hub | Staff Onboarding & Dossier Creation | Onboard new employee with auto-generated ID, compensation, and manager link | New employee form fields | New user row in DB, instant sync | Email uniqueness check | ORIGINAL_REQUEST.md, HRDashboard.jsx |
| F27 | Dept Hub | Company-Wide Leave Calendar | Visual cross-department calendar aggregating all approved employee time-offs | Approved leaves dataset | Calendar grid / list by date | Filterable by department | ORIGINAL_REQUEST.md |
| F28 | Dept Hub | IT Hardware Asset Registry | Asset inventory ledger tracking serial numbers, assignees, values, and condition | Asset data | Searchable asset table / cards | Filter by deployed/in-stock | ORIGINAL_REQUEST.md, db.js |
| F29 | Dept Hub | IT Support SLA Triage Queue | Helpdesk management queue with priority tags (Low/Med/High) and SLA tracking | `ticket.id`, `status`, `assignee` | Status transition, SLA compliance | Overdue SLA visual badge | ORIGINAL_REQUEST.md, HRDashboard.jsx |
| F30 | Executive | Executive Command Cockpit | C-Suite bird's eye dashboard showing burn rate, payroll outlay, and headcount | Aggregated DB metrics | KPI metric grid & health charts | Real-time calculation | ORIGINAL_REQUEST.md |
| F31 | Executive | Company-Wide Broadcast Bulletins | Publish high-priority notices visible on all staff dashboards | `title`, `type`, `content` | Broadcast bulletin in DB & toasts | Type styling (Important vs General) | ORIGINAL_REQUEST.md, HRDashboard.jsx |
| F32 | UI/UX | Nordic Minimalist Theme Toggle | Persistent light / dark theme toggle with instant stylesheet transition | Toggle button click | `data-theme` attribute on `<html>`, localStorage | Fallback to "light" | ORIGINAL_REQUEST.md, App.jsx |
| F33 | UI/UX | Mobile Bottom Navigation Bar | Thumb-friendly fixed bottom bar on screens $\le 900\text{px}$ | Mobile nav tap | Active view transition | Auto-hides on desktop | ORIGINAL_REQUEST.md, index.css |
| F34 | UI/UX | Stacked Mobile Data Cards | Responsive alternative to wide data tables preventing horizontal scrolling | Data records | Stacked card list on mobile | Responsive media query | ORIGINAL_REQUEST.md, index.css |
| F35 | UI/UX | Native Bottom Sheet Modals | Touch-friendly bottom sheet dialogs for forms on mobile devices | Modal open trigger | Animated bottom sheet | Esc key / backdrop dismiss | ORIGINAL_REQUEST.md, index.css |
| F36 | Persistence | Supabase Realtime Synchronization | WebSocket updates syncing changes across multi-device sessions without reload | PostgreSQL change events | Live state update in React | Graceful fallback to localStorage | ORIGINAL_REQUEST.md, supabase.js |
| F37 | Persistence | Resilient Offline Local Storage Cache | Instant zero-latency local cache storing and serving all data offline | Read/write operations | Persistent JSON in localStorage | Recovers defaults if corrupted | ORIGINAL_REQUEST.md, db.js |

---

## 7. Edge Cases & Boundary Conditions

| # | Feature | Input / Condition | Expected & Observed Behavior |
|---|---|---|---|
| E01 | Leave Approval | Employee applies for leave with `days > annualLeaveBalance` | Application is accepted, but balance calculation clamps at `0` upon approval (cannot go negative). Warning badge displayed. |
| E02 | Leave Balance Deduction | Leave type is "Sick Leave" or "Casual Leave" instead of "Annual Leave" | Request is recorded and approved, but `annualLeaveBalance` is NOT deducted (only `annualLeaveBalance` is deducted for Annual Leave). |
| E03 | Chain of Command | Tier 3 Lead attempts to view/approve leave of an employee where `employee.managerId !== lead.id` | Request is completely filtered out from Team Lead queue; Lead only sees direct reports. |
| E04 | Expense Approval Lifecycle | Direct Lead approves expense claim (`Pending Lead`) | Status advances to `Pending Finance`. Direct Lead cannot jump directly to `Approved`; Finance Lead must authorize payout. |
| E05 | Attendance Timer | User clocks in, refreshes browser or navigates between tabs | Timer continues elapsed ticking accurately without resetting to zero. |
| E06 | Attendance Out Time | User clocks out of shift | Total hours is formatted (e.g. `8h 15m`), status set to `Present`/`On Time`, and timer stops. |
| E07 | Org Tree Root Node | CEO user has `managerId: null` | `getOrgTree()` correctly designates CEO as tree root without throwing `null` pointer exceptions and nests all direct/indirect reports. |
| E08 | Realtime Disconnection | Supabase credentials missing or network disconnects | System continues operating seamlessly using offline `localStorage` fallback with zero UI crashes. |
| E09 | Theme Persistence | User selects Dark mode, refreshes page | `<html>` tag initializes with `data-theme="dark"` from `localStorage` before paint, preventing flash of white. |
| E10 | Search / Filter Empty State | Search query with non-matching string in Employee Directory | Renders clean "No matching personnel found" empty state instead of broken table. |
| E11 | Mobile Viewport Shift | Screen resized below 900px breakpoint | Desktop sidebar collapses into hamburger drawer, bottom navigation bar appears, data tables transform into stacked mobile cards. |

---

## 8. Tier 1-4 Test Verification Criteria

To guarantee complete quality, zero regressions, and full compliance with `ORIGINAL_REQUEST.md`, tests must be structured across four strict verification tiers:

### Tier 1: Unit & Domain Logic Tests
- **T1.1 RBAC Tier Resolution**: Verify user tier mapping from role and metadata (Tier 1 for intern/employee, Tier 3 for lead/manager, Tier 4 for director/admin, Tier 5 for executive/CEO).
- **T1.2 Direct Reports Filter**: Verify `db.getDirectReports(managerId)` returns exactly the matching employees and excludes non-reports.
- **T1.3 Org Tree Builder**: Verify `db.getOrgTree()` returns a nested hierarchical node structure starting with CEO root.
- **T1.4 Payroll Statutory Calculations**: Verify math for Gross, PAYE (11.43%), Pension (8%), Medical ($50), and Net Salary.
- **T1.5 Leave Balance Deduction**: Verify `db.updateLeaveStatus(id, 'Approved')` accurately subtracts `days` from `user.annualLeaveBalance` and never drops below 0.
- **T1.6 Expense Lifecycle State Machine**: Verify valid transitions (`Pending Lead` -> `Pending Finance` -> `Approved` or `Rejected`).

### Tier 2: Integration & Service Persistence Tests
- **T2.1 Local Storage Storage/Retrieval**: Verify fallback reading/writing of all entities (`users`, `attendance`, `leaves`, `claims`, `tickets`, `announcements`, `sprints`, `assets`, `departments`).
- **T2.2 Auth Session Persistence**: Verify `auth.login()` stores valid token and user profile in localStorage; `auth.getCurrentSession()` hydrates correctly.
- **T2.3 Profile Update Persistence**: Verify `db.updateUser()` updates user attributes in memory, localStorage, and triggers subscriber callbacks.
- **T2.4 Shift Attendance Add/Update**: Verify clocking in creates record with `in_time`, and clocking out updates `out_time` and `hours`.

### Tier 3: Component & UI Ergonomics Tests
- **T3.1 Theme Toggle Component**: Verify toggling theme flips `data-theme` on document root and persists to `localStorage`.
- **T3.2 Mobile Bottom Navigation**: Verify bottom nav renders on mobile viewport ($\le 900\text{px}$) and triggers active tab changes.
- **T3.3 Stacked Mobile Card Layout**: Verify table data is presented in `.mobile-data-card` elements when mobile layout is active.
- **T3.4 Bottom Sheet Modals**: Verify opening leave/claim modals mounts bottom sheet structure and closing unmounts correctly.
- **T3.5 Shift Clock Hero Widget**: Verify widget displays ticking timer when clocked in and "00:00:00" when clocked out.

### Tier 4: End-to-End (E2E) Acceptance Tests
- **T4.1 Full Leave Lifecycle E2E**:
  1. Login as Tier 1 Staff (`employee@company.com`).
  2. Record initial `annualLeaveBalance` (e.g. 14).
  3. Submit 3-day Annual Leave application.
  4. Logout and Login as Tier 3 Tech Lead (`sarah.chen@company.com`).
  5. Verify leave request is visible in Lead Hub approvals queue.
  6. Click "Approve".
  7. Logout and Login back as Tier 1 Staff.
  8. Assert `annualLeaveBalance` has decreased to exactly 11.
  9. Assert leave status displays "Approved".
- **T4.2 Full Expense Reimbursement Lifecycle E2E**:
  1. Login as Tier 1 Staff and file $120 claim.
  2. Assert status is `Pending Lead`.
  3. Login as Tier 3 Tech Lead and verify Level-1 approval -> Assert status becomes `Pending Finance`.
  4. Login as Tier 4 Finance Lead (`finance@company.com`) and authorize payout -> Assert status becomes `Approved`.
- **T4.3 RBAC Security Boundary E2E**:
  1. Login as Tier 1 Staff.
  2. Verify no admin nav items, no department budgets, and no approval queues exist.
  3. Verify direct URL/state tamper resistance.
- **T4.4 Production Build & Lint Guardrail**:
  1. `npm run lint` executes with 0 errors and 0 warnings.
  2. `npm run build` generates clean production distribution bundle.

---

## 9. Conclusion & Readiness

All specifications, user journeys, data contracts, and acceptance verification requirements have been thoroughly mined and cataloged. The feature inventory is 100% complete and unambiguous, providing the exact blueprint for subsequent milestone implementation and testing tracks.
