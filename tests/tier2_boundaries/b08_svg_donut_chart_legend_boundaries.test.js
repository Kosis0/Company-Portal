/**
 * Tier 2 Boundary Coverage: B8 - SVG Donut Chart & Legend Boundaries
 * Tests single 100% slice rendering, 0% slices, percentage normalizations,
 * empty region lists, and 20+ micro-segment slices.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Tier 2 - B8: SVG Donut Chart & Legend Boundaries", () => {
  const size = 180;
  const center = size / 2;
  const radius = 68;
  const innerRadius = 46;

  function safeComputeDonutSegments(regions) {
    if (!regions || !Array.isArray(regions) || regions.length === 0) {
      return [];
    }

    // Filter out <= 0% slices
    const validRegions = regions.filter(r => typeof r.percentage === "number" && r.percentage > 0);
    if (validRegions.length === 0) return [];

    // Normalize if sum != 100%
    const sum = validRegions.reduce((acc, r) => acc + r.percentage, 0);
    const normalized = validRegions.map(r => ({
      ...r,
      normalizedPct: (r.percentage / sum) * 100,
    }));

    return normalized.reduce(
      (acc, item) => {
        // Special case: Single 100% slice
        if (normalized.length === 1 && item.normalizedPct >= 99.99) {
          const pathData = `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center - 0.01} ${center - radius} L ${center - 0.01} ${center - innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 ${center} ${center - innerRadius} Z`;
          acc.list.push({ ...item, pathData, angle: 360 });
          return acc;
        }

        const angle = (item.normalizedPct / 100) * 360;
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

        acc.list.push({ ...item, pathData, startAngle, endAngle });
        acc.currentAngle = endAngle;
        return acc;
      },
      { currentAngle: 0, list: [] }
    ).list;
  }

  it("B8-1: renders a single 100% full circle slice without geometric singularity", () => {
    const single = [{ name: "Global", percentage: 100, color: "#3D644B" }];
    const segments = safeComputeDonutSegments(single);

    assert.equal(segments.length, 1);
    assert.ok(segments[0].pathData.includes(`A ${radius} ${radius}`));
    assert.ok(segments[0].pathData.includes(`A ${innerRadius} ${innerRadius}`));
  });

  it("B8-2: omits 0% or negative percentage slices from SVG rendering", () => {
    const mixed = [
      { name: "A", percentage: 60, color: "#111" },
      { name: "B", percentage: 0, color: "#222" },
      { name: "C", percentage: -10, color: "#333" },
      { name: "D", percentage: 40, color: "#444" },
    ];
    const segments = safeComputeDonutSegments(mixed);

    assert.equal(segments.length, 2);
    assert.equal(segments[0].name, "A");
    assert.equal(segments[1].name, "D");
  });

  it("B8-3: auto-normalizes slices when input percentages sum to != 100%", () => {
    const unnormalized = [
      { name: "A", percentage: 25, color: "#111" },
      { name: "B", percentage: 25, color: "#222" },
    ]; // Sum is 50%, normalized should be 50% and 50%
    const segments = safeComputeDonutSegments(unnormalized);

    assert.equal(segments.length, 2);
    assert.equal(segments[0].normalizedPct, 50);
    assert.equal(segments[1].normalizedPct, 50);
    assert.equal(segments[1].endAngle, 360);
  });

  it("B8-4: returns empty array for null, empty or invalid datasets", () => {
    assert.deepEqual(safeComputeDonutSegments([]), []);
    assert.deepEqual(safeComputeDonutSegments(null), []);
    assert.deepEqual(safeComputeDonutSegments([{ name: "Zero", percentage: 0 }]), []);
  });

  it("B8-5: handles 20 micro-segments without arithmetic drift exceeding 360 degrees", () => {
    const microRegions = Array.from({ length: 20 }, (_, i) => ({
      name: `Region ${i + 1}`,
      percentage: 5,
      color: "#3D644B",
    }));

    const segments = safeComputeDonutSegments(microRegions);
    assert.equal(segments.length, 20);
    const lastSeg = segments[segments.length - 1];
    assert.equal(Math.round(lastSeg.endAngle), 360, "Final arc angle must close cleanly at 360 degrees");
  });
});
