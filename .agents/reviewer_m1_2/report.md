# Milestone 1 (M1) Comprehensive Quality & Adversarial Review Report

**Reviewer**: Reviewer 2 (Reviewer & Adversarial Critic)  
**Date**: 2026-08-31  
**Target Milestone**: M1 — Database Schema, Relational Model & Sync Engine  
**Verdict**: **REQUEST_CHANGES**

---

## 1. Executive Review Summary

| Dimension | Assessment | Notes |
|---|---|---|
| **Integrity Check** | **PASS (Clean)** | Zero hardcoded test shortcuts, no dummy/facade implementations, genuine logic throughout. |
| **Database Schema (`supabase_schema.sql`)** | **PASS** | Complete 9-table DDL, correct foreign keys (`ON DELETE SET NULL`/`CASCADE`), indexes, and realtime publications. |
| **Auth Service (`src/services/auth.js`)** | **PASS** | 5-tier role mapping, token generation, 7-day session persistence, auto-refresh against DB. |
| **Realtime Sync (`src/services/supabase.js`)** | **PASS** | Dual-write pattern, safe fallback to local storage cache, WebSocket subscription setup. |
| **Automated Tests (`npm test`)** | **PASS** | All 16 M1 verification tests pass cleanly. |
| **Build Status (`npm run build`)** | **PASS** | Vite v8.2.0 production build completes in 6.10s with zero compilation errors. |
| **Lint Status (`npm run lint`)** | **FAIL** | 6 ESLint errors (`no-unused-vars`, `no-useless-assignment`) in test files cause `npm run lint` to exit with code 1. |
| **Adversarial & Edge Cases** | **ISSUES FOUND** | Identified 5 major/medium vulnerabilities in state machine transitions, budget filtering, and tree recursion. |

---

## 2. Integrity Verification

As an adversarial critic, the implementation was rigorously checked against integrity violation criteria:
1. **Hardcoded Test Results**: ❌ None found. All statutory payroll deductions, leave balance deductions, and tree recursion functions perform active dynamic calculations.
2. **Dummy / Facade Implementations**: ❌ None found. All 9 Supabase PostgreSQL tables and local caching operations maintain full CRUD lifecycle and relations.
3. **Task Bypasses**: ❌ None found. The relational model and sync engine are implemented from scratch.
4. **Fabricated Logs / Attestation**: ❌ None found. Verification was independently performed via direct execution.

---

## 3. Build, Lint, and Test Execution Log

### 3.1 `npm test`
```
> erp@0.0.0 test
> node tests/m1_database_relational.test.js

=================================================
🚀 STARTING MILESTONE 1 (M1) VERIFICATION SUITE
=================================================
  ✅ PASS: Supabase Schema v2.0 exists and defines all 9 tables and publications
  ✅ PASS: db.getUsers() returns all 10 seed users spanning Tiers 1 to 5
  ✅ PASS: db.getUserById and db.getUserByEmail return accurate records
  ✅ PASS: db.getDirectReports correctly isolates subtrees by managerId
  ✅ PASS: db.getOrgTree() constructs a complete hierarchical tree
  ✅ PASS: db.approveLeave transitions status to Approved and auto-deducts exact days
  ✅ PASS: db.rejectLeave transitions status to Rejected without balance deduction
  ✅ PASS: Expense claim lifecycle: Pending Lead -> Pending Finance -> Approved
  ✅ PASS: db.rejectClaim records rejection reason and status
  ✅ PASS: db.getDepartmentBudget accurately computes allocation, spend, and utilization
  ✅ PASS: db.getAssets, db.getSprints, db.getTickets, db.getAnnouncements return operational records
  ✅ PASS: db.calculatePayrollItem computes accurate statutory deductions and net pay
  ✅ PASS: db.executeMonthlyPayroll executes company-wide batch and stores record
  ✅ PASS: auth.login authenticates user and persists session
  ✅ PASS: auth.register creates new Tier 1 account and session
  ✅ PASS: db.subscribeToChanges returns unsubscribe function safely
=================================================
🎉 ALL 16/16 TESTS PASSED CLEANLY!
=================================================
```

### 3.2 `npm run build`
```
> erp@0.0.0 build
> vite build

vite v8.2.0 building client environment for production...
transforming...✓ 1854 modules transformed.
rendering chunks...
dist/index.html                   0.81 kB │ gzip:   0.46 kB
dist/assets/index-3wH_aYF9.css   29.75 kB │ gzip:   5.92 kB
dist/assets/index-BoqMrJTF.js   573.61 kB │ gzip: 145.49 kB
✓ built in 6.10s
```

### 3.3 `npm run lint`
```
> erp@0.0.0 lint
> eslint .

C:\Users\kosiu\Desktop\Work\ERP\tests\tier1_features\f06_f10_ess_core.test.js
  7:32  error  'testAssert' is defined but never used  no-unused-vars
  8:10  error  'FIXTURES' is defined but never used    no-unused-vars

C:\Users\kosiu\Desktop\Work\ERP\tests\tier1_features\f22_f27_finance_and_hr.test.js
  7:32  error  'testAssert' is defined but never used  no-unused-vars

C:\Users\kosiu\Desktop\Work\ERP\tests\tier1_features\f32_f37_ui_and_persistence.test.js
   60:35  error  'department' is defined but never used                                  no-unused-vars
   93:9   error  The value assigned to 'activeTab' is not used in subsequent statements  no-useless-assignment
  248:9   error  'eventReceived' is assigned a value but never used                      no-unused-vars

✖ 6 problems (6 errors, 0 warnings)
```

---

## 4. Key Findings & Vulnerabilities

### [Major] Finding 1: Repository Fails `npm run lint` (6 ESLint Errors)
- **Location**: `tests/tier1_features/f06_f10_ess_core.test.js` (lines 7, 8), `tests/tier1_features/f22_f27_finance_and_hr.test.js` (line 7), `tests/tier1_features/f32_f37_ui_and_persistence.test.js` (lines 60, 93, 248).
- **Why**: `eslint .` checks all `.js` files including `tests/`. Unused variables and useless assignments fail the build gate and violate Acceptance Criteria §Technical Quality ("npm run lint passes with 0 errors and 0 warnings").
- **Suggestion**: Remove unused imports/variables (`testAssert`, `FIXTURES`, `department`, `eventReceived`) and remove dead assignment `activeTab` in test files.

---

### [Major] Finding 2: `db.getDepartmentBudget` Fails to Match Human Resources Department (`DEP-HR`)
- **Location**: `src/services/db.js`, lines 904–907:
  ```javascript
  const users = this.getUsers().filter((u) =>
    u.department === dept.name ||
    u.department.toLowerCase().includes(dept.code.toLowerCase())
  );
  ```
- **Why**:
  - `DEP-HR` has `name: "Human Resources & Talent"` and `code: "HR"`.
  - HR seed users (`USR-003` Victoria Sterling, `USR-007` Alex Rivera) have `department: "Human Resources"`.
  - `"Human Resources"` !== `"Human Resources & Talent"`.
  - `"human resources".toLowerCase().includes("hr")` is `false` (substring `"hr"` does not occur continuously in `"human resources"`).
  - Consequently, `db.getDepartmentBudget('DEP-HR')` calculates `spentAmount: 0`, `budgetUtilization: '0%'`, omitting $13,100 of HR payroll spend.
- **Suggestion**: Use robust department mapping (e.g. matching `dept.name.startsWith(u.department)` or checking `u.department.toLowerCase().includes("human resources")` or checking department codes/IDs).

---

### [Major] Finding 3: Non-Idempotent Leave Approval (`approveLeave` Causes Duplicate Deductions)
- **Location**: `src/services/db.js`, lines 1259–1311 (`approveLeave`).
- **Why**: `approveLeave` does not verify whether `leave.status === 'Approved'` before deducting balance. If a manager double-clicks or re-submits approval, the employee's leave balance is deducted twice (e.g., approving a 3-day leave twice deducts 6 days).
- **Suggestion**: Add guard condition: `if (leave.status === 'Approved') return leave;` at the beginning of `approveLeave`.

---

### [Major] Finding 4: Expense Claim 2-Stage Lifecycle Can Be Bypassed Directly to 'Approved'
- **Location**: `src/services/db.js`, lines 1468–1504 (`approveClaimFinance`).
- **Why**: `approveClaimFinance` lacks state precondition validation. A claim currently in `'Pending Lead'` (or even `'Rejected'`) can be directly approved by Finance and assigned a payout batch without Team Lead verification.
- **Suggestion**: Add guard check in `approveClaimFinance`: `if (claims[index].status !== 'Pending Finance') { throw new Error(...) / return null; }` (or allow bypass only with explicit override flag).

---

### [Major] Finding 5: `getOrgTree` Stack Overflow on Cyclical Reporting Lines
- **Location**: `src/services/db.js`, lines 735–742 (`getOrgTree`).
- **Why**: `buildNode` recursively calls child nodes matching `managerId === user.id` without tracking visited node IDs. If bad data creates a reporting cycle (e.g., A reports to B and B reports to A) or self-reference (A reports to A), `getOrgTree` crashes the thread with `RangeError: Maximum call stack size exceeded`.
- **Suggestion**: Maintain a `visited = new Set()` in `buildNode` or limit recursion depth.

---

### [Minor] Finding 6: 0-Day and Negative Leave Deduction Edge Cases
- **Location**: `src/services/db.js`, line 1280 (`daysToDeduct = leave.days || 1;`).
- **Why**: When `leave.days === 0`, `0 || 1` evaluates to 1, causing a 0-day leave to deduct 1 day. If `leave.days` is negative (-10), balance arithmetic `balance - (-10)` increases the employee's balance.
- **Suggestion**: Sanitize `daysToDeduct`: `const daysToDeduct = Math.max(0, Number(leave.days) || 0);`.

---

### [Minor] Finding 7: `rejectLeave` Does Not Refund Balance for Previously Approved Leaves
- **Location**: `src/services/db.js`, lines 1313–1349 (`rejectLeave`).
- **Why**: If an already Approved leave is subsequently Rejected or cancelled, the days remain deducted.
- **Suggestion**: If `leave.status === 'Approved'`, restore deducted days back to the user balance.

---

## 5. Verified Claims Matrix

| Claim | Verification Method | Result |
|---|---|---|
| 9 Tables in `supabase_schema.sql` with foreign keys and realtime | File inspection + regex check in `m1_database_relational.test.js` | **PASS** |
| CEO `manager_id: null` supported by schema | Schema inspection (`REFERENCES public.users(id) ON DELETE SET NULL`) | **PASS** |
| 10 Seed users spanning Tiers 1–5 | `db.getUsers()` inspection | **PASS** |
| User lookup by ID and case-insensitive Email | `db.getUserById`, `db.getUserByEmail` tests | **PASS** |
| Direct reports subtree filtering (`managerId`) | `db.getDirectReports('USR-005')` | **PASS** |
| Payroll statutory deductions (PAYE 11.43%, Pension 8%, HMO $50) | `db.calculatePayrollItem` with fractional precision test | **PASS** |
| Monthly batch payroll execution | `db.executeMonthlyPayroll` | **PASS** |
| Auth login & registration session token | `auth.login`, `auth.register`, `auth.getCurrentSession` | **PASS** |
| Realtime subscription channel with unsubscribe | `db.subscribeToChanges` | **PASS** |
| Zero-balance clamping on leave deduction | `Math.max(0, balance - days)` | **PASS** |
| `npm test` clean pass | `node tests/m1_database_relational.test.js` | **PASS (16/16)** |
| `npm run build` clean bundle | `vite build` | **PASS (0 errors)** |
| `npm run lint` clean pass | `eslint .` | **FAIL (6 errors in tests)** |

---

## 6. Verdict and Next Steps

**Verdict**: **REQUEST_CHANGES**

**Required Actions for Milestone 1 Approval**:
1. Fix the 6 ESLint errors in `tests/tier1_features/*.test.js` so that `npm run lint` passes with 0 errors and 0 warnings.
2. Fix `db.getDepartmentBudget` in `src/services/db.js` so `DEP-HR` accurately matches HR staff and computes non-zero spend and utilization.
3. Add idempotency guard in `db.approveLeave` to prevent duplicate leave balance deduction.
4. Add state machine precondition check in `db.approveClaimFinance` to enforce the 2-stage lifecycle.
5. Add cycle detection / visited set to `db.getOrgTree` to protect against recursion stack overflows.
