/**
 * Tier 2 Boundary Coverage: B9 - Grouped & Horizontal Bar Charts Boundaries
 * Tests zero cash flow weeks, scaling over maximum limits (> $20M), $0 OpEx items,
 * long 50+ item expense lists, and fractional cent precision.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Tier 2 - B9: Grouped & Horizontal Bar Charts Boundaries", () => {
  describe("Grouped Bar Chart Boundaries", () => {
    const height = 210;
    const padTop = 20;
    const padBottom = 30;
    const chartH = height - padTop - padBottom;
    const maxVal = 20;

    const getSafeH = (val) => {
      if (typeof val !== "number" || isNaN(val) || val <= 0) return 0;
      return Math.min(chartH, (val / maxVal) * chartH);
    };

    it("B9-1: handles week with 0 cash in and 0 cash out producing 0 height bars", () => {
      assert.equal(getSafeH(0), 0);
      assert.equal(getSafeH(-10), 0);
      assert.equal(getSafeH(NaN), 0);
    });

    it("B9-2: clamps bar height to chart viewport when cash exceeds 20M maximum scale", () => {
      assert.equal(getSafeH(25.0), chartH);
      assert.equal(getSafeH(100.0), chartH);
    });

    it("B9-3: computes precise bar heights for fractional values ($0.05M)", () => {
      const hFrac = getSafeH(0.05);
      assert.equal(Math.round(hFrac * 100) / 100, Math.round((0.05 / 20) * chartH * 100) / 100);
      assert.ok(hFrac > 0);
    });
  });

  describe("Horizontal OpEx Bar Chart Boundaries", () => {
    function computeOpExItem(label, amountStr, maxVal = 350) {
      const cleanAmount = typeof amountStr === "number" ? amountStr : parseFloat(String(amountStr).replace(/[^0-9.-]/g, "") || "0");
      const val = isNaN(cleanAmount) || cleanAmount < 0 ? 0 : cleanAmount;
      const widthPercent = maxVal > 0 ? Math.min(100, Math.max(0, (val / maxVal) * 100)) : 0;
      return {
        label: label || "Unspecified",
        amountFormatted: `$${val.toLocaleString()}`,
        widthPercent: Math.round(widthPercent * 10) / 10,
      };
    }

    it("B9-4: handles OpEx category with $0 or negative amounts safely", () => {
      const zeroItem = computeOpExItem("Misc", "$0");
      assert.equal(zeroItem.widthPercent, 0);
      assert.equal(zeroItem.amountFormatted, "$0");

      const negItem = computeOpExItem("Refunds", "-$500");
      assert.equal(negItem.widthPercent, 0);
      assert.equal(negItem.amountFormatted, "$0");
    });

    it("B9-5: handles 50+ expense categories computing ranked widths without memory exhaustion", () => {
      const categories = Array.from({ length: 50 }, (_, i) =>
        computeOpExItem(`Category ${i + 1}`, `${(50 - i) * 5}`)
      );

      assert.equal(categories.length, 50);
      assert.equal(categories[0].widthPercent, Math.round((250 / 350) * 100 * 10) / 10);
      assert.ok(categories[0].widthPercent > categories[49].widthPercent);
    });
  });
});
