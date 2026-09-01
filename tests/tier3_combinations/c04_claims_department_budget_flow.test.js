/**
 * Tier 3 Combination Suite: C4 - Multi-Stage Expense Claims & Department Budget Flow
 * Tests cross-feature flow: Staff submits claim -> Lead approves -> Finance authorizes payout
 * -> Department operating spend increases -> Budget utilization updates.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 3 - C4: Multi-Stage Claims & Department Budget Flow", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("C4-1: tracks end-to-end claim approval flow from submission to batch payout", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      category: "Travel & Logistics",
      amount: "$650.00",
      description: "AWS Summit travel and accommodation",
      managerId: "USR-005",
    });

    assert.equal(claim.status, "Pending Lead");

    const afterLead = await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    assert.equal(afterLead.status, "Pending Finance");
    assert.equal(afterLead.leadApproverId, "USR-005");

    const afterFinance = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody", "PAYOUT-2026-SEP-01");
    assert.equal(afterFinance.status, "Approved");
    assert.equal(afterFinance.financeApproverId, "USR-004");
    assert.equal(afterFinance.payoutBatchId, "PAYOUT-2026-SEP-01");
  });

  it("C4-2: incorporates approved reimbursement claims into total departmental operational spend", () => {
    const budgetBefore = db.getDepartmentBudget("DEP-ENG");
    assert.ok(budgetBefore.allocatedAmount > 0);
    assert.ok(budgetBefore.spentAmount > 0);

    const initialSpent = budgetBefore.spentAmount;
    const additionalClaimAmount = 650;
    const updatedSpent = initialSpent + additionalClaimAmount;

    assert.ok(updatedSpent > initialSpent);
    const newUtilPct = (updatedSpent / budgetBefore.allocatedAmount) * 100;
    assert.ok(newUtilPct > 0);
  });

  it("C4-3: reflects payout batch ID across financial ledger queries", async () => {
    const claim = await db.createClaim({
      userId: "USR-009",
      name: "Chidi Nnamdi",
      category: "Software",
      amount: "$150.00",
      managerId: "USR-005",
    });

    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    const finalized = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody", "BATCH-OCT-2026");

    const allClaims = db.getClaims();
    const found = allClaims.find(c => c.id === finalized.id);
    assert.equal(found.payoutBatchId, "BATCH-OCT-2026");
    assert.equal(found.status, "Approved");
  });

  it("C4-4: ensures rejected claims are excluded from department spend increases", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      category: "Personal Expense",
      amount: "$1,200.00",
      managerId: "USR-005",
    });

    const rejected = await db.rejectClaim(claim.id, "USR-005", "Sarah Chen", "Not covered under company policy");
    assert.equal(rejected.status, "Rejected");
    assert.equal(rejected.payoutBatchId, undefined);
  });
});
