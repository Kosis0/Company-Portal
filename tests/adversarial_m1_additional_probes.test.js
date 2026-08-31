/**
 * Additional Empirical Stress Probes for Milestone 1 (M1)
 * Testing Auth, Department Budget Filtering, User Creation & Edge cases
 */
import assert from "node:assert/strict";

if (typeof globalThis.localStorage === "undefined") {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

const { db } = await import("../src/services/db.js");
const { auth } = await import("../src/services/auth.js");

console.log("=================================================");
console.log("🧪 RUNNING ADDITIONAL M1 ADVERSARIAL PROBES");
console.log("=================================================");

const findings = [];

// -------------------------------------------------------------
// PROBE 6.1: Duplicate Email Registration in Auth
// -------------------------------------------------------------
try {
  db.resetDatabase();
  // Register first user
  await auth.register({
    email: "test.duplicate@company.com",
    name: "User One",
    department: "Engineering",
  });

  // Attempt duplicate registration with same email
  try {
    const session2 = await auth.register({
      email: "test.duplicate@company.com",
      name: "User Two (Impostor)",
      department: "Engineering",
    });
    console.log(`  -> Duplicate registration result: Allowed! Session token created: ${session2.token}`);
    findings.push({
      category: "Authentication / Data Integrity",
      severity: "MEDIUM",
      title: "`auth.register` permits duplicate email registrations",
      description: "`auth.register` does not check whether `db.getUserByEmail(email)` already exists before creating a new user, resulting in duplicate conflicting user records with identical emails.",
      empiricalEvidence: `Two users successfully registered with email 'test.duplicate@company.com'.`,
    });
  } catch (err) {
    console.log(`  -> Duplicate registration prevented with error: ${err.message}`);
  }
} catch (err) {
  console.log(`Probe 6.1 error: ${err.message}`);
}

// -------------------------------------------------------------
// PROBE 6.2: Department Budget Substring Match False Positives
// -------------------------------------------------------------
try {
  db.resetDatabase();
  // Add a user in department "Chrome Engineering" or "Thrills"
  await db.createUser({
    id: "USR-CHROME",
    name: "Chrome Specialist",
    email: "chrome@company.com",
    department: "Chrome Infrastructure",
    salary: "$10,000/mo",
    monthlyBasePay: 10000,
  });

  // Check HR Department Budget (code is 'HR')
  // In db.js: u.department.toLowerCase().includes(dept.code.toLowerCase()) -> "chrome infrastructure".includes("hr") is TRUE!
  const hrBudget = db.getDepartmentBudget("DEP-HR");
  console.log(`  -> HR Dept Budget spent: $${hrBudget.spentAmount}, Headcount: ${hrBudget.headcount}`);
  
  const hrUsers = db.getUsers().filter(u => u.department === "Human Resources");
  const expectedSpent = hrUsers.reduce((sum, u) => sum + (u.monthlyBasePay || 0), 0);
  console.log(`  -> Expected HR actual spent: $${expectedSpent}, Diff: $${hrBudget.spentAmount - expectedSpent}`);

  if (hrBudget.spentAmount > expectedSpent) {
    findings.push({
      category: "Department Budgeting Bug",
      severity: "MEDIUM",
      title: "Department budget calculation matches substring in department names (False Inclusion)",
      description: "`db.getDepartmentBudget` uses `u.department.toLowerCase().includes(dept.code.toLowerCase())`. For department code 'HR', any department containing 'hr' (like 'Chrome Infrastructure') is wrongly matched and included in HR budget spend and headcount.",
      empiricalEvidence: `HR Budget included 'Chrome Infrastructure' user, increasing headcount from ${hrUsers.length} to ${hrBudget.headcount} and spend by $10,000.`,
    });
  }
} catch (err) {
  console.log(`Probe 6.2 error: ${err.message}`);
}

// -------------------------------------------------------------
// PROBE 6.3: Empty String / Falsy Password in Auth Login
// -------------------------------------------------------------
try {
  db.resetDatabase();
  // Attempt login with correct email but empty or incorrect password
  try {
    const sessionWrongPass = await auth.login("ceo@company.com", "wrongpassword");
    console.log("  -> Login with wrong password allowed!", sessionWrongPass);
    findings.push({
      category: "Authentication Security",
      severity: "CRITICAL",
      title: "`auth.login` accepts incorrect passwords",
      description: "Password verification is missing or bypassed in auth.login.",
    });
  } catch (err) {
    console.log(`  -> Correctly rejected wrong password: ${err.message}`);
  }
} catch (err) {
  console.log(`Probe 6.3 error: ${err.message}`);
}

console.log("\n=================================================");
console.log(`🔍 ADDITIONAL PROBE SUMMARY: ${findings.length} FINDINGS`);
console.log("=================================================");

findings.forEach((f, idx) => {
  console.log(`\n[FINDING #${idx + 1}] [${f.severity}] ${f.title}`);
  console.log(`  Category: ${f.category}`);
  console.log(`  Description: ${f.description}`);
  if (f.empiricalEvidence) {
    console.log(`  Evidence: ${f.empiricalEvidence}`);
  }
});
