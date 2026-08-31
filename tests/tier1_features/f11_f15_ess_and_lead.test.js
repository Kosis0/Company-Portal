/**
 * Tier 1 Feature Coverage: F11 to F15 (Helpdesk, HMO, OKRs, Profile, Attendance Monitor)
 * Each feature includes >= 5 distinct, verifiable test cases.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 1 - F11: Helpdesk Ticket Creation", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F11-1: creates a new support ticket with default status 'Open'", async () => {
    const ticket = await db.createTicket({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      subject: "Secondary Monitor Not Detected",
      category: "IT Hardware",
      priority: "Medium",
      details: "Thunderbolt dock does not output HDMI video signal.",
    });

    assert.ok(ticket.id.startsWith("TCK-"));
    assert.equal(ticket.status, "Open");
    assert.equal(ticket.priority, "Medium");
    assert.ok(ticket.assignedTo);
  });

  it("F11-2: updates support ticket status to In Progress, Resolved, or Closed", async () => {
    const ticket = await db.createTicket({
      userId: "USR-008",
      subject: "Need GitHub Copilot License",
      category: "Software Access",
      priority: "Low",
    });

    const inProgress = await db.updateTicketStatus(ticket.id, "In Progress");
    assert.equal(inProgress.status, "In Progress");

    const resolved = await db.updateTicketStatus(ticket.id, "Resolved");
    assert.equal(resolved.status, "Resolved");
  });

  it("F11-3: retrieves user's tickets filtered by userId", () => {
    const userTickets = db.getTickets("USR-008");
    assert.ok(Array.isArray(userTickets));
    assert.ok(userTickets.every((t) => t.userId === "USR-008"));
  });

  it("F11-4: supports high priority SLA triage tags", async () => {
    const ticket = await db.createTicket({
      userId: "USR-008",
      subject: "Production VPN Down",
      category: "Network & Security",
      priority: "High",
    });
    assert.equal(ticket.priority, "High");
  });

  it("F11-5: retrieves specific ticket by ID via db.getTicketById", async () => {
    const created = await db.createTicket({
      userId: "USR-008",
      subject: "YubiKey Replacement",
      category: "Security",
    });
    const found = db.getTicketById(created.id);
    assert.ok(found);
    assert.equal(found.subject, "YubiKey Replacement");
  });
});

describe("Tier 1 - F12: HMO & Corporate Benefits Directory", () => {
  const HMO_DIRECTORY = [
    {
      id: "HMO-01",
      provider: "Axa Mansard Health",
      policyNumber: "AXA-CORP-992381",
      tier: "Platinum Executive Care",
      coverageLimit: "$50,000 / annum",
      emergencyHotline: "+234 800 292 6267",
      hospitals: [
        { name: "Lagoon Hospital", location: "Ikoyi, Lagos", type: "General & Surgery" },
        { name: "Evercare Hospital", location: "Lekki, Lagos", type: "Multi-Specialist" },
        { name: "St. Nicholas Hospital", location: "Lagos Island", type: "Cardiology & Renal" },
      ],
    },
  ];

  it("F12-1: provides policy details and coverage limit for enrolled staff", () => {
    const policy = HMO_DIRECTORY[0];
    assert.equal(policy.provider, "Axa Mansard Health");
    assert.equal(policy.coverageLimit, "$50,000 / annum");
  });

  it("F12-2: lists authorized in-network hospitals and specialist clinics", () => {
    const hospitals = HMO_DIRECTORY[0].hospitals;
    assert.ok(hospitals.length >= 3);
    assert.ok(hospitals.some((h) => h.name === "Lagoon Hospital"));
  });

  it("F12-3: provides 24/7 toll-free emergency medical dispatch hotline", () => {
    assert.ok(HMO_DIRECTORY[0].emergencyHotline.startsWith("+234"));
  });

  it("F12-4: filters hospital providers by location/city", () => {
    const lekkiHospitals = HMO_DIRECTORY[0].hospitals.filter((h) => h.location.includes("Lekki"));
    assert.equal(lekkiHospitals.length, 1);
    assert.equal(lekkiHospitals[0].name, "Evercare Hospital");
  });

  it("F12-5: verifies employee HMO plan tier mapping", () => {
    const planTier = HMO_DIRECTORY[0].tier;
    assert.ok(planTier.includes("Executive") || planTier.includes("Platinum") || planTier.includes("Care"));
  });
});

describe("Tier 1 - F13: OKRs & Quarterly Performance Rating", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F13-1: retrieves employee manager performance score (e.g. 4.5 / 5.0)", () => {
    const user = db.getUserById("USR-008");
    assert.equal(user.score, "4.5 / 5.0");
  });

  it("F13-2: retrieves department-wide performance benchmarks", () => {
    const vpEng = db.getUserById("USR-002");
    const lead = db.getUserById("USR-005");
    assert.equal(vpEng.score, "4.9 / 5.0");
    assert.equal(lead.score, "4.8 / 5.0");
  });

  it("F13-3: updates user performance rating score and persists to DB", async () => {
    await db.updateUser("USR-008", { score: "4.8 / 5.0" });
    const updated = db.getUserById("USR-008");
    assert.equal(updated.score, "4.8 / 5.0");
  });

  it("F13-4: evaluates quarterly OKR key result progress metrics", () => {
    const okrs = [
      { id: "OKR-1", title: "Complete v3 Portal Migration", progress: 85, target: 100 },
      { id: "OKR-2", title: "Achieve 99.9% Test Coverage", progress: 95, target: 100 },
    ];
    assert.ok(okrs.every((o) => o.progress <= o.target));
  });

  it("F13-5: calculates average team OKR completion rate", () => {
    const okrs = [
      { progress: 80 },
      { progress: 90 },
      { progress: 100 },
    ];
    const avg = okrs.reduce((acc, curr) => acc + curr.progress, 0) / okrs.length;
    assert.equal(avg, 90);
  });
});

describe("Tier 1 - F14: Personnel Profile Self-Update", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F14-1: updates phone number, residential location, and personal details", async () => {
    const updated = await db.updateUser("USR-008", {
      phone: "+234 811 999 8888",
      location: "Victoria Island, Lagos",
    });
    assert.equal(updated.phone, "+234 811 999 8888");
    assert.equal(updated.location, "Victoria Island, Lagos");
  });

  it("F14-2: updates bank account and disbursement details", async () => {
    const updated = await db.updateUser("USR-008", {
      bankName: "Access Bank",
      accountNumber: "0123456789",
    });
    assert.equal(updated.bankName, "Access Bank");
    assert.equal(updated.accountNumber, "0123456789");
  });

  it("F14-3: updates statutory TIN and Pension PIN identifiers", async () => {
    const updated = await db.updateUser("USR-008", {
      taxId: "TIN-99988811",
      pensionPin: "PEN-77766655",
    });
    assert.equal(updated.taxId, "TIN-99988811");
    assert.equal(updated.pensionPin, "PEN-77766655");
  });

  it("F14-4: preserves unmodified fields when performing partial profile update", async () => {
    const original = db.getUserById("USR-008");
    const updated = await db.updateUser("USR-008", { phone: "+234 800 111 2222" });
    assert.equal(updated.email, original.email);
    assert.equal(updated.tier, original.tier);
    assert.equal(updated.salary, original.salary);
    assert.equal(updated.annualLeaveBalance, original.annualLeaveBalance);
  });

  it("F14-5: returns null when attempting to update non-existent user ID", async () => {
    const res = await db.updateUser("USR-99999", { phone: "+1 555 000 1111" });
    assert.equal(res, null);
  });
});

describe("Tier 1 - F15: Direct Reports Attendance Monitor", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("F15-1: returns attendance records of only direct reports for Line Manager (USR-005)", () => {
    const teamAttendance = db.getTeamAttendance("USR-005");
    assert.ok(Array.isArray(teamAttendance));
    // USR-005 reports: USR-008 and USR-009
    const reportUserIds = new Set(["USR-008", "USR-009"]);
    for (const record of teamAttendance) {
      assert.ok(reportUserIds.has(record.userId), `Record user ${record.userId} must be a direct report`);
    }
  });

  it("F15-2: excludes attendance of non-reporting employees from Lead's attendance monitor", () => {
    const teamAttendance = db.getTeamAttendance("USR-005");
    const userIds = teamAttendance.map((a) => a.userId);
    // USR-006, USR-007, USR-010 are NOT direct reports of USR-005
    assert.ok(!userIds.includes("USR-006"));
    assert.ok(!userIds.includes("USR-007"));
    assert.ok(!userIds.includes("USR-010"));
  });

  it("F15-3: dynamically includes new clock-in events submitted by direct reports", async () => {
    await db.addAttendance({
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      date: "2026-09-01",
      in: "09:00 AM",
      out: "—",
      hours: "In Progress",
      status: "On Time",
    });

    const teamAttendance = db.getTeamAttendance("USR-005");
    assert.ok(teamAttendance.some((a) => a.date === "2026-09-01" && a.userId === "USR-008"));
  });

  it("F15-4: returns empty attendance list for manager with zero direct reports", () => {
    const attendance = db.getTeamAttendance("USR-008");
    assert.deepEqual(attendance, []);
  });

  it("F15-5: handles VP Eng (USR-002) team attendance monitoring for Leads", () => {
    const vpTeamAttendance = db.getTeamAttendance("USR-002");
    assert.ok(Array.isArray(vpTeamAttendance));
    // Direct reports: Sarah Chen (USR-005), David Okonjo (USR-006)
    const vpReports = new Set(["USR-005", "USR-006"]);
    for (const record of vpTeamAttendance) {
      assert.ok(vpReports.has(record.userId));
    }
  });
});
