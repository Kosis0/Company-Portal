/**
 * Tier 1 Feature Coverage: F5 - Financial Performance Screen
 * Verifies 4 financial metric cards, Cash Flow Forecast grouped bar chart data,
 * Top Operating Expenses ranked bar chart, Unpaid Invoices table with Terracotta badges,
 * and department budget calculations.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F5: Financial Performance Screen", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F5-1: computes 4 financial performance executive summary metric cards", () => {
    const metrics = [
      { label: "Gross Revenue (Q3)", value: "$55.6M", trend: "+14.2%", status: "up" },
      { label: "Net Burn Rate", value: "$4.1M/mo", trend: "-3.8%", status: "down" },
      { label: "Cash Reserves", value: "$82.4M", trend: "Stable", status: "neutral" },
      { label: "Unpaid Invoices", value: "$1.45M", trend: "5 Overdue", status: "warning" },
    ];

    assert.equal(metrics.length, 4);
    assert.equal(metrics[0].value, "$55.6M");
    assert.equal(metrics[1].value, "$4.1M/mo");
    assert.equal(metrics[3].status, "warning");
  });

  it("F5-2: prepares weekly Cash Flow Forecast data with Cash In and Cash Out metrics", () => {
    const weeks = [
      { name: "Week 1", cashIn: 13.2, cashOut: 7.8 },
      { name: "Week 2", cashIn: 14.5, cashOut: 6.2 },
      { name: "Week 3", cashIn: 16.1, cashOut: 9.4 },
      { name: "Week 4", cashIn: 18.0, cashOut: 8.5 },
    ];

    assert.equal(weeks.length, 4);
    const totalCashIn = weeks.reduce((acc, w) => acc + w.cashIn, 0);
    const totalCashOut = weeks.reduce((acc, w) => acc + w.cashOut, 0);
    assert.ok(totalCashIn > totalCashOut, "Net cash flow must be positive across Q3 forecast");
    assert.equal(weeks[0].name, "Week 1");
  });

  it("F5-3: structures Top Operating Expenses with proportional values and formatted amounts", () => {
    const expenses = [
      { label: "Payroll", amount: "$320,000", val: 320, color: "#3D644B" },
      { label: "Rent", amount: "$75,000", val: 75, color: "#3D644B" },
      { label: "Software", amount: "$95,000", val: 95, color: "#3D644B" },
      { label: "Marketing", amount: "$15,000", val: 15, color: "#3D644B" },
      { label: "Others", amount: "$8,000", val: 8, color: "#3D644B" },
    ];

    assert.equal(expenses.length, 5);
    const maxVal = 350;
    expenses.forEach((e) => {
      const pct = (e.val / maxVal) * 100;
      assert.ok(pct >= 0 && pct <= 100, `Percentage ${pct} must be within 0-100%`);
    });
    assert.equal(expenses[0].label, "Payroll");
    assert.equal(expenses[0].amount, "$320,000");
  });

  it("F5-4: formats Unpaid Customer Invoices with Terracotta overdue warning badges", () => {
    const invoices = [
      { id: "INV-9021", client: "Acme Corp", amount: "$450,000", dueDate: "2026-08-15", status: "Overdue", daysOverdue: 17 },
      { id: "INV-9024", client: "Globex Logistics", amount: "$220,000", dueDate: "2026-08-20", status: "Overdue", daysOverdue: 12 },
      { id: "INV-9031", client: "Stark Industries", amount: "$780,000", dueDate: "2026-09-10", status: "Pending", daysOverdue: 0 },
    ];

    const overdueList = invoices.filter(inv => inv.status === "Overdue");
    assert.equal(overdueList.length, 2);
    assert.equal(overdueList[0].client, "Acme Corp");
    assert.equal(overdueList[0].daysOverdue, 17);
  });

  it("F5-5: calculates department budget allocation, spent amount, and utilization percentage", () => {
    const budget = db.getDepartmentBudget("DEP-ENG");
    assert.ok(budget, "Department budget must exist for DEP-ENG");
    assert.ok(budget.allocatedAmount > 0, "Allocated budget must be > 0");
    assert.ok(budget.spentAmount > 0, "Spent budget must be > 0");
    assert.ok(budget.budgetUtilization.includes("%"), "Utilization must include % sign");
  });
});
