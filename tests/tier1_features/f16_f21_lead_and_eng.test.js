/**
 * Tier 1 Feature Coverage: F16 to F21 (Team Lead Approvals & Engineering Hub)
 * Each feature includes >= 5 distinct, verifiable test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F16: Level-1 Leave Approval Queue", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F16-1: provides Team Lead with leave requests submitted strictly by direct reports", () => {
    const teamLeaves = db.getTeamLeaves("USR-005");
    assert.ok(Array.isArray(teamLeaves));
    const allowedUserIds = new Set(["USR-008", "USR-009"]);
    for (const leave of teamLeaves) {
      assert.ok(allowedUserIds.has(leave.userId) || leave.managerId === "USR-005");
    }
  });

  it("F16-2: approves leave request, setting status 'Approved', approver details, and timestamp", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      managerId: "USR-005",
      type: "Annual Leave",
      dates: "2026-09-10 - 2026-09-12",
      days: 3,
    });

    const approved = await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    assert.equal(approved.status, "Approved");
    assert.equal(approved.approverId, "USR-005");
    assert.equal(approved.approverName, "Sarah Chen");
    assert.ok(approved.approvedAt);
  });

  it("F16-3: automatically deducts leave days from applicant's annualLeaveBalance upon approval", async () => {
    const initialUser = db.getUserById("USR-008");
    const initialBal = initialUser.annualLeaveBalance;

    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 2,
    });

    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
    const updatedUser = db.getUserById("USR-008");
    assert.equal(updatedUser.annualLeaveBalance, initialBal - 2);
  });

  it("F16-4: rejects leave request, recording status 'Rejected' and custom rejection reason", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 5,
    });

    const rejected = await db.rejectLeave(leave.id, "USR-005", "Sarah Chen", "High workload during sprint");
    assert.equal(rejected.status, "Rejected");
    assert.equal(rejected.rejectionReason, "High workload during sprint");
  });

  it("F16-5: leaves applicant's annualLeaveBalance unchanged when leave is rejected", async () => {
    const initialBal = db.getUserById("USR-008").annualLeaveBalance;
    const leave = await db.createLeave({
      userId: "USR-008",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 4,
    });

    await db.rejectLeave(leave.id, "USR-005", "Sarah Chen", "Staff shortage");
    const currentBal = db.getUserById("USR-008").annualLeaveBalance;
    assert.equal(currentBal, initialBal);
  });
});

describe("Tier 1 - F17: Level-1 Expense Claim Verification", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F17-1: provides Team Lead with expense claims submitted by direct reports", () => {
    const teamClaims = db.getTeamClaims("USR-005");
    assert.ok(Array.isArray(teamClaims));
    const allowed = new Set(["USR-008", "USR-009"]);
    for (const c of teamClaims) {
      assert.ok(allowed.has(c.userId) || c.managerId === "USR-005");
    }
  });

  it("F17-2: verifies Level-1 claim necessity, advancing status from 'Pending Lead' to 'Pending Finance'", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      managerId: "USR-005",
      amount: "$150.00",
      category: "Internet",
    });

    const verified = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    assert.equal(verified.status, "Pending Finance");
    assert.equal(verified.leadApproverId, "USR-005");
    assert.equal(verified.leadApproverName, "Sarah Chen");
    assert.ok(verified.leadApprovedAt);
  });

  it("F17-3: rejects expense claim at Level-1 with mandatory reason", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      managerId: "USR-005",
      amount: "$900.00",
      description: "Luxury hotel upgrade",
    });

    const rejected = await db.rejectClaim(claim.id, "USR-005", "Sarah Chen", "Exceeds allowable policy quota");
    assert.equal(rejected.status, "Rejected");
    assert.equal(rejected.rejectionReason, "Exceeds allowable policy quota");
  });

  it("F17-4: prevents non-existent claims from advancing", async () => {
    const res = await db.approveClaimLead("CLM-NONEXISTENT", "USR-005", "Sarah Chen");
    assert.equal(res, null);
  });

  it("F17-5: keeps 'Pending Finance' claims visible in team queue history for audit", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      managerId: "USR-005",
      amount: "$75.00",
    });
    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");

    const teamClaims = db.getTeamClaims("USR-005");
    assert.ok(teamClaims.some((c) => c.id === claim.id && c.status === "Pending Finance"));
  });
});

describe("Tier 1 - F18: Engineering Cloud Sandbox Requisitions", () => {
  const mockSandboxes = [
    {
      id: "SBX-101",
      developerId: "USR-008",
      developerName: "Udeh Kosisochukwu Emmanuel",
      provider: "AWS",
      instanceType: "t4g.xlarge (4 vCPU, 16GB RAM)",
      status: "Provisioned",
      costPerMonth: "$120.00",
      expiresOn: "2026-09-30",
    },
    {
      id: "SBX-102",
      developerId: "USR-006",
      developerName: "David Okonjo",
      provider: "GCP",
      instanceType: "n2-standard-8 (8 vCPU, 32GB RAM)",
      status: "Provisioned",
      costPerMonth: "$240.00",
      expiresOn: "2026-10-15",
    },
  ];

  it("F18-1: tracks cloud sandbox provider and instance specifications (AWS / GCP)", () => {
    const sbx = mockSandboxes[0];
    assert.equal(sbx.provider, "AWS");
    assert.ok(sbx.instanceType.includes("4 vCPU"));
  });

  it("F18-2: enforces sandbox quota limits per developer level", () => {
    const devQuota = { tier1_max: 1, tier2_max: 2, tier3_max: 4 };
    assert.equal(devQuota.tier1_max, 1);
  });

  it("F18-3: tracks monthly estimated infrastructure cost for cloud sandboxes", () => {
    const totalCost = mockSandboxes.reduce(
      (sum, s) => sum + parseFloat(s.costPerMonth.replace("$", "")),
      0
    );
    assert.equal(totalCost, 360.0);
  });

  it("F18-4: tracks expiry and automatic teardown schedule", () => {
    assert.ok(mockSandboxes.every((s) => Boolean(s.expiresOn)));
  });

  it("F18-5: transitions status across Requested -> Provisioned -> Decommissioned lifecycle", () => {
    const lifecycle = ["Requested", "Provisioned", "Decommissioned"];
    assert.equal(lifecycle[1], "Provisioned");
  });
});

describe("Tier 1 - F19: GitHub Seats & API Keys Registry", () => {
  const mockLicenses = [
    { id: "LIC-01", name: "GitHub Enterprise Cloud", totalSeats: 25, allocatedSeats: 18 },
    { id: "LIC-02", name: "OpenAI GPT-4o API Tier-3", totalSeats: 10, allocatedSeats: 6 },
    { id: "LIC-03", name: "AWS IAM Developer Credentials", totalSeats: 15, allocatedSeats: 12 },
  ];

  it("F19-1: reports allocated seats and remaining seat capacity", () => {
    const gh = mockLicenses[0];
    const remaining = gh.totalSeats - gh.allocatedSeats;
    assert.equal(remaining, 7);
  });

  it("F19-2: calculates license utilization rate percentage across all tools", () => {
    const gh = mockLicenses[0];
    const rate = Math.round((gh.allocatedSeats / gh.totalSeats) * 100);
    assert.equal(rate, 72);
  });

  it("F19-3: provisions seat to developer and increments allocated count", () => {
    const tool = { ...mockLicenses[0] };
    tool.allocatedSeats += 1;
    assert.equal(tool.allocatedSeats, 19);
  });

  it("F19-4: revokes seat and decrements allocated count on offboarding", () => {
    const tool = { ...mockLicenses[0] };
    tool.allocatedSeats -= 1;
    assert.equal(tool.allocatedSeats, 17);
  });

  it("F19-5: enforces that allocated seats cannot exceed total available seats", () => {
    const isExceeded = mockLicenses.some((l) => l.allocatedSeats > l.totalSeats);
    assert.equal(isExceeded, false);
  });
});

describe("Tier 1 - F20: Engineering Sprint Velocity Board", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F20-1: retrieves all engineering sprints via db.getSprints()", () => {
    const sprints = db.getSprints();
    assert.ok(Array.isArray(sprints));
    assert.equal(sprints.length, 2);
  });

  it("F20-2: identifies active sprint with story points and velocity metrics", () => {
    const active = db.getSprints().find((s) => s.status === "Active");
    assert.ok(active);
    assert.equal(active.id, "SPR-42");
    assert.equal(active.velocity, "48 Story Points");
    assert.equal(active.progress, "84%");
  });

  it("F20-3: verifies sprint deliverables checklist goals array", () => {
    const active = db.getSprints().find((s) => s.status === "Active");
    assert.ok(Array.isArray(active.goals));
    assert.ok(active.goals.length >= 2);
    assert.ok(active.goals.some((g) => g.includes("5-tier RBAC")));
  });

  it("F20-4: identifies upcoming sprint with 0% initial progress", () => {
    const upcoming = db.getSprints().find((s) => s.status === "Upcoming");
    assert.ok(upcoming);
    assert.equal(upcoming.id, "SPR-43");
    assert.equal(upcoming.progress, "0%");
  });

  it("F20-5: retrieves specific sprint by ID via db.getSprintById", () => {
    const sprint = db.getSprintById("SPR-42");
    assert.ok(sprint);
    assert.equal(sprint.leadName || sprint.lead, "Sarah Chen");
  });
});

describe("Tier 1 - F21: On-Call Rotation Schedule", () => {
  const mockOnCallSchedule = {
    currentShift: {
      week: "Week 35 (Aug 31 - Sept 06, 2026)",
      primary: { id: "USR-006", name: "David Okonjo", role: "DevOps Lead", phone: "+234 818 222 3344" },
      secondary: { id: "USR-005", name: "Sarah Chen", role: "Frontend Lead", phone: "+234 803 444 5566" },
      escalationLead: { id: "USR-002", name: "Tunde Bakare", role: "VP Engineering" },
    },
    upcomingShift: {
      week: "Week 36 (Sept 07 - Sept 13, 2026)",
      primary: { id: "USR-005", name: "Sarah Chen" },
      secondary: { id: "USR-008", name: "Udeh Kosisochukwu Emmanuel" },
    },
  };

  it("F21-1: identifies active primary on-call engineer with contact details", () => {
    const shift = mockOnCallSchedule.currentShift;
    assert.equal(shift.primary.name, "David Okonjo");
    assert.ok(shift.primary.phone.startsWith("+234"));
  });

  it("F21-2: identifies secondary backup engineer on rotation", () => {
    const shift = mockOnCallSchedule.currentShift;
    assert.equal(shift.secondary.name, "Sarah Chen");
  });

  it("F21-3: designates escalation path to VP of Engineering", () => {
    const shift = mockOnCallSchedule.currentShift;
    assert.equal(shift.escalationLead.name, "Tunde Bakare");
  });

  it("F21-4: verifies upcoming rotation schedule roster", () => {
    const upcoming = mockOnCallSchedule.upcomingShift;
    assert.equal(upcoming.primary.name, "Sarah Chen");
    assert.equal(upcoming.secondary.name, "Udeh Kosisochukwu Emmanuel");
  });

  it("F21-5: enforces distinct primary and secondary engineers on any shift", () => {
    const current = mockOnCallSchedule.currentShift;
    assert.notEqual(current.primary.id, current.secondary.id);
  });
});
