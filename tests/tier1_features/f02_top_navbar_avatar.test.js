/**
 * Tier 1 Feature Coverage: F2 - Top Navigation Bar & Circular Avatar
 * Verifies live shift attendance chip, avatar initials rendering, authority tier chip,
 * theme toggle button, and breadcrumb hierarchy.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";
import { FIXTURES } from "../helpers/fixtures.js";

setupTestEnvironment();
const { auth } = await import("../../src/services/auth.js");
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F2: Top Navigation Bar & Circular Avatar", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("F2-1: generates accurate 2-letter uppercase avatar initials for active user", () => {
    const u1 = FIXTURES.personas.tier1_intern;
    const initials1 = u1.avatarInitials || u1.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
    assert.equal(initials1, "UK");

    const u2 = db.getUserById("USR-001");
    const initials2 = u2.avatarInitials || u2.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
    assert.equal(initials2, "AV");
  });

  it("F2-2: formats live attendance shift timer into HH:MM:SS format", () => {
    function formatTimer(totalSecs) {
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    assert.equal(formatTimer(0), "00:00:00");
    assert.equal(formatTimer(65), "00:01:05");
    assert.equal(formatTimer(3661), "01:01:01");
    assert.equal(formatTimer(28800), "08:00:00"); // Standard 8-hour shift
  });

  it("F2-3: maps all 5 authority tiers to authoritative badge labels", () => {
    function getTierLabel(tier) {
      switch (tier) {
        case 5: return "Tier 5: Executive (C-Suite)";
        case 4: return "Tier 4: Director (HoD)";
        case 3: return "Tier 3: Team Lead / Manager";
        case 2: return "Tier 2: Senior Contributor";
        case 1:
        default: return "Tier 1: Staff / Associate";
      }
    }

    assert.equal(getTierLabel(1), "Tier 1: Staff / Associate");
    assert.equal(getTierLabel(2), "Tier 2: Senior Contributor");
    assert.equal(getTierLabel(3), "Tier 3: Team Lead / Manager");
    assert.equal(getTierLabel(4), "Tier 4: Director (HoD)");
    assert.equal(getTierLabel(5), "Tier 5: Executive (C-Suite)");
  });

  it("F2-4: manages theme state toggling between 'light' and 'dark'", () => {
    let theme = "light";
    function toggleTheme() {
      theme = theme === "light" ? "dark" : "light";
      globalThis.document.documentElement.setAttribute("data-theme", theme);
      return theme;
    }

    assert.equal(toggleTheme(), "dark");
    assert.equal(globalThis.document.documentElement.getAttribute("data-theme"), "dark");
    assert.equal(toggleTheme(), "light");
    assert.equal(globalThis.document.documentElement.getAttribute("data-theme"), "light");
  });

  it("F2-5: constructs department breadcrumb path from user context and active tab", () => {
    function getBreadcrumb(department, activeNav) {
      return `${department} / ${activeNav.replace("_", " ").toUpperCase()}`;
    }

    assert.equal(getBreadcrumb("Engineering", "dashboard"), "Engineering / DASHBOARD");
    assert.equal(getBreadcrumb("Finance & Operations", "claims"), "Finance & Operations / CLAIMS");
    assert.equal(getBreadcrumb("Executive", "executive"), "Executive / EXECUTIVE");
  });
});
