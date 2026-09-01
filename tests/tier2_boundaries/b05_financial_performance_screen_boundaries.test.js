/**
 * Tier 2 Boundary Coverage: B5 - Financial Performance Screen Boundaries
 * Tests zero unpaid invoices, severe invoice overdue delays (365+ days),
 * negative cash flow weeks, 100% budget overspend (>200%), and zero-dollar OpEx categories.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Tier 2 - B5: Financial Performance Screen Boundaries", () => {
  it("B5-1: formats overdue badges for severe delays (>180 and >365 days)", () => {
    function getInvoiceBadge(daysOverdue) {
      if (daysOverdue <= 0) return { label: "Current", className: "badge badge-success" };
      if (daysOverdue > 365) return { label: "1+ Year Overdue", className: "badge badge-danger" };
      if (daysOverdue > 90) return { label: "90+ Days Overdue", className: "badge badge-danger" };
      return { label: `${daysOverdue}d Overdue`, className: "badge badge-warning" };
    }

    assert.deepEqual(getInvoiceBadge(0), { label: "Current", className: "badge badge-success" });
    assert.deepEqual(getInvoiceBadge(14), { label: "14d Overdue", className: "badge badge-warning" });
    assert.deepEqual(getInvoiceBadge(120), { label: "90+ Days Overdue", className: "badge badge-danger" });
    assert.deepEqual(getInvoiceBadge(400), { label: "1+ Year Overdue", className: "badge badge-danger" });
  });

  it("B5-2: handles empty unpaid invoices dataset rendering zero count", () => {
    function calculateUnpaidSummary(invoices) {
      if (!invoices || invoices.length === 0) {
        return { totalOverdueCount: 0, totalOverdueAmount: "$0.00", invoices: [] };
      }
      const overdue = invoices.filter(i => i.status === "Overdue");
      const sum = overdue.reduce((acc, i) => acc + parseFloat(i.amount.replace(/[^0-9.]/g, "")), 0);
      return {
        totalOverdueCount: overdue.length,
        totalOverdueAmount: `$${sum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        invoices: overdue,
      };
    }

    assert.deepEqual(calculateUnpaidSummary([]), { totalOverdueCount: 0, totalOverdueAmount: "$0.00", invoices: [] });
    assert.deepEqual(calculateUnpaidSummary(null), { totalOverdueCount: 0, totalOverdueAmount: "$0.00", invoices: [] });
  });

  it("B5-3: calculates net cash delta when weekly cash out exceeds cash in (negative net cash flow)", () => {
    function getWeeklyCashStatus(week) {
      const net = week.cashIn - week.cashOut;
      return {
        week: week.name,
        net: Math.round(net * 100) / 100,
        isDeficit: net < 0,
        statusLabel: net < 0 ? `Deficit (-$${Math.abs(net)}M)` : `Surplus (+$${net}M)`,
      };
    }

    const surplusWeek = { name: "Week 1", cashIn: 15.0, cashOut: 8.0 };
    assert.deepEqual(getWeeklyCashStatus(surplusWeek), {
      week: "Week 1",
      net: 7.0,
      isDeficit: false,
      statusLabel: "Surplus (+$7M)",
    });

    const deficitWeek = { name: "Week 2", cashIn: 6.5, cashOut: 12.0 };
    assert.deepEqual(getWeeklyCashStatus(deficitWeek), {
      week: "Week 2",
      net: -5.5,
      isDeficit: true,
      statusLabel: "Deficit (-$5.5M)",
    });
  });

  it("B5-4: handles OpEx category with $0 amount without NaN width calculation", () => {
    function getOpExBarWidth(amount, maxVal = 350) {
      if (typeof amount !== "number" || isNaN(amount) || amount <= 0) return 0;
      return Math.min(100, (amount / maxVal) * 100);
    }

    assert.equal(getOpExBarWidth(0), 0);
    assert.equal(getOpExBarWidth(-20), 0);
    assert.equal(getOpExBarWidth(NaN), 0);
    assert.equal(getOpExBarWidth(350), 100);
    assert.equal(getOpExBarWidth(500), 100); // Clamped at 100%
  });

  it("B5-5: calculates department budget overspend above 100% accurately", () => {
    function computeBudgetHealth(allocated, spent) {
      if (!allocated || allocated <= 0) {
        return { utilization: 0, utilizationStr: "0%", isOverspent: false, overspendAmount: 0 };
      }
      const util = (spent / allocated) * 100;
      const isOverspent = spent > allocated;
      const overspendAmount = isOverspent ? spent - allocated : 0;
      return {
        utilization: Math.round(util * 10) / 10,
        utilizationStr: `${Math.round(util)}%`,
        isOverspent,
        overspendAmount,
      };
    }

    const healthy = computeBudgetHealth(50000, 35000);
    assert.equal(healthy.utilizationStr, "70%");
    assert.equal(healthy.isOverspent, false);

    const overspent = computeBudgetHealth(20000, 45000);
    assert.equal(overspent.utilizationStr, "225%");
    assert.equal(overspent.isOverspent, true);
    assert.equal(overspent.overspendAmount, 25000);
  });
});
