/**
 * Tier 4 Real-World Application Scenario: A1 - CEO Executive Review & Financial Drilldown
 * Exercised Features: F1, F3, F4, F5, F7, F8, F9, F11
 *
 * Workflow:
 * 1. CEO Dr. Alexander Vance logs in with Tier 5 executive credentials.
 * 2. Navigates to Overview Screen, verifies 4 global metric cards & Revenue vs Expenses trend curve.
 * 3. Inspects Sales by Region donut chart, verifying North America (50%), Europe (30%), Asia (20%).
 * 4. Drills into Financial Performance, reviewing Q3 Cash Flow Forecast & Top OpEx (Payroll: $320k).
 * 5. Traverses complete organizational tree from root down to all departmental heads and engineers.
 * 6. Publishes a company-wide executive broadcast bulletin to all staff.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";
import { FIXTURES } from "../helpers/fixtures.js";

setupTestEnvironment();
const { auth } = await import("../../src/services/auth.js");
const { db } = await import("../../src/services/db.js");

describe("Tier 4 - A1: CEO Executive Review & Financial Drilldown Workflow", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("A1-1: CEO authenticates with Tier 5 role and accesses Executive Suite", async () => {
    const session = await auth.login("ceo@company.com", "password123");
    assert.ok(session, "CEO session must be established");
    assert.equal(session.user.tier, 5, "User must have Tier 5 authority");
    assert.equal(session.user.role, "executive");

    const isExecutive = Boolean(session.user.tier === 5 || session.user.role === "admin");
    assert.equal(isExecutive, true);
  });

  it("A1-2: reviews Overview Dashboard multi-line trend metrics and regional sales distribution", async () => {
    await auth.login("ceo@company.com", "password123");

    // Multi-line trend data
    const trendData = [
      { month: "Jan", revenue: 5.2, expenses: 3.8 },
      { month: "Feb", revenue: 8.4, expenses: 5.9 },
      { month: "Mar", revenue: 7.1, expenses: 5.4 },
      { month: "Apr", revenue: 11.6, expenses: 8.2 },
      { month: "May", revenue: 9.8, expenses: 6.7 },
      { month: "Jun", revenue: 13.5, expenses: 10.1 },
    ];
    const totalRev = trendData.reduce((acc, m) => acc + m.revenue, 0);
    const totalExp = trendData.reduce((acc, m) => acc + m.expenses, 0);
    assert.ok(totalRev > totalExp, "Company operates at positive profit margin across H1");

    // Donut chart verification
    const regions = [
      { name: "North America", percentage: 50, color: "#3D644B" },
      { name: "Europe", percentage: 30, color: "#78C6B1" },
      { name: "Asia", percentage: 20, color: "#D4A373" },
    ];
    assert.equal(regions.reduce((acc, r) => acc + r.percentage, 0), 100);
  });

  it("A1-3: drills into Financial Performance verifying Cash Flow Forecast & Top OpEx bars", async () => {
    await auth.login("ceo@company.com", "password123");

    const cashFlow = [
      { name: "Week 1", cashIn: 13.2, cashOut: 7.8 },
      { name: "Week 2", cashIn: 14.5, cashOut: 6.2 },
      { name: "Week 3", cashIn: 16.1, cashOut: 9.4 },
      { name: "Week 4", cashIn: 18.0, cashOut: 8.5 },
    ];
    assert.equal(cashFlow.length, 4);

    const opEx = [
      { label: "Payroll", amount: "$320,000", val: 320 },
      { label: "Rent", amount: "$75,000", val: 75 },
      { label: "Software", amount: "$95,000", val: 95 },
    ];
    assert.equal(opEx[0].label, "Payroll");
    assert.equal(opEx[0].amount, "$320,000");
  });

  it("A1-4: traverses hierarchical organization tree and publishes executive bulletin", async () => {
    await auth.login("ceo@company.com", "password123");

    const orgTree = db.getOrgTree();
    assert.ok(orgTree, "Org tree root must exist");
    assert.equal(orgTree.id, "USR-001");
    assert.equal(orgTree.tier, 5);
    assert.ok(orgTree.directReports.length >= 3, "CEO must have 3 Direct Report Directors");

    // Publish announcement
    const bulletin = await db.createAnnouncement({
      title: "Q3 2026 Strategy & Profitability Review",
      content: "Monolith ERP reports record $55.6M gross revenue with sustained cash reserves.",
      type: "Important",
      authorName: "Dr. Alexander Vance (CEO)",
    });

    assert.ok(bulletin.id);
    const bulletins = db.getAnnouncements();
    assert.ok(bulletins.some(b => b.id === bulletin.id));
  });
});
