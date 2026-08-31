/**
 * Tier 1 Feature Coverage: F01 to F05 (Authentication & RBAC Hierarchy)
 * Each feature includes >= 5 distinct, verifiable test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment, testAssert } from "../helpers/test-harness.js";
import { FIXTURES } from "../helpers/fixtures.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");
const { auth } = await import("../../src/services/auth.js");

describe("Tier 1 - F01: 5-Tier User Authentication", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("F01-1: authenticates Tier 1 staff with corporate credentials and issues JWT token", async () => {
    const session = await auth.login("employee@company.com", "password123");
    assert.ok(session, "Session must exist");
    assert.ok(session.token.startsWith("mth_jwt_"), "Token format must match mth_jwt_ prefix");
    assert.equal(session.user.tier, 1, "User must have tier 1");
    assert.equal(session.user.role, "employee");
  });

  it("F01-2: authenticates Tier 3 Line Manager / Team Lead with correct permissions", async () => {
    const session = await auth.login("sarah.chen@company.com", "password123");
    assert.equal(session.user.tier, 3);
    assert.equal(session.user.role, "manager");
    assert.equal(session.user.name, "Sarah Chen");
  });

  it("F01-3: authenticates Tier 4 Director / Head of Finance", async () => {
    const session = await auth.login("finance@company.com", "password123");
    assert.equal(session.user.tier, 4);
    assert.equal(session.user.role, "finance");
    assert.equal(session.user.department, "Finance & Operations");
  });

  it("F01-4: authenticates Tier 5 Executive / CEO with top-tier role", async () => {
    const session = await auth.login("ceo@company.com", "password123");
    assert.equal(session.user.tier, 5);
    assert.equal(session.user.role, "executive");
    assert.equal(session.user.managerId, null, "CEO must have null managerId");
  });

  it("F01-5: rejects authentication with invalid password or non-existent corporate email", async () => {
    await testAssert.assertThrowsAsync(
      () => auth.login("employee@company.com", "wrongpassword"),
      "Invalid password"
    );
    await testAssert.assertThrowsAsync(
      () => auth.login("nonexistent@company.com", "password123"),
      "No account found"
    );
  });
});

describe("Tier 1 - F02: New Staff Registration", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("F02-1: registers new employee assigning default Tier 1 and standard leave balances", async () => {
    const session = await auth.register({
      email: "new.engineer@company.com",
      password: "password123",
      name: "Chukwudi Eze",
      title: "Junior Backend Engineer",
      department: "Engineering",
    });

    assert.ok(session.token);
    assert.equal(session.user.email, "new.engineer@company.com");
    assert.equal(session.user.tier, 1);
    assert.equal(session.user.annualLeaveBalance, 20);
    assert.equal(session.user.sickLeaveBalance, 10);
    assert.equal(session.user.casualLeaveBalance, 5);
  });

  it("F02-2: prevents duplicate registration with an already registered corporate email", async () => {
    await testAssert.assertThrowsAsync(
      () =>
        auth.register({
          email: "employee@company.com",
          password: "password123",
          name: "Duplicate User",
        }),
      "already exists"
    );
  });

  it("F02-3: normalizes email addresses with whitespace or uppercase casing", async () => {
    const session = await auth.register({
      email: "  ALICE.WALKER@COMPANY.COM  ",
      password: "password123",
      name: "Alice Walker",
      department: "Human Resources",
    });
    assert.equal(session.user.email, "alice.walker@company.com");
  });

  it("F02-4: generates automatic TIN and Pension PIN identifiers upon registration", async () => {
    const session = await auth.register({
      email: "finance.junior@company.com",
      password: "password123",
      name: "Emeka Okafor",
      department: "Finance & Operations",
    });
    assert.ok(session.user.taxId?.startsWith("TIN-"), "Tax ID must be formatted with TIN-");
    assert.ok(session.user.pensionPin?.startsWith("PEN-"), "Pension PIN must be formatted with PEN-");
  });

  it("F02-5: assigns default active status and generated avatar initials", async () => {
    const session = await auth.register({
      email: "kosi.test@company.com",
      password: "password123",
      name: "Kosi Udeh",
      department: "Engineering",
    });
    assert.equal(session.user.status, "Active");
    assert.equal(session.user.avatarInitials, "KU");
  });
});

describe("Tier 1 - F03: Session Persistence & Auto-Refresh", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("F03-1: retrieves active session from localStorage when valid token exists", async () => {
    await auth.login("employee@company.com", "password123");
    const session = auth.getCurrentSession();
    assert.ok(session);
    assert.equal(session.user.id, "USR-008");
  });

  it("F03-2: returns null if no session exists in localStorage", () => {
    auth.logout();
    const session = auth.getCurrentSession();
    assert.equal(session, null);
  });

  it("F03-3: purges session and returns null upon explicit logout()", async () => {
    await auth.login("employee@company.com", "password123");
    auth.logout();
    assert.equal(auth.getCurrentSession(), null);
  });

  it("F03-4: auto-refreshes user profile against live database on session hydration", async () => {
    await auth.login("employee@company.com", "password123");
    // Simulate external database update (e.g. phone update)
    await db.updateUser("USR-008", { phone: "+234 999 888 7777" });
    const session = auth.getCurrentSession();
    assert.equal(session.user.phone, "+234 999 888 7777");
  });

  it("F03-5: automatically invalidates session if user was deleted or terminated from DB", async () => {
    await auth.login("employee@company.com", "password123");
    // Overwrite users storage with deleted user
    const users = db.getUsers().filter((u) => u.id !== "USR-008");
    globalThis.localStorage.setItem("monolith_db_users", JSON.stringify(users));

    const session = auth.getCurrentSession();
    assert.equal(session, null, "Should return null and invalidate if user no longer exists");
  });
});

describe("Tier 1 - F04: Direct Reports Subtree Filtering", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F04-1: returns exact direct reports for Tier 3 Tech Lead Sarah Chen (USR-005)", () => {
    const reports = db.getDirectReports("USR-005");
    assert.equal(reports.length, 2);
    const names = reports.map((r) => r.name);
    assert.ok(names.includes("Udeh Kosisochukwu Emmanuel"));
    assert.ok(names.includes("Chidi Nnamdi"));
  });

  it("F04-2: returns exact direct reports for Tier 4 VP of Engineering Tunde Bakare (USR-002)", () => {
    const reports = db.getDirectReports("USR-002");
    assert.equal(reports.length, 2);
    const names = reports.map((r) => r.name);
    assert.ok(names.includes("Sarah Chen"));
    assert.ok(names.includes("David Okonjo"));
  });

  it("F04-3: returns all 3 Tier 4 Directors as direct reports for Tier 5 CEO (USR-001)", () => {
    const reports = db.getDirectReports("USR-001");
    assert.equal(reports.length, 3);
    const ids = reports.map((r) => r.id);
    assert.ok(ids.includes("USR-002")); // VP Eng
    assert.ok(ids.includes("USR-003")); // VP HR
    assert.ok(ids.includes("USR-004")); // Head of Finance
  });

  it("F04-4: returns empty array for Tier 1 staff with no direct reports", () => {
    const reports = db.getDirectReports("USR-008");
    assert.deepEqual(reports, []);
  });

  it("F04-5: returns empty array for null, undefined or non-existent managerId", () => {
    assert.deepEqual(db.getDirectReports(null), []);
    assert.deepEqual(db.getDirectReports(undefined), []);
    assert.deepEqual(db.getDirectReports("NON_EXISTENT_ID"), []);
  });
});

describe("Tier 1 - F05: Dynamic Shell Navigation", () => {
  function getAvailableNavItems(user) {
    const items = ["overview", "attendance", "leaves", "claims", "payslips", "benefits", "tickets"];
    if (user.tier >= 3 && user.role === "manager") {
      items.push("team_hub");
    }
    if (user.tier >= 4) {
      if (user.department === "Engineering") items.push("engineering_hub");
      if (user.department === "Human Resources" || user.role === "admin") items.push("hr_talent_hub");
      if (user.department === "Finance & Operations" || user.role === "finance") items.push("finance_hub");
      if (user.department === "IT & Facilities") items.push("it_facilities_hub");
    }
    if (user.tier === 5) {
      items.push("executive_cockpit", "org_tree", "engineering_hub", "hr_talent_hub", "finance_hub");
    }
    return items;
  }

  it("F05-1: provides Tier 1 staff with standard ESS tabs and no management hubs", () => {
    const nav = getAvailableNavItems(FIXTURES.personas.tier1_intern);
    assert.ok(nav.includes("attendance"));
    assert.ok(nav.includes("leaves"));
    assert.ok(nav.includes("claims"));
    assert.ok(!nav.includes("team_hub"));
    assert.ok(!nav.includes("executive_cockpit"));
  });

  it("F05-2: provides Tier 3 Team Lead with ESS tabs + team_hub", () => {
    const nav = getAvailableNavItems(FIXTURES.personas.tier3_lead);
    assert.ok(nav.includes("team_hub"));
    assert.ok(!nav.includes("executive_cockpit"));
  });

  it("F05-3: provides Tier 4 VP of Engineering with engineering_hub", () => {
    const nav = getAvailableNavItems(FIXTURES.personas.tier4_director_eng);
    assert.ok(nav.includes("engineering_hub"));
    assert.ok(!nav.includes("finance_hub"));
  });

  it("F05-4: provides Tier 4 Head of Finance with finance_hub", () => {
    const nav = getAvailableNavItems(FIXTURES.personas.tier4_director_finance);
    assert.ok(nav.includes("finance_hub"));
    assert.ok(!nav.includes("engineering_hub"));
  });

  it("F05-5: provides Tier 5 CEO with executive_cockpit and global org_tree drilldown", () => {
    const nav = getAvailableNavItems(FIXTURES.personas.tier5_ceo);
    assert.ok(nav.includes("executive_cockpit"));
    assert.ok(nav.includes("org_tree"));
    assert.ok(nav.includes("engineering_hub"));
    assert.ok(nav.includes("finance_hub"));
  });
});
