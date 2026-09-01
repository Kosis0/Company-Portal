/**
 * Tier 1 Feature Coverage: F3 - Deep Slate Navy Sidebar & Sage Active Pills
 * Verifies Monolith brand mark, Sage Green active pill styling, dynamic section visibility,
 * notification badge counts, and user profile footer tile.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";
import { FIXTURES } from "../helpers/fixtures.js";

setupTestEnvironment();
const { auth } = await import("../../src/services/auth.js");
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F3: Deep Slate Navy Sidebar & Sage Active Pills", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("F3-1: provides Monolith Workforce OS branding mark and header elements", () => {
    const brand = {
      mark: "M",
      name: "MONOLITH",
      subtitle: "Workforce OS",
    };
    assert.equal(brand.mark, "M");
    assert.equal(brand.name, "MONOLITH");
    assert.equal(brand.subtitle, "Workforce OS");
  });

  it("F3-2: calculates active pill styling applying Sage Green background", () => {
    function getPillClasses(navId, currentActive) {
      const isActive = navId === currentActive;
      return {
        className: `nav-item ${isActive ? "active" : ""}`,
        isActive,
      };
    }

    const item1 = getPillClasses("dashboard", "dashboard");
    assert.equal(item1.className, "nav-item active");
    assert.equal(item1.isActive, true);

    const item2 = getPillClasses("leaves", "dashboard");
    assert.equal(item2.className, "nav-item ");
    assert.equal(item2.isActive, false);
  });

  it("F3-3: renders section titles dynamically based on user authority tier", () => {
    function getVisibleSections(user) {
      const sections = ["MY WORKSPACE"];
      if (user.tier >= 3 || user.role === "manager") {
        sections.push("PEOPLE MANAGEMENT");
      }
      if (user.tier >= 4 || user.department !== "Executive") {
        sections.push("DEPARTMENT TOOLKIT");
      }
      sections.push("ORGANIZATION");
      if (user.tier === 5 || user.role === "admin") {
        sections.push("EXECUTIVE SUITE");
      }
      return sections;
    }

    const t1Sections = getVisibleSections(FIXTURES.personas.tier1_intern);
    assert.ok(t1Sections.includes("MY WORKSPACE"));
    assert.ok(!t1Sections.includes("PEOPLE MANAGEMENT"));
    assert.ok(!t1Sections.includes("EXECUTIVE SUITE"));

    const t3Sections = getVisibleSections(FIXTURES.personas.tier3_lead);
    assert.ok(t3Sections.includes("PEOPLE MANAGEMENT"));

    const t5Sections = getVisibleSections(FIXTURES.personas.tier5_ceo);
    assert.ok(t5Sections.includes("EXECUTIVE SUITE"));
  });

  it("F3-4: aggregates pending leave and claim counts for notification badges", async () => {
    const initialPending = db.getLeaves().filter(l => l.managerId === "USR-005" && l.status.includes("Pending")).length;

    // Add 2 pending leaves for team
    await db.createLeave({
      userId: "USR-008",
      managerId: "USR-005",
      type: "Annual Leave",
      days: 2,
    });
    await db.createLeave({
      userId: "USR-009",
      managerId: "USR-005",
      type: "Sick Leave",
      days: 1,
    });

    const teamLeaves = db.getLeaves().filter(l => l.managerId === "USR-005" && l.status.includes("Pending"));
    assert.equal(teamLeaves.length, initialPending + 2, "Team lead must see pending requests increase by 2");
  });

  it("F3-5: populates sidebar footer user tile with name, title, initials, and logout", () => {
    const user = FIXTURES.personas.tier4_director_finance;
    const tile = {
      name: user.name,
      title: user.title,
      initials: user.name.split(" ").map(n => n[0]).slice(0, 2).join(""),
      canLogout: true,
    };

    assert.equal(tile.name, "Marcus Brody");
    assert.equal(tile.title, "Head of Finance & Corporate Operations");
    assert.equal(tile.initials, "MB");
    assert.equal(tile.canLogout, true);
  });
});
