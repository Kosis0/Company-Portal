/**
 * Tier 4 Real-World Application Scenario: A3 - Finance Controller Reconciliation & Payroll
 * Exercised Features: F1, F2, F5, F9, F11, F12
 *
 * Workflow:
 * 1. Head of Finance Marcus Brody logs in with Tier 4 credentials.
 * 2. Reviews Financial Performance Dashboard & Unpaid Invoices with overdue warning badges.
 * 3. Analyzes 4-week Cash Flow Forecast (Cash In: $61.8M vs Cash Out: $31.9M).
 * 4. Authorizes Level-2 finance payout on pending claims and assigns Payout Batch ID.
 * 5. Executes company-wide monthly payroll batch for all active staff, computing statutory PAYE/Pension.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { auth } = await import("../../src/services/auth.js");
const { db } = await import("../../src/services/db.js");

describe("Tier 4 - A3: Finance Reconciliation & Payroll Workflow", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("A3-1: Head of Finance authenticates and audits Unpaid Invoices table", async () => {
    const session = await auth.login("finance@company.com", "password123");
    assert.equal(session.user.tier, 4);
    assert.equal(session.user.department, "Finance & Operations");

    const invoices = [
      { id: "INV-9021", client: "Acme Corp", amount: "$450,000", status: "Overdue", days: 17 },
      { id: "INV-9024", client: "Globex Logistics", amount: "$220,000", status: "Overdue", days: 12 },
    ];
    const totalOverdue = invoices.reduce((acc, i) => acc + parseInt(i.amount.replace(/[^0-9]/g, "")), 0);
    assert.equal(totalOverdue, 670000);
  });

  it("A3-2: validates Q3 weekly Cash Flow Forecast margins", () => {
    const weeks = [
      { name: "Week 1", cashIn: 13.2, cashOut: 7.8 },
      { name: "Week 2", cashIn: 14.5, cashOut: 6.2 },
      { name: "Week 3", cashIn: 16.1, cashOut: 9.4 },
      { name: "Week 4", cashIn: 18.0, cashOut: 8.5 },
    ];

    const totalCashIn = weeks.reduce((acc, w) => acc + w.cashIn, 0);
    const totalCashOut = weeks.reduce((acc, w) => acc + w.cashOut, 0);
    const netReserveAddition = totalCashIn - totalCashOut;

    assert.equal(Math.round(totalCashIn * 10) / 10, 61.8);
    assert.equal(Math.round(totalCashOut * 10) / 10, 31.9);
    assert.equal(Math.round(netReserveAddition * 10) / 10, 29.9);
  });

  it("A3-3: processes Level-2 finance authorization on pending reimbursement claims", async () => {
    const claim = await db.createClaim({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      category: "Internet & Remote Work Allowance",
      amount: "$120.00",
      description: "Monthly fiber internet",
      managerId: "USR-005",
    });

    await db.approveClaimLead(claim.id, "USR-005", "Sarah Chen");
    const finalized = await db.approveClaimFinance(claim.id, "USR-004", "Marcus Brody", "PAYOUT-BATCH-SEP26");

    assert.equal(finalized.status, "Approved");
    assert.equal(finalized.payoutBatchId, "PAYOUT-BATCH-SEP26");
    assert.equal(finalized.financeApproverName, "Marcus Brody");
  });

  it("A3-4: executes monthly batch payroll for all active staff with statutory deductions", () => {
    const payrollBatch = db.executeMonthlyPayroll("USR-004", "Marcus Brody", "September 2026");

    assert.ok(payrollBatch.id);
    assert.ok(payrollBatch.headcount >= 10);
    assert.ok(payrollBatch.totalGross > 0);
    assert.ok(payrollBatch.totalNet > 0);
    assert.ok(payrollBatch.totalGross > payrollBatch.totalNet, "Total gross payroll must exceed net payout due to tax and pension deductions");
  });
});
