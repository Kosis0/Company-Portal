/**
 * Persistent Database Service for Monolith Enterprise ERP
 * Manages collections with local storage persistence and automated cloud sync capability.
 */

const STORAGE_KEYS = {
  USERS: "monolith_db_users",
  ATTENDANCE: "monolith_db_attendance",
  LEAVES: "monolith_db_leaves",
  CLAIMS: "monolith_db_claims",
  TICKETS: "monolith_db_tickets",
  ANNOUNCEMENTS: "monolith_db_announcements",
};

// Initial Seed Data for first run
const SEED_DATA = {
  users: [
    {
      id: "USR-001",
      email: "admin@company.com",
      password: "password123", // In real server this is bcrypt hashed
      role: "admin",
      name: "Victoria Sterling",
      title: "VP of People Operations",
      department: "Human Resources",
      phone: "+234 802 111 2233",
      location: "Lagos, Nigeria",
      salary: "$8,500/mo",
      score: "4.9 / 5.0",
      status: "Active",
      annualLeaveBalance: 25,
      sickLeaveBalance: 12,
      casualLeaveBalance: 5,
      createdAt: "2026-01-15T08:00:00.000Z",
    },
    {
      id: "USR-002",
      email: "employee@company.com",
      password: "password123",
      role: "employee",
      name: "Udeh Kosisochukwu Emmanuel",
      title: "Software Developer Intern",
      department: "Engineering",
      phone: "+234 812 345 6789",
      location: "Port Harcourt, Nigeria",
      manager: "Sarah Chen (Tech Lead)",
      bankName: "First Bank of Nigeria",
      accountNumber: "3049283482",
      taxId: "TIN-98234711",
      pensionPin: "PEN-100293847",
      salary: "$3,500/mo",
      score: "4.5 / 5.0",
      status: "Active",
      annualLeaveBalance: 14,
      sickLeaveBalance: 8,
      casualLeaveBalance: 4,
      createdAt: "2026-08-01T09:00:00.000Z",
    },
    {
      id: "USR-003",
      email: "sarah.chen@company.com",
      password: "password123",
      role: "employee",
      name: "Sarah Chen",
      title: "Tech Lead & Principal Architect",
      department: "Engineering",
      phone: "+234 803 444 5566",
      location: "Port Harcourt, Nigeria",
      manager: "Victoria Sterling",
      bankName: "Guaranty Trust Bank",
      accountNumber: "0123984756",
      taxId: "TIN-44910283",
      pensionPin: "PEN-994820194",
      salary: "$6,200/mo",
      score: "4.8 / 5.0",
      status: "Active",
      annualLeaveBalance: 18,
      sickLeaveBalance: 10,
      casualLeaveBalance: 5,
      createdAt: "2026-03-10T10:00:00.000Z",
    },
    {
      id: "USR-004",
      email: "alex.rivera@company.com",
      password: "password123",
      role: "employee",
      name: "Alex Rivera",
      title: "People & Talent Associate",
      department: "Human Resources",
      phone: "+234 805 777 8899",
      location: "Lagos, Nigeria",
      manager: "Victoria Sterling",
      bankName: "Zenith Bank",
      accountNumber: "2084930192",
      taxId: "TIN-55019284",
      pensionPin: "PEN-883719204",
      salary: "$4,100/mo",
      score: "4.3 / 5.0",
      status: "Active",
      annualLeaveBalance: 16,
      sickLeaveBalance: 9,
      casualLeaveBalance: 3,
      createdAt: "2026-04-12T09:30:00.000Z",
    },
    {
      id: "USR-005",
      email: "david.o@company.com",
      password: "password123",
      role: "employee",
      name: "David Okonjo",
      title: "DevOps & Cloud Specialist",
      department: "Engineering",
      phone: "+234 818 222 3344",
      location: "Remote",
      manager: "Sarah Chen",
      bankName: "Access Bank",
      accountNumber: "1092837465",
      taxId: "TIN-77291034",
      pensionPin: "PEN-773820194",
      salary: "$5,500/mo",
      score: "4.4 / 5.0",
      status: "On Leave",
      annualLeaveBalance: 12,
      sickLeaveBalance: 8,
      casualLeaveBalance: 2,
      createdAt: "2026-05-20T11:00:00.000Z",
    },
  ],
  attendance: [
    {
      id: "ATT-101",
      userId: "USR-002",
      name: "Udeh Kosisochukwu Emmanuel",
      date: "2026-08-11",
      in: "08:45 AM",
      out: "05:00 PM",
      hours: "8h 15m",
      location: "Port Harcourt Office",
      status: "On Time",
    },
    {
      id: "ATT-102",
      userId: "USR-003",
      name: "Sarah Chen",
      date: "2026-08-11",
      in: "08:30 AM",
      out: "05:15 PM",
      hours: "8h 45m",
      location: "Port Harcourt Office",
      status: "On Time",
    },
    {
      id: "ATT-103",
      userId: "USR-004",
      name: "Alex Rivera",
      date: "2026-08-11",
      in: "09:15 AM",
      out: "05:00 PM",
      hours: "7h 45m",
      location: "Lagos Office",
      status: "Present",
    },
  ],
  leaves: [
    {
      id: "LV-201",
      userId: "USR-002",
      name: "Udeh Kosisochukwu Emmanuel",
      type: "Annual Leave",
      dates: "2026-08-18 - 2026-08-25",
      days: 6,
      reason: "Summer vacation and family rest",
      status: "Pending",
      appliedOn: "2026-08-10",
    },
    {
      id: "LV-202",
      userId: "USR-003",
      name: "Sarah Chen",
      type: "Sick Leave",
      dates: "2026-08-01 - 2026-08-02",
      days: 2,
      reason: "Flu recovery & clinical rest",
      status: "Approved",
      appliedOn: "2026-07-31",
    },
    {
      id: "LV-203",
      userId: "USR-004",
      name: "Alex Rivera",
      type: "Casual Leave",
      dates: "2026-07-15 - 2026-07-16",
      days: 1,
      reason: "Personal statutory appointment",
      status: "Approved",
      appliedOn: "2026-07-12",
    },
  ],
  claims: [
    {
      id: "CLM-301",
      userId: "USR-002",
      name: "Udeh Kosisochukwu Emmanuel",
      category: "Internet & Data Allowance",
      amount: "$150.00",
      date: "2026-08-01",
      description: "Monthly fiber internet subscription for remote developer workstation",
      status: "Pending",
      receipt: "fiber_receipt_aug.pdf",
    },
    {
      id: "CLM-302",
      userId: "USR-003",
      name: "Sarah Chen",
      category: "Client Transport",
      amount: "$85.00",
      date: "2026-08-04",
      description: "Partner sync meeting airport commute mileage",
      status: "Approved",
      receipt: "taxi_voucher_aug.pdf",
    },
  ],
  tickets: [
    {
      id: "TCK-401",
      userId: "USR-002",
      name: "Udeh Kosisochukwu Emmanuel",
      subject: "Request for Replacement Workstation Battery",
      category: "IT Hardware",
      date: "2026-08-05",
      priority: "High",
      status: "In Progress",
      assignedTo: "Dennis V. (IT Support)",
      details: "MacBook battery degradation causing rapid shutdown without charger plugged in.",
    },
    {
      id: "TCK-388",
      userId: "USR-003",
      name: "Sarah Chen",
      subject: "VPN Access Grant for New Staging Server",
      category: "Network & Security",
      date: "2026-08-02",
      priority: "Medium",
      status: "Resolved",
      assignedTo: "Infra Security Team",
      details: "Requesting developer IP whitelist for staging environment deployment.",
    },
  ],
  announcements: [
    {
      id: "ANN-501",
      title: "Company Q3 Strategic Townhall & Compensation Updates",
      date: "Aug 15, 2026",
      type: "Important",
      author: "Victoria Sterling (People Ops)",
      content: "Mandatory virtual townhall to review H1 revenue milestones, Q3 goals, and benefits expansions across all locations.",
    },
    {
      id: "ANN-502",
      title: "Expanded HMO Hospital Network Coverage in Port Harcourt & Lagos",
      date: "Aug 08, 2026",
      type: "General",
      author: "HR Benefits Admin",
      content: "Axa Mansard has expanded primary healthcare centers and specialist clinics across Lagos Island and Port Harcourt.",
    },
  ],
};

function getCollection(key, defaultData) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultData;
  }
}

function saveCollection(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const db = {
  // USERS
  getUsers() {
    return getCollection(STORAGE_KEYS.USERS, SEED_DATA.users);
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  },

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      annualLeaveBalance: 20,
      sickLeaveBalance: 10,
      casualLeaveBalance: 5,
      score: "4.0 / 5.0",
      status: "Active",
      ...userData,
    };
    users.unshift(newUser);
    saveCollection(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveCollection(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return null;
  },

  // ATTENDANCE
  getAttendance(userId = null) {
    const records = getCollection(STORAGE_KEYS.ATTENDANCE, SEED_DATA.attendance);
    if (userId) {
      return records.filter((r) => r.userId === userId);
    }
    return records;
  },

  addAttendance(record) {
    const records = this.getAttendance();
    const newRecord = {
      id: `ATT-${Date.now()}`,
      ...record,
    };
    records.unshift(newRecord);
    saveCollection(STORAGE_KEYS.ATTENDANCE, records);
    return newRecord;
  },

  updateAttendance(id, updates) {
    const records = this.getAttendance();
    const index = records.findIndex((r) => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      saveCollection(STORAGE_KEYS.ATTENDANCE, records);
      return records[index];
    }
    return null;
  },

  // LEAVE REQUESTS
  getLeaves(userId = null) {
    const leaves = getCollection(STORAGE_KEYS.LEAVES, SEED_DATA.leaves);
    if (userId) {
      return leaves.filter((l) => l.userId === userId);
    }
    return leaves;
  },

  createLeave(leaveData) {
    const leaves = this.getLeaves();
    const newLeave = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
      ...leaveData,
    };
    leaves.unshift(newLeave);
    saveCollection(STORAGE_KEYS.LEAVES, leaves);
    return newLeave;
  },

  updateLeaveStatus(id, status) {
    const leaves = this.getLeaves();
    const index = leaves.findIndex((l) => l.id === id);
    if (index !== -1) {
      leaves[index].status = status;
      saveCollection(STORAGE_KEYS.LEAVES, leaves);

      // If approved, deduct from employee's leave balance in users collection
      if (status === "Approved" && leaves[index].userId) {
        const user = this.getUserById(leaves[index].userId);
        if (user && leaves[index].type === "Annual Leave") {
          const newBal = Math.max(0, (user.annualLeaveBalance || 20) - (leaves[index].days || 1));
          this.updateUser(user.id, { annualLeaveBalance: newBal });
        }
      }
      return leaves[index];
    }
    return null;
  },

  // EXPENSE CLAIMS
  getClaims(userId = null) {
    const claims = getCollection(STORAGE_KEYS.CLAIMS, SEED_DATA.claims);
    if (userId) {
      return claims.filter((c) => c.userId === userId);
    }
    return claims;
  },

  createClaim(claimData) {
    const claims = this.getClaims();
    const newClaim = {
      id: `CLM-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      receipt: claimData.receipt || "receipt_invoice.pdf",
      ...claimData,
    };
    claims.unshift(newClaim);
    saveCollection(STORAGE_KEYS.CLAIMS, claims);
    return newClaim;
  },

  updateClaimStatus(id, status) {
    const claims = this.getClaims();
    const index = claims.findIndex((c) => c.id === id);
    if (index !== -1) {
      claims[index].status = status;
      saveCollection(STORAGE_KEYS.CLAIMS, claims);
      return claims[index];
    }
    return null;
  },

  // SUPPORT TICKETS
  getTickets(userId = null) {
    const tickets = getCollection(STORAGE_KEYS.TICKETS, SEED_DATA.tickets);
    if (userId) {
      return tickets.filter((t) => t.userId === userId);
    }
    return tickets;
  },

  createTicket(ticketData) {
    const tickets = this.getTickets();
    const newTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Open",
      assignedTo: "Unassigned Helpdesk",
      ...ticketData,
    };
    tickets.unshift(newTicket);
    saveCollection(STORAGE_KEYS.TICKETS, tickets);
    return newTicket;
  },

  updateTicketStatus(id, status) {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      tickets[index].status = status;
      saveCollection(STORAGE_KEYS.TICKETS, tickets);
      return tickets[index];
    }
    return null;
  },

  // ANNOUNCEMENTS
  getAnnouncements() {
    return getCollection(STORAGE_KEYS.ANNOUNCEMENTS, SEED_DATA.announcements);
  },

  createAnnouncement(annData) {
    const announcements = this.getAnnouncements();
    const newAnn = {
      id: `ANN-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      ...annData,
    };
    announcements.unshift(newAnn);
    saveCollection(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    return newAnn;
  },
};
