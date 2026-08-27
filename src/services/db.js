/**
 * Persistent Hybrid Database Service (Supabase Cloud + Resilient Local Cache)
 * Enables real-time synchronization across multiple devices (phones, tablets, laptops).
 */
import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEYS = {
  USERS: "monolith_db_users",
  ATTENDANCE: "monolith_db_attendance",
  LEAVES: "monolith_db_leaves",
  CLAIMS: "monolith_db_claims",
  TICKETS: "monolith_db_tickets",
  ANNOUNCEMENTS: "monolith_db_announcements",
};

// Initial Seed Data fallback
const SEED_DATA = {
  users: [
    {
      id: "USR-001",
      email: "admin@company.com",
      password: "password123",
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
  ],
};

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

export const db = {
  // Realtime subscription hook
  subscribeToChanges(onUpdateCallback) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    const channel = supabase
      .channel("monolith-live-sync")
      .on("postgres_changes", { event: "*", schema: "public" }, () => {
        // Trigger parent state reload when any change occurs in Supabase
        if (onUpdateCallback) onUpdateCallback();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // USERS
  getUsers() {
    return getLocal(STORAGE_KEYS.USERS, SEED_DATA.users);
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  },

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createUser(userData) {
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
    saveLocal(STORAGE_KEYS.USERS, users);

    // Sync to Supabase Cloud
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
            location: newUser.location,
            salary: newUser.salary,
            annual_leave_balance: newUser.annualLeaveBalance,
            sick_leave_balance: newUser.sickLeaveBalance,
            casual_leave_balance: newUser.casualLeaveBalance,
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
          if (updates.name) supabaseUpdates.name = updates.name;
          if (updates.phone) supabaseUpdates.phone = updates.phone;
          if (updates.location) supabaseUpdates.location = updates.location;
          if (updates.annualLeaveBalance !== undefined) supabaseUpdates.annual_leave_balance = updates.annualLeaveBalance;
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

  // ATTENDANCE
  getAttendance(userId = null) {
    const records = getLocal(STORAGE_KEYS.ATTENDANCE, SEED_DATA.attendance);
    if (userId) return records.filter((r) => r.userId === userId);
    return records;
  },

  async addAttendance(record) {
    const records = this.getAttendance();
    const newRecord = {
      id: `ATT-${Date.now()}`,
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
          await supabase.from("attendance").update({
            out_time: updates.out,
            hours: updates.hours,
            status: updates.status,
          }).eq("id", id);
        } catch (err) {
          console.warn("Supabase attendance update error:", err);
        }
      }
      return records[index];
    }
    return null;
  },

  // LEAVES
  getLeaves(userId = null) {
    const leaves = getLocal(STORAGE_KEYS.LEAVES, SEED_DATA.leaves);
    if (userId) return leaves.filter((l) => l.userId === userId);
    return leaves;
  },

  async createLeave(leaveData) {
    const leaves = this.getLeaves();
    const newLeave = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
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

  async updateLeaveStatus(id, status) {
    const leaves = this.getLeaves();
    const index = leaves.findIndex((l) => l.id === id);
    if (index !== -1) {
      leaves[index].status = status;
      saveLocal(STORAGE_KEYS.LEAVES, leaves);

      if (status === "Approved" && leaves[index].userId) {
        const user = this.getUserById(leaves[index].userId);
        if (user && leaves[index].type === "Annual Leave") {
          const newBal = Math.max(0, (user.annualLeaveBalance || 20) - (leaves[index].days || 1));
          await this.updateUser(user.id, { annualLeaveBalance: newBal });
        }
      }

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("leaves").update({ status }).eq("id", id);
        } catch (err) {
          console.warn("Supabase leave status update error:", err);
        }
      }

      return leaves[index];
    }
    return null;
  },

  // CLAIMS
  getClaims(userId = null) {
    const claims = getLocal(STORAGE_KEYS.CLAIMS, SEED_DATA.claims);
    if (userId) return claims.filter((c) => c.userId === userId);
    return claims;
  },

  async createClaim(claimData) {
    const claims = this.getClaims();
    const newClaim = {
      id: `CLM-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      receipt: claimData.receipt || "receipt_invoice.pdf",
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

  async updateClaimStatus(id, status) {
    const claims = this.getClaims();
    const index = claims.findIndex((c) => c.id === id);
    if (index !== -1) {
      claims[index].status = status;
      saveLocal(STORAGE_KEYS.CLAIMS, claims);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("claims").update({ status }).eq("id", id);
        } catch (err) {
          console.warn("Supabase claim status update error:", err);
        }
      }
      return claims[index];
    }
    return null;
  },

  // TICKETS
  getTickets(userId = null) {
    const tickets = getLocal(STORAGE_KEYS.TICKETS, SEED_DATA.tickets);
    if (userId) return tickets.filter((t) => t.userId === userId);
    return tickets;
  },

  async createTicket(ticketData) {
    const tickets = this.getTickets();
    const newTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Open",
      assignedTo: "Unassigned Helpdesk",
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
          console.warn("Supabase ticket status update error:", err);
        }
      }
      return tickets[index];
    }
    return null;
  },

  // ANNOUNCEMENTS
  getAnnouncements() {
    return getLocal(STORAGE_KEYS.ANNOUNCEMENTS, SEED_DATA.announcements);
  },

  async createAnnouncement(annData) {
    const announcements = this.getAnnouncements();
    const newAnn = {
      id: `ANN-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      ...annData,
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
};
