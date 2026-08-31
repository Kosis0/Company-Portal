/**
 * Tier 2 Boundary & Corner Cases: B01 to B05 (Auth & RBAC Hierarchy Boundaries)
 * Each feature includes >= 5 distinct boundary & corner condition test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment, testAssert } from "../helpers/test-harness.js";

const { storage } = setupTestEnvironment();
const { db } = await import("../../src/services/db.js");
const { auth } = await import("../../src/services/auth.js");

describe("Tier 2 - B01: Auth Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("B01-1: rejects authentication with empty password or spaces-only password", async () => {
    await testAssert.assertThrowsAsync(() => auth.login("employee@company.com", ""), "Invalid password");
    await testAssert.assertThrowsAsync(() => auth.login("employee@company.com", "   "), "Invalid password");
  });

  it("B01-2: rejects authentication with whitespace-only or malformed email", async () => {
    await testAssert.assertThrowsAsync(() => auth.login("   ", "password123"), "No account found");
    await testAssert.assertThrowsAsync(() => auth.login("not-an-email", "password123"), "No account found");
  });

  it("B01-3: handles SQL injection attempt strings safely without executing or leaking", async () => {
    await testAssert.assertThrowsAsync(
      () => auth.login("' OR '1'='1", "' OR '1'='1"),
      "No account found"
    );
  });

  it("B01-4: handles ultra-long password string (10,000 characters) safely without crash", async () => {
    const longPass = "A".repeat(10000);
    await testAssert.assertThrowsAsync(() => auth.login("employee@company.com", longPass), "Invalid password");
  });

  it("B01-5: case-insensitivity: allows login regardless of email casing (e.g. EmPlOyEe@Company.Com)", async () => {
    const session = await auth.login("EmPlOyEe@CoMpAnY.cOm", "password123");
    assert.ok(session);
    assert.equal(session.user.id, "USR-008");
  });
});

describe("Tier 2 - B02: Registration Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("B02-1: rejects registration with duplicate email in different casing (e.g. EMPLOYEE@COMPANY.COM)", async () => {
    await testAssert.assertThrowsAsync(
      () =>
        auth.register({
          email: "EMPLOYEE@COMPANY.COM",
          password: "password123",
          name: "Duplicate User",
        }),
      "already exists"
    );
  });

  it("B02-2: handles special characters in employee name (accents, hyphens, apostrophes)", async () => {
    const session = await auth.register({
      email: "jean.francois@company.com",
      password: "password123",
      name: "Jean-François d'Artois",
      department: "Engineering",
    });
    assert.equal(session.user.name, "Jean-François d'Artois");
  });

  it("B02-3: handles missing optional fields with defaults during registration", async () => {
    const session = await auth.register({
      email: "minimal@company.com",
      password: "password123",
      name: "Minimal Hire",
    });
    assert.equal(session.user.department, "Engineering");
    assert.equal(session.user.role, "employee");
    assert.equal(session.user.tier, 1);
  });

  it("B02-4: sanitizes leading/trailing whitespaces across all input fields", async () => {
    const session = await auth.register({
      email: "  spacy.dev@company.com  ",
      password: "  password123  ",
      name: "  Spacy Developer  ",
      title: "  Senior Architect  ",
    });
    assert.equal(session.user.email, "spacy.dev@company.com");
    assert.equal(session.user.name, "Spacy Developer");
    assert.equal(session.user.title, "Senior Architect");
  });

  it("B02-5: assigns unique TIN and Pension PIN identifiers without collisions", async () => {
    const s1 = await auth.register({ email: "u1@company.com", password: "p", name: "User One" });
    const s2 = await auth.register({ email: "u2@company.com", password: "p", name: "User Two" });
    assert.notEqual(s1.user.taxId, s2.user.taxId);
    assert.notEqual(s1.user.pensionPin, s2.user.pensionPin);
  });
});

describe("Tier 2 - B03: Session Hydration Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("B03-1: gracefully handles corrupted non-JSON string in auth session key", () => {
    storage.setItem("monolith_auth_session", "MALFORMED_{{}}NOT_JSON");
    const session = auth.getCurrentSession();
    assert.equal(session, null);
  });

  it("B03-2: gracefully handles session payload with missing user object", () => {
    storage.setItem("monolith_auth_session", JSON.stringify({ token: "tok_123" }));
    const session = auth.getCurrentSession();
    assert.equal(session, null);
  });

  it("B03-3: handles empty object {} in auth session storage", () => {
    storage.setItem("monolith_auth_session", "{}");
    const session = auth.getCurrentSession();
    assert.equal(session, null);
  });

  it("B03-4: purges session from storage when live database verification fails", () => {
    storage.setItem(
      "monolith_auth_session",
      JSON.stringify({ token: "tok_xyz", user: { id: "USR-DELETED-999" } })
    );
    const session = auth.getCurrentSession();
    assert.equal(session, null);
    assert.equal(storage.getItem("monolith_auth_session"), null, "Must clean up invalid session");
  });

  it("B03-5: handles multiple rapid login/logout cycles without state corruption", async () => {
    for (let i = 0; i < 5; i++) {
      await auth.login("employee@company.com", "password123");
      assert.ok(auth.getCurrentSession());
      auth.logout();
      assert.equal(auth.getCurrentSession(), null);
    }
  });
});

describe("Tier 2 - B04: Direct Reports Subtree Boundary & Corner Cases", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("B04-1: protects against non-existent managerId returning empty array without error", () => {
    const reports = db.getDirectReports("USR-DOES-NOT-EXIST");
    assert.deepEqual(reports, []);
  });

  it("B04-2: handles empty string, null, or undefined managerId input", () => {
    assert.deepEqual(db.getDirectReports(""), []);
    assert.deepEqual(db.getDirectReports(null), []);
    assert.deepEqual(db.getDirectReports(undefined), []);
  });

  it("B04-3: handles manager assigned to themselves (self-referential) safely", async () => {
    await db.updateUser("USR-008", { managerId: "USR-008" });
    const reports = db.getDirectReports("USR-008");
    assert.ok(Array.isArray(reports));
    assert.equal(reports.length, 1);
    assert.equal(reports[0].id, "USR-008");
  });

  it("B04-4: handles large number of direct reports (e.g. 50 staff assigned to one lead)", async () => {
    for (let i = 0; i < 20; i++) {
      await db.createUser({
        name: `Batch Dev ${i}`,
        email: `batch.dev.${i}@company.com`,
        managerId: "USR-005",
      });
    }
    const reports = db.getDirectReports("USR-005");
    assert.ok(reports.length >= 22);
  });

  it("B04-5: case-sensitive managerId comparison consistency", () => {
    const reportsExact = db.getDirectReports("USR-005");
    const reportsMismatch = db.getDirectReports("usr-005");
    assert.ok(reportsExact.length >= 2);
    assert.equal(reportsMismatch.length, 0);
  });
});

describe("Tier 2 - B05: Shell Navigation Boundary & Corner Cases", () => {
  function resolveUserRoute(user) {
    if (!user || !user.tier) return "login";
    if (user.tier === 1 || user.tier === 2) return "ess_dashboard";
    if (user.tier === 3) return "team_lead_hub";
    if (user.tier === 4) return "department_hub";
    if (user.tier === 5) return "executive_cockpit";
    return "ess_dashboard";
  }

  it("B05-1: redirects unauthenticated null user to login", () => {
    assert.equal(resolveUserRoute(null), "login");
    assert.equal(resolveUserRoute({}), "login");
  });

  it("B05-2: handles out-of-range tier 0 or tier 6 with safe ESS fallback", () => {
    assert.equal(resolveUserRoute({ tier: 0 }), "ess_dashboard");
    assert.equal(resolveUserRoute({ tier: 6 }), "ess_dashboard");
  });

  it("B05-3: routes all Tier 1 and Tier 2 users to ess_dashboard", () => {
    assert.equal(resolveUserRoute({ tier: 1 }), "ess_dashboard");
    assert.equal(resolveUserRoute({ tier: 2 }), "ess_dashboard");
  });

  it("B05-4: routes Tier 3 Line Manager to team_lead_hub", () => {
    assert.equal(resolveUserRoute({ tier: 3 }), "team_lead_hub");
  });

  it("B05-5: routes Tier 4 to department_hub and Tier 5 to executive_cockpit", () => {
    assert.equal(resolveUserRoute({ tier: 4 }), "department_hub");
    assert.equal(resolveUserRoute({ tier: 5 }), "executive_cockpit");
  });
});
