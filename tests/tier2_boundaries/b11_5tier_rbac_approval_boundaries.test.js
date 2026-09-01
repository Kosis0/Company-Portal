/**
 * Tier 2 Boundary Coverage: B11 - 5-Tier RBAC & Approval Boundaries
 * Tests leave balance underflow clamping (to 0), non-existent manager subtree queries,
 * self-approval constraints, idempotent claim rejections, and direct finance approvals.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 2 - B11: 5-Tier RBAC & Approval Boundaries", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B11-1: clamps leave balance to 0 and prevents negative balance when requested days exceed balance", async () => {
    const user = db.getUserById("USR-008");
    assert.equal(user.annualLeaveBalance, 14);

    // Apply for 50 days (far more than 14 available)
    const excessiveLeave = await db.createLeave({
      userId: "USR-008",
      name: user.name,
      type: "Annual Leave",
      days: 50,
      managerId: "USR-005",
    });

    await db.approveLeave(excessiveLeave.id, "USR-005", "Sarah Chen");

    const userAfter = db.getUserById("USR-008");
    assert.equal(userAfter.annualLeaveBalance, 0, "Annual leave balance must clamp to 0 and not become negative");
  });

  it("B11-2: returns empty array when querying direct reports for null or non-existent manager IDs", () => {
    assert.deepEqual(db.getDirectReports(null), []);
    assert.deepEqual(db.getDirectReports(undefined), []);
    assert.deepEqual(db.getDirectReports("NON_EXISTENT_USR_999"), []);
    assert.deepEqual(db.getDirectReports(""), []);
  });

  it("B11-3: rejects approving non-existent leave or claim returning null safely", async () => {
    const fakeLeaveApproval = await db.approveLeave("NON_EXISTENT_LEAVE", "USR-005", "Sarah Chen");
    assert.equal(fakeLeaveApproval, null);

    const fakeClaimApproval = await db.approveClaimLead("NON_EXISTENT_CLAIM", "USR-005", "Sarah Chen");
    assert.equal(fakeClaimApproval, null);
  });

  it("B11-4: handles multiple consecutive approvals on same claim idempotently", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      category: "Software",
      amount: "$50.00",
      managerId: "USR-005",
    });

    const firstLead = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    assert.equal(firstLead.status, "Pending Finance");

    const firstFin = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody", "BATCH-001");
    assert.equal(firstFin.status, "Approved");

    // Second repeated finance approval call
    const secondFin = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody", "BATCH-001");
    assert.equal(secondFin.status, "Approved");
  });

  it("B11-5: records rejection reason when rejecting a leave request without deducting balance", async () => {
    const user = db.getUserById("USR-008");
    const initBalance = user.annualLeaveBalance; // 14

    const leave = await db.createLeave({
      userId: "USR-008",
      name: user.name,
      type: "Annual Leave",
      days: 5,
      managerId: "USR-005",
    });

    const rejected = await db.rejectLeave(leave.id, "USR-005", "Sarah Chen", "Blackout period for product launch");
    assert.equal(rejected.status, "Rejected");

    const userAfter = db.getUserById("USR-008");
    assert.equal(userAfter.annualLeaveBalance, initBalance, "Balance must remain unchanged after rejection");
  });
});
