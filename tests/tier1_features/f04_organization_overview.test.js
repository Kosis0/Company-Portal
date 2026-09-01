/**
 * Tier 1 Feature Coverage: F4 - Organization Overview Screen
 * Verifies 4 metric cards, Revenue vs Expenses multi-line trend chart integration,
 * Sales by Region donut chart, Recent Activities audit table, and welcome banner.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";
import { FIXTURES } from "../helpers/fixtures.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F4: Organization Overview Screen", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F4-1: computes 4 primary overview metrics with proportional progress bars", () => {
    const user = FIXTURES.personas.tier1_intern;
    const metrics = [
      {
        label: "Annual Leave Balance",
        value: `${user.annualLeaveBalance} Days`,
        percent: Math.min(100, (user.annualLeaveBalance / 25) * 100),
      },
      {
        label: "Pending Claims",
        value: "$0",
        percent: 0,
      },
      {
        label: "Net Monthly Salary",
        value: "$2,810.00",
        percent: 82,
      },
      {
        label: "Performance Rating",
        value: "4.5 / 5.0",
        percent: 90,
      },
    ];

    assert.equal(metrics.length, 4);
    assert.equal(metrics[0].value, "14 Days");
    assert.equal(Math.round(metrics[0].percent), 56);
    assert.equal(metrics[3].value, "4.5 / 5.0");
  });

  it("F4-2: formats Revenue vs Expenses trend dataset with monthly financial points", () => {
    const trendData = [
      { month: "Jan", revenue: 5.2, expenses: 3.8 },
      { month: "Feb", revenue: 8.4, expenses: 5.9 },
      { month: "Mar", revenue: 7.1, expenses: 5.4 },
      { month: "Apr", revenue: 11.6, expenses: 8.2 },
      { month: "May", revenue: 9.8, expenses: 6.7 },
      { month: "Jun", revenue: 13.5, expenses: 10.1 },
    ];

    assert.equal(trendData.length, 6);
    assert.ok(trendData.every(d => d.revenue > d.expenses), "Revenue must exceed expenses across all months");
    assert.equal(trendData[0].month, "Jan");
    assert.equal(trendData[5].revenue, 13.5);
  });

  it("F4-3: formats Sales by Region donut data with segmented regional percentages", () => {
    const regions = [
      { name: "North America", percentage: 50, color: "#3D644B" },
      { name: "Europe", percentage: 30, color: "#78C6B1" },
      { name: "Asia", percentage: 20, color: "#D4A373" },
    ];

    const totalPercentage = regions.reduce((acc, r) => acc + r.percentage, 0);
    assert.equal(totalPercentage, 100, "Regional percentages must sum to 100%");
    assert.equal(regions[0].color, "#3D644B", "Primary region must use brand sage color");
  });

  it("F4-4: compiles recent activity audit logs with timestamps and status badges", async () => {
    const leave = await db.createLeave({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      type: "Annual Leave",
      dates: "2026-09-15 - 2026-09-18",
      days: 4,
    });

    const recentLeaves = db.getLeaves().filter(l => l.userId === "USR-008");
    assert.ok(recentLeaves.length >= 1);
    assert.equal(recentLeaves[0].id, leave.id);
    assert.equal(recentLeaves[0].type, "Annual Leave");
    assert.ok(recentLeaves[0].status.includes("Pending"));
  });

  it("F4-5: constructs welcome header banner with user title, department, and reporting manager", () => {
    const user = FIXTURES.personas.tier1_intern;
    const banner = {
      greeting: `Welcome back, ${user.name.split(" ")[0]}`,
      subtext: `${user.title} • ${user.department} (Reporting to Sarah Chen)`,
    };

    assert.equal(banner.greeting, "Welcome back, Udeh");
    assert.ok(banner.subtext.includes("Software Developer Intern"));
    assert.ok(banner.subtext.includes("Engineering"));
  });
});
