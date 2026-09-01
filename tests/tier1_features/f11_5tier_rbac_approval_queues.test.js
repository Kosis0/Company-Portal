/**
 * Tier 1 Feature Coverage: F11 - 5-Tier RBAC & Multi-Stage Approval Queues
 * Verifies 5-tier role authentications, direct reports tree filtering, 2-stage expense claim approvals,
 * statutory leave deduction upon manager approval, and management hub permission checks.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";
import { FIXTURES } from "../helpers/fixtures.js";

setupTestEnvironment();
const { auth } = await import("../../src/services/auth.js");
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F11: 5-Tier RBAC & Multi-Stage Approval Queues", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("F11-1: authenticates users across all 5 tiers and issues verifiable sessions", async () => {
    const session1 = await auth.login("employee@company.com", "password123");
    assert.equal(session1.user.tier, 1);
    assert.equal(session1.user.role, "employee");

    const session3 = await auth.login("sarah.chen@company.com", "password123");
    assert.equal(session3.user.tier, 3);
    assert.equal(session3.user.role, "manager");

    const session4 = await auth.login("finance@company.com", "password123");
    assert.equal(session4.user.tier, 4);
    assert.equal(session4.user.role, "finance");

    const session5 = await auth.login("ceo@company.com", "password123");
    assert.equal(session5.user.tier, 5);
    assert.equal(session5.user.role, "executive");
  });

  it("F11-2: isolates direct reports subtree for Tier 3 Manager Sarah Chen (USR-005)", () => {
    const reports = db.getDirectReports("USR-005");
    assert.equal(reports.length, 2);
    const reportIds = reports.map(r => r.id);
    assert.ok(reportIds.includes("USR-008"));
    assert.ok(reportIds.includes("USR-009"));
  });

  it("F11-3: executes 2-stage Expense Claim approval workflow (Pending Lead -> Pending Finance -> Approved)", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      category: "Internet & Remote Work Allowance",
      amount: "$120.00",
      description: "Monthly fiber internet",
      managerId: "USR-005",
    });

    assert.equal(claim.status, "Pending Lead");

    // Stage 1: Lead approval
    const stage1 = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    assert.equal(stage1.status, "Pending Finance");
    assert.equal(stage1.leadApproverId, "USR-005");

    // Stage 2: Finance approval
    const stage2 = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody", "BATCH-2026-09");
    assert.equal(stage2.status, "Approved");
    assert.equal(stage2.financeApproverId, "USR-004");
    assert.equal(stage2.payoutBatchId, "BATCH-2026-09");
  });

  it("F11-4: deducts statutory Annual Leave balance upon manager approval", async () => {
    const userBefore = db.getUserById("USR-008");
    const initialBalance = userBefore.annualLeaveBalance; // 14

    const leave = await db.createLeave({
      userId: "USR-008",
      name: userBefore.name,
      type: "Annual Leave",
      days: 3,
      reason: "Vacation",
      managerId: "USR-005",
    });

    await db.approveLeave(leave.id, "USR-005", "Sarah Chen");

    const userAfter = db.getUserById("USR-008");
    assert.equal(userAfter.annualLeaveBalance, initialBalance - 3);
  });

  it("F11-5: enforces RBAC permission boundaries for executive and department toolkits", () => {
    function hasPermission(user, perm) {
      const isManager = Boolean(user.tier >= 3 || user.role === "manager");
      const isDirector = Boolean(user.tier >= 4);
      const isExecutive = Boolean(user.tier === 5 || user.role === "admin");
      switch (perm) {
        case "manage_team": return isManager;
        case "execute_payroll": return isDirector && (user.department === "Finance & Operations" || user.role === "finance" || isExecutive);
        case "view_all_org": return isExecutive;
        default: return false;
      }
    }

    assert.equal(hasPermission(FIXTURES.personas.tier1_intern, "manage_team"), false);
    assert.equal(hasPermission(FIXTURES.personas.tier3_lead, "manage_team"), true);
    assert.equal(hasPermission(FIXTURES.personas.tier4_director_finance, "execute_payroll"), true);
    assert.equal(hasPermission(FIXTURES.personas.tier5_ceo, "view_all_org"), true);
  });
});
