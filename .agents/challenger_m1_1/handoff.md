# Handoff Report: Milestone 1 (M1) Relational Model & Sync Engine Verification

## 1. Observation
Direct empirical observations from test runs (`node tests/adversarial_m1_probes.test.js` and `node tests/check_all_budgets.js`):

1. **`src/services/db.js:735-744` (`getOrgTree`)**:
   - Code:
     ```javascript
     const buildNode = (user) => {
       const reports = users.filter((u) => u.managerId === user.id);
       return {
         ...user,
         directReportsCount: reports.length,
         directReports: reports.map(buildNode),
       };
     };
     ```
   - When a reporting cycle was introduced (USR-001 `managerId` = 'USR-002', USR-002 `managerId` = 'USR-001'), execution threw:
     `RangeError: Maximum call stack size exceeded` at `buildNode` (`src/services/db.js:735`).

2. **`src/services/db.js:1468-1484` (`approveClaimFinance`)**:
   - Code:
     ```javascript
     async approveClaimFinance(claimId, financeId, financeName, payoutBatchId = null) {
       const claims = this.getClaims();
       const index = claims.findIndex((c) => c.id === claimId);
       if (index === -1) return null;
       const nowIso = new Date().toISOString();
       const batchId = payoutBatchId || `BATCH-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(10 + Math.random() * 90)}`;
       claims[index] = {
         ...claims[index],
         status: "Approved",
         ...
       };
     ```
   - Directly executing `approveClaimFinance` on a freshly created claim in status `Pending Lead` transitioned status to `Approved` with batch `BATCH-20260831-91` while `leadApproverId` remained `undefined`.

3. **`src/services/db.js:1259-1293` (`approveLeave`)**:
   - Code:
     ```javascript
     async approveLeave(leaveId, approverId, approverName) {
       const leaves = this.getLeaves();
       const index = leaves.findIndex((l) => l.id === leaveId);
       ...
       if (leave.userId) {
         const user = this.getUserById(leave.userId);
         if (user) {
           const daysToDeduct = leave.days || 1;
           const updates = {};
           if (leave.type === "Sick Leave") { ... }
           else {
             updates.annualLeaveBalance = Math.max(0, (user.annualLeaveBalance || 20) - daysToDeduct);
           }
           await this.updateUser(user.id, updates);
         }
       }
     ```
   - When `approveLeave` was called twice sequentially on a 3-day leave for USR-008 (initial balance 14):
     - After 1st approval: balance = 11
     - After 2nd approval: balance = 8
   - When a leave request with `days: 0` was approved, balance dropped from 14 to 13 due to `leave.days || 1` evaluating to `1`.
   - When a leave request with `days: -10` was approved, balance increased from 14 to 24 due to `Math.max(0, 14 - (-10)) = 24`.

4. **`src/services/db.js:900-928` (`getDepartmentBudget`)**:
   - Code:
     ```javascript
     const users = this.getUsers().filter((u) =>
       u.department === dept.name ||
       u.department.toLowerCase().includes(dept.code.toLowerCase())
     );
     ```
   - When running `getDepartmentBudget("DEP-HR")` on seed data where `dept.name = 'Human Resources & Talent'`, `dept.code = 'HR'`, and users have `department = 'Human Resources'`:
     - Matched Users: `0`
     - Spent Amount: `$0`
     - Budget Utilization: `0%`
   - When a user with department `'Chrome Development'` was added, `getDepartmentBudget("DEP-HR")` matched that user (due to `'c-h-r-o-m-e'.includes('hr')`) and increased HR spend by `$7,000`.

---

## 2. Logic Chain
1. **From Observation 1**: Because `getOrgTree()` does not track visited user IDs during recursion, any cyclic graph in user manager relationships triggers unbounded recursive calls, exhausting the call stack and crashing the runtime.
2. **From Observation 2**: Because `approveClaimFinance()` does not assert that `claims[index].status === 'Pending Finance'`, Stage 1 Team Lead verification is not strictly enforced in the data layer, allowing unauthorized direct fund release authorizations.
3. **From Observation 3**: Because `approveLeave()` lacks an idempotency check (`if (leave.status === 'Approved') return;`) and uses unsafe arithmetic (`leave.days || 1` and unsanitized negative days), balance corruption occurs under duplicate triggers, 0-day requests, and negative-day exploits.
4. **From Observation 4**: Because `getDepartmentBudget()` relies on exact name match or code substring matching without prefix normalization, the HR department matches 0 HR staff ($0 spend) while falsely capturing unrelated departments containing the substring `'hr'`.

---

## 3. Caveats
- Real-time Supabase WebSockets were verified through client subscription stubbing and local storage synchronization; remote Supabase PostgreSQL cloud sync requires live credentials not available in offline test environment.
- Concurrency was evaluated using Node.js asynchronous event loop Promise batches; multi-process or multi-tab browser localStorage lock contention was not simulated.

---

## 4. Conclusion
**Verdict**: **REQUEST_CHANGES**

The M1 implementation in `src/services/db.js` requires bug fixes before M1 can be approved:
1. **Cycle Guard**: Add visited tracking or depth limit to `getOrgTree()`.
2. **State Machine Validation**: Assert valid prior state in `approveClaimFinance()` (`status === 'Pending Finance'`) and `approveClaimLead()` (`status !== 'Approved'`).
3. **Leave Deductions Hardening**:
   - Add idempotency guard to `approveLeave()` (`if (leave.status === 'Approved') return leaves[index];`).
   - Fix 0-day deduction bug (replace `days || 1` with `typeof leave.days === 'number' ? Math.max(0, leave.days) : 1`).
   - Reject or sanitize negative days (`days > 0`).
4. **Department Matching**: Fix `getDepartmentBudget()` matching logic to correctly capture HR staff and avoid false substring collisions.

---

## 5. Verification Method
To independently reproduce all observations and verify fixes:

1. **Run Full Adversarial Suite**:
   ```bash
   node tests/adversarial_m1_probes.test.js
   ```
   *Expected behavior*: Confirms findings 1-8.

2. **Run Department Budget Inspection**:
   ```bash
   node tests/check_all_budgets.js
   ```
   *Expected behavior*: Demonstrates DEP-HR $0 spend and 0 matched users.

3. **Run Regression M1 Baseline Suite**:
   ```bash
   node tests/m1_database_relational.test.js
   ```
   *Expected behavior*: Baseline tests pass.
