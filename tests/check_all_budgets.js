/**
 * Check all 4 department budgets on fresh seed data
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
db.resetDatabase();

const depts = db.getDepartments();
console.log("=== SEED DEPARTMENT BUDGET MATCHING ANALYSIS ===");

for (const d of depts) {
  const b = db.getDepartmentBudget(d.id);
  const matchedUsers = db.getUsers().filter((u) =>
    u.department === d.name ||
    u.department.toLowerCase().includes(d.code.toLowerCase())
  );
  console.log(`Dept ${d.id} (${d.name}, code: ${d.code}):`);
  console.log(`  Allocated: $${b.allocatedAmount}`);
  console.log(`  Spent: $${b.spentAmount}`);
  console.log(`  Utilization: ${b.budgetUtilization}`);
  console.log(`  Matched Users (${matchedUsers.length}): ${matchedUsers.map(u => `${u.name} (${u.department})`).join(", ")}`);
}
