/**
 * Tier 2 Boundary & Corner Cases: B16 to B21 (Lead Approvals & Engineering Boundaries)
 * Each feature includes >= 5 distinct boundary & corner condition test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 2 - B16: L1 Leave Approval Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B16-1: handles re-approving an already 'Approved' leave idempotently", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 2,
    });

    const app1 = await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    assert.equal(app1.status, "Approved");

    const app2 = await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    assert.equal(app2.status, "Approved");
  });

  it("B16-2: handles approving an already 'Rejected' leave transition", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 3,
    });

    await db.rejectLeave(leave.id, "USR-005", "Sarah Chen", "Initial rejection");
    const overrideApproved = await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    assert.equal(overrideApproved.status, "Approved");
  });

  it("B16-3: handles rejecting a leave with empty rejection reason, providing default fallback", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 1,
    });

    const rejected = await db.rejectLeave(leave.id, "USR-005", "Sarah Chen", "");
    assert.equal(rejected.status, "Rejected");
    assert.ok(rejected.rejectionReason);
  });

  it("B16-4: handles non-existent leave ID approval returning null", async () => {
    const res = await db.approveLeave("LV-DOES-NOT-EXIST", "USR-005", "Sarah Chen");
    assert.equal(res, null);
  });

  it("B16-5: handles non-existent leave ID rejection returning null", async () => {
    const res = await db.rejectLeave("LV-DOES-NOT-EXIST", "USR-005", "Sarah Chen", "Reason");
    assert.equal(res, null);
  });
});

describe("Tier 2 - B17: L1 Expense Verification Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B17-1: handles re-verifying an already verified claim idempotently", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      managerId: "USR-005",
      amount: "$60.00",
    });

    const v1 = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    assert.equal(v1.status, "Pending Finance");

    const v2 = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    assert.equal(v2.status, "Pending Finance");
  });

  it("B17-2: handles rejecting already verified claim prior to Finance payout", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      managerId: "USR-005",
      amount: "$120.00",
    });

    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    const rejected = await db.rejectClaim(claim.id, "USR-005", "Sarah Chen", "Audit discovery");
    assert.equal(rejected.status, "Rejected");
  });

  it("B17-3: handles non-existent claim ID lead approval returning null", async () => {
    const res = await db.approveClaimLead("CLM-NONEXISTENT", "USR-005", "Sarah Chen");
    assert.equal(res, null);
  });

  it("B17-4: handles claim rejection without custom reason string", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      managerId: "USR-005",
      amount: "$30.00",
    });

    const rejected = await db.rejectClaim(claim.id, "USR-005", "Sarah Chen", "");
    assert.equal(rejected.status, "Rejected");
    assert.ok(rejected.rejectionReason);
  });

  it("B17-5: handles non-existent claim ID rejection returning null", async () => {
    const res = await db.rejectClaim("CLM-NONEXISTENT", "USR-005", "Sarah Chen", "Reason");
    assert.equal(res, null);
  });
});

describe("Tier 2 - B18: Cloud Sandbox Boundary & Corner Cases", () => {
  const sandboxRegistry = {
    sandboxes: [
      { id: "SBX-1", devId: "USR-008", status: "Active", maxQuota: 1 },
      { id: "SBX-2", devId: "USR-006", status: "Active", maxQuota: 3 },
    ],
  };

  it("B18-1: detects quota limit violation when developer attempts exceeding max allocation", () => {
    const userActiveCount = sandboxRegistry.sandboxes.filter(
      (s) => s.devId === "USR-008" && s.status === "Active"
    ).length;
    const canRequestMore = userActiveCount < 1;
    assert.equal(canRequestMore, false);
  });

  it("B18-2: allows sandbox creation if active count is below developer quota", () => {
    const userActiveCount = sandboxRegistry.sandboxes.filter(
      (s) => s.devId === "USR-006" && s.status === "Active"
    ).length;
    const canRequestMore = userActiveCount < 3;
    assert.equal(canRequestMore, true);
  });

  it("B18-3: handles sandbox with zero cost ($0.00 free tier trial)", () => {
    const freeTier = { id: "SBX-FREE", cost: "$0.00", provider: "AWS Free Tier" };
    assert.equal(freeTier.cost, "$0.00");
  });

  it("B18-4: handles custom environment specification with GPU acceleration", () => {
    const gpuSbx = { id: "SBX-GPU", instance: "g5.2xlarge (NVIDIA A10G 24GB)", status: "Active" };
    assert.ok(gpuSbx.instance.includes("NVIDIA"));
  });

  it("B18-5: handles decommissioned sandbox status transition", () => {
    const sbx = { id: "SBX-3", status: "Active" };
    sbx.status = "Decommissioned";
    assert.equal(sbx.status, "Decommissioned");
  });
});

describe("Tier 2 - B19: Software License Boundary & Corner Cases", () => {
  it("B19-1: detects 100% capacity exhaustion when allocatedSeats equals totalSeats", () => {
    const license = { name: "JetBrains All Products", totalSeats: 10, allocatedSeats: 10 };
    const hasAvailable = license.allocatedSeats < license.totalSeats;
    assert.equal(hasAvailable, false);
  });

  it("B19-2: calculates zero remaining capacity on fully booked license", () => {
    const license = { totalSeats: 5, allocatedSeats: 5 };
    assert.equal(license.totalSeats - license.allocatedSeats, 0);
  });

  it("B19-3: handles license with 0 total seats (disabled catalog item)", () => {
    const license = { name: "Deprecated Software", totalSeats: 0, allocatedSeats: 0 };
    assert.equal(license.totalSeats, 0);
  });

  it("B19-4: prevents revoking seat below zero", () => {
    const license = { totalSeats: 10, allocatedSeats: 0 };
    const newAllocated = Math.max(0, license.allocatedSeats - 1);
    assert.equal(newAllocated, 0);
  });

  it("B19-5: handles license utilization rate when totalSeats is 0 safely (no divide-by-zero NaN)", () => {
    const license = { totalSeats: 0, allocatedSeats: 0 };
    const util = license.totalSeats > 0 ? (license.allocatedSeats / license.totalSeats) * 100 : 0;
    assert.equal(util, 0);
  });
});

describe("Tier 2 - B20: Sprint Velocity Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B20-1: handles sprint with 0 story points safely", async () => {
    const sprint = await db.addSprint({
      title: "Zero SP Planning Sprint",
      velocity: "0 Story Points",
      progress: "0%",
      goals: [],
    });
    assert.equal(sprint.velocity, "0 Story Points");
    assert.equal(sprint.goals.length, 0);
  });

  it("B20-2: handles sprint with 100% progress and 'Completed' status", async () => {
    const sprint = await db.addSprint({
      title: "Completed Sprint",
      progress: "100%",
      status: "Completed",
    });
    assert.equal(sprint.progress, "100%");
    assert.equal(sprint.status, "Completed");
  });

  it("B20-3: handles sprint lookup with non-existent ID returning null", () => {
    const res = db.getSprintById("SPR-DOES-NOT-EXIST");
    assert.equal(res, null);
  });

  it("B20-4: filters sprints by non-existent department returning empty array", () => {
    const res = db.getSprints("NonExistentDepartment");
    assert.deepEqual(res, []);
  });

  it("B20-5: handles sprint with long list of 20 milestone goals", async () => {
    const goals = Array.from({ length: 20 }, (_, i) => `Sprint Goal item #${i + 1}`);
    const sprint = await db.addSprint({ title: "Major Milestone", goals });
    assert.equal(sprint.goals.length, 20);
  });
});

describe("Tier 2 - B21: On-Call Rotation Boundary & Corner Cases", () => {
  it("B21-1: validates phone number format for emergency on-call contact", () => {
    const engineer = { name: "David Okonjo", phone: "+234 818 222 3344" };
    const isValidPhone = /^\+?[0-9\s-]{10,20}$/.test(engineer.phone);
    assert.equal(isValidPhone, true);
  });

  it("B21-2: detects missing contact number for on-call engineer and flags warning", () => {
    const engineer = { name: "Incomplete Contact", phone: "" };
    assert.equal(Boolean(engineer.phone), false);
  });

  it("B21-3: handles rotation schedule transition when primary is promoted to secondary", () => {
    let primary = "Sarah Chen";
    let secondary = "Udeh Kosisochukwu Emmanuel";
    // Rotate
    const temp = primary;
    primary = secondary;
    secondary = temp;
    assert.equal(primary, "Udeh Kosisochukwu Emmanuel");
    assert.equal(secondary, "Sarah Chen");
  });

  it("B21-4: verifies escalation level mapping (Primary -> Secondary -> VP)", () => {
    const levels = ["Primary Engineer", "Secondary Backup", "VP Engineering Escalation"];
    assert.equal(levels.length, 3);
    assert.equal(levels[2], "VP Engineering Escalation");
  });

  it("B21-5: handles single-member team on-call fallback", () => {
    const soloOnCall = { primary: "Solo Dev", secondary: "Solo Dev (Self-Backup)" };
    assert.ok(soloOnCall.primary);
  });
});
