# Original User Request

## 2026-08-31T15:22:58Z

Perform a comprehensive quality audit and end-to-end verification of the Monolith Enterprise Organization Operating System (ERP). Verify all 5 authority tiers, department functional toolkits, multi-stage approval workflows, interactive organizational tree, and Supabase cloud persistence.

Working directory: c:\Users\kosiu\Desktop\Work\ERP
Integrity mode: development

## Audit & Verification Scope

### V1. 5-Tier RBAC & Isolation Audit
- Verify access control across all 5 test accounts (ceo@company.com, admin@company.com, vpeng@company.com, sarah.chen@company.com, employee@company.com):
  - Ensure Tier 1 staff cannot access manager approval queues, department budgets, or executive cockpits.
  - Ensure Tier 3 Team Leads can only view and approve leave/claim requests for their immediate direct reports.
  - Ensure Tier 4 Directors have full access to their specific department toolkits (Engineering, Finance, HR, IT).
  - Ensure Tier 5 C-Suite (CEO) has organization-wide drill-down visibility into all operating units and headcount analytics.

### V2. Multi-Stage Workflow & Balance Mathematics
- Verify Leave approval workflow:
  - Submitting leave -> Team Lead approval -> Dynamic balance deduction in live database (annualLeaveBalance).
  - Verify boundary edge cases (0 days, invalid dates, negative values).
- Verify Expense Claim 2-stage approval workflow:
  - Submitting claim -> Lead verification (Pending Lead -> Pending Finance) -> Finance payout authorization (Approved).
- Verify Shift Attendance Clock:
  - Real-time elapsed duration timer, clock-in and clock-out timestamp logging in database.

### V3. Departmental Functional Toolkits & Engines
- Engineering Hub: Sprints progress, cloud sandbox requisitions, and on-call roster.
- Finance Hub: 1-click batch payroll execution engine (gross pay, statutory PAYE tax, 8% pension, HMO withholdings) and department budget burn rate calculations.
- HR & Talent Hub: Workforce distribution, talent onboarding pipeline, and HMO medical care network.
- IT & Asset Registry: Hardware asset inventory with serial number tracking, valuation, and assignee records.

### V4. Interactive Org Chart Drill-Down
- Verify recursive tree rendering starting from CEO down through all leadership tiers to staff.
- Verify department filtering tabs, node expand/collapse, and Personnel Dossier modals.

### V5. Mobile Ergonomics, Theming & Build Health
- Verify dark and light theme toggle with persistent storage.
- Verify mobile-first bottom navigation bar, stacked mobile cards, and touch-friendly dialogs.
- Verify npm run lint passes with 0 errors and 0 warnings.
- Verify npm run build compiles clean production bundles with 0 errors.
