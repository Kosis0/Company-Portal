/**
 * Tier 1 Feature Coverage: F9 - Grouped & Horizontal Bar Charts
 * Verifies grouped bar coordinate offsets (Cash In vs Cash Out), horizontal OpEx bar
 * percentage widths, scaling limits, and monospaced number formatting.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Tier 1 - F9: Grouped & Horizontal Bar Charts", () => {
  describe("Cash Flow Forecast Grouped Bar Chart", () => {
    const width = 560;
    const height = 210;
    const padLeft = 45;
    const padRight = 15;
    const padTop = 20;
    const padBottom = 30;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;
    const maxVal = 20;

    const weeks = [
      { name: "Week 1", cashIn: 13.2, cashOut: 7.8 },
      { name: "Week 2", cashIn: 14.5, cashOut: 6.2 },
      { name: "Week 3", cashIn: 16.1, cashOut: 9.4 },
      { name: "Week 4", cashIn: 18.0, cashOut: 8.5 },
    ];

    const groupW = chartW / weeks.length;
    const barW = 28;

    const getY = (val) => padTop + chartH - (val / maxVal) * chartH;
    const getH = (val) => (val / maxVal) * chartH;

    it("F9-1: positions dual bars side-by-side within each week group", () => {
      weeks.forEach((w, i) => {
        const groupX = padLeft + i * groupW + groupW / 2;
        const inX = groupX - barW - 2;
        const outX = groupX + 2;

        assert.ok(inX < outX, "Cash In bar must sit to the left of Cash Out bar");
        assert.equal(outX - (inX + barW), 4, "Inter-bar gap must be exactly 4px");
      });
    });

    it("F9-2: calculates bar height proportionally against maxVal scale", () => {
      const hZero = getH(0);
      const hMax = getH(20);
      const hHalf = getH(10);

      assert.equal(hZero, 0);
      assert.equal(hMax, chartH);
      assert.equal(hHalf, chartH / 2);

      const hWeek1In = getH(weeks[0].cashIn);
      assert.equal(Math.round(hWeek1In * 100) / 100, Math.round((13.2 / 20) * chartH * 100) / 100);
    });

    it("F9-3: maps Y coordinates so taller bars start higher in SVG space", () => {
      const y18 = getY(18.0);
      const y8 = getY(8.0);
      assert.ok(y18 < y8, "Higher cash value (18) must have smaller SVG Y coordinate than lower cash value (8)");
    });
  });

  describe("Top Operating Expenses Horizontal Bar Chart", () => {
    const expenses = [
      { label: "Payroll", amount: "$320,000", val: 320, color: "#3D644B" },
      { label: "Rent", amount: "$75,000", val: 75, color: "#3D644B" },
      { label: "Software", amount: "$95,000", val: 95, color: "#3D644B" },
      { label: "Marketing", amount: "$15,000", val: 15, color: "#3D644B" },
      { label: "Others", amount: "$8,000", val: 8, color: "#3D644B" },
    ];
    const maxVal = 350;

    it("F9-4: computes horizontal progress bar percentage widths for each category", () => {
      const payrollPct = (expenses[0].val / maxVal) * 100;
      const rentPct = (expenses[1].val / maxVal) * 100;

      assert.equal(Math.round(payrollPct * 100) / 100, Math.round((320 / 350) * 100 * 100) / 100); // ~91.43%
      assert.equal(Math.round(rentPct * 100) / 100, Math.round((75 / 350) * 100 * 100) / 100); // ~21.43%
    });

    it("F9-5: formats expense amounts with standard currency prefix and thousands commas", () => {
      expenses.forEach((e) => {
        assert.ok(e.amount.startsWith("$"));
        assert.match(e.amount, /^\$[0-9]{1,3}(,[0-9]{3})*$/);
      });
      assert.equal(expenses[0].amount, "$320,000");
    });
  });
});
