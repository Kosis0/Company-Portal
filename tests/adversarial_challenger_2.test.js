/**
 * Challenger 2: Adversarial RBAC, Multi-Tier Approval Idempotency & Data Synchronization Harness
 * 
 * Deep Empirical Probes:
 * 1. Tier Privilege Escalation & RBAC Boundary Enforcement
 * 2. Multi-Tier Approval Lifecycle & Balance Underflow Clamping
 * 3. Idempotency of Repeated / Concurrent Approvals
 * 4. Cache Corruption Recovery & Resilient LocalStorage Handling
 * 5. Supabase Realtime Subscription & Offline-Online Sync Convergence
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "./helpers/test-harness.js";
import { db, STORAGE_KEYS, SEED_DATA } from "../src/services/db.js";
import { auth } from "../src/services/auth.js";

describe("Adversarial Challenger 2: RBAC, Approvals & Sync Integrity", () => {
  beforeEach(async () => {
    setupTestEnvironment();
    await db.resetDatabase();
  });

  // =========================================================================
  // 1. RBAC BOUNDARIES & PRIVILEGE ESCALATION PROBES
  // =========================================================================
  describe("1. RBAC Boundaries & Privilege Escalation", () => {
    it("RBAC-1: Session tampering — client-side role escalation is overridden by live DB verification", async () => {
      // User logs in as Tier 1 Staff (Emmanuel USR-008)
      const session = await auth.login("employee@company.com", "password123");
      assert.equal(session.user.tier, 1);
      assert.equal(session.user.role, "employee");

      // Attacker tampers with localStorage session to elevate to Tier 5 CEO
      const rawSession = JSON.parse(localStorage.getItem("monolith_auth_session"));
      rawSession.user.tier = 5;
      rawSession.user.role = "executive";
      rawSession.user.name = "Attacker Hacked";
      localStorage.setItem("monolith_auth_session", JSON.stringify(rawSession));

      // auth.getCurrentSession() MUST re-verify against the database and restore genuine tier
      const verifiedSession = auth.getCurrentSession();
      assert.ok(verifiedSession, "Session should still be valid");
      assert.equal(verifiedSession.user.tier, 1, "Tier must remain 1 after live DB lookup");
      assert.equal(verifiedSession.user.role, "employee", "Role must remain employee");
      assert.equal(verifiedSession.user.id, "USR-008");
      assert.equal(verifiedSession.user.name, "Udeh Kosisochukwu Emmanuel");
    });

    it("RBAC-2: Session invalidation — deleted user session returns null and logs out", async () => {
      await auth.login("fatima.ops@company.com", "password123");
      assert.ok(auth.getCurrentSession());

      // Simulate admin deleting user USR-010 from database
      const users = db.getUsers().filter((u) => u.id !== "USR-010");
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Re-verifying session should detect missing user, clear session, and return null
      const session = auth.getCurrentSession();
      assert.equal(session, null, "Deleted user session must be rejected");
      assert.equal(localStorage.getItem("monolith_auth_session"), null, "Session key must be cleared");
    });

    it("RBAC-3: Direct reports isolation — Tier 3 Lead can only query their own subtree", () => {
      // Sarah Chen (USR-005) manages USR-008 and USR-009
      const sarahReports = db.getDirectReports("USR-005");
      assert.equal(sarahReports.length, 2);
      const sarahReportIds = sarahReports.map((r) => r.id);
      assert.ok(sarahReportIds.includes("USR-008"));
      assert.ok(sarahReportIds.includes("USR-009"));
      assert.ok(!sarahReportIds.includes("USR-010"), "USR-010 reports to USR-004 (Marcus Brody), not Sarah Chen");

      // Marcus Brody (USR-004) manages USR-010
      const marcusReports = db.getDirectReports("USR-004");
      const marcusReportIds = marcusReports.map((r) => r.id);
      assert.ok(marcusReportIds.includes("USR-010"));
      assert.ok(!marcusReportIds.includes("USR-008"));

      // Tier 1 Staff (USR-008) has no direct reports
      const staffReports = db.getDirectReports("USR-008");
      assert.deepEqual(staffReports, [], "Tier 1 staff must have empty direct reports list");

      // Non-existent manager ID returns empty array
      const ghostReports = db.getDirectReports("USR-NON-EXISTENT");
      assert.deepEqual(ghostReports, [], "Non-existent manager returns empty array");
    });

    it("RBAC-4: Organization hierarchy recursion — cycles and self-references do not cause stack overflow", () => {
      const users = db.getUsers();
      // Introduce circular reference: USR-001 -> USR-002 -> USR-001
      const u1 = users.find((u) => u.id === "USR-001");
      const u2 = users.find((u) => u.id === "USR-002");
      u1.managerId = "USR-002";
      u2.managerId = "USR-001";
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // getOrgTree should handle cycles safely without throwing RangeError: Maximum call stack size exceeded
      let tree = null;
      assert.doesNotThrow(() => {
        tree = db.getOrgTree("USR-001");
      }, "Cyclic graph must not crash getOrgTree");
      assert.ok(tree, "Tree structure must be returned");
    });
  });

  // =========================================================================
  // 2. MULTI-TIER APPROVALS & IDEMPOTENCY PROBES
  // =========================================================================
  describe("2. Multi-Tier Approvals, Idempotency & Balance Integrity", () => {
    it("APP-1: Leave balance underflow clamping — balance never drops below 0", async () => {
      const user = db.getUserById("USR-008");
      const initialAnnual = user.annualLeaveBalance; // 14

      // Create a leave request requesting 50 days (more than initial 14)
      const leave = await db.createLeave({
        userId: "USR-008",
        userName: "Udeh Kosisochukwu Emmanuel",
        type: "Annual Leave",
        days: 50,
        startDate: "2026-09-10",
        endDate: "2026-10-30",
        reason: "Extended Vacation",
        managerId: "USR-005",
      });

      // Approve the leave
      const approved = await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
      assert.equal(approved.status, "Approved");

      const updatedUser = db.getUserById("USR-008");
      assert.equal(updatedUser.annualLeaveBalance, 0, "Balance must clamp at 0 and not be negative");
    });

    it("APP-2: Leave approval idempotency — repeated approveLeave calls do not multiply deductions", async () => {
      const userBefore = db.getUserById("USR-008");
      const initialBalance = userBefore.annualLeaveBalance;

      const leave = await db.createLeave({
        userId: "USR-008",
        userName: "Udeh Kosisochukwu Emmanuel",
        type: "Annual Leave",
        days: 3,
        startDate: "2026-09-15",
        endDate: "2026-09-18",
        reason: "Conference",
        managerId: "USR-005",
      });

      // Approve 1st time
      await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
      const balanceAfter1 = db.getUserById("USR-008").annualLeaveBalance;
      assert.equal(balanceAfter1, initialBalance - 3);

      // Approve 2nd, 3rd, 4th, 5th time in rapid succession
      await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
      await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
      await db.approveLeave(leave.id, "USR-005", "Sarah Chen");
      await db.approveLeave(leave.id, "USR-005", "Sarah Chen");

      const balanceAfterMulti = db.getUserById("USR-008").annualLeaveBalance;
      assert.equal(balanceAfterMulti, initialBalance - 3, "Repeated approval must not re-deduct balance");
    });

    it("APP-3: Sick leave and Casual leave route deductions to their respective balances", async () => {
      const user = db.getUserById("USR-008");
      const initAnnual = user.annualLeaveBalance;
      const initSick = user.sickLeaveBalance;
      const initCasual = user.casualLeaveBalance;

      // 1. Sick Leave (2 days)
      const sickLeave = await db.createLeave({
        userId: "USR-008",
        type: "Sick Leave",
        days: 2,
        managerId: "USR-005",
      });
      await db.approveLeave(sickLeave.id, "USR-005", "Sarah Chen");

      // 2. Casual Leave (1 day)
      const casualLeave = await db.createLeave({
        userId: "USR-008",
        type: "Casual Leave",
        days: 1,
        managerId: "USR-005",
      });
      await db.approveLeave(casualLeave.id, "USR-005", "Sarah Chen");

      const updated = db.getUserById("USR-008");
      assert.equal(updated.sickLeaveBalance, initSick - 2, "Sick balance deducted");
      assert.equal(updated.casualLeaveBalance, initCasual - 1, "Casual balance deducted");
      assert.equal(updated.annualLeaveBalance, initAnnual, "Annual balance unaffected");
    });

    it("APP-4: Expense claim 2-stage workflow transitions and anti-demotion guard", async () => {
      const claim = await db.createClaim({
        userId: "USR-008",
        userName: "Udeh Kosisochukwu Emmanuel",
        category: "Travel & Fuel Reimbursement",
        amount: "$350.00",
        description: "Client on-site visit",
        managerId: "USR-005",
      });
      assert.equal(claim.status, "Pending Lead");

      // Stage 1: Team Lead Approval -> "Pending Finance"
      const stage1 = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
      assert.equal(stage1.status, "Pending Finance");
      assert.equal(stage1.leadApproverId, "USR-005");
      assert.ok(stage1.leadApprovedAt);

      // Re-calling Stage 1 while in "Pending Finance" is idempotent
      const stage1Repeat = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
      assert.equal(stage1Repeat.status, "Pending Finance");

      // Stage 2: Finance Approval -> "Approved" with Payout Batch ID
      const stage2 = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");
      assert.equal(stage2.status, "Approved");
      assert.equal(stage2.financeApproverId, "USR-004");
      assert.ok(stage2.payoutBatchId.startsWith("BATCH-"));
      const assignedBatch = stage2.payoutBatchId;

      // Re-calling Stage 2 retains original payoutBatchId
      const stage2Repeat = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody");
      assert.equal(stage2Repeat.status, "Approved");
      assert.equal(stage2Repeat.payoutBatchId, assignedBatch, "Payout Batch ID must be preserved");

      // Anti-demotion: Calling Stage 1 on already Approved claim must NOT demote back to Pending Finance
      const demotionAttempt = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
      assert.equal(demotionAttempt.status, "Approved", "Approved claim cannot be demoted");
      assert.equal(demotionAttempt.payoutBatchId, assignedBatch);
    });

    it("APP-5: Rejection preserves audit trail and reason", async () => {
      const claim = await db.createClaim({
        userId: "USR-008",
        category: "Software Subscriptions",
        amount: "$1,200.00",
        description: "Personal IDE License",
        managerId: "USR-005",
      });

      const rejected = await db.rejectClaim(claim.id, "USR-005", "Sarah Chen", "Not within approved company tools");
      assert.equal(rejected.status, "Rejected");
      assert.equal(rejected.rejectedById, "USR-005");
      assert.equal(rejected.rejectedByName, "Sarah Chen");
      assert.equal(rejected.rejectionReason, "Not within approved company tools");
      assert.ok(rejected.rejectedAt);

      // Repeated rejection is idempotent
      const rejectedAgain = await db.rejectClaim(claim.id, "USR-005", "Sarah Chen", "Different reason");
      assert.equal(rejectedAgain.status, "Rejected");
      assert.equal(rejectedAgain.rejectionReason, "Not within approved company tools", "Original reason preserved");
    });
  });

  // =========================================================================
  // 3. CACHE CORRUPTION RECOVERY & DATA SYNC PROBES
  // =========================================================================
  describe("3. Cache Corruption Recovery & Sync Convergence", () => {
    it("SYNC-1: Database getters cleanly recover from malformed localStorage JSON strings", () => {
      // Corrupt primary ERP tables with malformed JSON strings
      localStorage.setItem(STORAGE_KEYS.USERS, "{broken_json: [true,");
      localStorage.setItem(STORAGE_KEYS.LEAVES, "NOT_EVEN_JSON");
      localStorage.setItem(STORAGE_KEYS.CLAIMS, "{\"unclosed");
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, "<<malformed>>");
      localStorage.setItem(STORAGE_KEYS.ASSETS, "invalid{json");
      localStorage.setItem(STORAGE_KEYS.SPRINTS, "<<xml><corrupt>>");

      // Verify that database calls do not throw and return fallback seed data
      let users, leaves, claims, depts, assets, sprints;
      assert.doesNotThrow(() => {
        users = db.getUsers();
        leaves = db.getLeaves();
        claims = db.getClaims();
        depts = db.getDepartments();
        assets = db.getAssets();
        sprints = db.getSprints();
      }, "Database getters must catch JSON parse errors safely");

      assert.ok(Array.isArray(users) && users.length >= 10, "Users recovered to seed data");
      assert.ok(Array.isArray(leaves), "Leaves recovered");
      assert.ok(Array.isArray(claims), "Claims recovered");
      assert.ok(Array.isArray(depts) && depts.length >= 4, "Departments recovered");
      assert.ok(Array.isArray(assets), "Assets recovered");
      assert.ok(Array.isArray(sprints), "Sprints recovered");
    });

    it("SYNC-2: saveLocal handles QuotaExceededError without throwing unhandled exceptions", () => {
      // Configure localStorage mock to trigger QuotaExceededError on next write
      const mockStorage = globalThis.localStorage;
      mockStorage.quotaLimit = mockStorage.store.size; // No more slots

      // Calling database mutation should log error gracefully and not crash the process
      assert.doesNotThrow(() => {
        db.updateUser("USR-001", { phone: "+234 999 999 9999" });
      }, "QuotaExceededError must be caught gracefully");
    });

    it("SYNC-3: Supabase realtime subscriber cleanup works safely", () => {
      let updateCalled = false;
      const callback = () => { updateCalled = true; };

      const unsubscribe = db.subscribeToChanges(callback);
      assert.equal(typeof unsubscribe, "function", "Must return cleanup function");

      // Calling unsubscribe must not throw
      assert.doesNotThrow(() => {
        unsubscribe();
      }, "Unsubscribe function executes cleanly");
    });

    it("SYNC-4: Backwards compatibility updateLeaveStatus & updateClaimStatus route to multi-tier flows", async () => {
      const leave = await db.createLeave({
        userId: "USR-008",
        type: "Annual Leave",
        days: 2,
        managerId: "USR-005",
      });

      const approvedLeave = await db.updateLeaveStatus(leave.id, "Approved", "Sarah Chen");
      assert.equal(approvedLeave.status, "Approved");
      assert.equal(approvedLeave.approverName, "Sarah Chen");

      const claim = await db.createClaim({
        userId: "USR-008",
        category: "Office Supplies",
        amount: "$50.00",
        managerId: "USR-005",
      });

      // Calling updateClaimStatus with "Pending Finance" routes to approveClaimLead
      const leadStep = await db.updateClaimStatus(claim.id, "Pending Finance", "Sarah Chen");
      assert.equal(leadStep.status, "Pending Finance");

      // Calling updateClaimStatus with "Approved" routes to approveClaimFinance
      const financeStep = await db.updateClaimStatus(claim.id, "Approved", "Marcus Brody");
      assert.equal(financeStep.status, "Approved");
      assert.ok(financeStep.payoutBatchId);
    });
  });
});
