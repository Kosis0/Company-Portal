# Original User Request

## 2026-08-31T14:30:24Z

Build an enterprise-grade, multi-tiered workforce and organization operating system (ERP) mirroring the organizational architecture of top-tier enterprises (e.g., Workday, Rippling, SAP). The platform integrates a unified adaptive portal with a 5-tier chain of command, department-specific functional toolkits, interactive organization tree hierarchy, real-time multi-device sync, and Supabase PostgreSQL persistence.

Working directory: c:\Users\kosiu\Desktop\Work\ERP
Integrity mode: development

## Requirements

### R1. 5-Tier Organizational Hierarchy & Role-Based Access Control (RBAC)
Implement a robust 5-tier authority structure where every user has an assigned tier, department, and reporting manager (managerId):
- Tier 1 (Staff / Associate / Intern): Self-service workspace (Clock-in attendance, personal leave balance, itemized payslip breakdown, expense claims, HMO health card, support tickets).
- Tier 2 (Mid / Senior Contributor): Expanded personal workspace + project/ticket assignments.
- Tier 3 (Line Manager / Team Lead): Dedicated Team Lead Hub showing direct reports only, real-time team attendance/shift presence, Level-1 leave & expense approvals for their team, and quarterly OKR reviews.
- Tier 4 (Head of Department / Director / Functional Admin): Department management hubs (Engineering Hub, Finance/Payroll Hub, HR Talent Hub, IT Asset Registry) with budget tracking and cross-team requisitions.
- Tier 5 (Executive / C-Suite • CEO/COO): Executive Command Cockpit displaying company burn rate, monthly payroll outlay, headcount growth, departmental health, and company-wide broadcasts.

### R2. Department-Specific Functional Toolkits
Provide dedicated operational modules tailored to each corporate department:
- Engineering & Tech Hub: Developer cloud sandbox requisitions (AWS/GCP), API keys & GitHub seat allocations, sprint tracking, and on-call rotation schedules.
- Finance & Accounting Hub: Monthly payroll execution engine (gross pay, statutory PAYE tax, 8% pension, HMO withholdings), expense reimbursement payout authorizations, and departmental budget utilization.
- HR & People Operations Hub: Interactive Organization Chart (hierarchical visual tree drill-down from CEO to staff), talent onboarding/offboarding pipeline, and company-wide leave calendar.
- IT & Facilities Operations Hub: Company hardware inventory (laptops, monitors, security keys tracked by serial number and assignee status) and support ticket SLA resolution queue.

### R3. Multi-Stage Chain of Command Workflow
Implement multi-level approval routing for workforce requests:
- Leaves: Staff submits -> Direct Team Lead reviews & approves -> HR balance automatically updates and logs on the company calendar.
- Expense Claims: Staff submits receipt -> Direct Manager verifies work necessity -> Finance Lead authorizes payout in payroll batch.

### R4. Adaptive Unified Portal Shell & Front-End Design System
A single unified application shell that dynamically renders sidebar navigation, mobile bottom bars, and active modules based on the authenticated user's tier, department, and direct reports:
- Preserve the high-contrast Nordic Minimalist / Monolith design system with dark/light theme persistence.
- Complete mobile-first ergonomics with thumb-friendly bottom navigation, stacked mobile data cards, and native bottom sheet modals.

### R5. Backend Persistence & Multi-Device Real-Time Sync (Supabase PostgreSQL)
- Complete database integration with Supabase PostgreSQL tables (users, departments, assets, attendance, leaves, claims, tickets, announcements, sprints).
- Real-time WebSocket synchronization across devices (changes made on a mobile phone immediately reflect on a desktop/laptop without manual refresh).
- Resilient local offline caching to ensure zero latency and smooth fallback.

## Acceptance Criteria

### Hierarchy & Access Control
- [ ] Logged-in Tier 1 staff cannot access manager approval queues, department budgets, or executive cockpits.
- [ ] Team Leads can only view and approve leave/claim requests originating from their direct reports (managerId == lead.id).
- [ ] Department Directors have full visibility into their specific department toolkit and budget.
- [ ] C-Suite (CEO) has organization-wide drill-down visibility into all departments, headcount metrics, and the interactive Org Tree.

### Workflow & Approvals
- [ ] Approving a leave request dynamically deducts the exact number of days from the employee's annualLeaveBalance in the live database.
- [ ] Submitting an expense claim moves through the 2-stage status lifecycle (Pending Lead -> Pending Finance -> Approved).
- [ ] Shift clock in/out calculates elapsed duration in real-time and persists timestamped logs.

### Technical Quality & Build Guardrails
- [ ] npm run lint passes with 0 errors and 0 warnings.
- [ ] npm run build generates clean production bundles with zero compilation failures.
- [ ] Real-time updates push seamlessly across multiple open sessions.
