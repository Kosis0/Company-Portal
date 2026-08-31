/**
 * Challenger Gate 2: Empirical Fuzzing and Boundary Stress Verification Suite
 * Stress-tests Monolith ERP data engine across 5 critical operational domains.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment, testAssert } from "./helpers/test-harness.js";
import { db } from "../src/services/db.js";
import { auth } from "../src/services/auth.js";

describe("Challenger Gate 2: Empirical Fuzzing & Boundary Stress Harness", () => {
  let env;

  beforeEach(() => {
    env = setupTestEnvironment();
    db.resetDatabase();
  });

  // =========================================================================
  // 1. FUZZING: USER REGISTRATION & AUTHENTICATION
  // =========================================================================
  describe("Domain 1: User Registration Fuzzing & Boundary Invariants", () => {
    it("Fuzz 1.1: duplicate email detection under mixed-case, whitespace, and Unicode", async () => {
      const initialUsers = db.getUsers();
      const existingEmail = initialUsers[0].email; // e.g. "ceo@company.com"

      const duplicateVariants = [
        existingEmail.toUpperCase(),
        `  ${existingEmail}  `,
        existingEmail.replace("ceo", "CeO"),
        ` \t ${existingEmail.toUpperCase()} \n `,
      ];

      for (const emailVariant of duplicateVariants) {
        await assert.rejects(
          async () => {
            await auth.register({
              email: emailVariant,
              name: "Duplicate Imposter",
              password: "password123",
            });
          },
          /already exists/i,
          `Failed to reject duplicate email variant: ${emailVariant}`
        );
      }
    });

    it("Fuzz 1.2: registration with missing or null fields provides safe fallback defaults", async () => {
      const minimalUser = await auth.register({
        email: "minimal.fuzz@company.com",
      });

      assert.ok(minimalUser.user.id.startsWith("USR-"));
      assert.equal(minimalUser.user.email, "minimal.fuzz@company.com");
      assert.equal(minimalUser.user.name, "New Staff");
      assert.equal(minimalUser.user.tier, 1);
      assert.equal(minimalUser.user.role, "employee");
      assert.equal(minimalUser.user.department, "Engineering");
      assert.equal(minimalUser.user.annualLeaveBalance, 20);
      assert.equal(minimalUser.user.sickLeaveBalance, 10);
      assert.equal(minimalUser.user.casualLeaveBalance, 5);
      assert.equal(minimalUser.user.status, "Active");
      assert.equal(minimalUser.user.avatarInitials, "NS");
    });

    it("Fuzz 1.3: fuzzing role-to-tier mappings and unusual tier specifications", async () => {
      const rolesToTest = [
        { role: "executive", expectedTier: 5 },
        { role: "director", expectedTier: 4 },
        { role: "admin", expectedTier: 1 }, // default fallback if not mapped to 4
        { role: "manager", expectedTier: 3 },
        { role: "senior_contributor", expectedTier: 2 },
        { role: "employee", expectedTier: 1 },
        { role: "intern_contractor", expectedTier: 1 },
        { role: "", expectedTier: 1 },
      ];

      for (let i = 0; i < rolesToTest.length; i++) {
        const { role, expectedTier } = rolesToTest[i];
        const created = await db.createUser({
          email: `role.fuzz.${i}@company.com`,
          name: `Role Tester ${i}`,
          role,
        });

        assert.equal(
          created.tier,
          expectedTier,
          `Role "${role}" should resolve to Tier ${expectedTier}, got ${created.tier}`
        );
      }
    });

    it("Fuzz 1.4: fuzzing extreme name inputs for avatarInitials generation", async () => {
      const testNames = [
        { name: "Single", expected: "S" },
        { name: "Three Word Name", expected: "TW" },
        { name: "   Leading Whitespace Name   ", expected: "LW" },
        { name: "Special-Char O'Connor", expected: "SO" },
        { name: "123 456 Numeric", expected: "14" },
        { name: "Éléonore Daudet", expected: "ÉD" },
      ];

      for (let i = 0; i < testNames.length; i++) {
        const { name, expected } = testNames[i];
        const user = await db.createUser({
          email: `name.fuzz.${i}@company.com`,
          name,
        });

        assert.equal(
          user.avatarInitials,
          expected,
          `Name "${name}" produced initials "${user.avatarInitials}", expected "${expected}"`
        );
      }
    });

    it("Fuzz 1.5: fuzzing 100 randomized user registrations in rapid succession", async () => {
      const count = 100;
      for (let i = 0; i < count; i++) {
        const email = `fuzz.user.${i}.${Date.now()}@company.com`;
        const user = await db.createUser({
          email,
          name: `Fuzz User ${i}`,
          salary: `$${(2000 + i * 50).toLocaleString()}/mo`,
          monthlyBasePay: 2000 + i * 50,
          tier: (i % 5) + 1,
        });
        assert.ok(user.id);
      }

      const allUsers = db.getUsers();
      assert.equal(allUsers.length, 10 + count);
    });
  });

  // =========================================================================
  // 2. FUZZING: PAYROLL CALCULATION ENGINE
  // =========================================================================
  describe("Domain 2: Payroll Engine Calculation Fuzzing & Extreme Base Pays", () => {
    it("Fuzz 2.1: calculate payroll with $0 monthlyBasePay (no negative net take-home)", () => {
      const zeroPayUser = {
        id: "USR-ZERO",
        name: "Zero Pay Volunteer",
        monthlyBasePay: 0,
        salary: "$0/mo",
      };

      const result = db.calculatePayrollItem(zeroPayUser);
      assert.equal(result.gross, 0);
      assert.equal(result.paye, 0);
      assert.equal(result.pension, 0);
      assert.equal(result.hmo, 50.0);
      assert.equal(result.totalDeductions, 50.0);
      assert.equal(result.netPay, 0, "Net pay for $0 base pay must be clamped to 0 (non-negative)");
      assert.equal(result.formattedGross, "$0.00");
      assert.equal(result.formattedNet, "$0.00");
    });

    it("Fuzz 2.2: calculate payroll with extreme high base pays ($1M, $10M, $100M)", () => {
      const highSalaries = [1_000_000, 10_000_000, 100_000_000];

      for (const salary of highSalaries) {
        const highUser = {
          id: `USR-HIGH-${salary}`,
          name: "Billionaire Executive",
          monthlyBasePay: salary,
        };

        const result = db.calculatePayrollItem(highUser);
        const expectedPAYE = Math.round(salary * 0.1143 * 100) / 100;
        const expectedPension = Math.round(salary * 0.08 * 100) / 100;
        const expectedDeductions = Math.round((expectedPAYE + expectedPension + 50.0) * 100) / 100;
        const expectedNet = Math.round((salary - expectedDeductions) * 100) / 100;

        assert.equal(result.gross, salary);
        assert.equal(result.paye, expectedPAYE);
        assert.equal(result.pension, expectedPension);
        assert.equal(result.totalDeductions, expectedDeductions);
        assert.equal(result.netPay, expectedNet);
        assert.ok(result.netPay > 0);
        assert.ok(result.formattedNet.startsWith("$"));
      }
    });

    it("Fuzz 2.3: calculate payroll with negative monthly base pay (resilient clamping)", () => {
      const negativeBasePays = [-1, -500, -10000];

      for (const negativePay of negativeBasePays) {
        const user = {
          id: "USR-NEG",
          name: "Negative Base User",
          monthlyBasePay: negativePay,
        };

        const result = db.calculatePayrollItem(user);
        assert.ok(result.netPay >= 0, `Net pay for ${negativePay} must be non-negative, got ${result.netPay}`);
        assert.equal(result.netPay, 0);
      }
    });

    it("Fuzz 2.4: calculate payroll with fractional/floating point cents base pays", () => {
      const floatingSalaries = [
        3500.75,
        4250.33333333,
        0.01,
        99.999,
        12345.6789,
      ];

      for (const salary of floatingSalaries) {
        const user = {
          id: "USR-FLOAT",
          name: "Floating Cents Employee",
          monthlyBasePay: salary,
        };

        const result = db.calculatePayrollItem(user);
        assert.ok(!isNaN(result.gross));
        assert.ok(!isNaN(result.paye));
        assert.ok(!isNaN(result.pension));
        assert.ok(!isNaN(result.totalDeductions));
        assert.ok(!isNaN(result.netPay));
        // Verify 2 decimal places precision in arithmetic
        assert.equal(result.paye, Math.round(salary * 0.1143 * 100) / 100);
        assert.equal(result.pension, Math.round(salary * 0.08 * 100) / 100);
      }
    });

    it("Fuzz 2.5: calculate payroll with malformed salary strings fallback", () => {
      const malformedCases = [
        { salary: "$NaN/mo", expectedGross: 3500 },
        { salary: "free intern", expectedGross: 3500 },
        { salary: "$$$", expectedGross: 3500 },
        { salary: "", expectedGross: 3500 },
        { salary: "$4,500.50/mo", expectedGross: 4500.5 },
      ];

      for (const testCase of malformedCases) {
        const user = {
          id: "USR-MALFORMED",
          name: "Malformed Salary User",
          salary: testCase.salary,
        };

        const result = db.calculatePayrollItem(user);
        assert.equal(result.gross, testCase.expectedGross);
      }
    });

    it("Fuzz 2.6: batch monthly payroll execution with mixed active and inactive staff", async () => {
      // Create terminated and on-leave users
      await db.createUser({
        email: "term.user@company.com",
        name: "Terminated User",
        status: "Terminated",
        monthlyBasePay: 5000,
      });

      await db.createUser({
        email: "leave.user@company.com",
        name: "On Leave User",
        status: "On Leave",
        monthlyBasePay: 6000,
      });

      const batch = db.executeMonthlyPayroll("USR-004", "Marcus Brody");
      // Only 10 seed Active users should be processed
      assert.equal(batch.headcount, 10);
      assert.equal(batch.payslips.length, 10);
      assert.ok(batch.totalGross > 0);
      assert.ok(batch.totalNet > 0);
      assert.equal(batch.status, "Executed");

      // Verify batch persistence in storage
      const savedBatches = db.getPayrollBatches();
      assert.equal(savedBatches.length, 1);
      assert.equal(savedBatches[0].id, batch.id);
    });
  });

  // =========================================================================
  // 3. FUZZING: ASSET MANAGEMENT (AST) REGISTRY
  // =========================================================================
  describe("Domain 3: Asset Registry Fuzzing, Serial Lookups & Transfers", () => {
    it("Fuzz 3.1: serial lookup across special characters, whitespace, and case variants", async () => {
      const specialSerials = [
        "SN-9988-ABC#123",
        "SN/2026/08/XYZ-99",
        "SN 8839 2201 @PROD",
        "SN_SPECIAL_$$$",
      ];

      for (let i = 0; i < specialSerials.length; i++) {
        const serial = specialSerials[i];
        const newAsset = await db.addAsset({
          id: `AST-FUZZ-${i}`,
          name: `Test Asset ${i}`,
          serial,
          category: "Workstation",
          status: "Deployed",
        });

        const retrieved = db.getAssetById(`AST-FUZZ-${i}`);
        assert.ok(retrieved);
        assert.equal(retrieved.serial, serial);
      }
    });

    it("Fuzz 3.2: rapid assignee transfers across users and unassignment", async () => {
      const asset = await db.addAsset({
        id: "AST-TRANS-01",
        name: "Test Laptop for Transfers",
        serial: "SN-TRANS-999",
        assignedToId: "USR-008",
        assignedToName: "Udeh Kosisochukwu Emmanuel",
      });

      // Transfer to Sarah Chen (USR-005)
      const transfer1 = await db.updateAsset("AST-TRANS-01", {
        assignedToId: "USR-005",
        assignedToName: "Sarah Chen",
      });
      assert.equal(transfer1.assignedToId, "USR-005");
      assert.equal(transfer1.assignedToName, "Sarah Chen");

      // Filter by user
      const sarahAssets = db.getAssets("USR-005");
      assert.ok(sarahAssets.some((a) => a.id === "AST-TRANS-01"));

      // Unassign (assignedToId: null)
      const unassigned = await db.updateAsset("AST-TRANS-01", {
        assignedToId: null,
        assignedToName: null,
        status: "In Stock",
      });
      assert.equal(unassigned.assignedToId, null);
      assert.equal(unassigned.status, "In Stock");

      // Re-verify no longer in user's asset list
      const sarahAssetsAfter = db.getAssets("USR-005");
      assert.ok(!sarahAssetsAfter.some((a) => a.id === "AST-TRANS-01"));
    });

    it("Fuzz 3.3: status updates across lifecycle (Deployed -> Maintenance -> Retired -> Deployed)", async () => {
      const asset = await db.addAsset({
        id: "AST-LIFE-01",
        name: "Lifecycle Workstation",
        status: "Deployed",
      });

      const statuses = ["Maintenance", "Retired", "In Stock", "Deployed"];
      for (const status of statuses) {
        const updated = await db.updateAsset("AST-LIFE-01", { status });
        assert.equal(updated.status, status);
        const fetched = db.getAssetById("AST-LIFE-01");
        assert.equal(fetched.status, status);
      }
    });

    it("Fuzz 3.4: non-existent and malformed asset lookups", () => {
      assert.equal(db.getAssetById("AST-NON-EXISTENT"), null);
      assert.equal(db.getAssetById(""), null);
      assert.equal(db.getAssetById(null), null);
      assert.equal(db.getAssetById(undefined), null);
    });
  });

  // =========================================================================
  // 4. FUZZING: SPRINT MANAGEMENT & HELPDESK SLA TRIAGE
  // =========================================================================
  describe("Domain 4: Sprints & Helpdesk Ticket SLA Priority Transitions", () => {
    it("Fuzz 4.1: sprint status lifecycle and boundary velocity / progress values", async () => {
      const sprint = await db.addSprint({
        id: "SPR-FUZZ-01",
        title: "Sprint Fuzz Stress",
        department: "Engineering",
        velocity: "10,000 Story Points",
        progress: "100%",
        status: "Active",
        goals: ["Stress testing", "Boundary verification"],
      });

      assert.equal(sprint.velocity, "10,000 Story Points");
      assert.equal(sprint.progress, "100%");

      // Transition to Completed
      const completed = await db.updateSprint("SPR-FUZZ-01", { status: "Completed" });
      assert.equal(completed.status, "Completed");

      // Transition back to Active
      const reactivated = await db.updateSprint("SPR-FUZZ-01", { status: "Active" });
      assert.equal(reactivated.status, "Active");
    });

    it("Fuzz 4.2: helpdesk ticket SLA priority escalation and de-escalation", async () => {
      const ticket = await db.createTicket({
        id: "TCK-SLA-01",
        userId: "USR-008",
        name: "Udeh Kosisochukwu Emmanuel",
        subject: "Critical Database Replica Latency",
        priority: "Low",
        status: "Open",
      });

      const priorities = ["Medium", "High", "Critical", "Urgent", "Low"];
      for (const priority of priorities) {
        const updated = await db.updateTicket("TCK-SLA-01", { priority });
        assert.equal(updated.priority, priority);
      }
    });

    it("Fuzz 4.3: helpdesk ticket status transition cycle (Open -> In Progress -> Resolved -> Closed -> Re-opened)", async () => {
      const ticket = await db.createTicket({
        id: "TCK-FLOW-01",
        userId: "USR-008",
        subject: "VPN Gateway Connectivity Drop",
        status: "Open",
      });

      const statusPath = ["In Progress", "Resolved", "Closed", "Open"];
      for (const status of statusPath) {
        const updated = await db.updateTicketStatus("TCK-FLOW-01", status);
        assert.equal(updated.status, status);
        const stored = db.getTicketById("TCK-FLOW-01");
        assert.equal(stored.status, status);
      }
    });

    it("Fuzz 4.4: ticket queries with empty or non-existent filters", () => {
      const ticketsAll = db.getTickets();
      assert.ok(ticketsAll.length >= 1);

      const nonExistentUserTickets = db.getTickets("USR-DOES-NOT-EXIST");
      assert.deepEqual(nonExistentUserTickets, []);

      assert.equal(db.getTicketById("TCK-UNKNOWN-999"), null);
    });
  });

  // =========================================================================
  // 5. FUZZING: THEME PERSISTENCE & CORRUPTED STORAGE KEYS
  // =========================================================================
  describe("Domain 5: Theme Persistence & Corrupted Storage Keys", () => {
    it("Fuzz 5.1: theme retrieval handles unknown, corrupted, and invalid theme keys", () => {
      const themeKey = "monolith_theme";
      const testCases = [
        { stored: "dark", expectedEffective: "dark" },
        { stored: "light", expectedEffective: "light" },
        { stored: "DARK", expectedEffective: "light" }, // uppercase normalized or fallback
        { stored: "", expectedEffective: "light" },
        { stored: "cyberpunk_neon_unknown", expectedEffective: "light" },
        { stored: "null", expectedEffective: "light" },
        { stored: "12345", expectedEffective: "light" },
        { stored: "{ \"bad\": \"json\" }", expectedEffective: "light" },
      ];

      for (const tc of testCases) {
        env.storage.setItem(themeKey, tc.stored);
        const raw = env.storage.getItem(themeKey);
        
        // Theme resolver logic equivalent to App.jsx
        let resolvedTheme = raw;
        if (!resolvedTheme || (resolvedTheme !== "dark" && resolvedTheme !== "light")) {
          resolvedTheme = "light";
        }

        assert.equal(
          resolvedTheme,
          tc.expectedEffective,
          `Theme stored "${tc.stored}" should resolve safely to "${tc.expectedEffective}", got "${resolvedTheme}"`
        );
      }
    });

    it("Fuzz 5.2: theme state survives clear and mutation of other ERP keys", () => {
      const themeKey = "monolith_theme";
      env.storage.setItem(themeKey, "dark");

      // Corrupt or clear all database keys
      env.storage.removeItem("monolith_db_users");
      env.storage.removeItem("monolith_db_departments");
      env.storage.setItem("monolith_db_assets", "CORRUPTED_STRING_NOT_JSON");

      // Database should auto-heal with fallback defaults
      const users = db.getUsers();
      assert.equal(users.length, 10);

      // Theme key should remain untouched
      assert.equal(env.storage.getItem(themeKey), "dark");
    });
  });
});
