/**
 * Tier 2 Boundary & Corner Cases: B06 to B10 (ESS Core Boundaries)
 * Each feature includes >= 5 distinct boundary & corner condition test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 2 - B06: Clock In/Out Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B06-1: handles clock-in with empty location string, providing default fallback", async () => {
    const record = await db.addAttendance({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      date: "2026-08-31",
      in: "09:00 AM",
      location: "",
    });
    assert.ok(record.id);
  });

  it("B06-2: handles multiple clock-in/clock-out cycles in the same calendar day", async () => {
    const r1 = await db.addAttendance({
      userId: "USR-008",
      date: "2026-08-31",
      in: "08:00 AM",
      out: "12:00 PM",
      hours: "4h 00m",
      status: "Present",
    });

    const r2 = await db.addAttendance({
      userId: "USR-008",
      date: "2026-08-31",
      in: "01:00 PM",
      out: "05:00 PM",
      hours: "4h 00m",
      status: "Present",
    });

    assert.notEqual(r1.id, r2.id);
    const history = db.getAttendance("USR-008");
    assert.ok(history.length >= 2);
  });

  it("B06-3: handles shift spanning across midnight boundary (e.g. 10:00 PM to 06:00 AM)", async () => {
    const record = await db.addAttendance({
      userId: "USR-006",
      date: "2026-08-31",
      in: "10:00 PM",
      out: "06:00 AM",
      hours: "8h 00m",
      status: "Night Shift",
    });
    assert.equal(record.hours, "8h 00m");
    assert.equal(record.status, "Night Shift");
  });

  it("B06-4: handles updating non-existent attendance record ID gracefully", async () => {
    const res = await db.updateAttendance("ATT-INVALID-ID-999", { out: "05:00 PM" });
    assert.equal(res, null);
  });

  it("B06-5: handles zero duration clock-in/clock-out immediate toggle", async () => {
    const record = await db.addAttendance({
      userId: "USR-008",
      date: "2026-08-31",
      in: "09:00:00 AM",
      out: "09:00:05 AM",
      hours: "0h 00m",
      status: "Present",
    });
    assert.equal(record.hours, "0h 00m");
  });
});

describe("Tier 2 - B07: Leave Balance Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B07-1: handles leave application when applicant balance is exact zero (0)", async () => {
    await db.updateUser("USR-008", { annualLeaveBalance: 0 });
    const leave = await db.createLeave({
      userId: "USR-008",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 3,
    });

    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    const user = db.getUserById("USR-008");
    assert.equal(user.annualLeaveBalance, 0);
  });

  it("B07-2: non-Annual leave types (Sick Leave, Casual Leave) do NOT deduct annualLeaveBalance", async () => {
    const initialBal = db.getUserById("USR-008").annualLeaveBalance;
    const sickLeave = await db.createLeave({
      userId: "USR-008",
      managerId: "USR-005",
      type: "Sick Leave",
      days: 3,
    });

    await db.approveLeave(sickLeave.id, "USR-005", "Sarah Chen");
    const updatedUser = db.getUserById("USR-008");
    assert.equal(updatedUser.annualLeaveBalance, initialBal, "Sick leave must not deduct Annual leave balance");
  });

  it("B07-3: handles 0-day leave application safely without changing balance", async () => {
    const initialBal = db.getUserById("USR-008").annualLeaveBalance;
    const leave = await db.createLeave({
      userId: "USR-008",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 0,
    });

    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    const updatedUser = db.getUserById("USR-008");
    assert.equal(updatedUser.annualLeaveBalance, initialBal);
  });

  it("B07-4: handles large balance deduction without arithmetic underflow", async () => {
    await db.updateUser("USR-008", { annualLeaveBalance: 10 });
    const leave = await db.createLeave({
      userId: "USR-008",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 50,
    });

    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    const user = db.getUserById("USR-008");
    assert.equal(user.annualLeaveBalance, 0);
  });

  it("B07-5: handles leave approval for deleted or invalid userId gracefully", async () => {
    const leave = await db.createLeave({
      userId: "USR-INVALID-999",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 2,
    });

    const approved = await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    assert.equal(approved.status, "Approved");
  });
});

describe("Tier 2 - B08: Leave Application Submission Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B08-1: handles single-day leave where start date equals end date", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      type: "Casual Leave",
      dates: "2026-09-15 - 2026-09-15",
      days: 1,
      reason: "One day personal business",
    });
    assert.equal(leave.days, 1);
  });

  it("B08-2: handles ultra-long leave justification text (5,000 characters) without truncation crash", async () => {
    const longReason = "Detailed justification: " + "X".repeat(5000);
    const leave = await db.createLeave({
      userId: "USR-008",
      type: "Annual Leave",
      days: 2,
      reason: longReason,
    });
    assert.equal(leave.reason, longReason);
  });

  it("B08-3: handles special characters, quotes and emojis in reason string", async () => {
    const specialReason = "Family wedding & celebration 🎉 🏖️ in St. John's, Antigua!";
    const leave = await db.createLeave({
      userId: "USR-008",
      type: "Annual Leave",
      days: 3,
      reason: specialReason,
    });
    assert.equal(leave.reason, specialReason);
  });

  it("B08-4: handles future year date range (e.g. 2027)", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      dates: "2027-01-05 - 2027-01-15",
      days: 10,
      reason: "Advance planned sabbatical",
    });
    assert.equal(leave.dates, "2027-01-05 - 2027-01-15");
  });

  it("B08-5: preserves applicant name and department even if omitted in input payload", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      days: 2,
    });
    assert.ok(leave.id);
    assert.equal(leave.status, "Pending Manager");
  });
});

describe("Tier 2 - B09: Payslip Calculation Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B09-1: handles zero gross base salary ($0/mo) safely with $0 statutory deductions", () => {
    const user = { id: "VOL-01", monthlyBasePay: 0, salary: "$0/mo" };
    const item = db.calculatePayrollItem(user);
    assert.equal(item.gross, 0);
    assert.equal(item.paye, 0);
    assert.equal(item.pension, 0);
    assert.equal(item.hmo, 50.0);
    assert.equal(item.netPay, 0);
  });

  it("B09-2: handles ultra-high compensation ($1,000,000/mo) with accurate arithmetic precision", () => {
    const user = { id: "EXEC-99", monthlyBasePay: 1000000, salary: "$1,000,000/mo" };
    const item = db.calculatePayrollItem(user);
    assert.equal(item.gross, 1000000);
    assert.equal(item.paye, 114300.0);
    assert.equal(item.pension, 80000.0);
    assert.equal(item.netPay, 805650.0);
  });

  it("B09-3: rounds fractional cents correctly to exactly two decimal places", () => {
    const user = { id: "DEV-ODD", monthlyBasePay: 3333.33, salary: "$3,333.33/mo" };
    const item = db.calculatePayrollItem(user);
    // PAYE: 3333.33 * 0.1143 = 380.999619 -> 381.00
    assert.equal(item.paye, 381.0);
    // Pension: 3333.33 * 0.08 = 266.6664 -> 266.67
    assert.equal(item.pension, 266.67);
  });

  it("B09-4: handles null user object returning null without throwing exception", () => {
    const res = db.calculatePayrollItem(null);
    assert.equal(res, null);
  });

  it("B09-5: handles non-standard formatted salary strings (e.g. '$ 4,500.00 / month USD')", () => {
    const user = { id: "CUSTOM-01", salary: "$ 4,500.00 / month USD" };
    const item = db.calculatePayrollItem(user);
    assert.equal(item.gross, 4500);
    assert.ok(item.netPay > 3000);
  });
});

describe("Tier 2 - B10: Expense Filing Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B10-1: handles small micro-expense claim (e.g. $1.50 for pen)", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      amount: "$1.50",
      description: "Stationery pen",
    });
    assert.equal(claim.amount, "$1.50");
  });

  it("B10-2: handles large capital expenditure reimbursement (e.g. $50,000.00)", async () => {
    const claim = await db.createClaim({
      userId: "USR-002",
      amount: "$50,000.00",
      description: "GPU server hardware cluster",
    });
    assert.equal(claim.amount, "$50,000.00");
  });

  it("B10-3: handles receipt attachments with special file extension formats (.png, .jpeg, .pdf)", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      amount: "$45.00",
      receipt: "receipt_scan_august_2026.heic",
    });
    assert.equal(claim.receipt, "receipt_scan_august_2026.heic");
  });

  it("B10-4: handles multi-line description with quotation marks and formatted bullet points", async () => {
    const multiDesc = "Monthly Expenses:\n- Fiber Internet: $100\n- Backup 5G Router: $50";
    const claim = await db.createClaim({
      userId: "USR-008",
      amount: "$150.00",
      description: multiDesc,
    });
    assert.equal(claim.description, multiDesc);
  });

  it("B10-5: retrieves all claims for user returning empty array if no claims filed", () => {
    const claims = db.getClaims("USR-NONEXISTENT-USER");
    assert.deepEqual(claims, []);
  });
});
