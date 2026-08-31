/**
 * Multi-Tier Enterprise Database & Relational Model Service for Monolith ERP
 * Handles 5-Tier Organizational Hierarchy, Department Toolkits, IT Assets,
 * Multi-Stage Chain of Command Approvals, Automated Payroll Execution,
 * Resilient Offline Dual-Write Caching, and Realtime Supabase Cloud Sync.
 */
import { supabase, isSupabaseConfigured } from "./supabase.js";

export const STORAGE_KEYS = {
  USERS: "monolith_db_users",
  DEPARTMENTS: "monolith_db_departments",
  ASSETS: "monolith_db_assets",
  ATTENDANCE: "monolith_db_attendance",
  LEAVES: "monolith_db_leaves",
  CLAIMS: "monolith_db_claims",
  TICKETS: "monolith_db_tickets",
  ANNOUNCEMENTS: "monolith_db_announcements",
  SPRINTS: "monolith_db_sprints",
  PAYROLL: "monolith_db_payroll_batches",
};

// Comprehensive 5-Tier Enterprise Seed Data (10 Users across Tiers 1-5 & Departments)
export const SEED_DATA = {
  users: [
    // TIER 5: EXECUTIVE C-SUITE (CEO)
    {
      id: "USR-001",
      email: "ceo@company.com",
      password: "password123",
      tier: 5,
      role: "executive",
      name: "Dr. Alexander Vance",
      title: "Chief Executive Officer & Co-Founder",
      department: "Executive",
      phone: "+234 801 000 1111",
      location: "Lagos Headquarters",
      managerId: null,
      managerName: "Board of Directors",
      salary: "$18,500/mo",
      monthlyBasePay: 18500,
      score: "5.0 / 5.0",
      status: "Active",
      annualLeaveBalance: 30,
      sickLeaveBalance: 15,
      casualLeaveBalance: 7,
      avatarInitials: "AV",
      bankName: "First Bank of Nigeria",
      accountNumber: "1010101010",
      taxId: "TIN-00100101",
      pensionPin: "PEN-00100101",
      createdAt: "2025-01-01T08:00:00.000Z",
    },

    // TIER 4: HEADS OF DEPARTMENT (DIRECTORS / VPS)
    {
      id: "USR-002",
      email: "vpeng@company.com",
      password: "password123",
      tier: 4,
      role: "director",
      name: "Tunde Bakare",
      title: "VP of Technology & Engineering",
      department: "Engineering",
      phone: "+234 802 222 3344",
      location: "Port Harcourt Office",
      managerId: "USR-001",
      managerName: "Dr. Alexander Vance (CEO)",
      salary: "$9,800/mo",
      monthlyBasePay: 9800,
      score: "4.9 / 5.0",
      status: "Active",
      annualLeaveBalance: 24,
      sickLeaveBalance: 12,
      casualLeaveBalance: 5,
      avatarInitials: "TB",
      bankName: "First Bank of Nigeria",
      accountNumber: "2020202020",
      taxId: "TIN-00200202",
      pensionPin: "PEN-00200202",
      createdAt: "2025-03-15T09:00:00.000Z",
    },
    {
      id: "USR-003",
      email: "admin@company.com",
      password: "password123",
      tier: 4,
      role: "admin",
      name: "Victoria Sterling",
      title: "VP of People Operations & Culture",
      department: "Human Resources",
      phone: "+234 802 111 2233",
      location: "Lagos Headquarters",
      managerId: "USR-001",
      managerName: "Dr. Alexander Vance (CEO)",
      salary: "$8,500/mo",
      monthlyBasePay: 8500,
      score: "4.9 / 5.0",
      status: "Active",
      annualLeaveBalance: 25,
      sickLeaveBalance: 12,
      casualLeaveBalance: 5,
      avatarInitials: "VS",
      bankName: "First Bank of Nigeria",
      accountNumber: "3030303030",
      taxId: "TIN-00300303",
      pensionPin: "PEN-00300303",
      createdAt: "2025-02-10T08:30:00.000Z",
    },
    {
      id: "USR-004",
      email: "finance@company.com",
      password: "password123",
      tier: 4,
      role: "finance",
      name: "Marcus Brody",
      title: "Head of Finance & Corporate Operations",
      department: "Finance & Operations",
      phone: "+234 803 555 6677",
      location: "Lagos Headquarters",
      managerId: "USR-001",
      managerName: "Dr. Alexander Vance (CEO)",
      salary: "$8,200/mo",
      monthlyBasePay: 8200,
      score: "4.8 / 5.0",
      status: "Active",
      annualLeaveBalance: 22,
      sickLeaveBalance: 10,
      casualLeaveBalance: 5,
      avatarInitials: "MB",
      bankName: "First Bank of Nigeria",
      accountNumber: "4040404040",
      taxId: "TIN-00400404",
      pensionPin: "PEN-00400404",
      createdAt: "2025-04-01T09:00:00.000Z",
    },

    // TIER 3: LINE MANAGERS & TEAM LEADS
    {
      id: "USR-005",
      email: "sarah.chen@company.com",
      password: "password123",
      tier: 3,
      role: "manager",
      name: "Sarah Chen",
      title: "Frontend & Mobile Engineering Lead",
      department: "Engineering",
      phone: "+234 803 444 5566",
      location: "Port Harcourt Office",
      managerId: "USR-002",
      managerName: "Tunde Bakare (VP Eng)",
      salary: "$6,200/mo",
      monthlyBasePay: 6200,
      score: "4.8 / 5.0",
      status: "Active",
      annualLeaveBalance: 18,
      sickLeaveBalance: 10,
      casualLeaveBalance: 5,
      avatarInitials: "SC",
      bankName: "Zenith Bank",
      accountNumber: "5050505050",
      taxId: "TIN-00500505",
      pensionPin: "PEN-00500505",
      createdAt: "2025-06-01T10:00:00.000Z",
    },
    {
      id: "USR-006",
      email: "devops.lead@company.com",
      password: "password123",
      tier: 3,
      role: "manager",
      name: "David Okonjo",
      title: "DevOps & Cloud Infrastructure Lead",
      department: "Engineering",
      phone: "+234 818 222 3344",
      location: "Remote / Port Harcourt",
      managerId: "USR-002",
      managerName: "Tunde Bakare (VP Eng)",
      salary: "$5,800/mo",
      monthlyBasePay: 5800,
      score: "4.7 / 5.0",
      status: "Active",
      annualLeaveBalance: 16,
      sickLeaveBalance: 9,
      casualLeaveBalance: 4,
      avatarInitials: "DO",
      bankName: "Zenith Bank",
      accountNumber: "6060606060",
      taxId: "TIN-00600606",
      pensionPin: "PEN-00600606",
      createdAt: "2025-07-15T09:00:00.000Z",
    },
    {
      id: "USR-007",
      email: "talent.lead@company.com",
      password: "password123",
      tier: 3,
      role: "manager",
      name: "Alex Rivera",
      title: "Talent Acquisition & HR Lead",
      department: "Human Resources",
      phone: "+234 805 777 8899",
      location: "Lagos Headquarters",
      managerId: "USR-003",
      managerName: "Victoria Sterling (VP HR)",
      salary: "$4,600/mo",
      monthlyBasePay: 4600,
      score: "4.6 / 5.0",
      status: "Active",
      annualLeaveBalance: 17,
      sickLeaveBalance: 8,
      casualLeaveBalance: 4,
      avatarInitials: "AR",
      bankName: "Guaranty Trust Bank",
      accountNumber: "7070707070",
      taxId: "TIN-00700707",
      pensionPin: "PEN-00700707",
      createdAt: "2025-08-01T09:00:00.000Z",
    },

    // TIER 1 & 2: STAFF, SENIOR ASSOCIATES & DEVELOPER INTERNS
    {
      id: "USR-008",
      email: "employee@company.com",
      password: "password123",
      tier: 1,
      role: "employee",
      name: "Udeh Kosisochukwu Emmanuel",
      title: "Software Developer Intern",
      department: "Engineering",
      phone: "+234 812 345 6789",
      location: "Port Harcourt Office",
      managerId: "USR-005",
      managerName: "Sarah Chen (Frontend Lead)",
      bankName: "First Bank of Nigeria",
      accountNumber: "3049283482",
      taxId: "TIN-98234711",
      pensionPin: "PEN-100293847",
      salary: "$3,500/mo",
      monthlyBasePay: 3500,
      score: "4.5 / 5.0",
      status: "Active",
      annualLeaveBalance: 14,
      sickLeaveBalance: 8,
      casualLeaveBalance: 4,
      avatarInitials: "UK",
      createdAt: "2026-08-01T09:00:00.000Z",
    },
    {
      id: "USR-009",
      email: "chidi.ui@company.com",
      password: "password123",
      tier: 2,
      role: "senior_contributor",
      name: "Chidi Nnamdi",
      title: "Product Designer & UI Engineer",
      department: "Product & Design",
      phone: "+234 809 111 4455",
      location: "Port Harcourt Office",
      managerId: "USR-005",
      managerName: "Sarah Chen (Tech Lead)",
      bankName: "Zenith Bank",
      accountNumber: "1029384756",
      taxId: "TIN-77192834",
      pensionPin: "PEN-883719201",
      salary: "$4,200/mo",
      monthlyBasePay: 4200,
      score: "4.6 / 5.0",
      status: "Active",
      annualLeaveBalance: 16,
      sickLeaveBalance: 9,
      casualLeaveBalance: 5,
      avatarInitials: "CN",
      createdAt: "2026-02-15T09:30:00.000Z",
    },
    {
      id: "USR-010",
      email: "fatima.ops@company.com",
      password: "password123",
      tier: 2,
      role: "senior_contributor",
      name: "Fatima Aliyu",
      title: "Financial Analyst & Compliance Associate",
      department: "Finance & Operations",
      phone: "+234 807 333 9988",
      location: "Lagos Headquarters",
      managerId: "USR-004",
      managerName: "Marcus Brody (Head of Finance)",
      bankName: "Guaranty Trust Bank",
      accountNumber: "0293847561",
      taxId: "TIN-55910283",
      pensionPin: "PEN-662910384",
      salary: "$4,000/mo",
      monthlyBasePay: 4000,
      score: "4.4 / 5.0",
      status: "Active",
      annualLeaveBalance: 15,
      sickLeaveBalance: 8,
      casualLeaveBalance: 3,
      avatarInitials: "FA",
      createdAt: "2026-03-01T08:00:00.000Z",
    },
  ],

  departments: [
    {
      id: "DEP-ENG",
      name: "Engineering & Technology",
      code: "ENG",
      headId: "USR-002",
      headName: "Tunde Bakare",
      headTitle: "VP of Engineering",
      headcount: 4,
      monthlyBudget: "$42,000",
      budgetUtilization: "76%",
      primaryLocation: "Port Harcourt & Remote",
      leadObjective: "Scale monolithic infrastructure and release v3.0 mobile portals.",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "DEP-HR",
      name: "Human Resources & Talent",
      code: "HR",
      headId: "USR-003",
      headName: "Victoria Sterling",
      headTitle: "VP of People Operations",
      headcount: 2,
      monthlyBudget: "$18,500",
      budgetUtilization: "64%",
      primaryLocation: "Lagos Headquarters",
      leadObjective: "Expand medical HMO network and complete Q3 leadership assessments.",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "DEP-FIN",
      name: "Finance & Corporate Operations",
      code: "FIN",
      headId: "USR-004",
      headName: "Marcus Brody",
      headTitle: "Head of Finance",
      headcount: 2,
      monthlyBudget: "$24,000",
      budgetUtilization: "82%",
      primaryLocation: "Lagos Headquarters",
      leadObjective: "Automate statutory PAYE/Pension remittances and expense audits.",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "DEP-PRD",
      name: "Product & Design",
      code: "PRD",
      headId: "USR-005",
      headName: "Sarah Chen",
      headTitle: "Product Engineering Lead",
      headcount: 2,
      monthlyBudget: "$16,000",
      budgetUtilization: "58%",
      primaryLocation: "Port Harcourt Office",
      leadObjective: "Deliver Nordic Minimalist component library and mobile design system.",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
  ],

  assets: [
    {
      id: "AST-101",
      name: "MacBook Pro 16\" M3 Max (36GB RAM / 1TB SSD)",
      category: "Workstation",
      serial: "MBP-2026-99238",
      assignedToId: "USR-008",
      assignedToName: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      deployedDate: "2026-08-01",
      condition: "Excellent",
      status: "Deployed",
      value: "$3,499.00",
      createdAt: "2026-08-01T08:00:00.000Z",
    },
    {
      id: "AST-102",
      name: "Dell UltraSharp 32\" 4K USB-C Hub Monitor",
      category: "Display & Peripheral",
      serial: "DEL-2026-88237",
      assignedToId: "USR-005",
      assignedToName: "Sarah Chen",
      department: "Engineering",
      deployedDate: "2025-06-10",
      condition: "Excellent",
      status: "Deployed",
      value: "$899.00",
      createdAt: "2025-06-10T08:00:00.000Z",
    },
    {
      id: "AST-103",
      name: "Lenovo ThinkPad X1 Carbon Gen 11 (32GB RAM)",
      category: "Workstation",
      serial: "TP-2025-77192",
      assignedToId: "USR-007",
      assignedToName: "Alex Rivera",
      department: "Human Resources",
      deployedDate: "2025-08-05",
      condition: "Good",
      status: "Deployed",
      value: "$2,100.00",
      createdAt: "2025-08-05T08:00:00.000Z",
    },
    {
      id: "AST-104",
      name: "YubiKey 5C NFC Enterprise 2FA Security Key",
      category: "Security Token",
      serial: "YK-2025-66291",
      assignedToId: "USR-006",
      assignedToName: "David Okonjo",
      department: "Engineering",
      deployedDate: "2025-07-20",
      condition: "New",
      status: "Deployed",
      value: "$75.00",
      createdAt: "2025-07-20T08:00:00.000Z",
    },
    {
      id: "AST-105",
      name: "Apple MacBook Air 15\" M3 (16GB RAM)",
      category: "Workstation",
      serial: "MBA-2026-10293",
      assignedToId: "USR-010",
      assignedToName: "Fatima Aliyu",
      department: "Finance & Operations",
      deployedDate: "2026-03-05",
      condition: "Excellent",
      status: "Deployed",
      value: "$1,499.00",
      createdAt: "2026-03-05T08:00:00.000Z",
    },
  ],

  sprints: [
    {
      id: "SPR-42",
      title: "Sprint 42 • Mobile Ergonomics & Cloud Sync",
      department: "Engineering",
      leadId: "USR-005",
      leadName: "Sarah Chen",
      status: "Active",
      progress: "84%",
      velocity: "48 Story Points",
      startDate: "Aug 15, 2026",
      endDate: "Aug 29, 2026",
      goals: ["Implement 5-tier RBAC", "Realtime Supabase syncing", "Touch-friendly bottom sheets"],
      createdAt: "2026-08-15T08:00:00.000Z",
    },
    {
      id: "SPR-43",
      title: "Sprint 43 • Micro-Services & Automated Payroll",
      department: "Engineering",
      leadId: "USR-002",
      leadName: "Tunde Bakare",
      status: "Upcoming",
      progress: "0%",
      velocity: "52 Story Points",
      startDate: "Sept 01, 2026",
      endDate: "Sept 15, 2026",
      goals: ["Direct deposit bank integrations", "Multi-tenant workspace isolation"],
      createdAt: "2026-08-25T08:00:00.000Z",
    },
  ],

  attendance: [
    {
      id: "ATT-101",
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      date: "2026-08-31",
      in: "08:45 AM",
      out: "05:00 PM",
      hours: "8h 15m",
      location: "Port Harcourt Office",
      status: "On Time",
      createdAt: "2026-08-31T08:45:00.000Z",
    },
    {
      id: "ATT-102",
      userId: "USR-005",
      name: "Sarah Chen",
      department: "Engineering",
      date: "2026-08-31",
      in: "08:30 AM",
      out: "05:30 PM",
      hours: "9h 00m",
      location: "Port Harcourt Office",
      status: "On Time",
      createdAt: "2026-08-31T08:30:00.000Z",
    },
    {
      id: "ATT-103",
      userId: "USR-009",
      name: "Chidi Nnamdi",
      department: "Product & Design",
      date: "2026-08-31",
      in: "09:05 AM",
      out: "05:00 PM",
      hours: "7h 55m",
      location: "Port Harcourt Office",
      status: "Present",
      createdAt: "2026-08-31T09:05:00.000Z",
    },
  ],

  leaves: [
    {
      id: "LV-201",
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005", // Direct Manager: Sarah Chen
      type: "Annual Leave",
      dates: "2026-09-08 - 2026-09-12",
      days: 5,
      reason: "Family vacation and restorative time-off",
      status: "Pending Manager", // Chain of command status
      appliedOn: "2026-08-30",
      createdAt: "2026-08-30T10:00:00.000Z",
    },
    {
      id: "LV-202",
      userId: "USR-009",
      name: "Chidi Nnamdi",
      department: "Product & Design",
      managerId: "USR-005",
      type: "Sick Leave",
      dates: "2026-08-20 - 2026-08-21",
      days: 2,
      reason: "Medical consultation & fever recovery",
      status: "Approved",
      appliedOn: "2026-08-19",
      approverId: "USR-005",
      approverName: "Sarah Chen",
      approvedAt: "2026-08-19T14:20:00.000Z",
      createdAt: "2026-08-19T09:00:00.000Z",
    },
  ],

  claims: [
    {
      id: "CLM-301",
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      managerId: "USR-005",
      category: "Internet & Remote Work Allowance",
      amount: "$150.00",
      date: "2026-08-28",
      description: "Monthly fiber internet subscription for home dev station",
      status: "Pending Lead", // Level 1 review
      receipt: "fiber_bill_august.pdf",
      createdAt: "2026-08-28T11:00:00.000Z",
    },
    {
      id: "CLM-302",
      userId: "USR-009",
      name: "Chidi Nnamdi",
      department: "Product & Design",
      managerId: "USR-005",
      category: "Design Software Asset",
      amount: "$85.00",
      date: "2026-08-25",
      description: "Font licensing bundle for product icon redesign",
      status: "Approved",
      receipt: "font_license_receipt.pdf",
      leadApproverId: "USR-005",
      leadApproverName: "Sarah Chen",
      leadApprovedAt: "2026-08-25T14:00:00.000Z",
      financeApproverId: "USR-004",
      financeApproverName: "Marcus Brody",
      financeApprovedAt: "2026-08-26T10:00:00.000Z",
      payoutBatchId: "BATCH-20260826-01",
      createdAt: "2026-08-25T09:30:00.000Z",
    },
  ],

  tickets: [
    {
      id: "TCK-401",
      userId: "USR-008",
      name: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      subject: "Request for Secondary 4K Monitor Adapter",
      category: "IT Hardware",
      date: "2026-08-30",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "Dennis V. (IT Support)",
      details: "Need Thunderbolt to DisplayPort converter for workstation setup.",
      createdAt: "2026-08-30T13:00:00.000Z",
    },
  ],

  announcements: [
    {
      id: "ANN-501",
      title: "Q3 Strategic Townhall & Multi-Tiered Organization Expansion",
      date: "Aug 31, 2026",
      type: "Important",
      author: "Dr. Alexander Vance (CEO)",
      content: "All hands mandatory virtual townhall to review H1 milestones, new department leadership tiers, and international health coverage expansion.",
      createdAt: "2026-08-31T08:00:00.000Z",
    },
    {
      id: "ANN-502",
      title: "Expanded HMO Hospital Network Coverage in Port Harcourt & Lagos",
      date: "Aug 20, 2026",
      type: "General",
      author: "Victoria Sterling (VP HR)",
      content: "Axa Mansard has certified new tier-1 specialist clinics and trauma facilities across Port Harcourt and Lagos.",
      createdAt: "2026-08-20T08:00:00.000Z",
    },
  ],

  payrollBatches: [],
};

// Safe LocalStorage Retrieval & Persistence
function getLocal(key, defaultData) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key}:`, err);
    return defaultData;
  }
}

function saveLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
  }
}

// Utility: parse salary string or numeric monthly base pay
function parseSalaryNumeric(salaryStr, fallback = 3500) {
  if (typeof salaryStr === "number" && !isNaN(salaryStr)) return salaryStr;
  if (!salaryStr || typeof salaryStr !== "string") return fallback;
  const cleaned = salaryStr.replace(/[^0-9.]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? fallback : val;
}

export const db = {
  // =========================================================================
  // REALTIME SUPABASE WEBSOCKET SUBSCRIPTION
  // =========================================================================
  subscribeToChanges(onUpdateCallback) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    try {
      const channel = supabase
        .channel("monolith-enterprise-sync")
        .on("postgres_changes", { event: "*", schema: "public" }, () => {
          if (onUpdateCallback) onUpdateCallback();
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            // Channel active
          }
        });

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch {
          // ignore cleanup errors
        }
      };
    } catch (err) {
      console.warn("Supabase realtime subscription failed, falling back to local state:", err);
      return () => {};
    }
  },

  // =========================================================================
  // RESET / RE-SEED DATABASE HELPER
  // =========================================================================
  resetDatabase() {
    saveLocal(STORAGE_KEYS.USERS, SEED_DATA.users);
    saveLocal(STORAGE_KEYS.DEPARTMENTS, SEED_DATA.departments);
    saveLocal(STORAGE_KEYS.ASSETS, SEED_DATA.assets);
    saveLocal(STORAGE_KEYS.SPRINTS, SEED_DATA.sprints);
    saveLocal(STORAGE_KEYS.ATTENDANCE, SEED_DATA.attendance);
    saveLocal(STORAGE_KEYS.LEAVES, SEED_DATA.leaves);
    saveLocal(STORAGE_KEYS.CLAIMS, SEED_DATA.claims);
    saveLocal(STORAGE_KEYS.TICKETS, SEED_DATA.tickets);
    saveLocal(STORAGE_KEYS.ANNOUNCEMENTS, SEED_DATA.announcements);
    saveLocal(STORAGE_KEYS.PAYROLL, SEED_DATA.payrollBatches);
  },

  // =========================================================================
  // 1. USERS & 5-TIER ORGANIZATIONAL HIERARCHY
  // =========================================================================
  getUsers() {
    return getLocal(STORAGE_KEYS.USERS, SEED_DATA.users);
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  },

  getUserByEmail(email) {
    if (!email) return null;
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  // Returns all direct reports for a specific manager ID
  getDirectReports(managerId) {
    if (!managerId) return [];
    const users = this.getUsers();
    return users.filter((u) => u.managerId === managerId);
  },

  // Returns complete organizational tree starting from CEO (Tier 5)
  getOrgTree(maxDepth = 150) {
    const users = this.getUsers();
    if (!users || users.length === 0) return null;

    // Find CEO (Tier 5) or root node without managerId
    const rootUser = users.find((u) => u.tier === 5) || users.find((u) => !u.managerId) || users[0];
    if (!rootUser) return null;

    const visited = new Set();

    const buildNode = (user, depth = 0) => {
      if (!user || visited.has(user.id) || depth >= maxDepth) {
        return null;
      }
      visited.add(user.id);

      const reports = users.filter((u) => u.managerId === user.id && !visited.has(u.id));
      const childNodes = reports
        .map((child) => buildNode(child, depth + 1))
        .filter(Boolean);

      return {
        ...user,
        directReportsCount: childNodes.length,
        directReports: childNodes,
      };
    };

    return buildNode(rootUser, 0);
  },

  async createUser(userData) {
    const users = this.getUsers();
    const monthlyBase = userData.monthlyBasePay || parseSalaryNumeric(userData.salary, 3500);
    const calculatedTier = userData.tier || (
      userData.role === "executive" ? 5 :
      userData.role === "director" ? 4 :
      userData.role === "manager" ? 3 :
      userData.role === "senior_contributor" ? 2 : 1
    );

    const initials = (userData.name || "Staff Member")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EM";

    const newUser = {
      id: userData.id || `USR-${Math.floor(100 + Math.random() * 900)}`,
      email: userData.email.trim().toLowerCase(),
      password: userData.password || "password123",
      name: userData.name.trim(),
      title: userData.title?.trim() || "Staff Member",
      department: userData.department || "Engineering",
      role: userData.role || "employee",
      tier: calculatedTier,
      managerId: userData.managerId || null,
      managerName: userData.managerName || null,
      phone: userData.phone?.trim() || "+234 800 000 0000",
      location: userData.location?.trim() || "Port Harcourt, Nigeria",
      bankName: userData.bankName || "First Bank of Nigeria",
      accountNumber: userData.accountNumber || "0000000000",
      taxId: userData.taxId || `TIN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      pensionPin: userData.pensionPin || `PEN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      salary: userData.salary || `$${monthlyBase.toLocaleString()}/mo`,
      monthlyBasePay: monthlyBase,
      score: userData.score || "4.5 / 5.0",
      status: userData.status || "Active",
      annualLeaveBalance: userData.annualLeaveBalance !== undefined ? userData.annualLeaveBalance : 20,
      sickLeaveBalance: userData.sickLeaveBalance !== undefined ? userData.sickLeaveBalance : 10,
      casualLeaveBalance: userData.casualLeaveBalance !== undefined ? userData.casualLeaveBalance : 5,
      avatarInitials: initials,
      createdAt: userData.createdAt || new Date().toISOString(),
    };

    // If managerId is supplied without managerName, resolve it
    if (newUser.managerId && !newUser.managerName) {
      const manager = users.find((u) => u.id === newUser.managerId);
      if (manager) newUser.managerName = `${manager.name} (${manager.title})`;
    }

    users.unshift(newUser);
    saveLocal(STORAGE_KEYS.USERS, users);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("users").insert([
          {
            id: newUser.id,
            email: newUser.email,
            password: newUser.password,
            name: newUser.name,
            title: newUser.title,
            department: newUser.department,
            role: newUser.role,
            tier: newUser.tier,
            manager_id: newUser.managerId,
            manager_name: newUser.managerName,
            phone: newUser.phone,
            location: newUser.location,
            bank_name: newUser.bankName,
            account_number: newUser.accountNumber,
            tax_id: newUser.taxId,
            pension_pin: newUser.pensionPin,
            salary: newUser.salary,
            monthly_base_pay: newUser.monthlyBasePay,
            score: newUser.score,
            status: newUser.status,
            annual_leave_balance: newUser.annualLeaveBalance,
            sick_leave_balance: newUser.sickLeaveBalance,
            casual_leave_balance: newUser.casualLeaveBalance,
            avatar_initials: newUser.avatarInitials,
          },
        ]);
      } catch (err) {
        console.warn("Supabase user sync error:", err);
      }
    }

    return newUser;
  },

  async updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveLocal(STORAGE_KEYS.USERS, users);

      if (isSupabaseConfigured && supabase) {
        try {
          const supabaseUpdates = {};
          if (updates.name !== undefined) supabaseUpdates.name = updates.name;
          if (updates.title !== undefined) supabaseUpdates.title = updates.title;
          if (updates.phone !== undefined) supabaseUpdates.phone = updates.phone;
          if (updates.location !== undefined) supabaseUpdates.location = updates.location;
          if (updates.department !== undefined) supabaseUpdates.department = updates.department;
          if (updates.role !== undefined) supabaseUpdates.role = updates.role;
          if (updates.tier !== undefined) supabaseUpdates.tier = updates.tier;
          if (updates.managerId !== undefined) supabaseUpdates.manager_id = updates.managerId;
          if (updates.managerName !== undefined) supabaseUpdates.manager_name = updates.managerName;
          if (updates.bankName !== undefined) supabaseUpdates.bank_name = updates.bankName;
          if (updates.accountNumber !== undefined) supabaseUpdates.account_number = updates.accountNumber;
          if (updates.taxId !== undefined) supabaseUpdates.tax_id = updates.taxId;
          if (updates.pensionPin !== undefined) supabaseUpdates.pension_pin = updates.pensionPin;
          if (updates.salary !== undefined) supabaseUpdates.salary = updates.salary;
          if (updates.monthlyBasePay !== undefined) supabaseUpdates.monthly_base_pay = updates.monthlyBasePay;
          if (updates.score !== undefined) supabaseUpdates.score = updates.score;
          if (updates.status !== undefined) supabaseUpdates.status = updates.status;
          if (updates.annualLeaveBalance !== undefined) supabaseUpdates.annual_leave_balance = updates.annualLeaveBalance;
          if (updates.sickLeaveBalance !== undefined) supabaseUpdates.sick_leave_balance = updates.sickLeaveBalance;
          if (updates.casualLeaveBalance !== undefined) supabaseUpdates.casual_leave_balance = updates.casualLeaveBalance;

          if (Object.keys(supabaseUpdates).length > 0) {
            await supabase.from("users").update(supabaseUpdates).eq("id", id);
          }
        } catch (err) {
          console.warn("Supabase user update error:", err);
        }
      }
      return users[index];
    }
    return null;
  },

  // =========================================================================
  // 2. DEPARTMENTS & BUDGET UTILIZATION
  // =========================================================================
  getDepartments() {
    return getLocal(STORAGE_KEYS.DEPARTMENTS, SEED_DATA.departments);
  },

  getDepartment(deptIdOrCode) {
    if (!deptIdOrCode || typeof deptIdOrCode !== "string") return null;
    const query = deptIdOrCode.trim().toLowerCase();
    const depts = this.getDepartments();
    return (
      depts.find(
        (d) =>
          d.id.toLowerCase() === query ||
          d.code.toLowerCase() === query ||
          d.name.toLowerCase() === query
      ) || null
    );
  },

  getDepartmentByName(deptName) {
    return this.getDepartment(deptName);
  },

  getDepartmentBudget(deptId) {
    const dept = this.getDepartment(deptId);
    if (!dept) return null;

    const dName = (dept.name || "").trim().toLowerCase();
    const dCode = (dept.code || "").trim().toLowerCase();
    const dId = (dept.id || "").trim().toLowerCase();

    const isUserInDept = (u) => {
      if (!u || !u.department) return false;
      const ud = u.department.trim().toLowerCase();
      if (ud === dName || ud === dCode || ud === dId) return true;
      if (dName.startsWith(ud) || ud.startsWith(dName)) return true;
      const udFirst = ud.split(/[\s&/]+/)[0];
      const dFirst = dName.split(/[\s&/]+/)[0];
      if (udFirst && dFirst && udFirst === dFirst && udFirst.length > 2) return true;
      return false;
    };

    const users = this.getUsers().filter(isUserInDept);

    const allocated = parseSalaryNumeric(dept.monthlyBudget, 25000);
    const spent = users.reduce((acc, u) => acc + (u.monthlyBasePay || parseSalaryNumeric(u.salary, 3500)), 0);
    const remaining = Math.max(0, allocated - spent);
    const utilizationPct = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;

    return {
      id: dept.id,
      departmentName: dept.name,
      code: dept.code,
      headName: dept.headName,
      headTitle: dept.headTitle,
      headcount: users.length || dept.headcount,
      monthlyBudget: dept.monthlyBudget,
      allocatedAmount: allocated,
      spentAmount: spent,
      remainingAmount: remaining,
      budgetUtilization: `${utilizationPct}%`,
      leadObjective: dept.leadObjective,
    };
  },

  async addDepartment(deptData) {
    const depts = this.getDepartments();
    const newDept = {
      id: deptData.id || `DEP-${deptData.code.toUpperCase()}`,
      headcount: deptData.headcount || 1,
      monthlyBudget: deptData.monthlyBudget || "$25,000",
      budgetUtilization: deptData.budgetUtilization || "0%",
      primaryLocation: deptData.primaryLocation || "Lagos Headquarters",
      createdAt: new Date().toISOString(),
      ...deptData,
    };
    depts.push(newDept);
    saveLocal(STORAGE_KEYS.DEPARTMENTS, depts);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("departments").insert([
          {
            id: newDept.id,
            name: newDept.name,
            code: newDept.code,
            head_id: newDept.headId,
            head_name: newDept.headName,
            head_title: newDept.headTitle,
            headcount: newDept.headcount,
            monthly_budget: newDept.monthlyBudget,
            budget_utilization: newDept.budgetUtilization,
            primary_location: newDept.primaryLocation,
            lead_objective: newDept.leadObjective,
          },
        ]);
      } catch (err) {
        console.warn("Supabase department sync error:", err);
      }
    }

    return newDept;
  },

  async updateDepartment(id, updates) {
    const depts = this.getDepartments();
    const index = depts.findIndex((d) => d.id === id);
    if (index !== -1) {
      depts[index] = { ...depts[index], ...updates };
      saveLocal(STORAGE_KEYS.DEPARTMENTS, depts);
      return depts[index];
    }
    return null;
  },

  // =========================================================================
  // 3. IT ASSETS REGISTRY
  // =========================================================================
  getAssets(userId = null) {
    const assets = getLocal(STORAGE_KEYS.ASSETS, SEED_DATA.assets);
    if (userId) return assets.filter((a) => a.assignedToId === userId);
    return assets;
  },

  getAssetById(id) {
    const assets = this.getAssets();
    return assets.find((a) => a.id === id) || null;
  },

  async addAsset(assetData) {
    const assets = this.getAssets();
    const newAsset = {
      id: assetData.id || `AST-${Math.floor(100 + Math.random() * 900)}`,
      deployedDate: assetData.deployedDate || new Date().toISOString().split("T")[0],
      condition: assetData.condition || "Excellent",
      status: assetData.status || "Deployed",
      value: assetData.value || "$1,000.00",
      createdAt: new Date().toISOString(),
      ...assetData,
    };
    assets.unshift(newAsset);
    saveLocal(STORAGE_KEYS.ASSETS, assets);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("assets").insert([
          {
            id: newAsset.id,
            name: newAsset.name,
            category: newAsset.category,
            serial: newAsset.serial,
            assigned_to_id: newAsset.assignedToId,
            assigned_to_name: newAsset.assignedToName,
            department: newAsset.department,
            deployed_date: newAsset.deployedDate,
            condition: newAsset.condition,
            status: newAsset.status,
            value: newAsset.value,
          },
        ]);
      } catch (err) {
        console.warn("Supabase asset sync error:", err);
      }
    }

    return newAsset;
  },

  async updateAsset(id, updates) {
    const assets = this.getAssets();
    const index = assets.findIndex((a) => a.id === id);
    if (index !== -1) {
      assets[index] = { ...assets[index], ...updates };
      saveLocal(STORAGE_KEYS.ASSETS, assets);
      return assets[index];
    }
    return null;
  },

  // =========================================================================
  // 4. ENGINEERING SPRINTS
  // =========================================================================
  getSprints(department = null) {
    const sprints = getLocal(STORAGE_KEYS.SPRINTS, SEED_DATA.sprints);
    if (department) return sprints.filter((s) => s.department === department);
    return sprints;
  },

  getSprintById(id) {
    const sprints = this.getSprints();
    return sprints.find((s) => s.id === id) || null;
  },

  async addSprint(sprintData) {
    const sprints = this.getSprints();
    const newSprint = {
      id: sprintData.id || `SPR-${Math.floor(10 + Math.random() * 90)}`,
      status: sprintData.status || "Active",
      progress: sprintData.progress || "0%",
      velocity: sprintData.velocity || "40 Story Points",
      goals: sprintData.goals || [],
      createdAt: new Date().toISOString(),
      ...sprintData,
    };
    sprints.unshift(newSprint);
    saveLocal(STORAGE_KEYS.SPRINTS, sprints);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("sprints").insert([
          {
            id: newSprint.id,
            title: newSprint.title,
            department: newSprint.department,
            lead_id: newSprint.leadId,
            lead_name: newSprint.leadName,
            status: newSprint.status,
            progress: newSprint.progress,
            velocity: newSprint.velocity,
            start_date: newSprint.startDate,
            end_date: newSprint.endDate,
            goals: newSprint.goals,
          },
        ]);
      } catch (err) {
        console.warn("Supabase sprint sync error:", err);
      }
    }

    return newSprint;
  },

  async updateSprint(id, updates) {
    const sprints = this.getSprints();
    const index = sprints.findIndex((s) => s.id === id);
    if (index !== -1) {
      sprints[index] = { ...sprints[index], ...updates };
      saveLocal(STORAGE_KEYS.SPRINTS, sprints);
      return sprints[index];
    }
    return null;
  },

  // =========================================================================
  // 5. ATTENDANCE LOGS & TEAM MONITORING
  // =========================================================================
  getAttendance(userId = null) {
    const records = getLocal(STORAGE_KEYS.ATTENDANCE, SEED_DATA.attendance);
    if (userId) return records.filter((r) => r.userId === userId);
    return records;
  },

  // Returns attendance records of direct reports for a given manager
  getTeamAttendance(managerId) {
    const directReports = this.getDirectReports(managerId);
    const reportIds = new Set(directReports.map((r) => r.id));
    const records = this.getAttendance();
    return records.filter((r) => reportIds.has(r.userId));
  },

  async addAttendance(record) {
    const records = this.getAttendance();
    const newRecord = {
      id: record.id || `ATT-${Date.now()}`,
      hours: record.hours || "In Progress",
      status: record.status || "On Time",
      location: record.location || "Port Harcourt Office",
      createdAt: new Date().toISOString(),
      ...record,
    };
    records.unshift(newRecord);
    saveLocal(STORAGE_KEYS.ATTENDANCE, records);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("attendance").insert([
          {
            id: newRecord.id,
            user_id: newRecord.userId,
            name: newRecord.name,
            department: newRecord.department,
            date: newRecord.date,
            in_time: newRecord.in,
            out_time: newRecord.out,
            hours: newRecord.hours,
            location: newRecord.location,
            status: newRecord.status,
          },
        ]);
      } catch (err) {
        console.warn("Supabase attendance sync error:", err);
      }
    }
    return newRecord;
  },

  async updateAttendance(id, updates) {
    const records = this.getAttendance();
    const index = records.findIndex((r) => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      saveLocal(STORAGE_KEYS.ATTENDANCE, records);

      if (isSupabaseConfigured && supabase) {
        try {
          const supabaseUpdates = {};
          if (updates.out !== undefined) supabaseUpdates.out_time = updates.out;
          if (updates.hours !== undefined) supabaseUpdates.hours = updates.hours;
          if (updates.status !== undefined) supabaseUpdates.status = updates.status;

          if (Object.keys(supabaseUpdates).length > 0) {
            await supabase.from("attendance").update(supabaseUpdates).eq("id", id);
          }
        } catch (err) {
          console.warn("Supabase attendance update error:", err);
        }
      }

      return records[index];
    }
    return null;
  },

  // =========================================================================
  // 6. LEAVES & MULTI-STAGE APPROVAL WORKFLOW
  // =========================================================================
  getLeaves(userId = null) {
    const leaves = getLocal(STORAGE_KEYS.LEAVES, SEED_DATA.leaves);
    if (userId) return leaves.filter((l) => l.userId === userId);
    return leaves;
  },

  getLeaveById(id) {
    const leaves = this.getLeaves();
    return leaves.find((l) => l.id === id) || null;
  },

  getTeamLeaves(managerId) {
    const directReports = this.getDirectReports(managerId);
    const reportIds = new Set(directReports.map((r) => r.id));
    const leaves = this.getLeaves();
    return leaves.filter((l) => reportIds.has(l.userId) || l.managerId === managerId);
  },

  async createLeave(leaveData) {
    const leaves = this.getLeaves();
    const newLeave = {
      id: leaveData.id || `LV-${Math.floor(100 + Math.random() * 900)}`,
      status: "Pending Manager",
      appliedOn: leaveData.appliedOn || new Date().toISOString().split("T")[0],
      days: typeof leaveData.days === "number" ? leaveData.days : 1,
      createdAt: new Date().toISOString(),
      ...leaveData,
    };
    leaves.unshift(newLeave);
    saveLocal(STORAGE_KEYS.LEAVES, leaves);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("leaves").insert([
          {
            id: newLeave.id,
            user_id: newLeave.userId,
            name: newLeave.name,
            department: newLeave.department,
            manager_id: newLeave.managerId,
            type: newLeave.type,
            dates: newLeave.dates,
            days: newLeave.days,
            reason: newLeave.reason,
            status: newLeave.status,
            applied_on: newLeave.appliedOn,
          },
        ]);
      } catch (err) {
        console.warn("Supabase leave sync error:", err);
      }
    }

    return newLeave;
  },

  async updateLeave(id, updates) {
    const leaves = this.getLeaves();
    const index = leaves.findIndex((l) => l.id === id);
    if (index !== -1) {
      leaves[index] = { ...leaves[index], ...updates };
      saveLocal(STORAGE_KEYS.LEAVES, leaves);
      return leaves[index];
    }
    return null;
  },

  // Level-1 Leave Approval: Approves request and automatically deducts balance from user record
  async approveLeave(leaveId, approverId, approverName) {
    const leaves = this.getLeaves();
    const index = leaves.findIndex((l) => l.id === leaveId);
    if (index === -1) return null;

    const leave = leaves[index];
    // Idempotency guard: if already approved, do not re-deduct balance
    if (leave.status === "Approved") {
      return leave;
    }

    const nowIso = new Date().toISOString();

    leaves[index] = {
      ...leave,
      status: "Approved",
      approverId: approverId || null,
      approverName: approverName || null,
      approvedAt: nowIso,
    };
    saveLocal(STORAGE_KEYS.LEAVES, leaves);

    // Auto-deduct exact days from employee's leave balance in user record
    if (leave.userId) {
      const user = this.getUserById(leave.userId);
      if (user) {
        const deductionDays = typeof leave.days === "number" ? Math.max(0, leave.days) : 1;
        const currentAnnual = typeof user.annualLeaveBalance === "number" ? user.annualLeaveBalance : 20;
        const currentSick = typeof user.sickLeaveBalance === "number" ? user.sickLeaveBalance : 10;
        const currentCasual = typeof user.casualLeaveBalance === "number" ? user.casualLeaveBalance : 5;

        const updates = {};
        if (leave.type === "Sick Leave") {
          updates.sickLeaveBalance = Math.max(0, currentSick - deductionDays);
        } else if (leave.type === "Casual Leave") {
          updates.casualLeaveBalance = Math.max(0, currentCasual - deductionDays);
        } else {
          // Annual Leave or default
          updates.annualLeaveBalance = Math.max(0, currentAnnual - deductionDays);
        }
        await this.updateUser(user.id, updates);
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("leaves")
          .update({
            status: "Approved",
            approver_id: approverId,
            approver_name: approverName,
            approved_at: nowIso,
          })
          .eq("id", leaveId);
      } catch (err) {
        console.warn("Supabase leave approval error:", err);
      }
    }

    return leaves[index];
  },

  async rejectLeave(leaveId, approverId, approverName, reason = "") {
    const leaves = this.getLeaves();
    const index = leaves.findIndex((l) => l.id === leaveId);
    if (index === -1) return null;

    const leave = leaves[index];
    if (leave.status === "Rejected") {
      return leave;
    }

    const nowIso = new Date().toISOString();
    const finalReason = reason && reason.trim() ? reason.trim() : "Rejected by reviewer";

    leaves[index] = {
      ...leave,
      status: "Rejected",
      approverId: approverId || null,
      approverName: approverName || null,
      rejectionReason: finalReason,
      approvedAt: nowIso,
    };
    saveLocal(STORAGE_KEYS.LEAVES, leaves);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("leaves")
          .update({
            status: "Rejected",
            approver_id: approverId,
            approver_name: approverName,
            rejection_reason: finalReason,
            approved_at: nowIso,
          })
          .eq("id", leaveId);
      } catch (err) {
        console.warn("Supabase leave rejection error:", err);
      }
    }

    return leaves[index];
  },

  // Backwards compatibility helper
  async updateLeaveStatus(id, status, approverName = null) {
    if (status === "Approved") {
      return this.approveLeave(id, null, approverName);
    }
    if (status === "Rejected") {
      return this.rejectLeave(id, null, approverName, "Rejected by administrative reviewer");
    }
    return this.updateLeave(id, { status, approverName });
  },

  // =========================================================================
  // 7. EXPENSE CLAIMS & 2-STAGE APPROVAL WORKFLOW
  // =========================================================================
  getClaims(userId = null) {
    const claims = getLocal(STORAGE_KEYS.CLAIMS, SEED_DATA.claims);
    if (userId) return claims.filter((c) => c.userId === userId);
    return claims;
  },

  getClaimById(id) {
    const claims = this.getClaims();
    return claims.find((c) => c.id === id) || null;
  },

  getTeamClaims(managerId) {
    const directReports = this.getDirectReports(managerId);
    const reportIds = new Set(directReports.map((r) => r.id));
    const claims = this.getClaims();
    return claims.filter((c) => reportIds.has(c.userId) || c.managerId === managerId);
  },

  async createClaim(claimData) {
    const claims = this.getClaims();
    const newClaim = {
      id: claimData.id || `CLM-${Math.floor(100 + Math.random() * 900)}`,
      date: claimData.date || new Date().toISOString().split("T")[0],
      status: "Pending Lead", // Level 1 review default
      receipt: claimData.receipt || "receipt_invoice.pdf",
      createdAt: new Date().toISOString(),
      ...claimData,
    };
    claims.unshift(newClaim);
    saveLocal(STORAGE_KEYS.CLAIMS, claims);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("claims").insert([
          {
            id: newClaim.id,
            user_id: newClaim.userId,
            name: newClaim.name,
            department: newClaim.department,
            manager_id: newClaim.managerId,
            category: newClaim.category,
            amount: newClaim.amount,
            date: newClaim.date,
            description: newClaim.description,
            receipt: newClaim.receipt,
            status: newClaim.status,
          },
        ]);
      } catch (err) {
        console.warn("Supabase claim sync error:", err);
      }
    }

    return newClaim;
  },

  async updateClaim(id, updates) {
    const claims = this.getClaims();
    const index = claims.findIndex((c) => c.id === id);
    if (index !== -1) {
      claims[index] = { ...claims[index], ...updates };
      saveLocal(STORAGE_KEYS.CLAIMS, claims);
      return claims[index];
    }
    return null;
  },

  // Stage 1 Approval: Team Lead verifies work necessity -> Moves to "Pending Finance"
  async approveClaimLead(claimId, leadId, leadName) {
    const claims = this.getClaims();
    const index = claims.findIndex((c) => c.id === claimId);
    if (index === -1) return null;

    const claim = claims[index];
    // If already approved, do not demote back to Pending Finance
    if (claim.status === "Approved") {
      return claim;
    }
    // If already in Pending Finance, return idempotently
    if (claim.status === "Pending Finance") {
      return claim;
    }

    const nowIso = new Date().toISOString();
    claims[index] = {
      ...claim,
      status: "Pending Finance",
      leadApproverId: leadId || null,
      leadApproverName: leadName || null,
      leadApprovedAt: nowIso,
    };
    saveLocal(STORAGE_KEYS.CLAIMS, claims);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("claims")
          .update({
            status: "Pending Finance",
            lead_approver_id: leadId,
            lead_approver_name: leadName,
            lead_approved_at: nowIso,
          })
          .eq("id", claimId);
      } catch (err) {
        console.warn("Supabase lead claim approval error:", err);
      }
    }

    return claims[index];
  },

  // Stage 2 Approval: Finance Lead authorizes final release of funds -> Moves to "Approved"
  async approveClaimFinance(claimId, financeId, financeName, payoutBatchId = null) {
    const claims = this.getClaims();
    const index = claims.findIndex((c) => c.id === claimId);
    if (index === -1) return null;

    const claim = claims[index];
    // Idempotency: if already approved, preserve existing payout batch ID and return
    if (claim.status === "Approved") {
      return claim;
    }

    const nowIso = new Date().toISOString();
    const batchId = payoutBatchId || `BATCH-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(10 + Math.random() * 90)}`;

    claims[index] = {
      ...claim,
      status: "Approved",
      financeApproverId: financeId || null,
      financeApproverName: financeName || null,
      financeApprovedAt: nowIso,
      payoutBatchId: claim.payoutBatchId || batchId,
    };
    saveLocal(STORAGE_KEYS.CLAIMS, claims);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("claims")
          .update({
            status: "Approved",
            finance_approver_id: financeId,
            finance_approver_name: financeName,
            finance_approved_at: nowIso,
            payout_batch_id: claims[index].payoutBatchId,
          })
          .eq("id", claimId);
      } catch (err) {
        console.warn("Supabase finance claim approval error:", err);
      }
    }

    return claims[index];
  },

  // Reject Claim at any stage
  async rejectClaim(claimId, rejectorId, rejectorName, reason = "") {
    const claims = this.getClaims();
    const index = claims.findIndex((c) => c.id === claimId);
    if (index === -1) return null;

    const claim = claims[index];
    if (claim.status === "Rejected") {
      return claim;
    }

    const finalReason = reason && reason.trim() ? reason.trim() : "Claim rejected by reviewer";
    const nowIso = new Date().toISOString();
    claims[index] = {
      ...claim,
      status: "Rejected",
      rejectionReason: finalReason,
      rejectedById: rejectorId || null,
      rejectedByName: rejectorName || null,
      rejectedAt: nowIso,
    };
    saveLocal(STORAGE_KEYS.CLAIMS, claims);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("claims")
          .update({
            status: "Rejected",
          })
          .eq("id", claimId);
      } catch (err) {
        console.warn("Supabase claim rejection error:", err);
      }
    }

    return claims[index];
  },

  // Backwards compatibility helper
  async updateClaimStatus(id, status) {
    if (status === "Approved") {
      return this.approveClaimFinance(id, null, "Finance Admin");
    }
    if (status === "Pending Finance") {
      return this.approveClaimLead(id, null, "Team Lead");
    }
    if (status === "Rejected") {
      return this.rejectClaim(id, null, "Reviewer", "Claim rejected during review");
    }
    return this.updateClaim(id, { status });
  },

  // =========================================================================
  // 8. SUPPORT TICKETS (IT & HR SLA TRIAGE QUEUE)
  // =========================================================================
  getTickets(userId = null) {
    const tickets = getLocal(STORAGE_KEYS.TICKETS, SEED_DATA.tickets);
    if (userId) return tickets.filter((t) => t.userId === userId);
    return tickets;
  },

  getTicketById(id) {
    const tickets = this.getTickets();
    return tickets.find((t) => t.id === id) || null;
  },

  async createTicket(ticketData) {
    const tickets = this.getTickets();
    const newTicket = {
      id: ticketData.id || `TCK-${Math.floor(100 + Math.random() * 900)}`,
      date: ticketData.date || new Date().toISOString().split("T")[0],
      status: "Open",
      priority: ticketData.priority || "Medium",
      assignedTo: ticketData.assignedTo || "Dennis V. (IT Support)",
      createdAt: new Date().toISOString(),
      ...ticketData,
    };
    tickets.unshift(newTicket);
    saveLocal(STORAGE_KEYS.TICKETS, tickets);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("tickets").insert([
          {
            id: newTicket.id,
            user_id: newTicket.userId,
            name: newTicket.name,
            department: newTicket.department,
            subject: newTicket.subject,
            category: newTicket.category,
            priority: newTicket.priority,
            details: newTicket.details,
            assigned_to: newTicket.assignedTo,
            status: newTicket.status,
            date: newTicket.date,
          },
        ]);
      } catch (err) {
        console.warn("Supabase ticket sync error:", err);
      }
    }

    return newTicket;
  },

  async updateTicketStatus(id, status) {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      tickets[index].status = status;
      saveLocal(STORAGE_KEYS.TICKETS, tickets);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("tickets").update({ status }).eq("id", id);
        } catch (err) {
          console.warn("Supabase ticket update error:", err);
        }
      }

      return tickets[index];
    }
    return null;
  },

  async updateTicket(id, updates) {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      tickets[index] = { ...tickets[index], ...updates };
      saveLocal(STORAGE_KEYS.TICKETS, tickets);
      return tickets[index];
    }
    return null;
  },

  // =========================================================================
  // 9. ANNOUNCEMENTS (COMPANY BROADCAST BULLETINS)
  // =========================================================================
  getAnnouncements() {
    return getLocal(STORAGE_KEYS.ANNOUNCEMENTS, SEED_DATA.announcements);
  },

  getAnnouncementById(id) {
    if (!id) return null;
    const announcements = this.getAnnouncements();
    return announcements.find((a) => a.id === id) || null;
  },

  async createAnnouncement(annData) {
    const announcements = this.getAnnouncements();
    const newAnn = {
      id: annData.id || `ANN-${Math.floor(100 + Math.random() * 900)}`,
      date: annData.date || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      createdAt: new Date().toISOString(),
      ...annData,
      type: annData.type || "General",
    };
    announcements.unshift(newAnn);
    saveLocal(STORAGE_KEYS.ANNOUNCEMENTS, announcements);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("announcements").insert([
          {
            id: newAnn.id,
            title: newAnn.title,
            content: newAnn.content,
            type: newAnn.type,
            author: newAnn.author,
            date: newAnn.date,
          },
        ]);
      } catch (err) {
        console.warn("Supabase announcement sync error:", err);
      }
    }

    return newAnn;
  },

  // =========================================================================
  // 10. MONTHLY PAYROLL EXECUTION ENGINE
  // =========================================================================
  calculatePayrollItem(user) {
    if (!user) return null;
    const gross = user.monthlyBasePay || parseSalaryNumeric(user.salary, 3500);

    // Statutory Deductions:
    // 1. PAYE Tax (approx 11.43%)
    const paye = Math.round(gross * 0.1143 * 100) / 100;
    // 2. Pension Contribution (8%)
    const pension = Math.round(gross * 0.08 * 100) / 100;
    // 3. HMO Medical Withholding ($50 fixed standard plan)
    const hmo = 50.0;

    const totalDeductions = Math.round((paye + pension + hmo) * 100) / 100;
    const netPay = Math.round(Math.max(0, gross - totalDeductions) * 100) / 100;

    return {
      userId: user.id,
      userName: user.name,
      title: user.title,
      department: user.department,
      bankName: user.bankName || "First Bank of Nigeria",
      accountNumber: user.accountNumber || "0000000000",
      gross,
      paye,
      pension,
      hmo,
      totalDeductions,
      netPay,
      formattedGross: `$${gross.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      formattedPAYE: `$${paye.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      formattedPension: `$${pension.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      formattedHMO: `$${hmo.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      formattedDeductions: `$${totalDeductions.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      formattedNet: `$${netPay.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };
  },

  executeMonthlyPayroll(executorId, executorName, monthYear = null) {
    const users = this.getUsers().filter((u) => u.status === "Active");
    const label = monthYear || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const payslips = users.map((u) => this.calculatePayrollItem(u));

    const totalGross = payslips.reduce((acc, p) => acc + p.gross, 0);
    const totalPAYE = payslips.reduce((acc, p) => acc + p.paye, 0);
    const totalPension = payslips.reduce((acc, p) => acc + p.pension, 0);
    const totalHMO = payslips.reduce((acc, p) => acc + p.hmo, 0);
    const totalDeductions = payslips.reduce((acc, p) => acc + p.totalDeductions, 0);
    const totalNet = payslips.reduce((acc, p) => acc + p.netPay, 0);

    const batch = {
      id: `PAY-${Date.now()}`,
      monthYear: label,
      status: "Executed",
      executorId: executorId || "USR-004",
      executorName: executorName || "Marcus Brody (Head of Finance)",
      executedAt: new Date().toISOString(),
      headcount: users.length,
      totalGross: Math.round(totalGross * 100) / 100,
      totalPAYE: Math.round(totalPAYE * 100) / 100,
      totalPension: Math.round(totalPension * 100) / 100,
      totalHMO: Math.round(totalHMO * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      totalNet: Math.round(totalNet * 100) / 100,
      formattedTotalGross: `$${totalGross.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      formattedTotalNet: `$${totalNet.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      payslips,
    };

    const batches = getLocal(STORAGE_KEYS.PAYROLL, []);
    batches.unshift(batch);
    saveLocal(STORAGE_KEYS.PAYROLL, batches);

    return batch;
  },

  getPayrollBatches() {
    return getLocal(STORAGE_KEYS.PAYROLL, []);
  },
};
