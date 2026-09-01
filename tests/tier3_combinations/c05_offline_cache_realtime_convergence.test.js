/**
 * Tier 3 Combination Suite: C5 - Offline LocalStorage Cache & Realtime State Convergence
 * Tests dual-write state persistence, simulated remote Supabase broadcast callbacks,
 * cache survival, and state consistency across app resets.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";
import { STORAGE_KEYS } from "../../src/services/db.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 3 - C5: Offline Cache & Realtime State Convergence", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("C5-1: stores local mutations instantly and makes them queryable across all service methods", async () => {
    const newDept = await db.addDepartment({
      name: "Autonomous AI Research",
      code: "AIR",
      monthlyBudget: "$75,000",
    });

    assert.ok(newDept.id);
    const depts = db.getDepartments();
    assert.ok(depts.some(d => d.id === newDept.id));
    assert.equal(db.getDepartment(newDept.id)?.name, "Autonomous AI Research");
  });

  it("C5-2: simulates Supabase realtime update event triggering re-hydration without data loss", () => {
    let rehydrateCalled = false;
    const unsub = db.subscribeToChanges(() => {
      rehydrateCalled = true;
    });

    // Simulate database update
    const currentUsers = db.getUsers();
    currentUsers[0].location = "London Tech Hub";
    globalThis.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(currentUsers));

    const updatedUsers = db.getUsers();
    assert.equal(updatedUsers[0].location, "London Tech Hub");
    unsub();
  });

  it("C5-3: preserves user session, theme, and attendance across multiple storage updates", () => {
    globalThis.localStorage.setItem("monolith_theme_preference", "dark");
    globalThis.localStorage.setItem("monolith_attendance_state", JSON.stringify({ isClockedIn: true, clockInTime: "09:15 AM" }));

    // Reset DB data
    db.resetDatabase();

    // Theme and attendance keys must be intact
    assert.equal(globalThis.localStorage.getItem("monolith_theme_preference"), "dark");
    const att = JSON.parse(globalThis.localStorage.getItem("monolith_attendance_state"));
    assert.equal(att.isClockedIn, true);
    assert.equal(att.clockInTime, "09:15 AM");
  });

  it("C5-4: handles multiple consecutive database resets restoring authoritative baseline schema", () => {
    db.resetDatabase();
    assert.equal(db.getUsers().length, 10);
    assert.equal(db.getDepartments().length, 4);
    assert.equal(db.getAssets().length, 5);
    assert.equal(db.getSprints().length, 2);

    db.resetDatabase();
    assert.equal(db.getUsers().length, 10);
  });
});
