# Dispatch for Milestone 1 Iteration 2 Worker

You are assigned as Worker for Milestone 1 (Iteration 2 Remediation).
Working directory: c:\Users\kosiu\Desktop\Work\ERP\.agents\worker_m1_iter2
Workspace root: c:\Users\kosiu\Desktop\Work\ERP
User request: c:\Users\kosiu\Desktop\Work\ERP\.agents\ORIGINAL_REQUEST.md
Project specification: c:\Users\kosiu\Desktop\Work\ERP\PROJECT.md
Parent orchestrator conversation ID: cad5ff4a-491d-42d4-8fe6-f19c64a2cc90

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Remediation Tasks in `src/services/db.js` and `tests/`:
1. **Fix `getDepartmentBudget(deptId)`**:
   - Accurately match department users: support exact match, normalized names (e.g. `Human Resources` & `Human Resources & Talent`, `Engineering`, `Finance & Operations`, etc.), and match `dept.id` / `dept.code` strictly without false positive substring collisions like `'Chrome Development'`.
2. **Harden `approveLeave(leaveId, approverId, approverName)`**:
   - Add idempotency guard: if `leave.status === 'Approved'`, return the leave immediately without deducting balance again.
   - Fix 0-day deduction bug: use `typeof leave.days === 'number' ? Math.max(0, leave.days) : 1` (do not deduct on 0 days).
   - Sanitize negative days: enforce `Math.max(0, ...)` so negative days cannot increase balance.
3. **Enforce 2-Stage Lifecycle in Claims**:
   - In `approveClaimFinance(claimId, financeId, financeName, payoutBatchId)`: only allow approval if `claim.status === 'Pending Finance'`. If claim is in `Pending Lead` or `Rejected`, reject or return error.
   - In `approveClaimLead(claimId, leadId, leadName)`: only allow approval if `claim.status === 'Pending Lead'`.
4. **Org Tree Cycle Protection in `getOrgTree()`**:
   - Add visited set tracking (`const visited = new Set();`) or max depth check to prevent stack overflow on circular reporting hierarchies.
5. **Clean ESLint in Tests**:
   - Resolve all unused variable and useless assignment errors in `tests/tier1_features/` and any other test files so `npm run lint` passes with 0 errors and 0 warnings.
6. **Verify**:
   - Run `npm test`, `node tests/adversarial_m1_probes.test.js`, `npm run lint`, and `npm run build`.
   - Write report to `report.md` and handoff to `handoff.md`.
   - Send completion message to parent.
