/**
 * Tier 2 Boundary Coverage: B7 - SVG Multi-Line Trend Chart Boundaries
 * Tests empty dataset array, single point curves, all-zero coordinates,
 * dynamic peak scaling (> $100M), and non-numeric value sanitization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Tier 2 - B7: SVG Multi-Line Trend Chart Boundaries", () => {
  const width = 580;
  const height = 220;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 25;
  const padBottom = 35;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  function createSafeTrendPath(data, key, defaultMax = 16) {
    if (!data || !Array.isArray(data) || data.length === 0) return { path: "", points: [], maxVal: defaultMax };

    // Dynamically adjust maxVal if data exceeds defaultMax
    const values = data.map(d => (typeof d[key] === "number" && !isNaN(d[key]) ? d[key] : 0));
    const highest = Math.max(...values, 0);
    const maxVal = highest > defaultMax ? Math.ceil(highest * 1.15) : defaultMax;

    const getX = (i) => data.length === 1 ? padLeft + chartW / 2 : padLeft + (i / (data.length - 1)) * chartW;
    const getY = (val) => padTop + chartH - (val / maxVal) * chartH;

    const pointObjs = values.map((val, i) => ({ x: getX(i), y: getY(val) }));

    if (pointObjs.length === 1) {
      return { path: `M ${pointObjs[0].x} ${pointObjs[0].y}`, points: pointObjs, maxVal };
    }

    let path = `M ${pointObjs[0].x} ${pointObjs[0].y}`;
    for (let i = 0; i < pointObjs.length - 1; i++) {
      const p0 = pointObjs[i];
      const p1 = pointObjs[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    return { path, points: pointObjs, maxVal };
  }

  it("B7-1: handles empty array [] returning empty path and default scale without error", () => {
    const result = createSafeTrendPath([], "revenue");
    assert.equal(result.path, "");
    assert.deepEqual(result.points, []);
    assert.equal(result.maxVal, 16);
  });

  it("B7-2: handles single data point positioning point at chart horizontal center", () => {
    const single = [{ month: "Jan", revenue: 10 }];
    const result = createSafeTrendPath(single, "revenue");

    assert.equal(result.points.length, 1);
    assert.equal(result.points[0].x, padLeft + chartW / 2);
    assert.equal(result.path, `M ${padLeft + chartW / 2} ${result.points[0].y}`);
  });

  it("B7-3: handles all-zero dataset mapping all points to baseline Y coordinate", () => {
    const allZero = [
      { month: "Jan", revenue: 0 },
      { month: "Feb", revenue: 0 },
      { month: "Mar", revenue: 0 },
    ];
    const result = createSafeTrendPath(allZero, "revenue");

    const baselineY = padTop + chartH;
    result.points.forEach((p) => {
      assert.equal(p.y, baselineY, "All zero data points must map exactly to baseline Y");
    });
  });

  it("B7-4: scales maxVal dynamically when data values exceed default threshold ($100M+)", () => {
    const megaData = [
      { month: "Jan", revenue: 50 },
      { month: "Feb", revenue: 120 },
      { month: "Mar", revenue: 80 },
    ];
    const result = createSafeTrendPath(megaData, "revenue");

    assert.ok(result.maxVal >= 120, `Max scale ${result.maxVal} must accommodate peak 120`);
    result.points.forEach((p) => {
      assert.ok(p.y >= padTop && p.y <= padTop + chartH, `Point Y ${p.y} must stay inside chart`);
    });
  });

  it("B7-5: sanitizes non-numeric and NaN values in dataset fallbacking to zero", () => {
    const malformed = [
      { month: "Jan", revenue: "invalid_num" },
      { month: "Feb", revenue: null },
      { month: "Mar", revenue: NaN },
      { month: "Apr", revenue: 10 },
    ];
    const result = createSafeTrendPath(malformed, "revenue");

    assert.equal(result.points.length, 4);
    assert.equal(result.points[0].y, padTop + chartH); // 0
    assert.equal(result.points[1].y, padTop + chartH); // 0
    assert.equal(result.points[2].y, padTop + chartH); // 0
    assert.ok(result.points[3].y < padTop + chartH);   // 10
  });
});
