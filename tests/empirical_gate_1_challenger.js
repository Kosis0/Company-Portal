/**
 * Empirical Gate 1 Challenger Test Suite
 * Deep probing of db.js, auth.js, state machines, and relational graph models.
 */

// Polyfill localStorage for Node environment
if (typeof globalThis.localStorage === "undefined") {
  const storage = new Map();
  globalThis.localStorage = {
    getItem: (k) => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: (k) => storage.delete(k),
    clear: () => storage.clear(),
  };
}

import { db, SEED_DATA, STORAGE_KEYS } from "../src/services/db.js";
import { auth } from "../src/services/auth.js";

const results = [];

function recordResult(probeId, description, status, details = {}) {
  results.push({ probeId, description, status, details });
  const symbol = status === "PASS" ? "✅ [PASS]" : status === "WARN" ? "⚠️ [WARN]" : "❌ [FAIL]";
  console.log(`${symbol} ${probeId}: ${description}`);
  if (Object.keys(details).length > 0) {
    console.log(`   Details:`, JSON.stringify(details));
  }
}

async function runEmpiricalProbes() {
  console.log("===================================================================");
  console.log("🔥 STARTING EMPIRICAL GATE 1 ADVERSARIAL STRESS PROBE SUITE");
  console.log("===================================================================\n");

  // Reset database to fresh seed state
  db.resetDatabase();

  // -------------------------------------------------------------------
  // PROBE GROUP 1: LEAVE DEDUCTIONS & BALANCE MATHEMATICS
  // -------------------------------------------------------------------
  console.log("--- PROBE GROUP 1: LEAVE DEDUCTIONS & BALANCE MATHEMATICS ---");

  // 1.1: Leave deduction on 0 balance
  db.resetDatabase();
  await db.updateUser("USR-008", { annualLeaveBalance: 0 });
  const zeroBalLeave = await db.createLeave({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    type: "Annual Leave",
    dates: "Sep 01 - Sep 05, 2026",
    days: 5,
    reason: "Vacation",
  });
  await db.approveLeave(zeroBalLeave.id, "USR-005", "Sarah Chen");
  const userAfterZeroBal = db.getUserById("USR-008");
  if (userAfterZeroBal.annualLeaveBalance === 0) {
    recordResult("PROBE-1.1", "Leave deduction on 0 balance clamps safely to 0 (no negative underflow)", "PASS", {
      initialBalance: 0,
      daysRequested: 5,
      finalBalance: userAfterZeroBal.annualLeaveBalance,
    });
  } else {
    recordResult("PROBE-1.1", "Leave deduction on 0 balance underflowed!", "FAIL", {
      finalBalance: userAfterZeroBal.annualLeaveBalance,
    });
  }

  // 1.2: Leave deduction with negative days (exploit attempt to increase balance)
  db.resetDatabase();
  const initBal = db.getUserById("USR-008").annualLeaveBalance; // 14
  const negLeave = await db.createLeave({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    type: "Annual Leave",
    dates: "Sep 01 - Sep 05, 2026",
    days: -10,
    reason: "Exploit attempt",
  });
  await db.approveLeave(negLeave.id, "USR-005", "Sarah Chen");
  const userAfterNeg = db.getUserById("USR-008");
  if (userAfterNeg.annualLeaveBalance === initBal) {
    recordResult("PROBE-1.2", "Negative days leave deduction is clamped (does not increase balance)", "PASS", {
      initialBalance: initBal,
      daysRequested: -10,
      finalBalance: userAfterNeg.annualLeaveBalance,
    });
  } else {
    recordResult("PROBE-1.2", "Negative leave days manipulated balance!", "FAIL", {
      initialBalance: initBal,
      finalBalance: userAfterNeg.annualLeaveBalance,
    });
  }

  // 1.3: Fractional days leave deduction (e.g. 0.5 day half-day leave, 2.5 days)
  db.resetDatabase();
  const halfDayLeave = await db.createLeave({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    type: "Annual Leave",
    dates: "Sep 01, 2026",
    days: 0.5,
    reason: "Afternoon half-day",
  });
  await db.approveLeave(halfDayLeave.id, "USR-005", "Sarah Chen");
  const userAfterHalfDay = db.getUserById("USR-008");
  if (userAfterHalfDay.annualLeaveBalance === 13.5) {
    recordResult("PROBE-1.3", "Fractional days (0.5 half-day) deducted with exact precision", "PASS", {
      initialBalance: 14,
      deduction: 0.5,
      finalBalance: userAfterHalfDay.annualLeaveBalance,
    });
  } else {
    recordResult("PROBE-1.3", "Fractional leave days failed or rounded unexpectedly", "FAIL", {
      expected: 13.5,
      actual: userAfterHalfDay.annualLeaveBalance,
    });
  }

  // 1.4: Multiple consecutive approvals of same leave (idempotency guard)
  db.resetDatabase();
  const doubleApproveLeave = await db.createLeave({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    type: "Annual Leave",
    dates: "Sep 01 - Sep 03, 2026",
    days: 3,
    reason: "Trip",
  });
  // Call approveLeave 5 times consecutively
  await db.approveLeave(doubleApproveLeave.id, "USR-005", "Sarah Chen");
  await db.approveLeave(doubleApproveLeave.id, "USR-005", "Sarah Chen");
  await db.approveLeave(doubleApproveLeave.id, "USR-005", "Sarah Chen");
  await db.approveLeave(doubleApproveLeave.id, "USR-005", "Sarah Chen");
  await db.approveLeave(doubleApproveLeave.id, "USR-005", "Sarah Chen");
  const userAfter5Approvals = db.getUserById("USR-008");
  if (userAfter5Approvals.annualLeaveBalance === 11) {
    recordResult("PROBE-1.4", "Multiple consecutive approveLeave calls are idempotent (deducts exactly once)", "PASS", {
      initialBalance: 14,
      daysDeducted: 3,
      finalBalance: userAfter5Approvals.annualLeaveBalance,
    });
  } else {
    recordResult("PROBE-1.4", "Multiple consecutive approvals repeatedly deducted balance!", "FAIL", {
      expected: 11,
      actual: userAfter5Approvals.annualLeaveBalance,
    });
  }

  // 1.5: Sick leave and Casual leave balance targeting
  db.resetDatabase();
  const sickLeave = await db.createLeave({
    userId: "USR-008",
    type: "Sick Leave",
    days: 2,
  });
  await db.approveLeave(sickLeave.id, "USR-005", "Sarah Chen");
  const casualLeave = await db.createLeave({
    userId: "USR-008",
    type: "Casual Leave",
    days: 1.5,
  });
  await db.approveLeave(casualLeave.id, "USR-005", "Sarah Chen");
  const userAfterSpecificLeaves = db.getUserById("USR-008");
  const sickOk = userAfterSpecificLeaves.sickLeaveBalance === 6; // 8 - 2 = 6
  const casualOk = userAfterSpecificLeaves.casualLeaveBalance === 2.5; // 4 - 1.5 = 2.5
  const annualUntouched = userAfterSpecificLeaves.annualLeaveBalance === 14;
  if (sickOk && casualOk && annualUntouched) {
    recordResult("PROBE-1.5", "Sick and Casual leaves deduct strictly from their respective balances", "PASS", {
      sick: userAfterSpecificLeaves.sickLeaveBalance,
      casual: userAfterSpecificLeaves.casualLeaveBalance,
      annual: userAfterSpecificLeaves.annualLeaveBalance,
    });
  } else {
    recordResult("PROBE-1.5", "Leave balance targeting mismatch", "FAIL", {
      sick: userAfterSpecificLeaves.sickLeaveBalance,
      casual: userAfterSpecificLeaves.casualLeaveBalance,
      annual: userAfterSpecificLeaves.annualLeaveBalance,
    });
  }


  // -------------------------------------------------------------------
  // PROBE GROUP 2: EXPENSE CLAIM STATE MACHINE & 2-STAGE WORKFLOW
  // -------------------------------------------------------------------
  console.log("\n--- PROBE GROUP 2: EXPENSE CLAIM STATE MACHINE & 2-STAGE WORKFLOW ---");

  // 2.1: Normal 2-Stage Lifecycle (Pending Lead -> Pending Finance -> Approved)
  db.resetDatabase();
  const normalClaim = await db.createClaim({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    category: "Cloud Subscriptions",
    amount: "$150.00",
    description: "AWS Dev Sandbox",
  });
  const step1 = await db.approveClaimLead(normalClaim.id, "USR-005", "Sarah Chen");
  const step2 = await db.approveClaimFinance(normalClaim.id, "USR-004", "Marcus Brody");
  if (step1.status === "Pending Finance" && step2.status === "Approved" && step2.payoutBatchId) {
    recordResult("PROBE-2.1", "Standard 2-stage approval workflow transitions correctly with audit metadata", "PASS", {
      initialStatus: normalClaim.status,
      stage1Status: step1.status,
      stage2Status: step2.status,
      payoutBatchId: step2.payoutBatchId,
    });
  } else {
    recordResult("PROBE-2.1", "Standard 2-stage workflow failed", "FAIL", { step1, step2 });
  }

  // 2.2: Stage 1 Bypass Attempt: Direct Finance Approval on 'Pending Lead'
  db.resetDatabase();
  const bypassClaim = await db.createClaim({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    category: "Hardware",
    amount: "$500.00",
    description: "External Monitor",
  });
  const bypassResult = await db.approveClaimFinance(bypassClaim.id, "USR-004", "Marcus Brody");
  // Document behavior: Does approveClaimFinance enforce claim.status === 'Pending Finance'?
  if (bypassResult.status === "Approved") {
    recordResult("PROBE-2.2", "Stage 1 Bypass: Direct Finance approval on 'Pending Lead' claim succeeds without Lead verification", "WARN", {
      note: "approveClaimFinance does not check precondition status === 'Pending Finance'. Allows executive override / direct payout.",
      resultingStatus: bypassResult.status,
      leadApproverId: bypassResult.leadApproverId || null,
      payoutBatchId: bypassResult.payoutBatchId,
    });
  } else {
    recordResult("PROBE-2.2", "Stage 1 Bypass blocked by status precondition", "PASS");
  }

  // 2.3: Duplicate Finance Approvals (Idempotency on Payout Batch)
  db.resetDatabase();
  const dupClaim = await db.createClaim({
    userId: "USR-008",
    category: "Travel",
    amount: "$200.00",
  });
  await db.approveClaimLead(dupClaim.id, "USR-005", "Sarah Chen");
  const fin1 = await db.approveClaimFinance(dupClaim.id, "USR-004", "Marcus Brody");
  const batch1 = fin1.payoutBatchId;
  const fin2 = await db.approveClaimFinance(dupClaim.id, "USR-004", "Marcus Brody");
  const batch2 = fin2.payoutBatchId;
  if (fin1.status === "Approved" && fin2.status === "Approved" && batch1 === batch2) {
    recordResult("PROBE-2.3", "Duplicate Finance approval is idempotent and preserves payoutBatchId", "PASS", {
      payoutBatchId: batch1,
    });
  } else {
    recordResult("PROBE-2.3", "Duplicate Finance approval regenerated payoutBatchId or mutated status", "FAIL", {
      batch1,
      batch2,
    });
  }

  // 2.4: Attempting to demote Approved claim back to Stage 1 (Pending Finance)
  db.resetDatabase();
  const demoteClaim = await db.createClaim({
    userId: "USR-008",
    category: "Office",
    amount: "$50.00",
  });
  await db.approveClaimLead(demoteClaim.id, "USR-005", "Sarah Chen");
  await db.approveClaimFinance(demoteClaim.id, "USR-004", "Marcus Brody");
  // Now call approveClaimLead on Approved claim
  const demoteResult = await db.approveClaimLead(demoteClaim.id, "USR-005", "Sarah Chen");
  if (demoteResult.status === "Approved") {
    recordResult("PROBE-2.4", "Approved claim cannot be demoted back to 'Pending Finance' by Lead approval", "PASS", {
      status: demoteResult.status,
    });
  } else {
    recordResult("PROBE-2.4", "Approved claim was demoted!", "FAIL", { status: demoteResult.status });
  }

  // 2.5: Rejection of Approved claim
  db.resetDatabase();
  const rejectApprovedClaim = await db.createClaim({
    userId: "USR-008",
    category: "Books",
    amount: "$80.00",
  });
  await db.approveClaimLead(rejectApprovedClaim.id, "USR-005", "Sarah Chen");
  await db.approveClaimFinance(rejectApprovedClaim.id, "USR-004", "Marcus Brody");
  const rejectRes = await db.rejectClaim(rejectApprovedClaim.id, "USR-004", "Marcus Brody", "Fraud detected");
  if (rejectRes.status === "Rejected") {
    recordResult("PROBE-2.5", "Claim can be transitioned to 'Rejected' post-approval (Admin override capability)", "PASS", {
      status: rejectRes.status,
      rejectionReason: rejectRes.rejectionReason,
    });
  } else {
    recordResult("PROBE-2.5", "Rejection behavior on approved claim", "WARN", { status: rejectRes.status });
  }


  // -------------------------------------------------------------------
  // PROBE GROUP 3: ORG TREE HIERARCHY, CYCLE PROTECTION & DEEP GRAPH
  // -------------------------------------------------------------------
  console.log("\n--- PROBE GROUP 3: ORG TREE HIERARCHY, CYCLE PROTECTION & DEEP GRAPH ---");

  // 3.1: 2-node circular manager relationship (A -> B -> A)
  db.resetDatabase();
  const usersForCycle = db.getUsers();
  // Set USR-002 managerId to USR-005, and USR-005 managerId to USR-002
  await db.updateUser("USR-002", { managerId: "USR-005" });
  await db.updateUser("USR-005", { managerId: "USR-002" });
  const treeWithCycle = db.getOrgTree();
  if (treeWithCycle && treeWithCycle.id === "USR-001") {
    recordResult("PROBE-3.1", "Org tree survives 2-node circular manager relationship ($A \\to B \\to A$) without stack overflow", "PASS", {
      rootUser: treeWithCycle.name,
      directReportsCount: treeWithCycle.directReportsCount,
    });
  } else {
    recordResult("PROBE-3.1", "Org tree crashed or failed on 2-node cycle", "FAIL");
  }

  // 3.2: 3-node circular manager relationship (A -> B -> C -> A)
  db.resetDatabase();
  await db.updateUser("USR-002", { managerId: "USR-005" });
  await db.updateUser("USR-005", { managerId: "USR-006" });
  await db.updateUser("USR-006", { managerId: "USR-002" });
  const treeWith3Cycle = db.getOrgTree();
  if (treeWith3Cycle && treeWith3Cycle.id === "USR-001") {
    recordResult("PROBE-3.2", "Org tree survives 3-node circular manager relationship ($A \\to B \\to C \\to A$) without infinite loop", "PASS", {
      rootUser: treeWith3Cycle.name,
    });
  } else {
    recordResult("PROBE-3.2", "Org tree crashed on 3-node cycle", "FAIL");
  }

  // 3.3: Self-referencing manager loop (A -> A)
  db.resetDatabase();
  await db.updateUser("USR-002", { managerId: "USR-002" });
  const treeWithSelfLoop = db.getOrgTree();
  if (treeWithSelfLoop) {
    recordResult("PROBE-3.3", "Org tree survives self-referencing manager node ($A \\to A$)", "PASS");
  } else {
    recordResult("PROBE-3.3", "Org tree failed on self-loop", "FAIL");
  }

  // 3.4: Deep hierarchy stress test (100 levels)
  db.resetDatabase();
  const deepUsers = [];
  deepUsers.push({
    id: "DEEP-ROOT",
    name: "Deep Root CEO",
    email: "deep_ceo@company.com",
    tier: 5,
    role: "executive",
    managerId: null,
    department: "Executive",
  });
  for (let i = 1; i <= 100; i++) {
    deepUsers.push({
      id: `DEEP-${i}`,
      name: `Deep Level ${i}`,
      email: `deep_${i}@company.com`,
      tier: 1,
      role: "employee",
      managerId: i === 1 ? "DEEP-ROOT" : `DEEP-${i - 1}`,
      department: "Engineering",
    });
  }
  globalThis.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(deepUsers));
  const deepTree = db.getOrgTree(150);
  let currentDepth = 0;
  let curr = deepTree;
  while (curr && curr.directReports && curr.directReports.length > 0) {
    currentDepth++;
    curr = curr.directReports[0];
  }
  if (currentDepth === 100) {
    recordResult("PROBE-3.4", "Deep hierarchy constructs cleanly to exact depth 100", "PASS", {
      constructedDepth: currentDepth,
    });
  } else {
    recordResult("PROBE-3.4", "Deep hierarchy depth mismatch", "FAIL", {
      expectedDepth: 100,
      actualDepth: currentDepth,
    });
  }

  // 3.5: Deep hierarchy exceeding maxDepth (200 levels with maxDepth=150)
  const ultraDeepUsers = [];
  ultraDeepUsers.push({
    id: "ULTRA-ROOT",
    name: "Ultra Root CEO",
    email: "ultra_ceo@company.com",
    tier: 5,
    role: "executive",
    managerId: null,
    department: "Executive",
  });
  for (let i = 1; i <= 200; i++) {
    ultraDeepUsers.push({
      id: `ULTRA-${i}`,
      name: `Ultra Level ${i}`,
      email: `ultra_${i}@company.com`,
      tier: 1,
      role: "employee",
      managerId: i === 1 ? "ULTRA-ROOT" : `ULTRA-${i - 1}`,
      department: "Engineering",
    });
  }
  globalThis.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(ultraDeepUsers));
  const ultraTree = db.getOrgTree(150);
  let ultraDepth = 0;
  let ultraCurr = ultraTree;
  while (ultraCurr && ultraCurr.directReports && ultraCurr.directReports.length > 0) {
    ultraDepth++;
    ultraCurr = ultraCurr.directReports[0];
  }
  // Depth 0 is root, 149 child hops = 150 nodes visited
  if (ultraDepth === 149) {
    recordResult("PROBE-3.5", "Org tree gracefully truncates recursion at maxDepth (150) preventing stack overflow on 200-level hierarchy", "PASS", {
      totalLevels: 200,
      truncatedAtChildHops: ultraDepth,
      totalNodesInBranch: ultraDepth + 1,
    });
  } else {
    recordResult("PROBE-3.5", "Org tree maxDepth boundary test unexpected depth", "FAIL", {
      expected: 149,
      actual: ultraDepth,
    });
  }


  // -------------------------------------------------------------------
  // PROBE GROUP 4: DEPARTMENT LOOKUPS, CASING, WHITESPACE & BUDGETS
  // -------------------------------------------------------------------
  console.log("\n--- PROBE GROUP 4: DEPARTMENT LOOKUPS, CASING, WHITESPACE & BUDGETS ---");
  db.resetDatabase();

  // 4.1: Unusual casing lookups with full names and codes
  const d1 = db.getDepartment("eNgInEeRiNg & TeChNoLoGy");
  const d2 = db.getDepartment("dEp-EnG");
  const d3 = db.getDepartment("ENG");
  const d4 = db.getDepartment("FiNaNcE & cOrPoRaTe OpErAtIoNs");
  const casingOk = d1 && d2 && d3 && d4 && d1.id === "DEP-ENG" && d4.id === "DEP-FIN";
  if (casingOk) {
    recordResult("PROBE-4.1", "Department lookups match case-insensitively across ID, code, and full name", "PASS", {
      "eNgInEeRiNg & TeChNoLoGy": d1?.id,
      "dEp-EnG": d2?.id,
      "ENG": d3?.id,
      "FiNaNcE & cOrPoRaTe OpErAtIoNs": d4?.id,
    });
  } else {
    recordResult("PROBE-4.1", "Department case-insensitive lookups failed", "FAIL", { d1, d2, d3, d4 });
  }

  // 4.2: Short name / prefix lookup behavior (e.g. "Engineering" vs "Engineering & Technology")
  const shortEng = db.getDepartment("Engineering");
  if (shortEng === null) {
    recordResult("PROBE-4.2", "Department lookup requires exact name/code/id (short name 'Engineering' returns null for 'Engineering & Technology')", "WARN", {
      note: "db.getDepartment performs strict equality (d.id === query || d.code === query || d.name === query). Short prefix 'Engineering' does not match full name 'Engineering & Technology'.",
      query: "Engineering",
      fullNameInDB: "Engineering & Technology",
      codeInDB: "ENG",
    });
  } else {
    recordResult("PROBE-4.2", "Department prefix lookup matched", "PASS");
  }

  // 4.2b: Whitespace padding in department lookup
  const dWs1 = db.getDepartment("   Engineering & Technology  \t");
  const dWs2 = db.getDepartment("\nDEP-HR \n");
  if (dWs1 && dWs1.id === "DEP-ENG" && dWs2 && dWs2.id === "DEP-HR") {
    recordResult("PROBE-4.2b", "Department lookups handle leading/trailing whitespace gracefully", "PASS", {
      "   Engineering & Technology  \\t": dWs1.id,
      "\\nDEP-HR \\n": dWs2.id,
    });
  } else {
    recordResult("PROBE-4.2b", "Whitespace-padded department lookup failed", "FAIL");
  }

  // 4.3: Budget calculations for all 4 primary departments
  const engBudget = db.getDepartmentBudget("DEP-ENG");
  const finBudget = db.getDepartmentBudget("DEP-FIN");
  const hrBudget = db.getDepartmentBudget("DEP-HR");
  const itBudget = db.getDepartmentBudget("DEP-IT");

  const engHeadcount = db.getUsers().filter((u) => u.department === "Engineering").length; // USR-002, USR-005, USR-006, USR-008 = 4
  const engSpent = 9800 + 6200 + 5800 + 3500; // 25300
  const engAllocated = 42000;
  const engUtilExpected = Math.round((25300 / 42000) * 100); // 60%

  if (engBudget.spentAmount === engSpent && engBudget.headcount === engHeadcount && engBudget.allocatedAmount === engAllocated) {
    recordResult("PROBE-4.3", "Engineering department budget aggregation matches headcount and individual salary sums", "PASS", {
      headcount: engBudget.headcount,
      spent: engBudget.spentAmount,
      allocated: engBudget.allocatedAmount,
      utilization: engBudget.budgetUtilization,
    });
  } else {
    recordResult("PROBE-4.3", "Engineering budget calculation mismatch", "FAIL", {
      actual: engBudget,
      expectedSpent: engSpent,
      expectedHeadcount: engHeadcount,
    });
  }

  // 4.4: Over-budget utilization calculation (>100%)
  db.resetDatabase();
  await db.updateDepartment("DEP-ENG", { monthlyBudget: "$10,000" });
  const overBudget = db.getDepartmentBudget("DEP-ENG");
  if (overBudget.spentAmount === 25300 && overBudget.remainingAmount === 0 && overBudget.budgetUtilization === "253%") {
    recordResult("PROBE-4.4", "Department budget over-utilization correctly computes >100% and clamps remaining to 0", "PASS", {
      allocated: overBudget.allocatedAmount,
      spent: overBudget.spentAmount,
      remaining: overBudget.remainingAmount,
      utilization: overBudget.budgetUtilization,
    });
  } else {
    recordResult("PROBE-4.4", "Over-budget calculation failure", "FAIL", { overBudget });
  }

  // 4.5: Querying budget for non-existent department
  const nullBudget = db.getDepartmentBudget("NON_EXISTENT_DEP");
  const emptyBudget = db.getDepartmentBudget("");
  if (nullBudget === null && emptyBudget === null) {
    recordResult("PROBE-4.5", "Non-existent and empty department budget queries return null safely", "PASS");
  } else {
    recordResult("PROBE-4.5", "Non-existent department budget returned non-null", "FAIL");
  }


  // -------------------------------------------------------------------
  // PROBE GROUP 5: SHIFT CLOCK RAPID SEQUENCES & DURATION CALCULATIONS
  // -------------------------------------------------------------------
  console.log("\n--- PROBE GROUP 5: SHIFT CLOCK RAPID SEQUENCES & DURATION CALCULATIONS ---");
  db.resetDatabase();

  // 5.1: Rapid clock-in and clock-out sequence (10 consecutive cycles)
  let lastAttId = null;
  const shiftCycles = 10;
  let cycleSuccess = true;
  for (let i = 0; i < shiftCycles; i++) {
    const inTime = `0${8 + (i % 4)}:${i < 10 ? "0" + i : i} AM`;
    const outTime = `0${9 + (i % 4)}:${i < 10 ? "0" + i : i} AM`;
    const rec = await db.addAttendance({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      date: "2026-08-31",
      in: inTime,
      out: "In Progress",
      hours: "In Progress",
      status: "On Time",
    });
    lastAttId = rec.id;
    const updated = await db.updateAttendance(rec.id, {
      out: outTime,
      hours: "1h 00m",
      status: "Completed",
    });
    if (!updated || updated.hours !== "1h 00m" || updated.out !== outTime) {
      cycleSuccess = false;
      break;
    }
  }
  const userAtts = db.getAttendance("USR-008");
  if (cycleSuccess && userAtts.length >= 10) {
    recordResult("PROBE-5.1", "Rapid clock in/out sequence (10 rapid cycles) persists without collision or corruption", "PASS", {
      totalRecords: userAtts.length,
      lastRecordStatus: userAtts[0].status,
      lastRecordHours: userAtts[0].hours,
    });
  } else {
    recordResult("PROBE-5.1", "Rapid shift clock sequence failed", "FAIL", { count: userAtts.length });
  }

  // 5.2: getTeamAttendance for manager
  const teamAttendance = db.getTeamAttendance("USR-005"); // Sarah Chen's direct reports (USR-008, USR-009)
  const sarahReports = db.getDirectReports("USR-005").map((r) => r.id);
  const allMatch = teamAttendance.every((a) => sarahReports.includes(a.userId));
  if (teamAttendance.length > 0 && allMatch) {
    recordResult("PROBE-5.2", "getTeamAttendance strictly filters logs to manager's direct reports", "PASS", {
      managerId: "USR-005",
      directReports: sarahReports,
      attendanceRecordCount: teamAttendance.length,
    });
  } else {
    recordResult("PROBE-5.2", "getTeamAttendance leak or empty", "FAIL", { count: teamAttendance.length, allMatch });
  }


  // -------------------------------------------------------------------
  // PROBE GROUP 6: AUTHENTICATION SERVICE & SESSION SECURITY
  // -------------------------------------------------------------------
  console.log("\n--- PROBE GROUP 6: AUTHENTICATION SERVICE & SESSION SECURITY ---");
  db.resetDatabase();
  auth.logout();

  // 6.1: Login with case-insensitive email and whitespace trimming
  const session1 = await auth.login("  CEO@COMPANY.COM  ", "password123");
  if (session1 && session1.user && session1.user.id === "USR-001" && session1.token.startsWith("mth_jwt_")) {
    recordResult("PROBE-6.1", "auth.login normalizes uppercase and padded email addresses", "PASS", {
      userId: session1.user.id,
      email: session1.user.email,
    });
  } else {
    recordResult("PROBE-6.1", "auth.login failed on email normalization", "FAIL");
  }

  // 6.2: Session persistence and live profile re-verification
  const activeSession = auth.getCurrentSession();
  if (activeSession && activeSession.user.id === "USR-001") {
    // Now update the user in DB and verify getCurrentSession reflects the live change
    await db.updateUser("USR-001", { title: "Executive Chairman & CEO" });
    const refreshedSession = auth.getCurrentSession();
    if (refreshedSession.user.title === "Executive Chairman & CEO") {
      recordResult("PROBE-6.2", "auth.getCurrentSession dynamically re-verifies and hydrates from live database", "PASS", {
        updatedTitle: refreshedSession.user.title,
      });
    } else {
      recordResult("PROBE-6.2", "auth.getCurrentSession did not re-verify against live database", "FAIL");
    }
  } else {
    recordResult("PROBE-6.2", "Session persistence failed", "FAIL");
  }

  // 6.3: Session invalidation when user is deleted from database
  const usersBeforeDelete = db.getUsers();
  const filteredUsers = usersBeforeDelete.filter((u) => u.id !== "USR-001");
  globalThis.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
  const sessionAfterDeletedUser = auth.getCurrentSession();
  if (sessionAfterDeletedUser === null) {
    recordResult("PROBE-6.3", "auth.getCurrentSession automatically logs out if user is removed from database", "PASS");
  } else {
    recordResult("PROBE-6.3", "auth.getCurrentSession returned ghost session for deleted user", "FAIL");
  }

  // 6.4: Registration validation for duplicate emails
  db.resetDatabase();
  let dupRegError = null;
  try {
    await auth.register({
      email: "Employee@Company.Com",
      password: "newpassword",
      name: "Duplicate User",
    });
  } catch (err) {
    dupRegError = err.message;
  }
  if (dupRegError && dupRegError.includes("already exists")) {
    recordResult("PROBE-6.4", "auth.register prevents duplicate registration with case-insensitive match", "PASS", {
      error: dupRegError,
    });
  } else {
    recordResult("PROBE-6.4", "auth.register allowed duplicate email registration!", "FAIL");
  }


  // -------------------------------------------------------------------
  // SUMMARY & STATISTICS
  // -------------------------------------------------------------------
  console.log("\n===================================================================");
  console.log("📊 EMPIRICAL GATE 1 CHALLENGER EXECUTION SUMMARY");
  console.log("===================================================================");
  const passed = results.filter((r) => r.status === "PASS").length;
  const warned = results.filter((r) => r.status === "WARN").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const total = results.length;

  console.log(`Total Probes Executed: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Warnings/Findings: ${warned}`);
  console.log(`Failed: ${failed}`);
  console.log("===================================================================\n");

  return { total, passed, warned, failed, results };
}

runEmpiricalProbes().catch((err) => {
  console.error("FATAL PROBE ERROR:", err);
  process.exit(1);
});
