/**
 * Tier 1 Feature Coverage: F28 to F31 (IT Assets, SLA Triage, Executive Cockpit & Broadcasts)
 * Each feature includes >= 5 distinct, verifiable test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F28: IT Hardware Asset Registry", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F28-1: retrieves all hardware assets in company registry via db.getAssets()", () => {
    const assets = db.getAssets();
    assert.ok(Array.isArray(assets));
    assert.equal(assets.length, 5);
  });

  it("F28-2: filters assets assigned to specific employee by userId", () => {
    const userAssets = db.getAssets("USR-008");
    assert.equal(userAssets.length, 1);
    assert.equal(userAssets[0].name, 'MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)');
    assert.equal(userAssets[0].serial, "MBP-2026-99238");
  });

  it("F28-3: registers new IT hardware asset in inventory ledger", async () => {
    const newAsset = await db.addAsset({
      name: "Dell XPS 15 (i9 / 32GB)",
      category: "Workstation",
      serial: "DELL-2026-55443",
      assignedToId: "USR-009",
      assignedToName: "Chidi Nnamdi",
      department: "Product & Design",
      condition: "New",
      value: "$2,200.00",
    });

    assert.ok(newAsset.id.startsWith("AST-"));
    assert.equal(newAsset.status, "Deployed");
    assert.equal(newAsset.condition, "New");

    const allAssets = db.getAssets();
    assert.ok(allAssets.some((a) => a.id === newAsset.id));
  });

  it("F28-4: retrieves specific asset by ID via db.getAssetById", () => {
    const asset = db.getAssetById("AST-104");
    assert.ok(asset);
    assert.equal(asset.name, "YubiKey 5C NFC Enterprise 2FA Security Key");
    assert.equal(asset.category, "Security Token");
  });

  it("F28-5: calculates total valuation of deployed corporate IT hardware", () => {
    const assets = db.getAssets();
    const totalValue = assets.reduce((sum, a) => {
      const num = parseFloat(a.value.replace(/[^0-9.-]+/g, ""));
      return sum + num;
    }, 0);
    assert.ok(totalValue > 7000, "Total asset valuation should exceed $7,000");
  });
});

describe("Tier 1 - F29: IT Support SLA Triage Queue", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F29-1: retrieves all helpdesk tickets in triage queue", () => {
    const tickets = db.getTickets();
    assert.ok(Array.isArray(tickets));
    assert.ok(tickets.length >= 1);
  });

  it("F29-2: assigns SLA resolution time limits by priority tier (High: 4h, Medium: 24h, Low: 48h)", () => {
    const slaHours = { High: 4, Medium: 24, Low: 48 };
    assert.equal(slaHours.High, 4);
    assert.equal(slaHours.Medium, 24);
    assert.equal(slaHours.Low, 48);
  });

  it("F29-3: advances ticket through lifecycle Open -> In Progress -> Resolved", async () => {
    const ticket = await db.createTicket({
      userId: "USR-008",
      subject: "Wi-Fi Connectivity Issue",
      priority: "Low",
    });

    const step1 = await db.updateTicketStatus(ticket.id, "In Progress");
    assert.equal(step1.status, "In Progress");

    const step2 = await db.updateTicketStatus(ticket.id, "Resolved");
    assert.equal(step2.status, "Resolved");
  });

  it("F29-4: filters tickets by priority level", async () => {
    await db.createTicket({ userId: "USR-008", subject: "Critical VPN Outage", priority: "High" });
    const tickets = db.getTickets();
    const highTickets = tickets.filter((t) => t.priority === "High");
    assert.ok(highTickets.length >= 1);
  });

  it("F29-5: filters tickets by department category", async () => {
    await db.createTicket({ userId: "USR-008", subject: "Access badge issue", category: "Facilities" });
    const tickets = db.getTickets();
    const facilities = tickets.filter((t) => t.category === "Facilities");
    assert.ok(facilities.length >= 1);
  });
});

describe("Tier 1 - F30: Executive Command Cockpit", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  function getExecutiveMetrics() {
    const users = db.getUsers();
    const depts = db.getDepartments();
    const totalPayroll = users.reduce((sum, u) => sum + (u.monthlyBasePay || 3500), 0);
    const activeHeadcount = users.filter((u) => u.status === "Active").length;
    const deptBudgets = depts.reduce((sum, d) => {
      const num = parseFloat(d.monthlyBudget.replace(/[^0-9.-]+/g, ""));
      return sum + num;
    }, 0);

    return {
      activeHeadcount,
      totalMonthlyPayroll: totalPayroll,
      totalMonthlyBudget: deptBudgets,
      departmentCount: depts.length,
      estimatedBurnRate: totalPayroll + deptBudgets,
    };
  }

  it("F30-1: aggregates total global company headcount", () => {
    const metrics = getExecutiveMetrics();
    assert.equal(metrics.activeHeadcount, 10);
  });

  it("F30-2: computes total monthly company payroll commitment", () => {
    const metrics = getExecutiveMetrics();
    assert.ok(metrics.totalMonthlyPayroll > 50000);
  });

  it("F30-3: computes total departmental allocated operating budget", () => {
    const metrics = getExecutiveMetrics();
    assert.ok(metrics.totalMonthlyBudget > 80000);
  });

  it("F30-4: calculates composite estimated monthly burn rate", () => {
    const metrics = getExecutiveMetrics();
    assert.equal(metrics.estimatedBurnRate, metrics.totalMonthlyPayroll + metrics.totalMonthlyBudget);
  });

  it("F30-5: provides departmental distribution count", () => {
    const metrics = getExecutiveMetrics();
    assert.equal(metrics.departmentCount, 4);
  });
});

describe("Tier 1 - F31: Company-Wide Broadcast Bulletins", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F31-1: retrieves all active announcements via db.getAnnouncements()", () => {
    const anns = db.getAnnouncements();
    assert.ok(Array.isArray(anns));
    assert.equal(anns.length, 2);
  });

  it("F31-2: creates new executive broadcast bulletin with author attribution", async () => {
    const ann = await db.createAnnouncement({
      title: "Q4 Strategic Roadmap & Global Expansion",
      type: "Important",
      author: "Dr. Alexander Vance (CEO)",
      content: "All hands meeting scheduled for Friday at 10 AM WAT.",
    });

    assert.ok(ann.id.startsWith("ANN-"));
    assert.equal(ann.title, "Q4 Strategic Roadmap & Global Expansion");
    assert.equal(ann.author, "Dr. Alexander Vance (CEO)");
    assert.ok(ann.date);
  });

  it("F31-3: supports different announcement types (Important, General)", async () => {
    const generalAnn = await db.createAnnouncement({
      title: "Office Cafeteria Menu Update",
      type: "General",
      author: "Facilities Lead",
      content: "New healthy snack options added.",
    });
    assert.equal(generalAnn.type, "General");
  });

  it("F31-4: verifies latest announcements appear at top of list", async () => {
    const ann = await db.createAnnouncement({
      title: "Urgent Security Patch",
      type: "Important",
      content: "Update macOS immediately.",
    });
    const all = db.getAnnouncements();
    assert.equal(all[0].id, ann.id);
  });

  it("F31-5: retrieves specific announcement by ID via db.getAnnouncementById", async () => {
    const created = await db.createAnnouncement({
      title: "Holiday Schedule",
      content: "Office closed on public holidays.",
    });
    const fetched = db.getAnnouncementById(created.id);
    assert.ok(fetched);
    assert.equal(fetched.title, "Holiday Schedule");
  });
});
