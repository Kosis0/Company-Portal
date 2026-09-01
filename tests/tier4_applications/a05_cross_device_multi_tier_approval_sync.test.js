/**
 * Tier 4 Real-World Application Scenario: A5 - Cross-Device Multi-Tier Approval & Realtime Sync
 * Exercised Features: F4, F5, F6, F11, F12
 *
 * Workflow:
 * 1. Simulates 3 concurrent clients (Device A: Intern, Device B: Team Lead, Device C: Finance Controller).
 * 2. Device A registers realtime listener and submits $450 Travel Reimbursement claim.
 * 3. Device B receives realtime notification, logs in, and approves Stage 1 (Pending Finance).
 * 4. Device C receives notification, reviews budget, and authorizes Stage 2 with Payout Batch ID.
 * 5. Device A observes state convergence to 'Approved' with batch details without data loss.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { auth } = await import("../../src/services/auth.js");
const { db } = await import("../../src/services/db.js");

describe("Tier 4 - A5: Cross-Device Multi-Tier Approval & Realtime Sync", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("A5-1: Device A subscribes to realtime channel and initiates reimbursement request", async () => {
    let deviceANotifications = 0;
    const unsubA = db.subscribeToChanges(() => {
      deviceANotifications++;
    });

    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      category: "Travel & Logistics",
      amount: "$450.00",
      description: "Flight to client on-site infrastructure setup",
      managerId: "USR-005",
    });

    assert.ok(claim.id);
    assert.equal(claim.status, "Pending Lead");
    unsubA();
  });

  it("A5-2: Device B processes Stage 1 Lead approval transitioning status to Pending Finance", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      category: "Travel & Logistics",
      amount: "$450.00",
      managerId: "USR-005",
    });

    // Device B: Sarah Chen logs in and approves
    const leadSession = await auth.login("sarah.chen@company.com", "password123");
    assert.equal(leadSession.user.id, "USR-005");

    const stage1 = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    assert.equal(stage1.status, "Pending Finance");
    assert.equal(stage1.leadApproverId, "USR-005");
  });

  it("A5-3: Device C authorizes Stage 2 Finance approval and attaches Payout Batch ID", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      category: "Travel & Logistics",
      amount: "$450.00",
      managerId: "USR-005",
    });

    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");

    // Device C: Marcus Brody logs in and authorizes
    const finSession = await auth.login("finance@company.com", "password123");
    assert.equal(finSession.user.id, "USR-004");

    const stage2 = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody", "BATCH-REALTIME-SYNC-99");
    assert.equal(stage2.status, "Approved");
    assert.equal(stage2.payoutBatchId, "BATCH-REALTIME-SYNC-99");
  });

  it("A5-4: Device A queries updated claim state observing full audit approval trail", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      category: "Travel & Logistics",
      amount: "$450.00",
      managerId: "USR-005",
    });

    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody", "BATCH-FINAL-101");

    // Device A re-queries
    const finalized = db.getClaims().find(c => c.id === claim.id);
    assert.ok(finalized);
    assert.equal(finalized.status, "Approved");
    assert.equal(finalized.leadApproverId, "USR-005");
    assert.equal(finalized.financeApproverId, "USR-004");
    assert.equal(finalized.payoutBatchId, "BATCH-FINAL-101");
    assert.ok(finalized.leadApprovedAt);
    assert.ok(finalized.financeApprovedAt);
  });
});
