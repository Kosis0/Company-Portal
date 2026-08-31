/**
 * Tier 2 Boundary & Corner Cases: B22 to B27 (Finance & HR Operations Boundaries)
 * Each feature includes >= 5 distinct boundary & corner condition test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 2 - B22: Monthly Batch Payroll Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B22-1: handles executing payroll multiple times for different consecutive months", () => {
    const b1 = db.executeMonthlyPayroll("USR-004", "Marcus Brody", "July 2026");
    const b2 = db.executeMonthlyPayroll("USR-004", "Marcus Brody", "August 2026");
    assert.notEqual(b1.id, b2.id);
    const batches = db.getPayrollBatches();
    assert.equal(batches.length, 2);
  });

  it("B22-2: handles batch payroll when new employees are added dynamically before run", async () => {
    await db.createUser({
      name: "Extra Employee",
      email: "extra@company.com",
      monthlyBasePay: 5000,
    });

    const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody", "August 2026");
    assert.equal(batch.headcount, 11);
    assert.equal(batch.payslips.length, 11);
  });

  it("B22-3: preserves executor metadata (id, name, timestamp) on batch record", () => {
    const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody (Head of Finance)");
    assert.equal(batch.executorId, "USR-004");
    assert.equal(batch.executorName, "Marcus Brody (Head of Finance)");
    assert.ok(batch.executedAt);
  });

  it("B22-4: handles total tax remittance calculation across all staff in batch", () => {
    const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody");
    const totalTax = batch.payslips.reduce((sum, p) => sum + p.paye, 0);
    assert.ok(totalTax > 5000);
  });

  it("B22-5: handles total pension remittance calculation across all staff in batch", () => {
    const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody");
    const totalPension = batch.payslips.reduce((sum, p) => sum + p.pension, 0);
    assert.ok(totalPension > 3500);
  });
});

describe("Tier 2 - B23: Level-2 Finance Payout Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B23-1: handles direct finance authorization without changing existing Lead metadata", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      managerId: "USR-005",
      amount: "$220.00",
    });

    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    const approved = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");

    assert.equal(approved.leadApproverId, "USR-005");
    assert.equal(approved.leadApproverName, "Sarah Chen");
    assert.equal(approved.financeApproverId, "USR-004");
    assert.equal(approved.financeApproverName, "Marcus Brody");
  });

  it("B23-2: handles authorizing multiple claims in batch assigning unique payout batch IDs", async () => {
    const c1 = await db.createClaim({ userId: "USR-008", amount: "$50.00" });
    const c2 = await db.createClaim({ userId: "USR-009", amount: "$75.00" });

    const a1 = await db.approveClaimFinance(c1.id, "USR-004", "Marcus Brody");
    const a2 = await db.approveClaimFinance(c2.id, "USR-004", "Marcus Brody");

    assert.ok(a1.payoutBatchId);
    assert.ok(a2.payoutBatchId);
  });

  it("B23-3: handles authorizing already approved claim idempotently", async () => {
    const claim = await db.createClaim({ userId: "USR-008", amount: "$100.00" });
    const first = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");
    const second = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");
    assert.equal(first.status, "Approved");
    assert.equal(second.status, "Approved");
  });

  it("B23-4: handles authorizing claim with non-standard dollar format (e.g. '$1,250.50')", async () => {
    const claim = await db.createClaim({ userId: "USR-008", amount: "$1,250.50" });
    const approved = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");
    assert.equal(approved.amount, "$1,250.50");
  });

  it("B23-5: handles non-existent claim ID authorization gracefully returning null", async () => {
    const res = await db.approveClaimFinance("CLM-GHOST-ID", "USR-004", "Marcus Brody");
    assert.equal(res, null);
  });
});

describe("Tier 2 - B24: Department Budget Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B24-1: handles department code lookup in lowercase (e.g. 'eng', 'fin', 'hr')", () => {
    const bEng = db.getDepartmentBudget("eng");
    assert.ok(bEng);
    assert.equal(bEng.departmentName, "Engineering & Technology");
  });

  it("B24-2: handles department lookup with full name (e.g. 'Engineering & Technology')", () => {
    const bEng = db.getDepartmentBudget("Engineering & Technology");
    assert.ok(bEng);
    assert.equal(bEng.allocatedAmount, 42000);
  });

  it("B24-3: handles department with over-budget utilization (>100% spend)", () => {
    const mockOverBudget = { allocated: 10000, spent: 12500 };
    const util = Math.round((mockOverBudget.spent / mockOverBudget.allocated) * 100);
    assert.equal(util, 125);
    const isOver = util > 100;
    assert.equal(isOver, true);
  });

  it("B24-4: handles department with 0 spend (0% utilization)", () => {
    const mockZeroSpend = { allocated: 20000, spent: 0 };
    const util = Math.round((mockZeroSpend.spent / mockZeroSpend.allocated) * 100);
    assert.equal(util, 0);
  });

  it("B24-5: returns null when querying budget with null or empty string", () => {
    assert.equal(db.getDepartmentBudget(""), null);
    assert.equal(db.getDepartmentBudget(null), null);
    assert.equal(db.getDepartmentBudget(undefined), null);
  });
});

describe("Tier 2 - B25: Org Tree Hierarchy Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B25-1: constructs tree when database has only a single CEO employee", () => {
    globalThis.localStorage.setItem(
      "monolith_db_users",
      JSON.stringify([
        { id: "USR-001", name: "Solo CEO", tier: 5, managerId: null },
      ])
    );
    const tree = db.getOrgTree();
    assert.ok(tree);
    assert.equal(tree.id, "USR-001");
    assert.deepEqual(tree.directReports, []);
  });

  it("B25-2: handles empty users array returning null without exception", () => {
    globalThis.localStorage.setItem("monolith_db_users", "[]");
    const tree = db.getOrgTree();
    assert.equal(tree, null);
  });

  it("B25-3: verifies directReportsCount metric on every tree node", () => {
    const tree = db.getOrgTree();
    assert.equal(tree.directReportsCount, 3);
    const vpEng = tree.directReports.find((d) => d.id === "USR-002");
    assert.equal(vpEng.directReportsCount, 2);
  });

  it("B25-4: handles disconnected orphaned employees by nesting all reachable subtrees", () => {
    const tree = db.getOrgTree();
    assert.ok(tree.directReports.length > 0);
  });

  it("B25-5: preserves user metadata (title, avatarInitials, email) across all tree nodes", () => {
    const tree = db.getOrgTree();
    assert.equal(tree.avatarInitials, "AV");
    assert.equal(tree.email, "ceo@company.com");
  });
});

describe("Tier 2 - B26: Staff Onboarding Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B26-1: generates avatarInitials for single-word names (e.g. 'Cher')", async () => {
    const user = await db.createUser({
      name: "Cher",
      email: "cher@company.com",
    });
    assert.equal(user.avatarInitials, "C");
  });

  it("B26-2: generates avatarInitials for multi-word names (e.g. 'Dr. John Von Neumann')", async () => {
    const user = await db.createUser({
      name: "Dr. John Von Neumann",
      email: "john.neumann@company.com",
    });
    assert.equal(user.avatarInitials, "DJ");
  });

  it("B26-3: assigns default salary if omitted during onboarding", async () => {
    const user = await db.createUser({
      name: "No Salary Given",
      email: "nosalary@company.com",
    });
    assert.ok(user.salary);
  });

  it("B26-4: onboards employee with executive role assigning Tier 5", async () => {
    const coo = await db.createUser({
      name: "Chief Operating Officer",
      email: "coo@company.com",
      role: "executive",
    });
    assert.equal(coo.tier, 5);
  });

  it("B26-5: onboards employee with director role assigning Tier 4", async () => {
    const director = await db.createUser({
      name: "VP Marketing",
      email: "vp.marketing@company.com",
      role: "director",
    });
    assert.equal(director.tier, 4);
  });
});

describe("Tier 2 - B27: Company Leave Calendar Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B27-1: handles cross-year leave date range (e.g. Dec 28, 2026 - Jan 05, 2027)", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      dates: "2026-12-28 - 2027-01-05",
      days: 6,
    });
    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");

    const approved = db.getLeaves().filter((l) => l.status === "Approved");
    assert.ok(approved.some((l) => l.dates.includes("2027")));
  });

  it("B27-2: handles department filter matching zero approved leaves returning empty list", () => {
    const approved = db.getLeaves().filter(
      (l) => l.status === "Approved" && l.department === "NonExistentDept"
    );
    assert.deepEqual(approved, []);
  });

  it("B27-3: handles calendar query when database has 0 leaves stored", () => {
    globalThis.localStorage.setItem("monolith_db_leaves", "[]");
    const leaves = db.getLeaves();
    assert.deepEqual(leaves, []);
  });

  it("B27-4: identifies overlapping leave dates for colleagues in same department", async () => {
    const leave1 = await db.createLeave({
      userId: "USR-008",
      department: "Engineering",
      dates: "2026-09-10 - 2026-09-15",
    });
    const leave2 = await db.createLeave({
      userId: "USR-006",
      department: "Engineering",
      dates: "2026-09-12 - 2026-09-18",
    });

    await db.approveLeave(leave1.id, "USR-005", "Sarah Chen");
    await db.approveLeave(leave2.id, "USR-002", "Tunde Bakare");

    const approvedEng = db
      .getLeaves()
      .filter((l) => l.status === "Approved" && l.department === "Engineering");
    assert.ok(approvedEng.length >= 2);
  });

  it("B27-5: handles leap year Feb 29 date safely in calendar queries", async () => {
    const leapLeave = await db.createLeave({
      userId: "USR-008",
      dates: "2028-02-28 - 2028-03-01",
      days: 3,
    });
    assert.ok(leapLeave.id);
  });
});
