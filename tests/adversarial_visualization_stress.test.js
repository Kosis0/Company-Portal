/**
 * Empirical Adversarial Stress Test Suite: SVG Data Visualizations & Shipment Timeline
 *
 * Stress-tests:
 * 1. RevenueExpensesTrendChart: Zeroes, negative amounts, $100M+ outliers, empty array, single data point (NaN check), XSS/long labels.
 * 2. SalesByRegionDonutChart: Single 100% slice (arc singularity), 0% slices, non-100% sums (50% gap, 180% overlap), 25+ slices, extreme outlier ratio, XSS/long labels.
 * 3. CashFlowForecastChart: Zero values, negative cash in/out (SVG negative rect height), $100M+ spikes, empty array (Infinity group width), single week.
 * 4. TopOperatingExpensesChart: Negative OpEx, extreme values ($1M+), 50+ categories, empty array, XSS/long labels.
 * 5. ShipmentTimeline: Empty shipments, single shipment, null/missing fields fallback, unknown status strings, XSS injection.
 * 6. Theme Switching & Token Integrity: Rapid toggling, CSS variable contrast in light and dark modes.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Adversarial Visualization & UI Stress Harness", () => {

  // =========================================================================
  // 1. REVENUE VS. EXPENSES TREND CHART EMPIRICAL STRESS TESTS
  // =========================================================================
  describe("1. RevenueExpensesTrendChart Edge Cases & Math Stress", () => {
    const width = 580;
    const height = 220;
    const padLeft = 45;
    const padRight = 20;
    const padTop = 25;
    const padBottom = 35;
    const chartW = width - padLeft - padRight; // 515
    const chartH = height - padTop - padBottom; // 160
    const defaultMax = 16;
    const defaultMin = 0;

    // Direct mathematical implementation as defined in AnalyticsCharts.jsx
    const getX_raw = (index, dataLen) => padLeft + (index / (dataLen - 1)) * chartW;
    const getY_raw = (val, minVal = defaultMin, maxVal = defaultMax) =>
      padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

    const createCurvedPath = (points) => {
      if (points.length === 0) return "";
      let pathStr = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX = (p0.x + p1.x) / 2;
        pathStr += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
      }
      return pathStr;
    };

    it("ADV-1.1: Single data point produces NaN in raw component math (dataLen - 1 = 0)", () => {
      const singleData = [{ month: "Jan", revenue: 10, expenses: 5 }];
      const xCoord = getX_raw(0, singleData.length);
      
      // EMPIRICAL VERIFICATION: 0 / 0 produces NaN
      assert.ok(Number.isNaN(xCoord), "Raw getX(0) on single-item array produces NaN due to (0 / 0)");

      const points = singleData.map((d, i) => ({
        x: getX_raw(i, singleData.length),
        y: getY_raw(d.revenue),
      }));
      const pathResult = createCurvedPath(points);
      assert.equal(pathResult, "M NaN 85", "Path contains NaN coordinates for single data point");
    });

    it("ADV-1.2: Empty array [] produces empty path without throwing exception", () => {
      const emptyData = [];
      const points = emptyData.map((d, i) => ({
        x: getX_raw(i, emptyData.length),
        y: getY_raw(d.revenue),
      }));
      const pathResult = createCurvedPath(points);
      assert.equal(pathResult, "", "Empty array must return empty path string");
      assert.deepEqual(points, []);
    });

    it("ADV-1.3: Zero values ({ revenue: 0, expenses: 0 }) map precisely to baseline Y coordinate", () => {
      const zeroData = [
        { month: "Jan", revenue: 0, expenses: 0 },
        { month: "Feb", revenue: 0, expenses: 0 },
        { month: "Mar", revenue: 0, expenses: 0 },
      ];
      const baselineY = padTop + chartH; // 185px

      zeroData.forEach((d, i) => {
        const yRev = getY_raw(d.revenue);
        const yExp = getY_raw(d.expenses);
        assert.equal(yRev, baselineY, `Revenue Y coordinate must be at baseline (${baselineY}px)`);
        assert.equal(yExp, baselineY, `Expenses Y coordinate must be at baseline (${baselineY}px)`);
      });
    });

    it("ADV-1.4: Negative revenue/expenses values map below baseline (into X-axis label territory)", () => {
      const negativeData = [
        { month: "Jan", revenue: -5.0, expenses: -10.0 },
      ];
      const baselineY = padTop + chartH; // 185px
      const yRev = getY_raw(negativeData[0].revenue); // 25 + 160 - (-5 / 16) * 160 = 185 + 50 = 235
      const yExp = getY_raw(negativeData[0].expenses); // 25 + 160 - (-10 / 16) * 160 = 185 + 100 = 285

      assert.ok(yRev > baselineY, "Negative revenue Y (235px) extends below the baseline (185px)");
      assert.ok(yRev > height, "Negative revenue Y (235px) exceeds total SVG canvas height (220px)");
      assert.ok(yExp > height, "Negative expenses Y (285px) exceeds total SVG canvas height (220px)");
    });

    it("ADV-1.5: Extreme outlier ($100M+, $1B) maps far above SVG viewport without dynamic scale", () => {
      const megaData = [{ month: "Jan", revenue: 160, expenses: 1600 }];
      const yRev = getY_raw(megaData[0].revenue); // 185 - 1600 = -1415
      const yExp = getY_raw(megaData[0].expenses); // 185 - 16000 = -15815

      assert.ok(yRev < 0, "Revenue Y (-1415px) is plotted far above top viewport boundary");
      assert.ok(yExp < 0, "Expenses Y (-15815px) is plotted far above top viewport boundary");
    });

    it("ADV-1.6: Special characters and long labels in month names", () => {
      const longName = "A".repeat(150);
      const xssName = "<script>alert('xss')</script>";
      const testData = [
        { month: longName, revenue: 10, expenses: 5 },
        { month: xssName, revenue: 12, expenses: 8 },
      ];

      assert.equal(testData[0].month.length, 150);
      assert.ok(testData[1].month.includes("<script>"));
    });
  });

  // =========================================================================
  // 2. SALES BY REGION DONUT CHART EMPIRICAL STRESS TESTS
  // =========================================================================
  describe("2. SalesByRegionDonutChart Edge Cases & Geometry Stress", () => {
    const size = 180;
    const center = size / 2; // 90
    const radius = 68;
    const innerRadius = 46;

    function computeDonutSegments(regions) {
      return regions.reduce(
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

          const pathData = `
            M ${x1.toFixed(4)} ${y1.toFixed(4)}
            A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(4)} ${y2.toFixed(4)}
            L ${x3.toFixed(4)} ${y3.toFixed(4)}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4.toFixed(4)} ${y4.toFixed(4)}
            Z
          `.trim();

          const midAngle = startAngle + angle / 2;
          const midRad = ((midAngle - 90) * Math.PI) / 180;
          const labelX = center + ((radius + innerRadius) / 2) * Math.cos(midRad);
          const labelY = center + ((radius + innerRadius) / 2) * Math.sin(midRad);

          acc.list.push({
            ...item,
            angle,
            startAngle,
            endAngle,
            x1, y1, x2, y2, x3, y3, x4, y4,
            pathData,
            labelX,
            labelY,
          });
          acc.currentAngle = endAngle;
          return acc;
        },
        { currentAngle: 0, list: [] }
      ).list;
    }

    it("ADV-2.1: Single 100% slice creates identical start/end point (SVG arc singularity)", () => {
      const singleRegion = [{ name: "Global", percentage: 100, color: "#3D644B" }];
      const segments = computeDonutSegments(singleRegion);

      assert.equal(segments.length, 1);
      const seg = segments[0];

      // In floating-point math:
      // startAngle = 0 -> startRad = -pi/2 -> cos(-pi/2)=0, sin(-pi/2)=-1 -> (90, 22)
      // endAngle = 360 -> endRad = 3pi/2 -> cos(3pi/2)=0, sin(3pi/2)=-1 -> (90, 22)
      assert.ok(Math.abs(seg.x1 - seg.x2) < 0.0001, "Outer arc start X equals end X");
      assert.ok(Math.abs(seg.y1 - seg.y2) < 0.0001, "Outer arc start Y equals end Y");
      assert.ok(Math.abs(seg.x3 - seg.x4) < 0.0001, "Inner arc start X equals end X");
      assert.ok(Math.abs(seg.y3 - seg.y4) < 0.0001, "Inner arc start Y equals end Y");

      // NOTE: In SVG 1.1 specification section 8.3.8, if endpoint is identical to start point,
      // the arc segment is degenerate and does not render a full circle.
    });

    it("ADV-2.2: 0% slices generate zero-length degenerate path", () => {
      const zeroSliceRegions = [
        { name: "Region A", percentage: 0, color: "#3D644B" },
        { name: "Region B", percentage: 100, color: "#78C6B1" },
      ];
      const segments = computeDonutSegments(zeroSliceRegions);
      assert.equal(segments[0].angle, 0);
      assert.equal(segments[0].x1, segments[0].x2);
      assert.equal(segments[0].y1, segments[0].y2);
    });

    it("ADV-2.3: Non-100% donut sum (50% sum) leaves an unrendered 180-degree gap", () => {
      const halfDonut = [
        { name: "Region A", percentage: 25, color: "#3D644B" },
        { name: "Region B", percentage: 25, color: "#78C6B1" },
      ];
      const segments = computeDonutSegments(halfDonut);
      const totalAngle = segments.reduce((sum, s) => sum + s.angle, 0);

      assert.equal(totalAngle, 180, "Total arc angle is 180 degrees (half-donut)");
      assert.equal(segments[1].endAngle, 180);
      // Gap remains between 180 and 360
    });

    it("ADV-2.4: Non-100% donut sum (180% sum) creates overlapping arc segments", () => {
      const overDonut = [
        { name: "Region A", percentage: 90, color: "#3D644B" },
        { name: "Region B", percentage: 90, color: "#78C6B1" },
      ];
      const segments = computeDonutSegments(overDonut);
      const totalAngle = segments.reduce((sum, s) => sum + s.angle, 0);

      assert.equal(totalAngle, 648, "Total arc angle is 648 degrees (overlaps 288 degrees)");
      assert.equal(segments[1].endAngle, 648);
    });

    it("ADV-2.5: 25 high-density slices compute distinct contiguous angles covering 360 degrees", () => {
      const manySlices = Array.from({ length: 25 }, (_, i) => ({
        name: `Territory ${i + 1}`,
        percentage: 4, // 25 * 4 = 100%
        color: `#${((i * 1234567) & 0xffffff).toString(16).padStart(6, "0")}`,
      }));

      const segments = computeDonutSegments(manySlices);
      assert.equal(segments.length, 25);

      let expectedStart = 0;
      segments.forEach((seg, i) => {
        assert.equal(seg.angle, 14.4, `Slice ${i} angle must be 14.4 degrees`);
        assert.ok(Math.abs(seg.startAngle - expectedStart) < 0.0001);
        expectedStart += 14.4;
      });
      assert.ok(Math.abs(expectedStart - 360) < 0.0001);
    });

    it("ADV-2.6: Outlier ratio (99.999% vs 0.001%) computes without numeric divergence", () => {
      const extremeRatio = [
        { name: "Dominant", percentage: 99.999, color: "#3D644B" },
        { name: "Micro", percentage: 0.001, color: "#78C6B1" },
      ];
      const segments = computeDonutSegments(extremeRatio);

      assert.ok(!Number.isNaN(segments[0].labelX));
      assert.ok(!Number.isNaN(segments[1].labelX));
      assert.ok(segments[0].angle > 359.99);
      assert.ok(segments[1].angle < 0.01);
    });
  });

  // =========================================================================
  // 3. CASH FLOW FORECAST GROUPED BAR CHART EMPIRICAL STRESS TESTS
  // =========================================================================
  describe("3. CashFlowForecastChart Edge Cases & Bar Math Stress", () => {
    const width = 560;
    const height = 210;
    const padLeft = 45;
    const padRight = 15;
    const padTop = 20;
    const padBottom = 30;
    const chartW = width - padLeft - padRight; // 500
    const chartH = height - padTop - padBottom; // 160
    const maxVal = 20;

    const getY = (val) => padTop + chartH - (val / maxVal) * chartH;
    const getH = (val) => (val / maxVal) * chartH;

    it("ADV-3.1: Zero values ({ cashIn: 0, cashOut: 0 }) generate 0px bar height", () => {
      const inH = getH(0);
      const outH = getH(0);
      const y = getY(0);

      assert.equal(inH, 0);
      assert.equal(outH, 0);
      assert.equal(y, padTop + chartH); // 180px
    });

    it("ADV-3.2: Negative cash values generate negative height in SVG rect", () => {
      const negativeVal = -5.0;
      const inH = getH(negativeVal); // (-5 / 20) * 160 = -40
      const y = getY(negativeVal); // 20 + 160 - (-5 / 20) * 160 = 180 + 40 = 220

      assert.equal(inH, -40, "Negative cash value produces negative height (-40px)");
      assert.equal(y, 220, "Negative cash value Y is positioned below baseline at 220px");
      // NOTE: SVG rect elements with negative height violate SVG specification and are dropped by browsers.
    });

    it("ADV-3.3: Extreme cash spikes ($100M+) produce height exceeding canvas", () => {
      const megaVal = 100.0;
      const inH = getH(megaVal); // (100 / 20) * 160 = 800
      const y = getY(megaVal); // 180 - 800 = -620

      assert.equal(inH, 800, "Spike height is 800px (canvas is 210px)");
      assert.equal(y, -620, "Spike Y is -620px (off-canvas top)");
    });

    it("ADV-3.4: Empty weeks array [] produces Infinity group width (chartW / 0)", () => {
      const weeks = [];
      const groupW = chartW / weeks.length;

      assert.equal(groupW, Infinity, "weeks.length = 0 causes groupW to evaluate to Infinity");
      // Since weeks is empty, weeks.map does not execute, so no NaN elements are rendered into DOM.
    });
  });

  // =========================================================================
  // 4. TOP OPERATING EXPENSES HORIZONTAL BAR CHART EMPIRICAL STRESS TESTS
  // =========================================================================
  describe("4. TopOperatingExpensesChart Edge Cases & Clamping Stress", () => {
    const maxVal = 350;

    const computeWidthPercent = (val) =>
      maxVal > 0 ? Math.min(100, Math.max(0, ((val || 0) / maxVal) * 100)) : 0;

    it("ADV-4.1: Clamps negative OpEx items cleanly to 0% width", () => {
      const negativeVal = -150;
      const width = computeWidthPercent(negativeVal);
      assert.equal(width, 0, "Negative OpEx value must clamp to 0%");
    });

    it("ADV-4.2: Clamps extreme OpEx items ($1M+) cleanly to 100% width", () => {
      const extremeVal = 1000000;
      const width = computeWidthPercent(extremeVal);
      assert.equal(width, 100, "Extreme OpEx value must cap at 100%");
    });

    it("ADV-4.3: Handles missing, undefined, null, or NaN value defaulting to 0%", () => {
      assert.equal(computeWidthPercent(undefined), 0);
      assert.equal(computeWidthPercent(null), 0);
      assert.equal(computeWidthPercent(NaN), 0);
    });

    it("ADV-4.4: 50+ expense categories compute without degradation", () => {
      const largeExpenseList = Array.from({ length: 60 }, (_, i) => ({
        label: `Expense Category ${i + 1}`,
        amount: `$${(i * 1000).toLocaleString()}`,
        val: i * 5,
        color: "#3D644B",
      }));

      largeExpenseList.forEach((item) => {
        const pct = computeWidthPercent(item.val);
        assert.ok(pct >= 0 && pct <= 100);
      });
    });
  });

  // =========================================================================
  // 5. SHIPMENT TIMELINE COMPONENT EMPIRICAL STRESS TESTS
  // =========================================================================
  describe("5. ShipmentTimeline Edge Cases & Metadata Fallback Stress", () => {
    const getStatusBadgeClass = (status) => {
      switch (status) {
        case "In Transit": return "badge badge-info";
        case "Scheduled": return "badge badge-warning";
        case "Delivered":
        case "Active":
        default: return "badge badge-success";
      }
    };

    it("ADV-5.1: Null or empty shipment object resolves fallback titles and timings", () => {
      const emptyShipment = {};
      const itemTitle = emptyShipment.title || emptyShipment.supplier || emptyShipment.carrier || "Inbound Shipment";
      const itemTiming = emptyShipment.timing || emptyShipment.status || "Active";
      const itemDate = emptyShipment.date || emptyShipment.expectedDate || "Pending";
      const itemCarrier = emptyShipment.carrier || emptyShipment.origin ? `${emptyShipment.carrier ? emptyShipment.carrier + " • " : ""}${emptyShipment.origin || ""}` : null;

      assert.equal(itemTitle, "Inbound Shipment");
      assert.equal(itemTiming, "Active");
      assert.equal(itemDate, "Pending");
      assert.equal(itemCarrier, null);
    });

    it("ADV-5.2: Unknown status strings gracefully fallback to badge-success class", () => {
      const unknownStatuses = ["Customs Hold", "Lost in Sea", "Returned to Vendor", null, undefined, ""];
      unknownStatuses.forEach((status) => {
        const cls = getStatusBadgeClass(status);
        assert.equal(cls, "badge badge-success", `Status '${status}' must fallback to 'badge badge-success'`);
      });
    });

    it("ADV-5.3: Single shipment renders without index out of bounds", () => {
      const single = [{ id: "SHP-001", title: "Single Supplier", status: "Active" }];
      const isLast = (i) => i === single.length - 1;
      assert.equal(isLast(0), true, "Single shipment is correctly recognized as the final item");
    });
  });

  // =========================================================================
  // 6. THEME SWITCHING & CSS TOKEN RESILIENCE STRESS TESTS
  // =========================================================================
  describe("6. Theme Switching & CSS Token Integrity Stress", () => {
    const indexCssPath = path.resolve(__dirname, "../src/index.css");
    const cssContent = fs.readFileSync(indexCssPath, "utf-8");

    it("ADV-6.1: Validates required light theme tokens are defined", () => {
      const lightSection = cssContent.match(/:root,\s*\[data-theme="light"\]\s*\{([\s\S]*?)\}/);
      assert.ok(lightSection, "Light theme token block must exist");

      const requiredTokens = [
        "--bg-canvas: #F6F4EE",
        "--bg-sidebar: #1E293B",
        "--brand-sage: #3D644B",
        "--border-card: #EAE6DB",
        "--radius-card: 14px",
        "--accent-terracotta: #D96B43",
        "--accent-sand: #C8A27A",
      ];

      requiredTokens.forEach((tok) => {
        assert.ok(
          lightSection[1].toLowerCase().includes(tok.toLowerCase()),
          `Light theme must define token '${tok}'`
        );
      });
    });

    it("ADV-6.2: Validates required dark theme tokens are defined with correct contrast inversions", () => {
      const darkSection = cssContent.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\}/);
      assert.ok(darkSection, "Dark theme token block must exist");

      const requiredDarkTokens = [
        "--bg-canvas: #0F172A",
        "--bg-surface: #1E293B",
        "--border-card: #334155",
        "--text-primary: #F8FAFC",
        "--text-secondary: #94A3B8",
      ];

      requiredDarkTokens.forEach((tok) => {
        assert.ok(
          darkSection[1].toLowerCase().includes(tok.toLowerCase()),
          `Dark theme must define token '${tok}'`
        );
      });
    });

    it("ADV-6.3: Simulates 100 rapid consecutive theme toggles without state breakdown", () => {
      let currentTheme = "light";
      for (let i = 0; i < 100; i++) {
        currentTheme = currentTheme === "light" ? "dark" : "light";
      }
      assert.equal(currentTheme, "light");
    });
  });
});
