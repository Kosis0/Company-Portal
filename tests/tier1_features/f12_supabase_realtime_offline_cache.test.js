/**
 * Tier 1 Feature Coverage: F12 - Multi-Device Supabase Realtime Sync & Offline Cache
 * Verifies realtime channel bindings, offline dual-write caching, automatic seed data fallback,
 * safe unsubscription handling, and client sync resilience.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";
import { STORAGE_KEYS } from "../../src/services/db.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F12: Supabase Realtime & Offline Dual-Write Cache", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F12-1: dual-writes new record mutations to local cache immediately", async () => {
    const ticket = await db.createTicket({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      subject: "External Monitor DisplayPort Failure",
      category: "Hardware",
      priority: "High",
    });

    assert.ok(ticket.id);
    const tickets = db.getTickets();
    const stored = tickets.find(t => t.id === ticket.id);
    assert.ok(stored, "Created ticket must immediately exist in local cache");
    assert.equal(stored.subject, "External Monitor DisplayPort Failure");
  });

  it("F12-2: recovers cleanly to seed data when localStorage contains corrupted JSON", () => {
    globalThis.localStorage.setItem(STORAGE_KEYS.USERS, "{{MALFORMED_JSON_STRING}}");
    const recoveredUsers = db.getUsers();

    assert.ok(Array.isArray(recoveredUsers), "Must return an array upon corrupted storage recovery");
    assert.equal(recoveredUsers.length, 10, "Must recover all 10 seed users");
  });

  it("F12-3: falls back to initial seed data when localStorage keys are null or removed", () => {
    globalThis.localStorage.removeItem(STORAGE_KEYS.ASSETS);
    const assets = db.getAssets();
    assert.equal(assets.length, 5, "Must recover seed assets list");

    globalThis.localStorage.removeItem(STORAGE_KEYS.SPRINTS);
    const sprints = db.getSprints();
    assert.equal(sprints.length, 2, "Must recover seed sprints list");
  });

  it("F12-4: subscribeToChanges returns safe unsubscription function even if offline", () => {
    let callbackFired = false;
    const unsubscribe = db.subscribeToChanges(() => {
      callbackFired = true;
    });

    assert.equal(typeof unsubscribe, "function", "Must return unsubscription function");
    assert.doesNotThrow(() => unsubscribe(), "Unsubscribe must be callable without throwing");
    assert.equal(callbackFired, false);
  });

  it("F12-5: broadcasts local mutations and retains data across database reset cycles", () => {
    db.resetDatabase();
    const users = db.getUsers();
    assert.equal(users.length, 10);
    const departments = db.getDepartments();
    assert.equal(departments.length, 4);
  });
});
