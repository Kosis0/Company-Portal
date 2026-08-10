import React, { useState } from "react";

export default function ESSDashboard({
  leaveRequests,
  onSubmitLeave,
  announcements,
  payments,
  claims,
  onSubmitClaim,
  attendanceRecords,
  attendanceStatus,
  onClockToggle,
  tickets,
  onAddTicket,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Employee Information State
  const [employee, setEmployee] = useState({
    name: "Udeh Kosisochukwu Emmanuel",
    id: "EMP-2026-042",
    title: "Software Developer Intern",
    department: "Engineering",
    email: "udeh.emmanuel@nexus.com",
    phone: "+234 812 345 6789",
    joinDate: "August 1, 2026",
    manager: "Sarah Chen (Tech Lead)",
    location: "Port Harcourt, Nigeria",
    bankName: "First Bank of Nigeria",
    accountNumber: "3049283482",
    taxId: "TIN-98234711",
    pensionPin: "PEN-100293847",
  });

  const [editProfileForm, setEditProfileForm] = useState(employee);

  const isClockedIn = attendanceStatus?.isClockedIn ?? false;
  const clockInTime = attendanceStatus?.clockInTime ?? null;
  const events = [
    {
      id: 1,
      title: "Engineering E-Sports & Board Game Night",
      date: "Aug 14, 2026",
      time: "06:00 PM",
      desc: "Join us for casual ranked matches (League of Legends) and Blitz Chess.",
    },
    {
      id: 2,
      title: "Monthly Office Book Club",
      date: "Aug 21, 2026",
      time: "05:00 PM",
      desc: "This month's focus: Contemporary Fantasy Novellas.",
    },
  ];

  const performanceKPIs = [
    {
      id: 1,
      label: "Task Completion Rate",
      value: "93%",
      detail: "45 of 48 assigned tasks completed",
    },
    {
      id: 2,
      label: "Attendance Score",
      value: "97%",
      detail: "Strong punctuality over the last 4 weeks",
    },
    {
      id: 3,
      label: "Review Rating",
      value: "4.5 / 5",
      detail: "Latest quarterly internal review",
    },
  ];

  const performanceGoals = [
    {
      id: 1,
      title: "Launch support ticket automation workflow",
      progress: 82,
      due: "Sep 15, 2026",
    },
    {
      id: 2,
      title: "Complete Q3 customer onboarding dashboards",
      progress: 64,
      due: "Sep 30, 2026",
    },
    {
      id: 3,
      title: "Mentor junior engineer on deployment best practices",
      progress: 48,
      due: "Oct 12, 2026",
    },
  ];

  // Benefits & HMO State
  const hmoDetails = {
    provider: "Axa Mansard Health",
    plan: "Corporate Premium Tier 2",
    enrolleeId: "AXM-2026-042",
    primaryHospital: "Evercare Hospital, Port Harcourt",
    status: "Active",
    bloodGroup: "O+",
    genotype: "AA",
    emergencyContact: {
      name: "Dr. Udeh",
      relation: "Sister (Medical Doctor)",
      phone: "+1 (555) 019-8372",
      location: "United States",
    },
  };

  const [leaveForm, setLeaveForm] = useState({
    type: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [claimForm, setClaimForm] = useState({
    category: "Internet & Data Allowance",
    amount: "",
    description: "",
  });

  const [ticketForm, setTicketForm] = useState({
    category: "IT Hardware",
    subject: "",
    details: "",
  });

  // Payroll State
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  // Utility Functions
  const calcDays = (start, end) => {
    if (!start || !end) return 1;
    const diff =
      Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const parseDurationToMinutes = (value) => {
    if (!value) return 0;
    const numbers = String(value).match(/\d+/g);
    if (!numbers || numbers.length < 2) return 0;
    const hours = Number(numbers[0]);
    const minutes = Number(numbers[1]);
    return hours * 60 + minutes;
  };

  const totalWeeklyMinutes = attendanceRecords.reduce(
    (sum, record) => sum + parseDurationToMinutes(record.total),
    0
  );

  const totalWeeklyOvertimeMinutes = attendanceRecords.reduce(
    (sum, record) => sum + parseDurationToMinutes(record.overtime),
    0
  );

  const lateArrivalsCount = attendanceRecords.filter(
    (record) => record.status === "Late"
  ).length;

  const weeklyHoursLabel = (totalWeeklyMinutes / 60).toFixed(1);
  const weeklyOvertimeLabel = (totalWeeklyOvertimeMinutes / 60).toFixed(2);

  const handleProfileSave = (e) => {
    e.preventDefault();
    const sanitizedProfile = Object.keys(editProfileForm).reduce((acc, key) => {
      const val = editProfileForm[key];
      acc[key] = typeof val === "string" && val.trim() === "" ? "nil" : val;
      return acc;
    }, {});
    setEmployee(sanitizedProfile);
    setIsEditingProfile(false);
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();

    onSubmitLeave?.({
      type: leaveForm.type,
      dates: `${leaveForm.startDate} - ${leaveForm.endDate}`,
      reason: leaveForm.reason,
    });

    setLeaveForm({
      type: "Annual Leave",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();

    onSubmitClaim?.({
      category: claimForm.category,
      amount: claimForm.amount.startsWith("$")
        ? claimForm.amount
        : `$${claimForm.amount}`,
      description: claimForm.description,
    });

    setClaimForm({
      category: "Internet & Data Allowance",
      amount: "",
      description: "",
    });
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();

    onAddTicket?.({
      category: ticketForm.category,
      subject: ticketForm.subject,
      details: ticketForm.details,
    });

    setTicketForm({ category: "IT Hardware", subject: "", details: "" });
  };

  return (
    <div style={styles.layout} className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.brand}>
          <div style={styles.brandLogo}>N</div>
          <div>
            <h2 style={styles.brandName}>Nexus ESS</h2>
            <p style={styles.brandSub}>Employee Portal</p>
          </div>
        </div>

        <nav style={styles.navStack}>
          <button
            onClick={() => setActiveTab("dashboard")}
            style={{
              ...styles.navLink,
              ...(activeTab === "dashboard" ? styles.navActive : {}),
            }}
          >
            🏠 Home / Dashboard
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              ...styles.navLink,
              ...(activeTab === "profile" ? styles.navActive : {}),
            }}
          >
            👤 My Profile
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            style={{
              ...styles.navLink,
              ...(activeTab === "performance" ? styles.navActive : {}),
            }}
          >
            🎯 My Performance
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            style={{
              ...styles.navLink,
              ...(activeTab === "attendance" ? styles.navActive : {}),
            }}
          >
            ⏱️ Time & Attendance
          </button>
          <button
            onClick={() => setActiveTab("leave")}
            style={{
              ...styles.navLink,
              ...(activeTab === "leave" ? styles.navActive : {}),
            }}
          >
            🌴 Leave & Absence
          </button>
          <button
            onClick={() => setActiveTab("benefits")}
            style={{
              ...styles.navLink,
              ...(activeTab === "benefits" ? styles.navActive : {}),
            }}
          >
            🏥 Health & Benefits
          </button>
          <button
            onClick={() => setActiveTab("payroll")}
            style={{
              ...styles.navLink,
              ...(activeTab === "payroll" ? styles.navActive : {}),
            }}
          >
            💳 Payroll & Payslips
          </button>
          <button
            onClick={() => setActiveTab("claims")}
            style={{
              ...styles.navLink,
              ...(activeTab === "claims" ? styles.navActive : {}),
            }}
          >
            🧾 Expenses
          </button>
          <button
            onClick={() => setActiveTab("helpdesk")}
            style={{
              ...styles.navLink,
              ...(activeTab === "helpdesk" ? styles.navActive : {}),
            }}
          >
            🎧 IT Helpdesk
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userBadge}>
            <div style={styles.avatar}>
              {employee.name !== "nil"
                ? employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "N/A"}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "13px" }}>
                {employee.name}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                {employee.id}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent} className="dashboard-main-content">
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>
                Welcome back, {employee.name.split(" ")[0]} 👋
              </h1>
              <p style={styles.pageSub}>
                Here is what's happening at Nexus today.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div style={styles.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "18px" }}>
                        Daily Attendance
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        August 5, 2026
                      </p>
                    </div>
                    <button
                      onClick={onClockToggle}
                      style={{
                        ...styles.primaryBtn,
                        background: isClockedIn
                          ? "linear-gradient(135deg, #ef4444, #dc2626)"
                          : "linear-gradient(135deg, #10b981, #059669)",
                        fontSize: "16px",
                        padding: "12px 24px",
                      }}
                    >
                      {isClockedIn ? "🕒 Clock Out" : "🕒 Clock In"}
                    </button>
                  </div>
                  {isClockedIn && (
                    <p
                      style={{
                        margin: "16px 0 0 0",
                        color: "#10b981",
                        fontWeight: "600",
                      }}
                    >
                      You clocked in today at {clockInTime || "08:52 AM"}
                    </p>
                  )}
                </div>

                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>
                    📢 Company Announcements & News
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        style={{
                          padding: "16px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={{ fontWeight: "700", color: "#1e293b" }}>
                            {ann.title}
                          </span>
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            {ann.date}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#475569",
                            lineHeight: "1.5",
                          }}
                        >
                          {ann.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>📅 Upcoming Events</h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        style={{
                          borderLeft: "4px solid #4f46e5",
                          paddingLeft: "12px",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "14px",
                            color: "#1e293b",
                          }}
                        >
                          {ev.title}
                        </h4>
                        <p
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "12px",
                            color: "#64748b",
                            fontWeight: "600",
                          }}
                        >
                          {ev.date} | {ev.time}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#475569",
                          }}
                        >
                          {ev.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    ...styles.card,
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    boxShadow: "none",
                  }}
                >
                  <h3 style={styles.cardTitle}>Quick Links</h3>
                  <ul
                    style={{
                      paddingLeft: "20px",
                      margin: 0,
                      color: "#4f46e5",
                      fontSize: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <li style={{ cursor: "pointer" }}>
                      Download Employee Handbook
                    </li>
                    <li style={{ cursor: "pointer" }}>View Holiday Calendar</li>
                    <li style={{ cursor: "pointer" }}>
                      IT Security Guidelines
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === "performance" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>My Performance</h1>
              <p style={styles.pageSub}>
                Review your current KPIs, goal progress, and latest review
                highlights.
              </p>
            </div>

            <div style={{ ...styles.statsGrid, marginBottom: "24px" }}>
              {performanceKPIs.map((kpi) => (
                <div key={kpi.id} style={styles.statCard}>
                  <span style={styles.statLabel}>{kpi.label}</span>
                  <span style={styles.statNum}>{kpi.value}</span>
                  <p style={{ margin: "12px 0 0 0", color: "#64748b", fontSize: "13px" }}>
                    {kpi.detail}
                  </p>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <h3 style={styles.cardTitle}>Active Goals & Objectives</h3>
                <span style={{ color: "#475569", fontSize: "13px" }}>
                  Updated today
                </span>
              </div>
              <div style={{ display: "grid", gap: "18px" }}>
                {performanceGoals.map((goal) => (
                  <div key={goal.id} style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center" }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>
                          {goal.title}
                        </p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                          Due {goal.due}
                        </p>
                      </div>
                      <span style={{ fontWeight: "700", color: "#2563eb", fontSize: "13px" }}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div style={styles.progressShell}>
                      <div style={{ ...styles.progressFill, width: `${goal.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TIME & ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Time & Attendance History</h1>
              <p style={styles.pageSub}>
                View your daily clock-in/out records, total hours worked, and
                overtime accumulation.
              </p>
            </div>

            <div style={{ ...styles.statsGrid, marginBottom: "24px" }}>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Total Hours (This Week)</span>
                <span style={styles.statNum}>
                  {weeklyHoursLabel} <span style={styles.statUnit}>Hours</span>
                </span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Overtime (This Week)</span>
                <span style={styles.statNum}>
                  {weeklyOvertimeLabel} <span style={styles.statUnit}>Hours</span>
                </span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Late Arrivals</span>
                <span style={styles.statNum}>
                  {lateArrivalsCount} <span style={styles.statUnit}>Days</span>
                </span>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>August 2026 Timesheet</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Clock In</th>
                    <th style={styles.th}>Clock Out</th>
                    <th style={styles.th}>Total Hours</th>
                    <th style={styles.th}>Overtime</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, i) => (
                    <tr key={record.id || i} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {record.date}
                      </td>
                      <td style={styles.td}>{record.in}</td>
                      <td style={styles.td}>{record.out || "—"}</td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {record.total}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          color:
                            record.overtime !== "0m" ? "#4f46e5" : "#64748b",
                        }}
                      >
                        {record.overtime}
                      </td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(record.status)}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HEALTH & BENEFITS TAB */}
        {activeTab === "benefits" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Health & Employee Benefits</h1>
              <p style={styles.pageSub}>
                Manage your HMO plan, primary care facilities, and emergency
                contacts.
              </p>
            </div>

            <div style={styles.gridTwo}>
              <div style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <h3 style={styles.cardTitle}>HMO Plan Details</h3>
                  <span style={getBadgeStyle("Approved")}>Active</span>
                </div>
                <div style={styles.infoGroup}>
                  <div>
                    <span style={styles.infoLabel}>Provider</span>
                    <p style={styles.infoVal}>{hmoDetails.provider}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Plan Type</span>
                    <p style={{ ...styles.infoVal, color: "#4f46e5" }}>
                      {hmoDetails.plan}
                    </p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Enrollee ID</span>
                    <p style={styles.infoVal}>{hmoDetails.enrolleeId}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Primary Hospital</span>
                    <p style={styles.infoVal}>{hmoDetails.primaryHospital}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Blood Group</span>
                    <p style={styles.infoVal}>{hmoDetails.bloodGroup}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Genotype</span>
                    <p style={styles.infoVal}>{hmoDetails.genotype}</p>
                  </div>
                </div>
                <button
                  style={{
                    ...styles.secondaryBtn,
                    width: "100%",
                    marginTop: "20px",
                  }}
                >
                  Request Hospital Change
                </button>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>
                  Emergency Contact / Next of Kin
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "16px",
                          color: "#1e293b",
                        }}
                      >
                        {hmoDetails.emergencyContact.name}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          backgroundColor: "#e2e8f0",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontWeight: "600",
                        }}
                      >
                        Primary
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <span style={styles.infoLabel}>Relationship</span>
                        <p style={styles.infoVal}>
                          {hmoDetails.emergencyContact.relation}
                        </p>
                      </div>
                      <div>
                        <span style={styles.infoLabel}>Phone</span>
                        <p style={styles.infoVal}>
                          {hmoDetails.emergencyContact.phone}
                        </p>
                      </div>
                      <div>
                        <span style={styles.infoLabel}>Location</span>
                        <p style={styles.infoVal}>
                          {hmoDetails.emergencyContact.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button style={styles.secondaryBtn}>
                    + Add Secondary Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MY PROFILE TAB */}
        {activeTab === "profile" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <h1 style={styles.pageTitle}>Employee Profile</h1>
                <p style={styles.pageSub}>
                  Personal credentials, employment info, and payment records.
                </p>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => {
                    const preparedForm = Object.keys(employee).reduce(
                      (acc, k) => {
                        acc[k] = employee[k] === "nil" ? "" : employee[k];
                        return acc;
                      },
                      {}
                    );
                    setEditProfileForm(preparedForm);
                    setIsEditingProfile(true);
                  }}
                  style={styles.primaryBtn}
                >
                  ✏️ Edit Profile Info
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              <div style={styles.gridTwo}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Personal & Job Details</h3>
                  <div style={styles.infoGroup}>
                    <div>
                      <span style={styles.infoLabel}>Full Name</span>
                      <p style={styles.infoVal}>{employee.name}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Job Title</span>
                      <p style={styles.infoVal}>{employee.title}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Department</span>
                      <p style={styles.infoVal}>{employee.department}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Work Email</span>
                      <p style={styles.infoVal}>{employee.email}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Phone Number</span>
                      <p style={styles.infoVal}>{employee.phone}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Reports To</span>
                      <p style={styles.infoVal}>{employee.manager}</p>
                    </div>
                  </div>
                </div>

                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Banking & Tax Info</h3>
                  <div style={styles.infoGroup}>
                    <div>
                      <span style={styles.infoLabel}>Bank Name</span>
                      <p style={styles.infoVal}>{employee.bankName}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Account Number</span>
                      <p style={styles.infoVal}>{employee.accountNumber}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Tax ID (TIN)</span>
                      <p style={styles.infoVal}>{employee.taxId}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Pension PIN</span>
                      <p style={styles.infoVal}>{employee.pensionPin}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Work Location</span>
                      <p style={styles.infoVal}>{employee.location}</p>
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Start Date</span>
                      <p style={styles.infoVal}>{employee.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Update Personal Information</h3>
                <form onSubmit={handleProfileSave} style={styles.formGrid}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Full Name</label>
                      <input
                        type="text"
                        value={editProfileForm.name}
                        onChange={(e) =>
                          setEditProfileForm({
                            ...editProfileForm,
                            name: e.target.value,
                          })
                        }
                        style={styles.input}
                        placeholder="nil"
                      />
                    </div>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Work Email</label>
                      <input
                        type="email"
                        value={editProfileForm.email}
                        onChange={(e) =>
                          setEditProfileForm({
                            ...editProfileForm,
                            email: e.target.value,
                          })
                        }
                        style={styles.input}
                        placeholder="nil"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Phone Number</label>
                      <input
                        type="text"
                        value={editProfileForm.phone}
                        onChange={(e) =>
                          setEditProfileForm({
                            ...editProfileForm,
                            phone: e.target.value,
                          })
                        }
                        style={styles.input}
                        placeholder="nil"
                      />
                    </div>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Work Location</label>
                      <input
                        type="text"
                        value={editProfileForm.location}
                        onChange={(e) =>
                          setEditProfileForm({
                            ...editProfileForm,
                            location: e.target.value,
                          })
                        }
                        style={styles.input}
                        placeholder="nil"
                      />
                    </div>
                  </div>

                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid #e2e8f0",
                      margin: "8px 0",
                    }}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Bank Name</label>
                      <input
                        type="text"
                        value={editProfileForm.bankName}
                        onChange={(e) =>
                          setEditProfileForm({
                            ...editProfileForm,
                            bankName: e.target.value,
                          })
                        }
                        style={styles.input}
                        placeholder="nil"
                      />
                    </div>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Account Number</label>
                      <input
                        type="text"
                        value={editProfileForm.accountNumber}
                        onChange={(e) =>
                          setEditProfileForm({
                            ...editProfileForm,
                            accountNumber: e.target.value,
                          })
                        }
                        style={styles.input}
                        placeholder="nil"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Tax ID (TIN)</label>
                      <input
                        type="text"
                        value={editProfileForm.taxId}
                        onChange={(e) =>
                          setEditProfileForm({
                            ...editProfileForm,
                            taxId: e.target.value,
                          })
                        }
                        style={styles.input}
                        placeholder="nil"
                      />
                    </div>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Pension PIN</label>
                      <input
                        type="text"
                        value={editProfileForm.pensionPin}
                        onChange={(e) =>
                          setEditProfileForm({
                            ...editProfileForm,
                            pensionPin: e.target.value,
                          })
                        }
                        style={styles.input}
                        placeholder="nil"
                      />
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: "12px", marginTop: "12px" }}
                  >
                    <button type="submit" style={styles.primaryBtn}>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      style={styles.secondaryBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* LEAVE & ABSENCE TAB */}
        {activeTab === "leave" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Leave & Absence</h1>
              <p style={styles.pageSub}>
                Track your entitlement balances and submit time off requests.
              </p>
            </div>

            <div style={{ ...styles.statsGrid, marginBottom: "24px" }}>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Annual Leave</span>
                <span style={styles.statNum}>
                  10 <span style={styles.statUnit}>/ 15 Days Left</span>
                </span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Sick Leave</span>
                <span style={styles.statNum}>
                  3 <span style={styles.statUnit}>/ 5 Days Left</span>
                </span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Casual Leave</span>
                <span style={styles.statNum}>
                  3 <span style={styles.statUnit}>/ 3 Days Left</span>
                </span>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Submit New Leave Request</h3>
              <form onSubmit={handleLeaveSubmit} style={styles.formGrid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Leave Type</label>
                  <select
                    value={leaveForm.type}
                    onChange={(e) =>
                      setLeaveForm({ ...leaveForm, type: e.target.value })
                    }
                    style={styles.input}
                  >
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Start Date</label>
                    <input
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) =>
                        setLeaveForm({
                          ...leaveForm,
                          startDate: e.target.value,
                        })
                      }
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>End Date</label>
                    <input
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) =>
                        setLeaveForm({ ...leaveForm, endDate: e.target.value })
                      }
                      required
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Reason</label>
                  <textarea
                    value={leaveForm.reason}
                    onChange={(e) =>
                      setLeaveForm({ ...leaveForm, reason: e.target.value })
                    }
                    required
                    rows={2}
                    style={styles.input}
                    placeholder="Briefly describe reason..."
                  />
                </div>
                <button type="submit" style={styles.primaryBtn}>
                  Submit Leave Request
                </button>
              </form>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Leave Request History</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Dates</th>
                    <th style={styles.th}>Duration</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((r) => (
                    <tr key={r.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {r.type}
                      </td>
                      <td style={styles.td}>{r.dates || "—"}</td>
                      <td style={styles.td}>{r.days ? `${r.days} Days` : "—"}</td>
                      <td style={styles.td}>{r.reason || "—"}</td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(r.status)}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYROLL & PAYSLIPS TAB */}
        {activeTab === "payroll" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Payroll & Compensation</h1>
              <p style={styles.pageSub}>
                View salary statements, tax deductions, and download payslips.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Recent Payslips</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Pay Period</th>
                    <th style={styles.th}>Pay Date</th>
                    <th style={styles.th}>Gross Pay</th>
                    <th style={styles.th}>Tax (PAYE)</th>
                    <th style={styles.th}>Pension</th>
                    <th style={styles.th}>Net Pay</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((ps) => (
                    <tr key={ps.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {ps.month || ps.period || "—"}
                      </td>
                      <td style={styles.td}>{ps.payDate || ps.date || "—"}</td>
                      <td style={styles.td}>{ps.gross || ps.amount || "—"}</td>
                      <td style={{ ...styles.td, color: "#ef4444" }}>
                        -{ps.tax || "0.00"}
                      </td>
                      <td style={{ ...styles.td, color: "#ef4444" }}>
                        -{ps.pension || "0.00"}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "700",
                          color: "#10b981",
                        }}
                      >
                        {ps.net || ps.amount || "—"}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => setSelectedPayslip(ps)}
                          style={styles.secondaryBtn}
                        >
                          View Breakdown
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedPayslip && (
              <div style={{ ...styles.card, borderLeft: "4px solid #4f46e5" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "16px" }}>
                    Statement Detail: {selectedPayslip.month}
                  </h3>
                  <button
                    onClick={() => setSelectedPayslip(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                    }}
                  >
                    ✕ Close
                  </button>
                </div>
                <div style={styles.infoGroup}>
                  <div>
                    <span style={styles.infoLabel}>Gross Salary</span>
                    <p style={styles.infoVal}>{selectedPayslip.gross || selectedPayslip.amount || "—"}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Income Tax</span>
                    <p style={styles.infoVal}>{selectedPayslip.tax || "0.00"}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Pension Contribution</span>
                    <p style={styles.infoVal}>{selectedPayslip.pension || "0.00"}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Take Home (Net)</span>
                    <p style={{ ...styles.infoVal, color: "#10b981" }}>
                      {selectedPayslip.net || selectedPayslip.amount || "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXPENSE CLAIMS TAB */}
        {activeTab === "claims" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Expense Claims & Reimbursements</h1>
              <p style={styles.pageSub}>
                Submit official work-related expenses for managerial approval.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>File New Expense Claim</h3>
              <form onSubmit={handleClaimSubmit} style={styles.formGrid}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Expense Category</label>
                    <select
                      value={claimForm.category}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, category: e.target.value })
                      }
                      style={styles.input}
                    >
                      <option value="Internet & Data Allowance">
                        Internet & Data Allowance
                      </option>
                      <option value="Office Supplies & Tech Accessories">
                        Office Supplies & Tech Accessories
                      </option>
                      <option value="Travel & Logistics">
                        Travel & Logistics
                      </option>
                    </select>
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Amount ($)</label>
                    <input
                      type="text"
                      value={claimForm.amount}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, amount: e.target.value })
                      }
                      placeholder="e.g. 50.00"
                      required
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Description / Purpose</label>
                  <textarea
                    value={claimForm.description}
                    onChange={(e) =>
                      setClaimForm({
                        ...claimForm,
                        description: e.target.value,
                      })
                    }
                    required
                    rows={2}
                    style={styles.input}
                    placeholder="Provide details standard for audit compliance..."
                  />
                </div>
                <button type="submit" style={styles.primaryBtn}>
                  Submit Expense Claim
                </button>
              </form>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Claims Log</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Claim ID</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c) => (
                    <tr key={c.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        #{c.id}
                      </td>
                      <td style={styles.td}>{c.category || c.type || "—"}</td>
                      <td style={styles.td}>{c.date || c.payDate || "—"}</td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {c.amount}
                      </td>
                      <td style={styles.td}>{c.description || c.desc || "—"}</td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(c.status)}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* IT & HR HELPDESK TAB */}
        {activeTab === "helpdesk" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>IT & HR Helpdesk</h1>
              <p style={styles.pageSub}>
                Create and track support tickets for technical hardware,
                software access, or HR inquiries.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Create Support Ticket</h3>
              <form onSubmit={handleTicketSubmit} style={styles.formGrid}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) =>
                        setTicketForm({
                          ...ticketForm,
                          category: e.target.value,
                        })
                      }
                      style={styles.input}
                    >
                      <option value="IT Hardware">IT Hardware</option>
                      <option value="Software & Access">
                        Software & Access
                      </option>
                      <option value="HR & Administrative Inquiry">
                        HR & Administrative Inquiry
                      </option>
                    </select>
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Subject</label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) =>
                        setTicketForm({
                          ...ticketForm,
                          subject: e.target.value,
                        })
                      }
                      placeholder="Short description of issue"
                      required
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Detailed Description</label>
                  <textarea
                    value={ticketForm.details}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, details: e.target.value })
                    }
                    required
                    rows={3}
                    style={styles.input}
                    placeholder="Describe problem symptoms, device models, or requests..."
                  />
                </div>
                <button type="submit" style={styles.primaryBtn}>
                  Open Ticket
                </button>
              </form>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Your Active Tickets</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Ticket ID</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Date Submitted</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {t.id}
                      </td>
                      <td style={styles.td}>{t.category}</td>
                      <td style={{ ...styles.td, fontWeight: "500" }}>
                        {t.subject}
                      </td>
                      <td style={styles.td}>{t.date}</td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(t.status)}>{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Utility styling helper for UI status badges
const getBadgeStyle = (status) => {
  const base = {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  };
  if (status === "Approved" || status === "On Time" || status === "Active")
    return { ...base, backgroundColor: "#dcfce7", color: "#166534" };
  if (status === "Rejected" || status === "Late")
    return { ...base, backgroundColor: "#fee2e2", color: "#991b1b" };
  if (status === "In Progress" || status === "Open")
    return { ...base, backgroundColor: "#e0e7ff", color: "#3730a3" };
  return { ...base, backgroundColor: "#fef3c7", color: "#92400e" };
};

// UI Design System / CSS Styles Object
const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
    color: "#fff",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    borderRight: "1px solid rgba(148, 163, 184, 0.18)",
  },
  brand: { display: "flex", alignItems: "center", gap: "12px" },
  brandLogo: {
    width: "38px",
    height: "38px",
    background: "linear-gradient(135deg, #4f46e5, #2563eb)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
    boxShadow: "0 8px 22px rgba(37, 99, 235, 0.28)",
  },
  brandName: { fontSize: "16px", fontWeight: "700", margin: 0 },
  brandSub: { fontSize: "11px", color: "#94a3b8", margin: 0 },
  navStack: { display: "flex", flexDirection: "column", gap: "6px" },
  navLink: {
    background: "transparent",
    border: "1px solid transparent",
    color: "#94a3b8",
    padding: "11px 12px",
    borderRadius: "10px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.18s ease",
  },
  navActive: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    borderColor: "rgba(255,255,255,0.12)",
  },
  sidebarFooter: {
    marginTop: "auto",
    borderTop: "1px solid rgba(148, 163, 184, 0.18)",
    paddingTop: "16px",
  },
  userBadge: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "12px",
  },
  mainContent: { flex: 1, padding: "36px 40px", maxWidth: "1100px" },
  pageHeader: { marginBottom: "24px" },
  pageTitle: { fontSize: "26px", fontWeight: "800", margin: 0, letterSpacing: "-0.03em" },
  pageSub: { fontSize: "13px", color: "#64748b", margin: "6px 0 0 0", lineHeight: 1.6 },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
    marginBottom: "24px",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 16px 0",
    color: "#0f172a",
  },
  infoGroup: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  infoLabel: { fontSize: "12px", color: "#64748b", fontWeight: "700" },
  infoVal: { fontSize: "14px", fontWeight: "600", margin: "2px 0 0 0" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
    display: "flex",
    flexDirection: "column",
  },
  statLabel: { fontSize: "12px", color: "#64748b", fontWeight: "700" },
  statNum: { fontSize: "24px", fontWeight: "700", marginTop: "6px" },
  statUnit: { fontSize: "13px", color: "#64748b", fontWeight: "normal" },
  progressShell: {
    width: "100%",
    height: "12px",
    borderRadius: "999px",
    background: "#e2e8f0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #4f46e5, #2563eb)",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.15)",
  },
  formGrid: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "700", color: "#334155" },
  input: {
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    backgroundColor: "#fff",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.18s ease",
    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.18)",
  },
  secondaryBtn: {
    backgroundColor: "#f8fafc",
    color: "#334155",
    border: "1px solid #cbd5e1",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    textAlign: "left",
    fontSize: "13px",
  },
  thRow: { borderBottom: "1px solid #e2e8f0", color: "#64748b" },
  th: {
    padding: "10px 12px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: "700",
  },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "12px", color: "#334155" },
};
