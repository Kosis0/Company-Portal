/**
 * Automated Verification Test Suite for Milestone 1 (M1)
 * Tests: Database Schema, Relational Model, Multi-Stage Approvals, Payroll Engine & Offline Sync
 */
import fs from "node:fs";
import path from "node:path";
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

// Import db and auth modules
const { db } = await import("../src/services/db.js");
const { auth } = await import("../src/services/auth.js");

console.log("=================================================");
console.log("🚀 STARTING MILESTONE 1 (M1) VERIFICATION SUITE");
console.log("=================================================");

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    throw err;
  }
}

// -------------------------------------------------------------
// 1. SUPABASE SCHEMA V2.0 FILE VERIFICATION
// -------------------------------------------------------------
runTest("Supabase Schema v2.0 exists and defines all 9 tables and publications", () => {
  const schemaPath = path.resolve(process.cwd(), "supabase_schema.sql");
  assert.ok(fs.existsSync(schemaPath), "supabase_schema.sql must exist");
  const content = fs.readFileSync(schemaPath, "utf-8");

  const requiredTables = [
    "public.users",
    "public.departments",
    "public.assets",
    "public.sprints",
    "public.attendance",
    "public.leaves",
    "public.claims",
    "public.tickets",
    "public.announcements",
  ];

  for (const table of requiredTables) {
    assert.ok(content.includes(`CREATE TABLE IF NOT EXISTS ${table}`), `Schema must define ${table}`);
    assert.ok(content.includes(`ADD TABLE ${table}`), `Schema must add ${table} to realtime publication`);
  }

  assert.ok(content.includes("CREATE INDEX IF NOT EXISTS idx_users_manager_id"), "Schema must index manager_id");
  assert.ok(content.includes("CREATE INDEX IF NOT EXISTS idx_users_tier"), "Schema must index tier");
  assert.ok(content.includes("USR-001"), "Schema must include seed data for USR-001");
  assert.ok(content.includes("USR-010"), "Schema must include seed data for USR-010");
});

// -------------------------------------------------------------
// 2. 5-TIER ORGANIZATIONAL HIERARCHY & RELATIONAL METHODS
// -------------------------------------------------------------
runTest("db.getUsers() returns all 10 seed users spanning Tiers 1 to 5", () => {
  db.resetDatabase();
  const users = db.getUsers();
  assert.equal(users.length, 10, "Should have exactly 10 initial users");

  const tiersPresent = new Set(users.map((u) => u.tier));
  assert.ok(tiersPresent.has(1), "Must have Tier 1 (Staff/Intern)");
  assert.ok(tiersPresent.has(2), "Must have Tier 2 (Senior Contributor)");
  assert.ok(tiersPresent.has(3), "Must have Tier 3 (Line Manager)");
  assert.ok(tiersPresent.has(4), "Must have Tier 4 (Director/VP)");
  assert.ok(tiersPresent.has(5), "Must have Tier 5 (CEO/Executive)");
});

runTest("db.getUserById and db.getUserByEmail return accurate records", () => {
  const ceo = db.getUserById("USR-001");
  assert.ok(ceo, "CEO record must exist");
  assert.equal(ceo.name, "Dr. Alexander Vance");
  assert.equal(ceo.tier, 5);
  assert.equal(ceo.role, "executive");

  const employee = db.getUserByEmail("employee@company.com");
  assert.ok(employee, "Employee must exist");
  assert.equal(employee.id, "USR-008");
  assert.equal(employee.tier, 1);
  assert.equal(employee.managerId, "USR-005");
});

runTest("db.getDirectReports correctly isolates subtrees by managerId", () => {
  // CEO direct reports: VP Eng (USR-002), VP HR (USR-003), Head of Finance (USR-004)
  const ceoReports = db.getDirectReports("USR-001");
  assert.equal(ceoReports.length, 3, "CEO should have 3 direct reports");
  const ceoReportIds = ceoReports.map((r) => r.id);
  assert.ok(ceoReportIds.includes("USR-002"));
  assert.ok(ceoReportIds.includes("USR-003"));
  assert.ok(ceoReportIds.includes("USR-004"));

  // VP Eng direct reports: Sarah Chen (USR-005), David Okonjo (USR-006)
  const vpEngReports = db.getDirectReports("USR-002");
  assert.equal(vpEngReports.length, 2, "VP Eng should have 2 direct reports");

  // Sarah Chen direct reports: Udeh (USR-008), Chidi (USR-009)
  const leadReports = db.getDirectReports("USR-005");
  assert.equal(leadReports.length, 2, "Sarah Chen should have 2 direct reports");
  const leadReportIds = leadReports.map((r) => r.id);
  assert.ok(leadReportIds.includes("USR-008"));
  assert.ok(leadReportIds.includes("USR-009"));

  // Tier 1 staff has 0 direct reports
  const staffReports = db.getDirectReports("USR-008");
  assert.equal(staffReports.length, 0, "Staff member should have 0 direct reports");
});

runTest("db.getOrgTree() constructs a complete hierarchical tree", () => {
  const tree = db.getOrgTree();
  assert.ok(tree, "Tree root must exist");
  assert.equal(tree.id, "USR-001");
  assert.equal(tree.tier, 5);
  assert.ok(Array.isArray(tree.directReports), "Root should have directReports array");
  assert.equal(tree.directReports.length, 3);

  // Check deeper nested node (VP Eng -> Leads -> Staff)
  const vpEngNode = tree.directReports.find((r) => r.id === "USR-002");
  assert.ok(vpEngNode, "VP Eng node must exist in tree");
  assert.equal(vpEngNode.directReports.length, 2);

  const sarahNode = vpEngNode.directReports.find((r) => r.id === "USR-005");
  assert.ok(sarahNode, "Sarah Chen node must exist in tree");
  assert.equal(sarahNode.directReports.length, 2);
  assert.equal(sarahNode.directReports[0].directReports.length, 0);
});

// -------------------------------------------------------------
// 3. MULTI-STAGE LEAVE APPROVAL & BALANCE DEDUCTION
// -------------------------------------------------------------
await runAsyncTest("db.approveLeave transitions status to Approved and auto-deducts exact days", async () => {
  db.resetDatabase();
  const initialUser = db.getUserById("USR-008");
  const initialAnnualBal = initialUser.annualLeaveBalance; // 14

  // Create a new 3-day annual leave
  const newLeave = await db.createLeave({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    type: "Annual Leave",
    dates: "2026-09-15 - 2026-09-18",
    days: 3,
    reason: "Rest and recovery",
  });

  assert.equal(newLeave.status, "Pending Manager");

  // Lead approves leave
  const approved = await db.approveLeave(newLeave.id, "USR-005", "Sarah Chen");
  assert.equal(approved.status, "Approved");
  assert.equal(approved.approverId, "USR-005");
  assert.equal(approved.approverName, "Sarah Chen");
  assert.ok(approved.approvedAt, "approvedAt timestamp must be set");

  // Verify employee's balance was automatically deducted
  const updatedUser = db.getUserById("USR-008");
  assert.equal(updatedUser.annualLeaveBalance, initialAnnualBal - 3, "Leave balance must be deducted by exact days");
});

await runAsyncTest("db.rejectLeave transitions status to Rejected without balance deduction", async () => {
  const initialUser = db.getUserById("USR-008");
  const initialAnnualBal = initialUser.annualLeaveBalance;

  const newLeave = await db.createLeave({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    type: "Annual Leave",
    dates: "2026-10-01 - 2026-10-05",
    days: 4,
    reason: "Conference attendance",
  });

  const rejected = await db.rejectLeave(newLeave.id, "USR-005", "Sarah Chen", "Overlapping release milestone");
  assert.equal(rejected.status, "Rejected");
  assert.equal(rejected.rejectionReason, "Overlapping release milestone");

  const checkUser = db.getUserById("USR-008");
  assert.equal(checkUser.annualLeaveBalance, initialAnnualBal, "Rejected leave must not deduct balance");
});

// -------------------------------------------------------------
// 4. 2-STAGE EXPENSE CLAIM WORKFLOW
// -------------------------------------------------------------
await runAsyncTest("Expense claim lifecycle: Pending Lead -> Pending Finance -> Approved", async () => {
  const newClaim = await db.createClaim({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    category: "Hardware Accessory",
    amount: "$120.00",
    description: "Ergonomic keyboard",
  });

  assert.equal(newClaim.status, "Pending Lead");

  // Stage 1: Team Lead Approval
  const stage1 = await db.approveClaimLead(newClaim.id, "USR-005", "Sarah Chen");
  assert.equal(stage1.status, "Pending Finance");
  assert.equal(stage1.leadApproverId, "USR-005");
  assert.equal(stage1.leadApproverName, "Sarah Chen");
  assert.ok(stage1.leadApprovedAt);

  // Stage 2: Finance Approval
  const stage2 = await db.approveClaimFinance(newClaim.id, "USR-004", "Marcus Brody");
  assert.equal(stage2.status, "Approved");
  assert.equal(stage2.financeApproverId, "USR-004");
  assert.equal(stage2.financeApproverName, "Marcus Brody");
  assert.ok(stage2.financeApprovedAt);
  assert.ok(stage2.payoutBatchId, "Payout batch ID must be assigned");
});

await runAsyncTest("db.rejectClaim records rejection reason and status", async () => {
  const newClaim = await db.createClaim({
    userId: "USR-008",
    name: "Udeh Kosisochukwu Emmanuel",
    department: "Engineering",
    managerId: "USR-005",
    category: "Meals",
    amount: "$250.00",
    description: "Team dinner",
  });

  const rejected = await db.rejectClaim(newClaim.id, "USR-005", "Sarah Chen", "Receipt illegible");
  assert.equal(rejected.status, "Rejected");
  assert.equal(rejected.rejectionReason, "Receipt illegible");
});

// -------------------------------------------------------------
// 5. DEPARTMENT BUDGETS & FUNCTIONAL ENTITIES
// -------------------------------------------------------------
runTest("db.getDepartmentBudget accurately computes allocation, spend, and utilization", () => {
  const engBudget = db.getDepartmentBudget("DEP-ENG");
  assert.ok(engBudget, "Engineering budget must be returned");
  assert.equal(engBudget.departmentName, "Engineering & Technology");
  assert.equal(engBudget.allocatedAmount, 42000);
  assert.ok(engBudget.spentAmount > 0, "Spend amount must be greater than 0");
  assert.ok(engBudget.remainingAmount <= engBudget.allocatedAmount);
  assert.ok(engBudget.budgetUtilization.includes("%"));
});

runTest("db.getAssets, db.getSprints, db.getTickets, db.getAnnouncements return operational records", () => {
  const assets = db.getAssets();
  assert.equal(assets.length, 5, "Should have 5 initial assets");
  const userAssets = db.getAssets("USR-008");
  assert.equal(userAssets.length, 1, "USR-008 has 1 assigned asset");

  const sprints = db.getSprints();
  assert.equal(sprints.length, 2, "Should have 2 sprints");

  const tickets = db.getTickets();
  assert.ok(tickets.length >= 1, "Should have tickets");

  const announcements = db.getAnnouncements();
  assert.equal(announcements.length, 2, "Should have 2 announcements");
});

// -------------------------------------------------------------
// 6. MONTHLY PAYROLL EXECUTION ENGINE
// -------------------------------------------------------------
runTest("db.calculatePayrollItem computes accurate statutory deductions and net pay", () => {
  const user = db.getUserById("USR-008"); // monthlyBasePay: 3500
  const item = db.calculatePayrollItem(user);

  assert.equal(item.gross, 3500);
  // PAYE: 3500 * 0.1143 = 400.05
  assert.equal(item.paye, 400.05);
  // Pension: 3500 * 0.08 = 280.00
  assert.equal(item.pension, 280.00);
  // HMO: 50.00
  assert.equal(item.hmo, 50.00);
  // Total Deductions: 400.05 + 280.00 + 50.00 = 730.05
  assert.equal(item.totalDeductions, 730.05);
  // Net: 3500 - 730.05 = 2769.95
  assert.equal(item.netPay, 2769.95);
  assert.equal(item.formattedGross, "$3,500.00");
  assert.equal(item.formattedNet, "$2,769.95");
});

runTest("db.executeMonthlyPayroll executes company-wide batch and stores record", () => {
  const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody (Head of Finance)", "August 2026");
  assert.ok(batch, "Payroll batch must be generated");
  assert.equal(batch.monthYear, "August 2026");
  assert.equal(batch.status, "Executed");
  assert.equal(batch.headcount, 10);
  assert.ok(batch.totalGross > 0);
  assert.ok(batch.totalNet > 0);
  assert.equal(batch.payslips.length, 10);

  const batches = db.getPayrollBatches();
  assert.equal(batches.length, 1);
  assert.equal(batches[0].id, batch.id);
});

// -------------------------------------------------------------
// 7. AUTHENTICATION SERVICE INTEGRATION
// -------------------------------------------------------------
await runAsyncTest("auth.login authenticates user and persists session", async () => {
  const session = await auth.login("ceo@company.com", "password123");
  assert.ok(session, "Session must exist");
  assert.ok(session.token.startsWith("mth_jwt_"));
  assert.equal(session.user.id, "USR-001");

  const current = auth.getCurrentSession();
  assert.ok(current, "Current session should be active");
  assert.equal(current.user.id, "USR-001");
});

await runAsyncTest("auth.register creates new Tier 1 account and session", async () => {
  const session = await auth.register({
    email: "new.hire@company.com",
    password: "password123",
    name: "Ada Lovelace",
    department: "Engineering",
    title: "Junior Backend Developer",
  });

  assert.ok(session, "Session for new user must exist");
  assert.equal(session.user.email, "new.hire@company.com");
  assert.equal(session.user.tier, 1);
  assert.equal(session.user.annualLeaveBalance, 20);

  const found = db.getUserByEmail("new.hire@company.com");
  assert.ok(found, "User should be in database");
});

// -------------------------------------------------------------
// 8. REALTIME SUBSCRIPTION HOOK
// -------------------------------------------------------------
runTest("db.subscribeToChanges returns unsubscribe function safely", () => {
  const unsubscribe = db.subscribeToChanges(() => {});
  assert.equal(typeof unsubscribe, "function", "Must return cleanup function");
  unsubscribe(); // Should not throw
});

console.log("=================================================");
console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED CLEANLY!`);
console.log("=================================================");
process.exit(0);
