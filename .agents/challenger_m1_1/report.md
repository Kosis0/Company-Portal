# Empirical Challenge Report: Milestone 1 (M1)
**Target**: Database Schema, Relational Model & Sync Engine (`src/services/db.js`, `src/services/auth.js`, `supabase_schema.sql`)
**Challenger**: Challenger 1 (Empirical Challenger)
**Verdict**: **REQUEST_CHANGES**

---

## Challenge Summary

**Overall risk assessment**: **HIGH**

Empirical stress testing and adversarial probes revealed 9 confirmed bugs and vulnerabilities across relational querying, approval state machine enforcement, leave deduction balance mathematics, and recursive tree traversal.

| # | Severity | Category | Finding Summary | Empirical Status |
|---|---|---|---|---|
| 1 | **HIGH** | Algorithm / DoS | `getOrgTree()` crashes with `RangeError: Maximum call stack size exceeded` on circular manager relationships | Confirmed |
| 2 | **HIGH** | Workflow Enforcement | Expense claim 2-stage lifecycle bypass: `approveClaimFinance` directly approves `Pending Lead` claims without Stage 1 Lead review | Confirmed |
| 3 | **HIGH** | State Machine / Idempotency | `approveLeave` is non-idempotent: repeat calls deduct days repeatedly on already approved leaves | Confirmed |
| 4 | **HIGH** | Business Logic / Exploit | Negative leave days (`days: -10`) increase employee leave balance (`Math.max(0, balance - days)`) | Confirmed |
| 5 | **HIGH** | Relational Calculation | `getDepartmentBudget("DEP-HR")` matches 0 users ($0 spent, 0% utilization) due to faulty string matching | Confirmed |
| 6 | **MEDIUM** | Boundary Math | 0-day leave deduction (`days: 0`) deducts 1 day due to falsy fallback `days || 1` | Confirmed |
| 7 | **MEDIUM** | State Machine / Balance | `rejectLeave` on an already Approved leave fails to refund deducted days | Confirmed |
| 8 | **MEDIUM** | State Machine / Demotion | `approveClaimLead` demotes already Approved and paid expense claims back to `Pending Finance` | Confirmed |
| 9 | **LOW** | Leave Categorization | Unrecognized leave types (e.g. Maternity, Study) silently fall back to deducting Annual Leave | Confirmed |

---

## Challenges & Detailed Empirical Findings

### [High] Challenge 1: Infinite Recursion & DoS in `db.getOrgTree()`
- **Assumption challenged**: The workforce hierarchy is strictly an acyclic directed tree.
- **Attack scenario**: If a circular manager assignment occurs (e.g., USR-001 `managerId` set to USR-002, and USR-002 `managerId` set to USR-001, or circular delegation during onboarding), `getOrgTree()` executes `buildNode(user)` indefinitely.
- **Empirical result**: `RangeError: Maximum call stack size exceeded` is thrown, crashing the application thread.
- **Blast radius**: Complete portal crash on any page attempting to render or fetch the organization tree (Executive Cockpit, HR Hub, Org Tree component).
- **Mitigation**: Maintain a `visited = new Set()` in `buildNode` and check `if (visited.has(user.id)) return null;` or enforce a `maxDepth` limit (e.g., 20).

### [High] Challenge 2: Expense Claim 2-Stage Lifecycle Bypass
- **Assumption challenged**: Expense claims must pass Stage 1 Team Lead verification before Stage 2 Finance payout authorization can occur.
- **Attack scenario**: Directly invoking `db.approveClaimFinance(claimId, financeId, financeName)` on a claim whose status is `Pending Lead` (or `Rejected`).
- **Empirical result**: The claim immediately transitions to `Approved`, `leadApproverId` remains `undefined`, and a new `payoutBatchId` is generated.
- **Blast radius**: Unauthorized release of corporate funds without line-manager approval.
- **Mitigation**: Add state assertion in `approveClaimFinance`:
  ```javascript
  if (claims[index].status !== "Pending Finance") {
    throw new Error(`Cannot authorize payout for claim in status: ${claims[index].status}`);
  }
  ```

### [High] Challenge 3: Non-Idempotent `db.approveLeave` Duplicate Deductions
- **Assumption challenged**: Approving a leave request is an idempotent state transition.
- **Attack scenario**: A manager double-clicks the "Approve" button, a network retry occurs, or `approveLeave` is called twice.
- **Empirical result**: For a 3-day leave on a balance of 14:
  - 1st approval: Balance = 11
  - 2nd approval: Balance = 8 (Total 6 days deducted for 3 days requested)
- **Blast radius**: Employees lose legitimate leave entitlements due to duplicate approval triggers.
- **Mitigation**: Check if `leave.status === "Approved"` before executing balance deduction:
  ```javascript
  if (leaves[index].status === "Approved") return leaves[index];
  ```

### [High] Challenge 4: Negative Leave Days Balance Manipulation Exploit
- **Assumption challenged**: Leave request day counts are positive integers.
- **Attack scenario**: An employee submits a leave request with `days: -10`.
- **Empirical result**: `balance = Math.max(0, 14 - (-10)) = 24`. The employee's annual leave balance is increased by 10 days.
- **Blast radius**: Unauthorized leave entitlement inflation.
- **Mitigation**: Validate in `createLeave` and `approveLeave` that `days > 0` and is a finite number.

### [High] Challenge 5: `db.getDepartmentBudget` 0% Spend Matching Failure for HR
- **Assumption challenged**: `u.department === dept.name || u.department.toLowerCase().includes(dept.code.toLowerCase())` correctly matches users to their department.
- **Attack scenario**: Call `db.getDepartmentBudget("DEP-HR")`.
- **Empirical result**:
  - `dept.name` is `'Human Resources & Talent'`, `dept.code` is `'HR'`.
  - HR employees have `department: 'Human Resources'`.
  - `'Human Resources' === 'Human Resources & Talent'` is `false`.
  - `'human resources'.includes('hr')` is `false` (no contiguous `'hr'` substring).
  - Output: 0 users matched, $0 spent, 0% utilization.
  - Furthermore, any department containing `'hr'` (e.g. `'Chrome Development'`) matches `DEP-HR` by accident.
- **Blast radius**: Financial and headcount metrics in HR department dashboards and Executive Cockpit show incorrect zero/corrupted data.
- **Mitigation**: Match by normalized department name prefix or department ID:
  ```javascript
  const deptNorm = dept.name.toLowerCase().split("&")[0].trim();
  const users = this.getUsers().filter((u) =>
    u.department.toLowerCase().startsWith(deptNorm) ||
    u.department.toLowerCase().includes("human resources")
  );
  ```

### [Medium] Challenge 6: 0-Day Leave Request Deducts 1 Day
- **Assumption challenged**: Deducting 0 days leaves balance unchanged.
- **Attack scenario**: Call `db.createLeave({ days: 0 })` followed by `db.approveLeave()`.
- **Empirical result**: `const daysToDeduct = leave.days || 1;` evaluates `0 || 1` to `1`, deducting 1 day (14 -> 13).
- **Mitigation**: Use `const daysToDeduct = typeof leave.days === "number" ? Math.max(0, leave.days) : 1;`.

### [Medium] Challenge 7: `rejectLeave` Missing Balance Refund on Approved Leaves
- **Assumption challenged**: Rejecting/cancelling an approved leave restores balance integrity.
- **Attack scenario**: Approve a 4-day leave (balance 14 -> 10), then call `rejectLeave()`.
- **Empirical result**: Leave status changes to `Rejected`, but user balance remains 10 (4 days lost).
- **Mitigation**: In `rejectLeave`, if previous status was `Approved`, refund the deducted days back to the user balance.

### [Medium] Challenge 8: Paid Expense Claims Demoted Back to Pending Finance
- **Assumption challenged**: Claims in terminal `Approved` status cannot be altered by Level 1 actions.
- **Attack scenario**: Team Lead calls `db.approveClaimLead(claimId)` on an already Approved and batched claim.
- **Empirical result**: Status is changed back to `Pending Finance`, bypassing the payout authorization.
- **Mitigation**: In `approveClaimLead`, disallow modifying claims that are already `Approved` or `Rejected`.

---

## Stress Test Harness Results

Test Execution: `node tests/adversarial_m1_probes.test.js` and `node tests/check_all_budgets.js`

| Probe | Scenario | Expected | Actual | Verdict |
|---|---|---|---|---|
| Probe 1.1 | 0-day leave deduction | Balance unchanged (14 -> 14) | Balance deducted by 1 (14 -> 13) | **FAIL** |
| Probe 1.2 | Negative day leave (-10 days) | Rejected / No increase | Balance increased (14 -> 24) | **FAIL** |
| Probe 1.3 | String NaN leave days | Error / Safe fallback | Balance became `null` / `0` | **FAIL** |
| Probe 1.4 | Leave exceeding balance (50 days) | Balance clamped to 0 | Clamped to 0 (14 -> 0) | **PASS** |
| Probe 1.5 | Maternity leave deduction | Deduct separate or fail | Deducted Annual Leave (14 -> 9) | **WARN** |
| Probe 2.1 | Double approval of leave | Balance deducted once (14 -> 11) | Balance deducted twice (14 -> 8) | **FAIL** |
| Probe 2.2 | Rejecting approved leave | Balance refunded (10 -> 14) | Balance not refunded (remains 10) | **FAIL** |
| Probe 2.3 | Bypass Stage 1 for Expense Claim | Error thrown, claim rejected | Claim approved with payout batch | **FAIL** |
| Probe 2.4 | Demoting Approved claim | Disallowed | Reverted to `Pending Finance` | **FAIL** |
| Probe 3.1 | 10 Concurrent `createLeave` | 10 leaves saved in store | 10 leaves saved in store | **PASS** |
| Probe 3.2 | Concurrent `approveLeave` | Accurate total deduction | Accurate total deduction | **PASS** |
| Probe 4.1 | Circular manager reporting cycle | Graceful cycle termination | Stack overflow crash (`RangeError`) | **FAIL** |
| Probe 4.2 | Self-referencing user (`id === managerId`) | Handled safely | Stack overflow crash (`RangeError`) | **FAIL** |
| Probe 4.3 | Deep tree (100 levels) | Resolves depth 100 | Resolves depth 100 | **PASS** |
| Probe 4.4 | Orphaned user (`managerId: 'USR-999'`) | Handled | Subtree omitted from CEO tree | **WARN** |
| Probe 5.1 | Zero salary payroll item | Handled without NaN | Calculated ($0 net, $50 HMO) | **PASS** |
| Probe 5.2 | Fractional salary payroll item | Exact penny rounding | Exact penny rounding | **PASS** |
| Dept Check | `db.getDepartmentBudget("DEP-HR")` | Matches HR employees | Matches 0 employees ($0 spent) | **FAIL** |

---

## Unchallenged Areas

- Live Supabase PostgreSQL WebSocket connection (`monolith-enterprise-sync` channel under real remote network latency and disconnect/reconnect cycles) — evaluated offline localStorage fallback; remote cloud Supabase instance was not connected in local node test environment.
