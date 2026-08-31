/**
 * Empirical Adversarial Test Probes for Milestone 1 (M1)
 * Challenger 1 Probe Suite: Stress-testing boundaries, state machines, concurrency, and tree algorithms.
 */
import assert from "node:assert/strict";

// Setup browser/localStorage polyfill for Node test environment
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

const { db } = await import("../src/services/db.js");

console.log("=================================================");
console.log("🧪 RUNNING M1 ADVERSARIAL STRESS PROBE SUITE");
console.log("=================================================");

const findings = [];

function probe(title, fn) {
  try {
    const result = fn();
    console.log(`[PROBE COMPLETED] ${title}`);
    return result;
  } catch (err) {
    console.log(`[PROBE CRASHED] ${title} -> Error: ${err.message}`);
    findings.push({ title, status: "CRASH", error: err.message, stack: err.stack });
    return { error: err };
  }
}

async function asyncProbe(title, fn) {
  try {
    const result = await fn();
    console.log(`[ASYNC PROBE COMPLETED] ${title}`);
    return result;
  } catch (err) {
    console.log(`[ASYNC PROBE CRASHED] ${title} -> Error: ${err.message}`);
    findings.push({ title, status: "CRASH", error: err.message, stack: err.stack });
    return { error: err };
  }
}

// -------------------------------------------------------------
// SECTION 1: LEAVE DEDUCTION BOUNDARIES & EXPLOIT PROBES
// -------------------------------------------------------------

await asyncProbe("PROBE 1.1: 0-day leave deduction behavior", async () => {
  db.resetDatabase();
  const user = db.getUserById("USR-008");
  const initBal = user.annualLeaveBalance; // 14

  const leave = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Annual Leave",
    dates: "2026-09-01",
    days: 0,
    reason: "Zero day test",
  });

  await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
  const updatedUser = db.getUserById("USR-008");
  console.log(`  -> Initial balance: ${initBal}, Leave days requested: 0, Final balance: ${updatedUser.annualLeaveBalance}`);
  
  if (updatedUser.annualLeaveBalance === initBal - 1) {
    findings.push({
      category: "Leave Deduction Bug",
      severity: "MEDIUM",
      title: "0-day leave deducts 1 day due to falsy fallback (`days || 1`)",
      description: "When leave.days is 0, JavaScript expression `leave.days || 1` evaluates to 1, causing a 0-day leave request to deduct 1 day from user balance.",
      empiricalEvidence: `Initial: ${initBal}, Requested: 0, Resulting Balance: ${updatedUser.annualLeaveBalance}`,
    });
  }
});

await asyncProbe("PROBE 1.2: Negative-day leave deduction exploit", async () => {
  db.resetDatabase();
  const user = db.getUserById("USR-008");
  const initBal = user.annualLeaveBalance; // 14

  const leave = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Annual Leave",
    dates: "2026-09-01",
    days: -10,
    reason: "Negative leave exploit",
  });

  await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
  const updatedUser = db.getUserById("USR-008");
  console.log(`  -> Initial balance: ${initBal}, Leave days requested: -10, Final balance: ${updatedUser.annualLeaveBalance}`);

  if (updatedUser.annualLeaveBalance > initBal) {
    findings.push({
      category: "Leave Deduction Vulnerability",
      severity: "HIGH",
      title: "Negative leave days increase employee balance (Exploit Vector)",
      description: "Negative days are not validated or sanitized, allowing balance manipulation where subtracting negative numbers increases balance.",
      empiricalEvidence: `Initial: ${initBal}, Requested: -10, Resulting Balance: ${updatedUser.annualLeaveBalance} (Gained 10 days)`,
    });
  }
});

await asyncProbe("PROBE 1.3: Non-numeric / NaN leave days deduction", async () => {
  db.resetDatabase();
  const user = db.getUserById("USR-008");
  const initBal = user.annualLeaveBalance;

  const leave = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Annual Leave",
    dates: "2026-09-01",
    days: "invalid_number",
    reason: "String days test",
  });

  await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
  const updatedUser = db.getUserById("USR-008");
  console.log(`  -> Initial balance: ${initBal}, Leave days: 'invalid_number', Final balance: ${updatedUser.annualLeaveBalance}`);

  if (isNaN(updatedUser.annualLeaveBalance) || updatedUser.annualLeaveBalance === 0) {
    findings.push({
      category: "Leave Deduction Bug",
      severity: "MEDIUM",
      title: "Non-numeric leave days corrupts balance or coerces to 0 / NaN",
      description: "Passing string or invalid number to leave.days causes arithmetic calculation with NaN (`Math.max(0, 14 - 'invalid')`), corrupting the user leave balance to 0 or NaN.",
      empiricalEvidence: `Initial: ${initBal}, Resulting Balance: ${updatedUser.annualLeaveBalance}`,
    });
  }
});

await asyncProbe("PROBE 1.4: Leave deduction exceeding balance (Underflow / Clamping)", async () => {
  db.resetDatabase();
  const user = db.getUserById("USR-008");
  const initBal = user.annualLeaveBalance; // 14

  const leave = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Annual Leave",
    dates: "2026-09-01 - 2026-10-01",
    days: 50,
    reason: "Excessive leave days",
  });

  await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
  const updatedUser = db.getUserById("USR-008");
  console.log(`  -> Initial balance: ${initBal}, Requested: 50, Final balance: ${updatedUser.annualLeaveBalance}`);
});

await asyncProbe("PROBE 1.5: Sick leave vs Casual leave vs Maternity / Unrecognized leave type", async () => {
  db.resetDatabase();
  const user = db.getUserById("USR-008");
  const initAnnual = user.annualLeaveBalance; // 14
  const initSick = user.sickLeaveBalance; // 8
  const initCasual = user.casualLeaveBalance; // 4

  // Test Sick Leave
  const sickLeave = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Sick Leave",
    days: 3,
  });
  await db.approveLeave(sickLeave.id, "USR-005", "Sarah Chen");

  // Test Casual Leave
  const casualLeave = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Casual Leave",
    days: 2,
  });
  await db.approveLeave(casualLeave.id, "USR-005", "Sarah Chen");

  // Test Maternity / Other Leave type
  const otherLeave = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Maternity / Study Leave",
    days: 5,
  });
  await db.approveLeave(otherLeave.id, "USR-005", "Sarah Chen");

  const uAfter = db.getUserById("USR-008");
  console.log(`  -> Sick: ${initSick} -> ${uAfter.sickLeaveBalance} (expected ${initSick - 3})`);
  console.log(`  -> Casual: ${initCasual} -> ${uAfter.casualLeaveBalance} (expected ${initCasual - 2})`);
  console.log(`  -> Annual: ${initAnnual} -> ${uAfter.annualLeaveBalance} (after 5-day other leave, expected 14 or 9?)`);

  if (uAfter.annualLeaveBalance === initAnnual - 5) {
    findings.push({
      category: "Leave Type Categorization",
      severity: "LOW",
      title: "Unrecognized leave types default to deducting Annual Leave balance",
      description: "Any leave type other than 'Sick Leave' or 'Casual Leave' falls through to the `else` branch and deducts Annual Leave balance.",
      empiricalEvidence: `Type 'Maternity / Study Leave' deducted 5 days from annualLeaveBalance (${initAnnual} -> ${uAfter.annualLeaveBalance})`,
    });
  }
});

// -------------------------------------------------------------
// SECTION 2: APPROVAL STATE MACHINE IDEMPOTENCY & LIFECYCLE
// -------------------------------------------------------------

await asyncProbe("PROBE 2.1: Double approval idempotency on Leave (Repeated Deduction)", async () => {
  db.resetDatabase();
  const user = db.getUserById("USR-008");
  const initBal = user.annualLeaveBalance; // 14

  const leave = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Annual Leave",
    days: 3,
  });

  // First approval
  await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
  const userAfterFirst = db.getUserById("USR-008");
  const balAfterFirst = userAfterFirst.annualLeaveBalance; // 11

  // Second approval (simulating double-click or replay)
  await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
  const userAfterSecond = db.getUserById("USR-008");
  const balAfterSecond = userAfterSecond.annualLeaveBalance;

  console.log(`  -> Initial: ${initBal}, After 1st Approval: ${balAfterFirst}, After 2nd Approval: ${balAfterSecond}`);

  if (balAfterSecond < balAfterFirst) {
    findings.push({
      category: "State Machine / Idempotency Violation",
      severity: "HIGH",
      title: "Non-idempotent `approveLeave` causes duplicate balance deduction on repeat approvals",
      description: "Calling `approveLeave` multiple times on the same leave request repeatedly deducts days from the employee's balance because there is no guard checking if `leave.status === 'Approved'`.",
      empiricalEvidence: `Initial: ${initBal}, 1st Approval: ${balAfterFirst}, 2nd Approval: ${balAfterSecond} (Deducted 6 days instead of 3)`,
    });
  }
});

await asyncProbe("PROBE 2.2: Rejecting an already Approved leave (No Refund)", async () => {
  db.resetDatabase();
  const user = db.getUserById("USR-008");
  const initBal = user.annualLeaveBalance; // 14

  const leave = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Annual Leave",
    days: 4,
  });

  await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
  const balAfterApprove = db.getUserById("USR-008").annualLeaveBalance; // 10

  // Reject the previously approved leave
  await db.rejectLeave(leave.id, "USR-005", "Sarah Chen", "Emergency cancellation");
  const userAfterReject = db.getUserById("USR-008");
  const balAfterReject = userAfterReject.annualLeaveBalance;

  console.log(`  -> Initial: ${initBal}, Approved: ${balAfterApprove}, After Rejecting Approved Leave: ${balAfterReject}`);

  if (balAfterReject === balAfterApprove) {
    findings.push({
      category: "State Machine / Balance Integrity",
      severity: "MEDIUM",
      title: "`rejectLeave` on an already Approved leave does not refund deducted balance",
      description: "When a manager cancels/rejects a leave that was previously Approved, the leave status becomes 'Rejected' but the deducted days are never restored to the employee's balance.",
      empiricalEvidence: `Leave for 4 days approved (balance 14 -> 10), then rejected (balance remains 10, days lost)`,
    });
  }
});

await asyncProbe("PROBE 2.3: Expense Claim 2-Stage Lifecycle Bypass (Direct Finance Approval)", async () => {
  db.resetDatabase();
  const claim = await db.createClaim({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    category: "Hardware",
    amount: "$500.00",
    description: "GPU Card",
  });

  console.log(`  -> Newly created claim status: ${claim.status}`); // Pending Lead

  // Adversarial action: Directly call approveClaimFinance without Stage 1 Lead approval
  const bypassedClaim = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");
  console.log(`  -> Status after direct approveClaimFinance: ${bypassedClaim.status}`);
  console.log(`  -> leadApproverId: ${bypassedClaim.leadApproverId}`);
  console.log(`  -> payoutBatchId: ${bypassedClaim.payoutBatchId}`);

  if (bypassedClaim.status === "Approved" && !bypassedClaim.leadApproverId) {
    findings.push({
      category: "Workflow Enforcement Vulnerability",
      severity: "HIGH",
      title: "Expense claim 2-stage lifecycle can be bypassed (Stage 1 skipped)",
      description: "`approveClaimFinance` lacks precondition validation (`claim.status === 'Pending Finance'`), allowing claims in 'Pending Lead' (or 'Rejected') state to jump directly to 'Approved' and generate a payout batch without Team Lead verification.",
      empiricalEvidence: `Claim created in 'Pending Lead' -> Directly called 'approveClaimFinance' -> Status became 'Approved' with batch '${bypassedClaim.payoutBatchId}' while leadApproverId is null`,
    });
  }
});

await asyncProbe("PROBE 2.4: Demoting Approved claim back to Pending Finance", async () => {
  db.resetDatabase();
  const claim = await db.createClaim({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    category: "Hardware",
    amount: "$500.00",
  });

  await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
  await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody", "BATCH-PAID-001");

  // Claim is now Approved and assigned to batch BATCH-PAID-001
  // Adversarial action: Lead calls approveClaimLead again
  const demotedClaim = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
  console.log(`  -> Status after re-calling approveClaimLead: ${demotedClaim.status}`);

  if (demotedClaim.status === "Pending Finance") {
    findings.push({
      category: "State Machine Violation",
      severity: "MEDIUM",
      title: "Approved / paid expense claims can be demoted back to 'Pending Finance'",
      description: "`approveClaimLead` does not check if the claim has already reached terminal status 'Approved', allowing already paid/batched claims to be reverted to 'Pending Finance'.",
      empiricalEvidence: `Claim in 'Approved' status with batch 'BATCH-PAID-001' reverted to 'Pending Finance' after calling approveClaimLead`,
    });
  }
});

// -------------------------------------------------------------
// SECTION 3: CONCURRENCY & RACE CONDITION PROBES
// -------------------------------------------------------------

await asyncProbe("PROBE 3.1: Concurrent `createLeave` calls (Race Condition on Storage)", async () => {
  db.resetDatabase();
  const initialLeavesCount = db.getLeaves().length; // 2

  // Simulate 10 concurrent leave creations
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      db.createLeave({
        userId: "USR-008",
        name: "Concurrent Applicant",
        department: "Engineering",
        managerId: "USR-005",
        type: "Annual Leave",
        dates: `2026-11-0${i}`,
        days: 1,
        reason: `Concurrent leave ${i}`,
      })
    );
  }

  await Promise.all(promises);
  const finalLeaves = db.getLeaves();
  console.log(`  -> Initial: ${initialLeavesCount}, Created: 10 concurrent requests, Final count in storage: ${finalLeaves.length}`);

  if (finalLeaves.length < initialLeavesCount + 10) {
    findings.push({
      category: "Concurrency / Lost Update",
      severity: "HIGH",
      title: "Concurrent entity creation causes lost writes in localStorage cache",
      description: "`createLeave` performs non-atomic read-modify-write on localStorage (`getLeaves()` -> `unshift()` -> `saveLocal()`). Concurrent calls read identical initial arrays and overwrite each other's writes.",
      empiricalEvidence: `Expected ${initialLeavesCount + 10} records, but only found ${finalLeaves.length} records (${(initialLeavesCount + 10) - finalLeaves.length} records lost)`,
    });
  }
});

await asyncProbe("PROBE 3.2: Concurrent `approveLeave` balance deduction race condition", async () => {
  db.resetDatabase();
  const user = db.getUserById("USR-008");
  const initBal = user.annualLeaveBalance; // 14

  const l1 = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Annual Leave",
    days: 3,
  });

  const l2 = await db.createLeave({
    userId: "USR-008",
    name: user.name,
    department: user.department,
    managerId: user.managerId,
    type: "Annual Leave",
    days: 4,
  });

  // Concurrently approve both leaves
  await Promise.all([
    db.approveLeave(l1.id, "USR-005", "Sarah Chen"),
    db.approveLeave(l2.id, "USR-005", "Sarah Chen"),
  ]);

  const finalUser = db.getUserById("USR-008");
  console.log(`  -> Initial balance: ${initBal}, Leaves: 3 days + 4 days, Expected final: ${initBal - 3 - 4} = 7, Actual: ${finalUser.annualLeaveBalance}`);

  if (finalUser.annualLeaveBalance !== initBal - 7) {
    findings.push({
      category: "Concurrency / Lost Update",
      severity: "HIGH",
      title: "Concurrent leave approvals result in lost balance deduction",
      description: "When multiple leaves for the same user are approved concurrently, both approval handlers read the initial user balance and overwrite each other, causing one deduction to be lost.",
      empiricalEvidence: `Initial: ${initBal}, Approved: 3 and 4 days (total 7), Resulting balance: ${finalUser.annualLeaveBalance} (Lost deduction of ${Math.abs(finalUser.annualLeaveBalance - (initBal - 7))} days)`,
    });
  }
});

// -------------------------------------------------------------
// SECTION 4: RECURSIVE ORG TREE & HIERARCHY STRESS PROBES
// -------------------------------------------------------------

probe("PROBE 4.1: Cycle in organization hierarchy (Infinite Recursion)", () => {
  db.resetDatabase();
  const users = db.getUsers();
  
  // Introduce cycle: USR-001 (CEO) reports to USR-002 (VP Eng), and USR-002 reports to USR-001
  const ceoIdx = users.findIndex((u) => u.id === "USR-001");
  const vpIdx = users.findIndex((u) => u.id === "USR-002");
  users[ceoIdx].managerId = "USR-002";
  users[vpIdx].managerId = "USR-001";
  globalThis.localStorage.setItem("monolith_db_users", JSON.stringify(users));

  try {
    const tree = db.getOrgTree();
    console.log("  -> Tree built without crash:", Boolean(tree));
  } catch (err) {
    console.log(`  -> Crash caught: ${err.message}`);
    findings.push({
      category: "Algorithm / Tree Recursion Flaw",
      severity: "HIGH",
      title: "`getOrgTree` crashes with RangeError (Stack Overflow) on cyclical reporting lines",
      description: "`getOrgTree` recursively traverses `buildNode(user)` by matching `managerId === user.id` without tracking visited node IDs or depth limits. Any accidental or malicious reporting cycle causes maximum call stack size exhaustion.",
      empiricalEvidence: `Error: ${err.message}`,
    });
  }
});

probe("PROBE 4.2: Self-referencing managerId (USR-005 reports to USR-005)", () => {
  db.resetDatabase();
  const users = db.getUsers();
  const leadIdx = users.findIndex((u) => u.id === "USR-005");
  users[leadIdx].managerId = "USR-005"; // self reference
  globalThis.localStorage.setItem("monolith_db_users", JSON.stringify(users));

  try {
    const tree = db.getOrgTree();
    console.log("  -> Tree built without crash:", Boolean(tree));
  } catch (err) {
    console.log(`  -> Crash caught on self-reference: ${err.message}`);
    findings.push({
      category: "Algorithm / Tree Recursion Flaw",
      severity: "HIGH",
      title: "`getOrgTree` crashes on self-referencing user (managerId === id)",
      description: "When a user's managerId is set to their own ID, `getOrgTree` enters infinite recursion immediately upon reaching that node.",
      empiricalEvidence: `Error: ${err.message}`,
    });
  }
});

probe("PROBE 4.3: Deep Hierarchy Stress Test (100 Levels Deep)", () => {
  db.resetDatabase();
  const deepUsers = [];
  
  // CEO at top
  deepUsers.push({
    id: "DEEP-000",
    name: "Deep CEO",
    tier: 5,
    managerId: null,
    department: "Executive",
  });

  for (let i = 1; i <= 100; i++) {
    deepUsers.push({
      id: `DEEP-${String(i).padStart(3, "0")}`,
      name: `Deep Level ${i}`,
      tier: i > 5 ? 1 : (5 - i + 1),
      managerId: `DEEP-${String(i - 1).padStart(3, "0")}`,
      department: "Engineering",
    });
  }

  globalThis.localStorage.setItem("monolith_db_users", JSON.stringify(deepUsers));

  const tree = db.getOrgTree();
  assert.ok(tree, "Deep tree must be constructed");
  assert.equal(tree.id, "DEEP-000");

  let curr = tree;
  let depth = 0;
  while (curr && curr.directReports && curr.directReports.length > 0) {
    depth++;
    curr = curr.directReports[0];
  }
  console.log(`  -> Successfully navigated deep tree to depth: ${depth} (expected 100)`);
  assert.equal(depth, 100, "Should resolve all 100 hierarchy levels");
});

probe("PROBE 4.4: Disconnected subtrees / Orphaned managerId", () => {
  db.resetDatabase();
  const users = db.getUsers();
  // Set USR-007 (HR Lead) managerId to non-existent USR-999
  const hrLeadIdx = users.findIndex((u) => u.id === "USR-007");
  users[hrLeadIdx].managerId = "USR-999";
  globalThis.localStorage.setItem("monolith_db_users", JSON.stringify(users));

  const tree = db.getOrgTree();
  
  // Check if USR-007 exists in the tree
  const findInTree = (node, id) => {
    if (node.id === id) return true;
    return (node.directReports || []).some((child) => findInTree(child, id));
  };

  const found = findInTree(tree, "USR-007");
  console.log(`  -> Orphaned user USR-007 found in CEO org tree? ${found}`);

  if (!found) {
    findings.push({
      category: "Data Visibility / Org Tree",
      severity: "LOW",
      title: "Users with broken manager links (orphaned managerId) are excluded from root org tree",
      description: "When an employee has a managerId pointing to a deleted or non-existent user, `getOrgTree()` starting from the CEO silently omits that entire subtree.",
      empiricalEvidence: `USR-007 with managerId='USR-999' was omitted from CEO org tree.`,
    });
  }
});

// -------------------------------------------------------------
// SECTION 5: PAYROLL & STATUTORY DEDUCTION PROBES
// -------------------------------------------------------------

probe("PROBE 5.1: Zero and Negative Salary Payroll Calculation", () => {
  db.resetDatabase();
  const zeroUser = {
    id: "USR-ZERO",
    name: "Volunteer",
    salary: "$0/mo",
    monthlyBasePay: 0,
    status: "Active",
  };

  const item = db.calculatePayrollItem(zeroUser);
  console.log(`  -> Zero Salary Item: Gross: $${item.gross}, Total Deductions: $${item.totalDeductions}, Net: $${item.netPay}`);
  
  if (item.totalDeductions === 50 && item.netPay === 0) {
    console.log("  -> Note: Fixed $50 HMO withholding causes $50 deductions on $0 gross, net clamped to $0.00.");
  }
});

probe("PROBE 5.2: Fractional Penny Rounding Precision in Payroll", () => {
  db.resetDatabase();
  const fractionalUser = {
    id: "USR-FRAC",
    name: "Fractional Worker",
    salary: "$3,333.33/mo",
    monthlyBasePay: 3333.33,
    status: "Active",
  };

  const item = db.calculatePayrollItem(fractionalUser);
  // Gross: 3333.33
  // PAYE: 3333.33 * 0.1143 = 380.999619 -> 381.00
  // Pension: 3333.33 * 0.08 = 266.6664 -> 266.67
  // HMO: 50.00
  // Total Deductions: 381.00 + 266.67 + 50.00 = 697.67
  // Net Pay: 3333.33 - 697.67 = 2635.66
  console.log(`  -> Gross: ${item.gross}, PAYE: ${item.paye}, Pension: ${item.pension}, HMO: ${item.hmo}, Deductions: ${item.totalDeductions}, Net: ${item.netPay}`);
  assert.equal(item.paye, 381.00);
  assert.equal(item.pension, 266.67);
  assert.equal(item.totalDeductions, 697.67);
  assert.equal(item.netPay, 2635.66);
});

// -------------------------------------------------------------
// SUMMARY & FINDINGS DUMP
// -------------------------------------------------------------

console.log("\n=================================================");
console.log(`🔍 PROBE SUMMARY: ${findings.length} EMPIRICAL FINDINGS IDENTIFIED`);
console.log("=================================================");

findings.forEach((f, idx) => {
  console.log(`\n[FINDING #${idx + 1}] [${f.severity || "INFO"}] ${f.title}`);
  console.log(`  Category: ${f.category || "General"}`);
  console.log(`  Description: ${f.description || f.error || "N/A"}`);
  if (f.empiricalEvidence) {
    console.log(`  Evidence: ${f.empiricalEvidence}`);
  }
});
