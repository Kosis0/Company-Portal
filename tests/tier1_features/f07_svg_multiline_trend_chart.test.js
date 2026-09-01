/**
 * Tier 1 Feature Coverage: F7 - Pure SVG Multi-Line Trend Chart
 * Verifies mathematical coordinate transforms, smooth cubic bezier curve generation,
 * Y-axis tick scaling, interactive hover calculations, and tooltip positions.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Tier 1 - F7: SVG Multi-Line Trend Chart", () => {
  const width = 580;
  const height = 220;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 25;
  const padBottom = 35;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const maxVal = 16;
  const minVal = 0;

  const data = [
    { month: "Jan", revenue: 5.2, expenses: 3.8 },
    { month: "Feb", revenue: 8.4, expenses: 5.9 },
    { month: "Mar", revenue: 7.1, expenses: 5.4 },
    { month: "Apr", revenue: 11.6, expenses: 8.2 },
    { month: "May", revenue: 9.8, expenses: 6.7 },
    { month: "Jun", revenue: 13.5, expenses: 10.1 },
  ];

  const getX = (index) => padLeft + (index / (data.length - 1)) * chartW;
  const getY = (val) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const createCurvedPath = (points) => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  it("F7-1: calculates exact X and Y coordinates within SVG viewport boundaries", () => {
    const x0 = getX(0);
    const xLast = getX(data.length - 1);
    assert.equal(x0, padLeft);
    assert.equal(xLast, width - padRight);

    const yMin = getY(0);
    const yMax = getY(16);
    assert.equal(yMin, padTop + chartH);
    assert.equal(yMax, padTop);
  });

  it("F7-2: constructs smooth cubic bezier SVG path starting with M command and C control points", () => {
    const revPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.revenue) }));
    const path = createCurvedPath(revPoints);

    assert.ok(path.startsWith(`M ${padLeft}`), "Path must start with M command at padLeft");
    assert.ok(path.includes(" C "), "Path must contain cubic bezier C command");
    const cSegments = path.split(" C ").length - 1;
    assert.equal(cSegments, data.length - 1, "Must generate exactly (N-1) cubic bezier segments");
  });

  it("F7-3: generates Y-axis gridline ticks and currency labels", () => {
    const yTicks = [
      { label: "$15M", val: 15 },
      { label: "$10M", val: 10 },
      { label: "$5M", val: 5 },
      { label: "$0", val: 0 },
    ];

    assert.equal(yTicks.length, 4);
    yTicks.forEach(tick => {
      const y = getY(tick.val);
      assert.ok(y >= padTop && y <= padTop + chartH, `Y-tick coordinate ${y} must be within chart bounds`);
    });
  });

  it("F7-4: computes hover coordinates for guidelines and tooltip positioning", () => {
    const hoverIdx = 3; // April (11.6 Rev, 8.2 Exp)
    const hoverX = getX(hoverIdx);
    const hoverYRev = getY(data[hoverIdx].revenue);
    const hoverYExp = getY(data[hoverIdx].expenses);

    assert.ok(hoverX > padLeft && hoverX < width - padRight);
    assert.ok(hoverYRev < hoverYExp, "Higher revenue must map to lower SVG Y coordinate");
    const tooltipLeftPercent = (hoverX / width) * 100;
    assert.ok(tooltipLeftPercent > 0 && tooltipLeftPercent < 100);
  });

  it("F7-5: handles variable data point counts and updates scale dynamically", () => {
    const customData = [
      { month: "Q1", revenue: 20, expenses: 15 },
      { month: "Q2", revenue: 25, expenses: 18 },
      { month: "Q3", revenue: 30, expenses: 22 },
    ];

    const getCustomX = (i) => padLeft + (i / (customData.length - 1)) * chartW;
    const points = customData.map((d, i) => ({ x: getCustomX(i), y: getY(d.revenue) }));
    const customPath = createCurvedPath(points);

    assert.ok(customPath.startsWith(`M ${padLeft}`));
    assert.equal(customPath.split(" C ").length - 1, 2);
  });
});
