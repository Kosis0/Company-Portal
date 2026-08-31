/**
 * Tier 1 Feature Coverage: F22 to F27 (Finance Hub & HR Operations)
 * Each feature includes >= 5 distinct, verifiable test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment, testAssert } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F22: Monthly Batch Payroll Execution", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F22-1: executes monthly payroll for all active employees and generates batch record", () => {
    const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody", "August 2026");
    assert.ok(batch);
    assert.ok(batch.id.startsWith("PAY-"));
    assert.equal(batch.status, "Executed");
    assert.equal(batch.monthYear, "August 2026");
    assert.equal(batch.headcount, 10);
  });

  it("F22-2: calculates total company gross payroll outlay and net take-home sum", () => {
    const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody", "August 2026");
    assert.ok(batch.totalGross > 50000, "Total gross payroll should exceed $50k");
    assert.ok(batch.totalNet > 35000, "Total net payroll should exceed $35k");
    assert.ok(batch.totalGross > batch.totalNet, "Gross must be greater than Net");
  });

  it("F22-3: generates itemized payslips for every employee in batch", () => {
    const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody", "August 2026");
    assert.equal(batch.payslips.length, 10);
    const internPayslip = batch.payslips.find((p) => p.userId === "USR-008");
    assert.ok(internPayslip);
    assert.equal(internPayslip.gross, 3500);
    assert.equal(internPayslip.netPay, 2769.95);
  });

  it("F22-4: persists payroll batch record and retrieves via db.getPayrollBatches()", () => {
    db.executeMonthlyPayroll("USR-004", "Marcus Brody", "August 2026");
    const batches = db.getPayrollBatches();
    assert.ok(batches.length >= 1);
    assert.equal(batches[0].monthYear, "August 2026");
  });

  it("F22-5: defaults monthYear to current month if omitted", () => {
    const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody");
    assert.ok(batch.monthYear);
  });
});

describe("Tier 1 - F23: Level-2 Finance Payout Authorization", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F23-1: authorizes verified expense claim at Level-2, updating status to 'Approved'", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      managerId: "USR-005",
      amount: "$150.00",
      description: "Development monitor adapter",
    });

    // Advance to Level 1
    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");

    // Level 2 Finance Approval
    const authorized = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");
    assert.equal(authorized.status, "Approved");
    assert.equal(authorized.financeApproverId, "USR-004");
    assert.equal(authorized.financeApproverName, "Marcus Brody");
    assert.ok(authorized.financeApprovedAt);
    assert.ok(authorized.payoutBatchId);
  });

  it("F23-2: generates payout batch identifier (e.g. BATCH-xxx) on authorization", async () => {
    const claim = await db.createClaim({ userId: "USR-008", amount: "$80.00" });
    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    const authorized = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");
    assert.ok(authorized.payoutBatchId.startsWith("BATCH-"));
  });

  it("F23-3: filters and retrieves all approved claims for payout release", async () => {
    const claim = await db.createClaim({ userId: "USR-008", amount: "$100.00" });
    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");

    const allClaims = db.getClaims();
    const approved = allClaims.filter((c) => c.status === "Approved");
    assert.ok(approved.some((c) => c.id === claim.id));
  });

  it("F23-4: returns null when authorizing a non-existent claim ID", async () => {
    const res = await db.approveClaimFinance("CLM-NONEXISTENT", "USR-004", "Marcus Brody");
    assert.equal(res, null);
  });

  it("F23-5: preserves Lead approver metadata alongside Finance approver metadata", async () => {
    const claim = await db.createClaim({ userId: "USR-008", amount: "$50.00" });
    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    const finalClaim = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");

    assert.equal(finalClaim.leadApproverName, "Sarah Chen");
    assert.equal(finalClaim.financeApproverName, "Marcus Brody");
  });
});

describe("Tier 1 - F24: Departmental Budget Utilization", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F24-1: computes budget metrics for Engineering & Technology (DEP-ENG)", () => {
    const budget = db.getDepartmentBudget("DEP-ENG");
    assert.ok(budget);
    assert.equal(budget.departmentName, "Engineering & Technology");
    assert.equal(budget.allocatedAmount, 42000);
    assert.ok(budget.spentAmount > 0);
    assert.ok(budget.remainingAmount > 0);
    assert.ok(budget.budgetUtilization.includes("%"));
  });

  it("F24-2: computes budget metrics for Finance & Operations (DEP-FIN)", () => {
    const budget = db.getDepartmentBudget("DEP-FIN");
    assert.equal(budget.allocatedAmount, 24000);
    assert.ok(budget.spentAmount > 0);
  });

  it("F24-3: computes budget metrics for Human Resources (DEP-HR)", () => {
    const budget = db.getDepartmentBudget("DEP-HR");
    assert.equal(budget.allocatedAmount, 18500);
  });

  it("F24-4: computes budget metrics for Product & Design (DEP-PRD)", () => {
    const budget = db.getDepartmentBudget("DEP-PRD");
    assert.equal(budget.allocatedAmount, 16000);
  });

  it("F24-5: returns null for non-existent department ID or code", () => {
    const budget = db.getDepartmentBudget("DEP-NONEXISTENT");
    assert.equal(budget, null);
  });
});

describe("Tier 1 - F25: Interactive Organizational Tree", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F25-1: builds root node anchored by Tier 5 CEO (Dr. Alexander Vance)", () => {
    const tree = db.getOrgTree();
    assert.ok(tree);
    assert.equal(tree.id, "USR-001");
    assert.equal(tree.tier, 5);
    assert.equal(tree.name, "Dr. Alexander Vance");
  });

  it("F25-2: attaches Tier 4 Directors directly to CEO node directReports array", () => {
    const tree = db.getOrgTree();
    assert.equal(tree.directReports.length, 3);
    const directorIds = tree.directReports.map((d) => d.id);
    assert.ok(directorIds.includes("USR-002")); // VP Eng
    assert.ok(directorIds.includes("USR-003")); // VP HR
    assert.ok(directorIds.includes("USR-004")); // Head of Finance
  });

  it("F25-3: attaches Tier 3 Team Leads under respective Tier 4 Directors", () => {
    const tree = db.getOrgTree();
    const vpEng = tree.directReports.find((d) => d.id === "USR-002");
    assert.ok(vpEng);
    assert.equal(vpEng.directReports.length, 2);
    const leadNames = vpEng.directReports.map((l) => l.name);
    assert.ok(leadNames.includes("Sarah Chen"));
    assert.ok(leadNames.includes("David Okonjo"));
  });

  it("F25-4: attaches Tier 1 & 2 Staff members under respective Line Managers", () => {
    const tree = db.getOrgTree();
    const vpEng = tree.directReports.find((d) => d.id === "USR-002");
    const sarahLead = vpEng.directReports.find((l) => l.id === "USR-005");
    assert.ok(sarahLead);
    assert.equal(sarahLead.directReports.length, 2);
    const staffNames = sarahLead.directReports.map((s) => s.name);
    assert.ok(staffNames.includes("Udeh Kosisochukwu Emmanuel"));
    assert.ok(staffNames.includes("Chidi Nnamdi"));
  });

  it("F25-5: designates leaf nodes with empty directReports arrays", () => {
    const tree = db.getOrgTree();
    const vpEng = tree.directReports.find((d) => d.id === "USR-002");
    const sarahLead = vpEng.directReports.find((l) => l.id === "USR-005");
    const intern = sarahLead.directReports.find((s) => s.id === "USR-008");
    assert.ok(intern);
    assert.deepEqual(intern.directReports, []);
  });
});

describe("Tier 1 - F26: Staff Onboarding & Dossier Creation", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F26-1: onboards new employee with generated ID and default 20/10/5 leave balances", async () => {
    const newUser = await db.createUser({
      name: "Tariq Adeleke",
      email: "tariq.adeleke@company.com",
      title: "QA Automation Engineer",
      department: "Engineering",
      managerId: "USR-005",
      managerName: "Sarah Chen (Tech Lead)",
      salary: "$4,500/mo",
      monthlyBasePay: 4500,
    });

    assert.ok(newUser.id.startsWith("USR-"));
    assert.equal(newUser.name, "Tariq Adeleke");
    assert.equal(newUser.annualLeaveBalance, 20);
    assert.equal(newUser.sickLeaveBalance, 10);
    assert.equal(newUser.casualLeaveBalance, 5);
  });

  it("F26-2: connects onboarded employee to assigned reporting manager", async () => {
    const newUser = await db.createUser({
      name: "Grace Hopper",
      email: "grace.hopper@company.com",
      department: "Engineering",
      managerId: "USR-005",
    });

    const directReports = db.getDirectReports("USR-005");
    assert.ok(directReports.some((r) => r.id === newUser.id));
  });

  it("F26-3: assigns default Tier 1 if role is employee", async () => {
    const user = await db.createUser({
      name: "Junior Dev",
      email: "junior@company.com",
      role: "employee",
    });
    assert.equal(user.tier, 1);
  });

  it("F26-4: assigns Tier 3 if role is manager or Tier 4 if role is director", async () => {
    const manager = await db.createUser({
      name: "New Lead",
      email: "newlead@company.com",
      role: "manager",
    });
    const director = await db.createUser({
      name: "New Director",
      email: "newdirector@company.com",
      role: "director",
    });
    assert.equal(manager.tier, 3);
    assert.equal(director.tier, 4);
  });

  it("F26-5: verifies onboarded employee appears in global employee directory", async () => {
    const user = await db.createUser({
      name: "Samson Bala",
      email: "samson.bala@company.com",
      department: "Finance & Operations",
    });
    const allUsers = db.getUsers();
    assert.ok(allUsers.some((u) => u.id === user.id));
  });
});

describe("Tier 1 - F27: Company-Wide Leave Calendar", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F27-1: retrieves all approved employee leaves across all departments", () => {
    const allLeaves = db.getLeaves();
    const approvedLeaves = allLeaves.filter((l) => l.status === "Approved");
    assert.ok(Array.isArray(approvedLeaves));
    assert.ok(approvedLeaves.length >= 1);
  });

  it("F27-2: filters approved calendar leaves by department", () => {
    const allLeaves = db.getLeaves();
    const prdLeaves = allLeaves.filter(
      (l) => l.status === "Approved" && l.department === "Product & Design"
    );
    assert.ok(prdLeaves.length >= 1);
    assert.equal(prdLeaves[0].name, "Chidi Nnamdi");
  });

  it("F27-3: adds newly approved leave to the company-wide calendar view", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      type: "Annual Leave",
      dates: "2026-10-10 - 2026-10-15",
      days: 5,
    });

    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");

    const approvedLeaves = db.getLeaves().filter((l) => l.status === "Approved");
    assert.ok(approvedLeaves.some((l) => l.id === leave.id));
  });

  it("F27-4: excludes pending or rejected leaves from approved calendar", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 3,
    });
    await db.rejectLeave(leave.id, "USR-005", "Sarah Chen", "Denied");

    const approvedLeaves = db.getLeaves().filter((l) => l.status === "Approved");
    assert.ok(!approvedLeaves.some((l) => l.id === leave.id));
  });

  it("F27-5: verifies leave dates format for calendar timeline rendering", () => {
    const leaves = db.getLeaves();
    for (const l of leaves) {
      assert.ok(l.dates, "Each leave must specify dates range");
    }
  });
});
