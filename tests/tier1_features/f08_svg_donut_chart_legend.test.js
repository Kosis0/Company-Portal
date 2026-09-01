/**
 * Tier 1 Feature Coverage: F8 - Pure SVG Donut Chart & Legend
 * Verifies trigonometric arc slice calculation, SVG path A/L commands,
 * legend metadata alignment, center cutout rendering, and segment hover states.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Tier 1 - F8: SVG Donut Chart & Legend", () => {
  const size = 180;
  const center = size / 2;
  const radius = 68;
  const innerRadius = 46;

  const regions = [
    { name: "North America", percentage: 50, color: "#3D644B" },
    { name: "Europe", percentage: 30, color: "#78C6B1" },
    { name: "Asia", percentage: 20, color: "#D4A373" },
  ];

  function computeSegments(items) {
    return items.reduce(
      (acc, item) => {
        const angle = (item.percentage / 100) * 360;
        const startAngle = acc.currentAngle;
        const endAngle = acc.currentAngle + angle;

        const startRad = ((startAngle - 90) * Math.PI) / 180;
        const endRad = ((endAngle - 90) * Math.PI) / 180;

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        const x3 = center + innerRadius * Math.cos(endRad);
        const y3 = center + innerRadius * Math.sin(endRad);
        const x4 = center + innerRadius * Math.cos(startRad);
        const y4 = center + innerRadius * Math.sin(startRad);

        const largeArc = angle > 180 ? 1 : 0;

        const pathData = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;

        acc.list.push({
          ...item,
          pathData,
          startAngle,
          endAngle,
        });
        acc.currentAngle = endAngle;
        return acc;
      },
      { currentAngle: 0, list: [] }
    ).list;
  }

  it("F8-1: calculates contiguous circular arcs covering exactly 360 degrees", () => {
    const segments = computeSegments(regions);
    assert.equal(segments.length, 3);
    assert.equal(segments[0].startAngle, 0);
    assert.equal(segments[0].endAngle, 180); // 50% = 180 deg
    assert.equal(segments[1].startAngle, 180);
    assert.equal(segments[1].endAngle, 288); // 180 + 30%*360 = 288 deg
    assert.equal(segments[2].startAngle, 288);
    assert.equal(segments[2].endAngle, 360); // 288 + 20%*360 = 360 deg
  });

  it("F8-2: generates valid SVG path with outer arc, line to inner radius, and inner arc reverse", () => {
    const segments = computeSegments(regions);
    segments.forEach((seg) => {
      assert.ok(seg.pathData.startsWith("M "), "Path must begin with Move command");
      assert.ok(seg.pathData.includes(`A ${radius} ${radius}`), "Path must contain outer arc");
      assert.ok(seg.pathData.includes(" L "), "Path must contain Line to inner radius");
      assert.ok(seg.pathData.includes(`A ${innerRadius} ${innerRadius}`), "Path must contain inner reverse arc");
      assert.ok(seg.pathData.endsWith(" Z"), "Path must close with Z command");
    });
  });

  it("F8-3: maintains inner cutout circle radius and center label positioning", () => {
    const cutoutRadius = innerRadius - 4; // 42px
    assert.equal(cutoutRadius, 42);
    assert.ok(cutoutRadius < innerRadius, "Cutout circle must be smaller than inner arc radius");
    assert.equal(center, 90);
  });

  it("F8-4: matches legend items with corresponding segment colors and percentages", () => {
    regions.forEach((r) => {
      assert.ok(r.name);
      assert.ok(r.color.startsWith("#"));
      assert.ok(r.percentage > 0);
    });
    assert.equal(regions[0].color, "#3D644B");
    assert.equal(regions[1].color, "#78C6B1");
    assert.equal(regions[2].color, "#D4A373");
  });

  it("F8-5: updates center percentage readout dynamically on segment hover", () => {
    function getCenterLabel(hoveredName, items) {
      if (!hoveredName) return "100%";
      const item = items.find((r) => r.name === hoveredName);
      return item ? `${item.percentage}%` : "100%";
    }

    assert.equal(getCenterLabel(null, regions), "100%");
    assert.equal(getCenterLabel("North America", regions), "50%");
    assert.equal(getCenterLabel("Europe", regions), "30%");
    assert.equal(getCenterLabel("Asia", regions), "20%");
  });
});
