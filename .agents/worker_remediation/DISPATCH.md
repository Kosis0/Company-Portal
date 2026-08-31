## 2026-08-31T15:34:31Z

You are worker_remediation tasked with hardening the ERP database relational logic and achieving 100% test pass rate and 0 lint errors.
Your working directory is: c:\Users\kosiu\Desktop\Work\ERP\.agents\worker_remediation
Project root: c:\Users\kosiu\Desktop\Work\ERP
Read the user request at: c:\Users\kosiu\Desktop\Work\ERP\.agents\ORIGINAL_REQUEST.md
Read the project architecture at: c:\Users\kosiu\Desktop\Work\ERP\PROJECT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Harden `src/services/db.js`:
   - **Leave Approval Dynamic Deductions & Idempotency**:
     - In `approveLeave`: If `leave.status === 'Approved'`, do not re-deduct balance (idempotency guard).
     - Guard against zero-balance falsy fallback: Use `typeof user.annualLeaveBalance === 'number' ? user.annualLeaveBalance : 20` (same for sick and casual balances).
     - Sanitize leave days: `const deductionDays = typeof leave.days === 'number' ? Math.max(0, leave.days) : 1`. Ensure 0-day leave deducts 0 days, and negative days do not increment balance.
     - In `rejectLeave`: If `leave.status === 'Rejected'`, no-op; ensure rejection does not touch balances.
   - **Expense Claim 2-Stage Lifecycle Guard**:
     - In `approveClaimFinance`: Verify that `claim.status === 'Pending Finance'` before approving (or handle gracefully if not yet verified by lead).
     - In `approveClaimLead`: Verify that `claim.status === 'Pending Lead'` before transitioning to `'Pending Finance'`.
   - **Org Tree Cycle Protection**:
     - In `getOrgTree`: Add a `visited = new Set()` and recursion depth guard (maxDepth = 20) in `buildNode` to prevent `RangeError: Maximum call stack size exceeded` on circular `managerId` references.
   - **Department Lookups & Budgets**:
     - In `getDepartment`: Support case-insensitive lookup by code or id (e.g. `d.code.toLowerCase() === deptIdOrCode.toLowerCase()`).
     - In `getDepartmentBudget`: Ensure department user matching matches the department accurately without substring false positives.
2. Clean up any lint warnings/errors in `tests/` or `src/` so `npm run lint` passes with 0 errors and 0 warnings.
3. Run:
   - `npm run lint` (verify 0 errors, 0 warnings)
   - `npm run build` (verify clean production build)
   - All tests in `tests/` (`node tests/m1_database_relational.test.js`, `node tests/m1_empirical_challenger.test.js`, `node --test tests/tier1_features/*.test.js tests/tier2_boundaries/*.test.js`)
4. Verify all tests pass 100%.
5. Write your handoff report to `c:\Users\kosiu\Desktop\Work\ERP\.agents\worker_remediation/handoff.md` and send a completion message back to parent.
