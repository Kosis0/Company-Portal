/**
 * Detailed investigation probe for Department Budget filtering
 */

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
console.log("Initial seed users:", db.getUsers().length);
const initialHRBudget = db.getDepartmentBudget("DEP-HR");
console.log("Initial HR Budget:", initialHRBudget);

// Add user in 'Chrome Development'
await db.createUser({
  id: "USR-TEST-CHR",
  name: "Chrome Worker",
  email: "chrome.worker@company.com",
  department: "Chrome Development",
  salary: "$7,000/mo",
  monthlyBasePay: 7000,
});

const hrBudgetAfter = db.getDepartmentBudget("DEP-HR");
console.log("HR Budget after adding Chrome Worker:", hrBudgetAfter);
console.log("Spent diff:", hrBudgetAfter.spentAmount - initialHRBudget.spentAmount);
console.log("Headcount diff:", hrBudgetAfter.headcount - initialHRBudget.headcount);
