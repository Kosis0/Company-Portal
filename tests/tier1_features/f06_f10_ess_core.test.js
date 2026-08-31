/**
 * Tier 1 Feature Coverage: F06 to F10 (ESS Core Capabilities)
 * Each feature includes >= 5 distinct, verifiable test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F06: Real-Time Shift Clock In/Out", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F06-1: creates a new clock-in attendance record with timestamp and status", async () => {
    const record = await db.addAttendance({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      date: "2026-08-31",
      in: "08:45 AM",
      out: "—",
      hours: "In Progress",
      location: "Port Harcourt Office",
      status: "On Time",
    });

    assert.ok(record.id.startsWith("ATT-"));
    assert.equal(record.status, "On Time");
    assert.equal(record.hours, "In Progress");
  });

  it("F06-2: updates existing clock-in record with out-time and calculated duration upon clock-out", async () => {
    const record = await db.addAttendance({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      date: "2026-08-31",
      in: "08:30 AM",
      out: "—",
      hours: "In Progress",
      location: "Port Harcourt Office",
      status: "On Time",
    });

    const updated = await db.updateAttendance(record.id, {
      out: "05:30 PM",
      hours: "9h 00m",
      status: "Present",
    });

    assert.equal(updated.out, "05:30 PM");
    assert.equal(updated.hours, "9h 00m");
    assert.equal(updated.status, "Present");
  });

  it("F06-3: retrieves personal attendance history filtered by userId", () => {
    const history = db.getAttendance("USR-008");
    assert.ok(Array.isArray(history));
    assert.ok(history.length >= 1);
    for (const item of history) {
      assert.equal(item.userId, "USR-008");
    }
  });

  it("F06-4: isolates attendance records between different users", () => {
    const user8Records = db.getAttendance("USR-008");
    const user9Records = db.getAttendance("USR-009");
    assert.ok(user8Records.every((r) => r.userId === "USR-008"));
    assert.ok(user9Records.every((r) => r.userId === "USR-009"));
  });

  it("F06-5: returns null when updating a non-existent attendance record", async () => {
    const result = await db.updateAttendance("ATT-NONEXISTENT", { out: "06:00 PM" });
    assert.equal(result, null);
  });
});

describe("Tier 1 - F07: Leave Balance Countdown", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F07-1: retrieves accurate initial leave balances for Annual, Sick, and Casual tracks", () => {
    const user = db.getUserById("USR-008");
    assert.equal(user.annualLeaveBalance, 14);
    assert.equal(user.sickLeaveBalance, 8);
    assert.equal(user.casualLeaveBalance, 4);
  });

  it("F07-2: accurately calculates total remaining leave days available across all categories", () => {
    const user = db.getUserById("USR-008");
    const totalRemaining = user.annualLeaveBalance + user.sickLeaveBalance + user.casualLeaveBalance;
    assert.equal(totalRemaining, 26);
  });

  it("F07-3: decrements annualLeaveBalance upon Annual Leave approval", async () => {
    const initialUser = db.getUserById("USR-008");
    const initialAnnual = initialUser.annualLeaveBalance;

    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      type: "Annual Leave",
      dates: "2026-09-01 - 2026-09-05",
      days: 5,
      reason: "Rest",
    });

    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    const updatedUser = db.getUserById("USR-008");
    assert.equal(updatedUser.annualLeaveBalance, initialAnnual - 5);
  });

  it("F07-4: leaves sickLeaveBalance and casualLeaveBalance untouched when Annual Leave is taken", async () => {
    const initialUser = db.getUserById("USR-008");
    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      type: "Annual Leave",
      dates: "2026-09-10 - 2026-09-11",
      days: 2,
      reason: "Short break",
    });

    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    const updatedUser = db.getUserById("USR-008");
    assert.equal(updatedUser.sickLeaveBalance, initialUser.sickLeaveBalance);
    assert.equal(updatedUser.casualLeaveBalance, initialUser.casualLeaveBalance);
  });

  it("F07-5: clamps balance at 0 if deducted days exceed remaining balance", async () => {
    const user = db.getUserById("USR-008");
    await db.updateUser(user.id, { annualLeaveBalance: 2 });

    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      type: "Annual Leave",
      dates: "2026-09-10 - 2026-09-15",
      days: 5,
      reason: "Emergency extended leave",
    });

    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    const updatedUser = db.getUserById("USR-008");
    assert.equal(updatedUser.annualLeaveBalance, 0, "Balance must clamp at 0 and not become negative");
  });
});

describe("Tier 1 - F08: Leave Application Submission", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F08-1: submits new leave application with default status 'Pending Manager'", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      type: "Annual Leave",
      dates: "2026-09-20 - 2026-09-24",
      days: 4,
      reason: "Annual holiday",
    });

    assert.ok(leave.id.startsWith("LV-"));
    assert.equal(leave.status, "Pending Manager");
    assert.equal(leave.days, 4);
    assert.ok(leave.appliedOn);
  });

  it("F08-2: correctly captures and persists leave category (Sick, Casual, Annual)", async () => {
    const sickLeave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      type: "Sick Leave",
      dates: "2026-09-02 - 2026-09-03",
      days: 2,
      reason: "Flu recovery",
    });
    assert.equal(sickLeave.type, "Sick Leave");
  });

  it("F08-3: retrieves user's submitted leaves via db.getLeaves(userId)", async () => {
    await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      type: "Casual Leave",
      dates: "2026-09-18",
      days: 1,
      reason: "Personal appointment",
    });

    const userLeaves = db.getLeaves("USR-008");
    assert.ok(userLeaves.some((l) => l.reason === "Personal appointment"));
  });

  it("F08-4: generates unique IDs for successive leave applications", async () => {
    const l1 = await db.createLeave({ userId: "USR-008", name: "User", days: 1 });
    const l2 = await db.createLeave({ userId: "USR-008", name: "User", days: 2 });
    assert.notEqual(l1.id, l2.id);
  });

  it("F08-5: maintains submission order with newest applications accessible first", async () => {
    const l1 = await db.createLeave({ userId: "USR-008", name: "User", reason: "First" });
    const l2 = await db.createLeave({ userId: "USR-008", name: "User", reason: "Second" });
    const leaves = db.getLeaves();
    const firstIndex = leaves.findIndex((l) => l.id === l1.id);
    const secondIndex = leaves.findIndex((l) => l.id === l2.id);
    assert.ok(secondIndex < firstIndex, "Newer application must appear earlier in list");
  });
});

describe("Tier 1 - F09: Itemized Payslip Breakdown", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F09-1: calculates accurate statutory deductions (PAYE 11.43%, Pension 8%, HMO $50)", () => {
    const user = { id: "TEST-01", monthlyBasePay: 3500, salary: "$3,500/mo" };
    const item = db.calculatePayrollItem(user);

    assert.equal(item.gross, 3500);
    assert.equal(item.paye, 400.05);
    assert.equal(item.pension, 280.00);
    assert.equal(item.hmo, 50.00);
    assert.equal(item.totalDeductions, 730.05);
    assert.equal(item.netPay, 2769.95);
  });

  it("F09-2: calculates higher bracket director salary itemized deductions correctly", () => {
    const vpEng = { id: "USR-002", monthlyBasePay: 9800, salary: "$9,800/mo" };
    const item = db.calculatePayrollItem(vpEng);

    assert.equal(item.gross, 9800);
    assert.equal(item.paye, 1120.14);
    assert.equal(item.pension, 784.00);
    assert.equal(item.hmo, 50.00);
    assert.equal(item.netPay, 7845.86);
  });

  it("F09-3: formats gross and net pay with currency signs and comma grouping", () => {
    const user = { id: "TEST-02", monthlyBasePay: 5000, salary: "$5,000/mo" };
    const item = db.calculatePayrollItem(user);
    assert.equal(item.formattedGross, "$5,000.00");
    assert.ok(item.formattedNet.startsWith("$"));
  });

  it("F09-4: handles executive salary calculation accurately ($18,500)", () => {
    const ceo = { id: "USR-001", monthlyBasePay: 18500, salary: "$18,500/mo" };
    const item = db.calculatePayrollItem(ceo);
    assert.equal(item.gross, 18500);
    assert.equal(item.paye, 2114.55);
    assert.equal(item.pension, 1480.00);
    assert.equal(item.netPay, 14855.45);
  });

  it("F09-5: falls back gracefully if monthlyBasePay is not explicitly set", () => {
    const user = { id: "TEST-03", salary: "$4,000/mo" };
    const item = db.calculatePayrollItem(user);
    assert.equal(item.gross, 4000);
    assert.ok(item.netPay > 0);
  });
});

describe("Tier 1 - F10: Out-of-Pocket Expense Filing", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F10-1: files expense reimbursement claim with default status 'Pending Lead'", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      category: "Internet & Remote Work",
      amount: "$150.00",
      description: "Fiber optic internet bill",
      receipt: "fiber_bill.pdf",
    });

    assert.ok(claim.id.startsWith("CLM-"));
    assert.equal(claim.status, "Pending Lead");
    assert.equal(claim.amount, "$150.00");
    assert.equal(claim.receipt, "fiber_bill.pdf");
  });

  it("F10-2: attaches default receipt placeholder if receipt is omitted", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      category: "Software Asset",
      amount: "$45.00",
      description: "Plugin license",
    });
    assert.ok(claim.receipt, "Must assign default receipt placeholder");
  });

  it("F10-3: retrieves user's claims filtered by userId", () => {
    const userClaims = db.getClaims("USR-008");
    assert.ok(Array.isArray(userClaims));
    assert.ok(userClaims.every((c) => c.userId === "USR-008"));
  });

  it("F10-4: supports multiple corporate expense categories", async () => {
    const c1 = await db.createClaim({ userId: "USR-008", category: "Hardware Accessory", amount: "$80.00" });
    const c2 = await db.createClaim({ userId: "USR-008", category: "Meals & Entertainment", amount: "$60.00" });
    assert.equal(c1.category, "Hardware Accessory");
    assert.equal(c2.category, "Meals & Entertainment");
  });

  it("F10-5: retrieves specific claim by ID via db.getClaimById", async () => {
    const created = await db.createClaim({
      userId: "USR-008",
      category: "Travel",
      amount: "$200.00",
      description: "Flight booking",
    });
    const fetched = db.getClaimById(created.id);
    assert.ok(fetched);
    assert.equal(fetched.id, created.id);
    assert.equal(fetched.description, "Flight booking");
  });
});
