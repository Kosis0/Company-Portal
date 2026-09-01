/**
 * Tier 4 Real-World Application Scenario: A4 - Employee Self-Service & Attendance Logging
 * Exercised Features: F1, F2, F3, F11, F12
 *
 * Workflow:
 * 1. Software Developer Intern logs in with Tier 1 credentials.
 * 2. Clocks into work shift via top navbar live attendance chip.
 * 3. Submits 4-day Annual Leave application for family vacation.
 * 4. Submits $120 internet reimbursement claim with receipt details.
 * 5. Team Lead Sarah Chen approves leave in Team Lead Hub.
 * 6. Employee verifies updated statutory leave balance (14 -> 10 days) and shift attendance.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { auth } = await import("../../src/services/auth.js");
const { db } = await import("../../src/services/db.js");

describe("Tier 4 - A4: Employee Self-Service & Attendance Workflow", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("A4-1: Tier 1 employee logs in and toggles shift clock-in", async () => {
    const session = await auth.login("employee@company.com", "password123");
    assert.equal(session.user.tier, 1);
    assert.equal(session.user.name, "Udeh Kosisochukwu Emmanuel");

    // Add attendance record
    const attRecord = await db.addAttendance({
      userId: session.user.id,
      name: session.user.name,
      department: session.user.department,
      date: "2026-09-01",
      clockIn: "08:58 AM",
      status: "Present",
    });

    assert.ok(attRecord.id);
    const records = db.getAttendance();
    assert.ok(records.some(r => r.id === attRecord.id));
  });

  it("A4-2: submits Annual Leave application and Internet reimbursement claim", async () => {
    const session = await auth.login("employee@company.com", "password123");

    const leave = await db.createLeave({
      userId: session.user.id,
      name: session.user.name,
      department: session.user.department,
      type: "Annual Leave",
      dates: "2026-09-15 - 2026-09-18",
      days: 4,
      reason: "Family travel",
      managerId: session.user.managerId,
    });

    assert.equal(leave.status, "Pending Manager");
    assert.equal(leave.days, 4);

    const claim = await db.createClaim({
      userId: session.user.id,
      name: session.user.name,
      department: session.user.department,
      category: "Internet & Remote Work Allowance",
      amount: "$120.00",
      description: "Monthly fiber internet connection",
      managerId: session.user.managerId,
    });

    assert.equal(claim.status, "Pending Lead");
  });

  it("A4-3: Team Lead reviews and approves leave in Team Lead Hub, updating employee balance", async () => {
    const userBefore = db.getUserById("USR-008");
    const initialBalance = userBefore.annualLeaveBalance; // 14

    const leave = await db.createLeave({
      userId: "USR-008",
      name: userBefore.name,
      department: "Engineering",
      type: "Annual Leave",
      dates: "2026-09-15 - 2026-09-18",
      days: 4,
      managerId: "USR-005",
    });

    // Team Lead logs in and approves
    const leadSession = await auth.login("sarah.chen@company.com", "password123");
    assert.equal(leadSession.user.tier, 3);

    const approvedLeave = await db.approveLeave(leave.id, leadSession.user.id, leadSession.user.name);
    assert.equal(approvedLeave.status, "Approved");
    assert.equal(approvedLeave.managerId, "USR-005");

    // Verify employee balance deducted
    const userAfter = db.getUserById("USR-008");
    assert.equal(userAfter.annualLeaveBalance, initialBalance - 4);
  });
});
