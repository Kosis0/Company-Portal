import React, { useState } from "react";

export default function HRDashboard({
  leaveRequests,
  onUpdateStatus,
  announcements,
  onAddAnnouncement,
  payments,
  claims,
  onUpdateClaimStatus,
  attendanceRecords,
  tickets,
  onUpdateTicketStatus,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  // --- STATE MANAGEMENT ---

  // 1. Employee Roster Data
  const [employees, setEmployees] = useState([
    {
      id: "EMP-2026-042",
      name: "Emmanuel Kosi",
      title: "Software Developer Intern",
      dept: "Engineering",
      email: "emmanuel.kosi@nexus.com",
      status: "Active",
      location: "Port Harcourt",
      score: "9.2 / 10",
      performance: {
        taskCompletion: "92%",
        attendanceScore: "97%",
        reviewRating: "4.6 / 5",
      },
      recentProjects: [
        {
          name: "Onboarding Dashboard",
          deliverable: "Client intake workflow",
          status: "On Track",
          due: "Sep 5, 2026",
        },
        {
          name: "Support Ticket Enhancements",
          deliverable: "Automation rules and alerts",
          status: "Nearly Complete",
          due: "Sep 18, 2026",
        },
      ],
      evaluations: [
        { title: "Q2 Review", rating: "4.6 / 5", date: "Jul 2026" },
        { title: "Project Pulse", rating: "A-", date: "Jun 2026" },
      ],
    },
    {
      id: "EMP-2026-018",
      name: "Sarah Chen",
      title: "Tech Lead",
      dept: "Engineering",
      email: "sarah.chen@nexus.com",
      status: "Active",
      location: "Port Harcourt",
      score: "9.6 / 10",
      performance: {
        taskCompletion: "95%",
        attendanceScore: "99%",
        reviewRating: "4.8 / 5",
      },
      recentProjects: [
        {
          name: "CI/CD Review",
          deliverable: "Production rollout plan",
          status: "Completed",
          due: "Aug 10, 2026",
        },
        {
          name: "Mentorship Program",
          deliverable: "Pairing junior engineers",
          status: "In Progress",
          due: "Oct 1, 2026",
        },
      ],
      evaluations: [
        { title: "Q2 Review", rating: "4.8 / 5", date: "Jul 2026" },
        { title: "Team Alignment", rating: "A", date: "Jun 2026" },
      ],
    },
    {
      id: "EMP-2026-009",
      name: "Alex Rivera",
      title: "HR Generalist",
      dept: "Human Resources",
      email: "alex.rivera@nexus.com",
      status: "Active",
      location: "Lagos",
      score: "8.9 / 10",
      performance: {
        taskCompletion: "88%",
        attendanceScore: "94%",
        reviewRating: "4.3 / 5",
      },
      recentProjects: [
        {
          name: "Benefits Rollout",
          deliverable: "HMO enrollment guide",
          status: "On Track",
          due: "Sep 7, 2026",
        },
        {
          name: "Recruitment Drive",
          deliverable: "Interview panel support",
          status: "In Progress",
          due: "Sep 20, 2026",
        },
      ],
      evaluations: [
        { title: "Q2 Review", rating: "4.3 / 5", date: "Jul 2026" },
        { title: "Engagement Pulse", rating: "B+", date: "Jun 2026" },
      ],
    },
    {
      id: "EMP-2026-077",
      name: "David O.",
      title: "DevOps Engineer",
      dept: "Engineering",
      email: "david.o@nexus.com",
      status: "On Leave",
      location: "Remote",
      score: "9.1 / 10",
      performance: {
        taskCompletion: "91%",
        attendanceScore: "92%",
        reviewRating: "4.4 / 5",
      },
      recentProjects: [
        {
          name: "Infra Health Check",
          deliverable: "Cloud cost audit",
          status: "Paused",
          due: "Sep 1, 2026",
        },
      ],
      evaluations: [
        { title: "Q2 Review", rating: "4.4 / 5", date: "Jul 2026" },
        { title: "Sprint Summary", rating: "A-", date: "Jun 2026" },
      ],
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const openEditProfile = (employee) => {
    setEditedEmployee({
      id: employee.id,
      name: employee.name,
      title: employee.title,
      dept: employee.dept,
      email: employee.email,
      status: employee.status,
      location: employee.location,
    });
    setIsEditModalOpen(true);
  };

  const openViewPerformance = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setEditedEmployee(null);
    setSelectedEmployee(null);
  };

  const saveEmployeeUpdate = (e) => {
    e.preventDefault();
    if (!editedEmployee) return;
    setEmployees((prev) =>
      prev.map((item) =>
        item.id === editedEmployee.id
          ? { ...item, ...editedEmployee }
          : item
      )
    );
    closeModals();
  };

  // 4. HMO & Health Benefits Roster
  const [hmoRoster, setHmoRoster] = useState([
    {
      enrolleeId: "AXM-2026-042",
      name: "Emmanuel Kosi",
      provider: "Axa Mansard",
      plan: "Tier 2 Premium",
      hospital: "Evercare Hospital, Port Harcourt",
      status: "Active",
    },
    {
      enrolleeId: "AXM-2026-018",
      name: "Sarah Chen",
      provider: "Axa Mansard",
      plan: "Tier 1 Executive",
      hospital: "St. Nicholas, Lagos",
      status: "Active",
    },
    {
      enrolleeId: "AXM-2026-009",
      name: "Alex Rivera",
      provider: "Reliance HMO",
      plan: "Standard Corporate",
      hospital: "Reddington, Lagos",
      status: "Pending Hospital Switch",
    },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "News",
  });

  const notifications = [
    ...leaveRequests
      .filter((request) => request.status === "Pending")
      .map((request) => ({
        id: `leave-${request.id}`,
        title: `${request.name} requested ${request.type}`,
        meta: `${request.dates} • ${request.days} day(s)`,
        type: "Leave",
      })),
    ...claims
      .filter((claim) => claim.status === "Pending")
      .map((claim) => ({
        id: `claim-${claim.id}`,
        title: `${claim.name} submitted a ${claim.category} claim`,
        meta: `${claim.amount} • ${claim.date}`,
        type: "Expense",
      })),
    ...tickets
      .filter((ticket) => ticket.status !== "Resolved")
      .map((ticket) => ({
        id: `ticket-${ticket.id}`,
        title: `${ticket.name} opened a ${ticket.category} ticket`,
        meta: `${ticket.subject} • ${ticket.status}`,
        type: "Ticket",
      })),
  ];

  const pendingNotificationCount = notifications.length;

  // --- HANDLERS ---
  const handleClaimAction = (id, newStatus) => {
    onUpdateClaimStatus?.(id, newStatus);
  };

  const handleTicketStatusChange = (id, newStatus) => {
    onUpdateTicketStatus?.(id, newStatus);
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    onAddAnnouncement?.({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      type: newAnnouncement.type,
      date: "Aug 5, 2026",
    });

    setNewAnnouncement({ title: "", content: "", type: "News" });
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandLogo}>N</div>
          <div>
            <h2 style={styles.brandName}>Nexus HR</h2>
            <p style={styles.brandSub}>Human Resources Portal</p>
          </div>
        </div>

        <nav style={styles.navStack}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              ...styles.navLink,
              ...(activeTab === "overview" ? styles.navActive : {}),
            }}
          >
            📊 HR Overview
          </button>
          <button
            onClick={() => setActiveTab("employees")}
            style={{
              ...styles.navLink,
              ...(activeTab === "employees" ? styles.navActive : {}),
            }}
          >
            👥 Employee Roster
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            style={{
              ...styles.navLink,
              ...(activeTab === "attendance" ? styles.navActive : {}),
            }}
          >
            ⏱️ Attendance & Overtime
          </button>
          <button
            onClick={() => setActiveTab("leave")}
            style={{
              ...styles.navLink,
              ...(activeTab === "leave" ? styles.navActive : {}),
            }}
          >
            🌴 Leave Requests
          </button>
          <button
            onClick={() => setActiveTab("benefits")}
            style={{
              ...styles.navLink,
              ...(activeTab === "benefits" ? styles.navActive : {}),
            }}
          >
            🏥 HMO & Health Plans
          </button>
          <button
            onClick={() => setActiveTab("content")}
            style={{
              ...styles.navLink,
              ...(activeTab === "content" ? styles.navActive : {}),
            }}
          >
            📢 News & Events Manager
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            style={{
              ...styles.navLink,
              ...(activeTab === "finance" ? styles.navActive : {}),
            }}
          >
            💳 Expenses & Payroll
          </button>
          <button
            onClick={() => setActiveTab("helpdesk")}
            style={{
              ...styles.navLink,
              ...(activeTab === "helpdesk" ? styles.navActive : {}),
            }}
          >
            🎧 HR & Support Queue
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userBadge}>
            <div style={styles.avatar}>HR</div>
            <div>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "13px" }}>
                Alex Rivera
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                HR Generalist
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>HR Executive Control Center</h1>
              <p style={styles.pageSub}>
                Real-time workforce metrics, personnel updates, and actionable
                HR approvals.
              </p>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Total Headcount</span>
                <span style={styles.statNum}>
                  {employees.length}{" "}
                  <span style={styles.statUnit}>Employees</span>
                </span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Active Clocked-In Today</span>
                <span style={{ ...styles.statNum, color: "#10b981" }}>
                  3 <span style={styles.statUnit}>/ 4 Present</span>
                </span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Pending Leave Requests</span>
                <span style={{ ...styles.statNum, color: "#f59e0b" }}>
                  {leaveRequests.filter((r) => r.status === "Pending").length}{" "}
                  <span style={styles.statUnit}>Action Required</span>
                </span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Open Support Tickets</span>
                <span style={{ ...styles.statNum, color: "#ef4444" }}>
                  {tickets.filter((t) => t.status !== "Resolved").length}{" "}
                  <span style={styles.statUnit}>Unresolved</span>
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "24px",
                marginTop: "24px",
              }}
            >
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>
                  Immediate Approval Action Items
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {leaveRequests
                    .filter((r) => r.status === "Pending")
                    .map((req) => (
                      <div key={req.id} style={styles.actionRow}>
                        <div>
                          <span style={{ fontWeight: "700", color: "#1e293b" }}>
                            {req.name}
                          </span>{" "}
                          —{" "}
                          <span style={{ fontSize: "13px", color: "#4f46e5" }}>
                            {req.type}
                          </span>
                          <p
                            style={{
                              margin: "2px 0 0 0",
                              fontSize: "12px",
                              color: "#64748b",
                            }}
                          >
                            {req.dates} ({req.days} days) • Reason: {req.reason}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() =>
                              onUpdateStatus(req.id, "Approved")
                            }
                            style={styles.approveBtn}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              onUpdateStatus(req.id, "Rejected")
                            }
                            style={styles.rejectBtn}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  {leaveRequests.filter((r) => r.status === "Pending")
                    .length === 0 && (
                    <p
                      style={{ margin: 0, color: "#64748b", fontSize: "13px" }}
                    >
                      No pending leave approvals.
                    </p>
                  )}
                </div>
              </div>

              <div style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3 style={styles.cardTitle}>HR Notifications</h3>
                  <span style={styles.notificationBadge}>
                    {pendingNotificationCount} new
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {notifications.slice(0, 4).map((item) => (
                    <div key={item.id} style={styles.notificationItem}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={styles.notificationType}>{item.type}</span>
                        <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                          {item.title}
                        </strong>
                      </div>
                      <p style={{ marginTop: "4px", fontSize: "12px" }}>{item.meta}</p>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <p style={{ margin: 0, fontSize: "13px" }}>
                      No new requests right now.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. EMPLOYEE ROSTER TAB */}
        {activeTab === "employees" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Employee Directory & Profiles</h1>
              <p style={styles.pageSub}>
                Manage staff records, update roles and departments, and review employee performance.
              </p>
            </div>

            <div style={styles.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <input
                  type="text"
                  placeholder="Search by name, ID, department or email..."
                  style={{ ...styles.input, width: "min(100%, 320px)" }}
                />
                <button style={styles.primaryBtn}>+ Onboard New Staff</button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Employee ID</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Department</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Score</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: "600", color: "#4f46e5" }}>
                          {emp.id}
                        </td>
                        <td style={{ ...styles.td, fontWeight: "600" }}>{emp.name}</td>
                        <td style={styles.td}>{emp.title}</td>
                        <td style={styles.td}>{emp.dept}</td>
                        <td style={styles.td}>{emp.email}</td>
                        <td style={styles.td}>{emp.score}</td>
                        <td style={styles.td}>
                          <span style={getBadgeStyle(emp.status)}>{emp.status}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button
                              onClick={() => openEditProfile(emp)}
                              style={styles.tableActionBtn}
                            >
                              Edit Profile
                            </button>
                            <button
                              onClick={() => openViewPerformance(emp)}
                              style={styles.tableActionBtnSecondary}
                            >
                              View Performance
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {isEditModalOpen && editedEmployee && (
              <div style={styles.modalOverlay} onClick={closeModals}>
                <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalHeader}>
                    <h2 style={{ margin: 0 }}>Edit Employee Profile</h2>
                    <button onClick={closeModals} style={styles.closeButton}>
                      ×
                    </button>
                  </div>
                  <form onSubmit={saveEmployeeUpdate} style={{ display: "grid", gap: "18px" }}>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Employee Name</label>
                      <input type="text" value={editedEmployee.name} disabled style={styles.input} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Role</label>
                        <input
                          type="text"
                          value={editedEmployee.title}
                          onChange={(e) => setEditedEmployee({ ...editedEmployee, title: e.target.value })}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Department</label>
                        <input
                          type="text"
                          value={editedEmployee.dept}
                          onChange={(e) => setEditedEmployee({ ...editedEmployee, dept: e.target.value })}
                          style={styles.input}
                        />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Status</label>
                        <select
                          value={editedEmployee.status}
                          onChange={(e) => setEditedEmployee({ ...editedEmployee, status: e.target.value })}
                          style={styles.input}
                        >
                          <option>Active</option>
                          <option>On Leave</option>
                          <option>Inactive</option>
                        </select>
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Location</label>
                        <input
                          type="text"
                          value={editedEmployee.location}
                          onChange={(e) => setEditedEmployee({ ...editedEmployee, location: e.target.value })}
                          style={styles.input}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                      <button type="button" onClick={closeModals} style={styles.secondaryBtn}>
                        Cancel
                      </button>
                      <button type="submit" style={styles.primaryBtn}>
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isViewModalOpen && selectedEmployee && (
              <div style={styles.modalOverlay} onClick={closeModals}>
                <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalHeader}>
                    <div>
                      <h2 style={{ margin: 0 }}>{selectedEmployee.name}</h2>
                      <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
                        {selectedEmployee.title} • {selectedEmployee.dept}
                      </p>
                    </div>
                    <button onClick={closeModals} style={styles.closeButton}>
                      ×
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "20px" }}>
                    <div style={styles.infoGroup}>
                      <div>
                        <span style={styles.infoLabel}>Email</span>
                        <p style={styles.infoVal}>{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <span style={styles.infoLabel}>Score</span>
                        <p style={styles.infoVal}>{selectedEmployee.score}</p>
                      </div>
                      <div>
                        <span style={styles.infoLabel}>Status</span>
                        <p style={styles.infoVal}>{selectedEmployee.status}</p>
                      </div>
                    </div>

                    <div style={styles.card}>
                      <h3 style={styles.cardTitle}>Performance Metrics</h3>
                      <div style={{ display: "grid", gap: "12px" }}>
                        <div style={styles.detailRow}>
                          <span>Task Completion</span>
                          <strong>{selectedEmployee.performance.taskCompletion}</strong>
                        </div>
                        <div style={styles.detailRow}>
                          <span>Attendance Score</span>
                          <strong>{selectedEmployee.performance.attendanceScore}</strong>
                        </div>
                        <div style={styles.detailRow}>
                          <span>Recent Review</span>
                          <strong>{selectedEmployee.performance.reviewRating}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={styles.card}>
                      <h3 style={styles.cardTitle}>Recent Project Deliverables</h3>
                      <div style={{ display: "grid", gap: "12px" }}>
                        {selectedEmployee.recentProjects.map((project, idx) => (
                          <div key={idx} style={styles.projectRow}>
                            <div>
                              <p style={{ margin: 0, fontWeight: "700" }}>{project.name}</p>
                              <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>
                                {project.deliverable}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={styles.badgeSmall}>{project.status}</span>
                              <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                                Due {project.due}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={styles.card}>
                      <h3 style={styles.cardTitle}>Internal Evaluations</h3>
                      <div style={{ display: "grid", gap: "12px" }}>
                        {selectedEmployee.evaluations.map((item, idx) => (
                          <div key={idx} style={styles.detailRow}>
                            <div>
                              <p style={{ margin: 0, fontWeight: "700" }}>{item.title}</p>
                              <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "12px" }}>
                                {item.date}
                              </p>
                            </div>
                            <strong>{item.rating}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. ATTENDANCE & OVERTIME TAB */}
        {activeTab === "attendance" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Attendance & Time Audit Console</h1>
              <p style={styles.pageSub}>
                Real-time employee clock-in records, tardiness logs, and
                overtime accumulation.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Live Daily Clock-In Logs</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Employee</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Clock In</th>
                    <th style={styles.th}>Clock Out</th>
                    <th style={styles.th}>Hours Logged</th>
                    <th style={styles.th}>Overtime</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((rec) => (
                    <tr key={rec.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {rec.name} <br />
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          {rec.empId}
                        </span>
                      </td>
                      <td style={styles.td}>{rec.date}</td>
                      <td style={styles.td}>{rec.in}</td>
                      <td style={styles.td}>{rec.out}</td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {rec.total}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          color: rec.overtime !== "0m" ? "#4f46e5" : "#64748b",
                          fontWeight: "600",
                        }}
                      >
                        {rec.overtime}
                      </td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(rec.status)}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. LEAVE REQUESTS TAB */}
        {activeTab === "leave" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Leave Management Queue</h1>
              <p style={styles.pageSub}>
                Review, approve, or reject employee leave applications and
                monitor balance limits.
              </p>
            </div>

            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Applicant</th>
                    <th style={styles.th}>Leave Type</th>
                    <th style={styles.th}>Requested Dates</th>
                    <th style={styles.th}>Days</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((req) => (
                    <tr key={req.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {req.name}
                      </td>
                      <td style={styles.td}>{req.type}</td>
                      <td style={styles.td}>{req.dates}</td>
                      <td style={styles.td}>{req.days}</td>
                      <td style={styles.td}>{req.reason}</td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(req.status)}>
                          {req.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {req.status === "Pending" ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() =>
                                onUpdateStatus(req.id, "Approved")
                              }
                              style={styles.approveBtn}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                onUpdateStatus(req.id, "Rejected")
                              }
                              style={styles.rejectBtn}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. HMO & BENEFITS TAB */}
        {activeTab === "benefits" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>
                HMO & Health Insurance Administration
              </h1>
              <p style={styles.pageSub}>
                Manage provider registrations, corporate coverage tiers, and
                hospital assignments.
              </p>
            </div>

            <div style={styles.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <h3 style={styles.cardTitle}>
                  Enrolled Staff & Provider Roster
                </h3>
                <button style={styles.secondaryBtn}>
                  Export HMO Roster (CSV)
                </button>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Enrollee ID</th>
                    <th style={styles.th}>Employee Name</th>
                    <th style={styles.th}>HMO Provider</th>
                    <th style={styles.th}>Tier Plan</th>
                    <th style={styles.th}>Primary Hospital Location</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hmoRoster.map((item) => (
                    <tr key={item.enrolleeId} style={styles.tr}>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "600",
                          color: "#4f46e5",
                        }}
                      >
                        {item.enrolleeId}
                      </td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {item.name}
                      </td>
                      <td style={styles.td}>{item.provider}</td>
                      <td style={styles.td}>{item.plan}</td>
                      <td style={styles.td}>{item.hospital}</td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(item.status)}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. NEWS & EVENTS MANAGER TAB */}
        {activeTab === "content" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Corporate News & Event Publisher</h1>
              <p style={styles.pageSub}>
                Broadcast news, vital policy changes, and social events to
                employee dashboards.
              </p>
            </div>

            <div style={styles.gridTwo}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Publish New Announcement</h3>
                <form onSubmit={handleAddAnnouncement} style={styles.formGrid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Title</label>
                    <input
                      type="text"
                      value={newAnnouncement.title}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g. Company Policy Update"
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Notice Category</label>
                    <select
                      value={newAnnouncement.type}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          type: e.target.value,
                        })
                      }
                      style={styles.input}
                    >
                      <option value="News">News</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Content Body</label>
                    <textarea
                      rows={4}
                      value={newAnnouncement.content}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          content: e.target.value,
                        })
                      }
                      placeholder="Write full announcement description..."
                      style={styles.input}
                      required
                    />
                  </div>
                  <button type="submit" style={styles.primaryBtn}>
                    📢 Broadcast Notice
                  </button>
                </form>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Active Published News</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        padding: "12px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ fontWeight: "700", fontSize: "13px" }}>
                          {a.title}
                        </span>
                        <span style={getBadgeStyle(a.type)}>{a.type}</span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        {a.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. EXPENSES & PAYROLL TAB */}
        {activeTab === "finance" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Financial & Expense Approvals</h1>
              <p style={styles.pageSub}>
                Audit employee out-of-pocket claims, monthly payroll batches,
                and tax filings.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Pending Expense Claims</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Claim ID</th>
                    <th style={styles.th}>Employee</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c) => (
                    <tr key={c.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        #{c.id}
                      </td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {c.name || c.employee || "—"}
                      </td>
                      <td style={styles.td}>{c.category || c.type || "—"}</td>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "700",
                          color: "#10b981",
                        }}
                      >
                        {c.amount}
                      </td>
                      <td style={styles.td}>{c.date || c.payDate || "—"}</td>
                      <td style={styles.td}>{c.desc || c.description || "—"}</td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(c.status)}>{c.status}</span>
                      </td>
                      <td style={styles.td}>
                        {c.status === "Pending" ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() =>
                                handleClaimAction(c.id, "Approved")
                              }
                              style={styles.approveBtn}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleClaimAction(c.id, "Rejected")
                              }
                              style={styles.rejectBtn}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. HR HELPDESK QUEUE TAB */}
        {activeTab === "helpdesk" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>
                HR & Support Ticket Management Queue
              </h1>
              <p style={styles.pageSub}>
                Track employee support inquiries, policy questions, and
                operational requests.
              </p>
            </div>

            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Ticket ID</th>
                    <th style={styles.th}>Submitted By</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Priority</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} style={styles.tr}>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "600",
                          color: "#4f46e5",
                        }}
                      >
                        {t.id}
                      </td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {t.name}
                      </td>
                      <td style={styles.td}>{t.category}</td>
                      <td style={styles.td}>{t.subject}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            fontWeight: "700",
                            color:
                              t.priority === "High" ? "#ef4444" : "#64748b",
                          }}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(t.status)}>{t.status}</span>
                      </td>
                      <td style={styles.td}>
                        <select
                          value={t.status}
                          onChange={(e) =>
                            handleTicketStatusChange(t.id, e.target.value)
                          }
                          style={{
                            ...styles.input,
                            padding: "4px 8px",
                            fontSize: "12px",
                          }}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
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

// --- BADGE STYLING HELPER ---
const getBadgeStyle = (status) => {
  const base = {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  };
  if (
    status === "Approved" ||
    status === "Active" ||
    status === "On Time" ||
    status === "Resolved"
  ) {
    return { ...base, backgroundColor: "#dcfce7", color: "#166534" };
  }
  if (status === "Rejected" || status === "Late" || status === "Urgent") {
    return { ...base, backgroundColor: "#fee2e2", color: "#991b1b" };
  }
  if (
    status === "In Progress" ||
    status === "Important" ||
    status === "Pending Hospital Switch"
  ) {
    return { ...base, backgroundColor: "#e0e7ff", color: "#3730a3" };
  }
  return { ...base, backgroundColor: "#fef3c7", color: "#92400e" };
};

// --- STYLES OBJECT ---
const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  sidebar: {
    width: "270px",
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
  navStack: { display: "flex", flexDirection: "column", gap: "4px" },
  navLink: {
    background: "transparent",
    border: "1px solid transparent",
    color: "#94a3b8",
    padding: "10px 14px",
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
  mainContent: { flex: 1, padding: "36px 40px", maxWidth: "1200px" },
  pageHeader: { marginBottom: "24px" },
  pageTitle: { fontSize: "26px", fontWeight: "800", margin: 0, letterSpacing: "-0.03em" },
  pageSub: { fontSize: "13px", color: "#64748b", margin: "6px 0 0 0", lineHeight: 1.6 },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
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
  notificationBadge: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
  },
  notificationItem: {
    padding: "10px 12px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  notificationType: {
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    padding: "2px 7px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
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
  formGrid: { display: "flex", flexDirection: "column", gap: "14px" },
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
    textAlign: "center",
  },
  approveBtn: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  rejectBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "13px",
  },
  thRow: { borderBottom: "2px solid #f1f5f9", color: "#64748b" },
  th: {
    padding: "10px 12px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: "600",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px", color: "#334155" },
  smallLinkBtn: {
    background: "none",
    border: "none",
    color: "#4f46e5",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  tableActionBtn: {
    background: "#eef2ff",
    color: "#3730a3",
    border: "1px solid #c7d2fe",
    borderRadius: "10px",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  tableActionBtnSecondary: {
    background: "#fff",
    color: "#2563eb",
    border: "1px solid #c7d2fe",
    borderRadius: "10px",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    zIndex: 50,
  },
  modalCard: {
    width: "min(760px, 100%)",
    backgroundColor: "#fff",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 34px 80px rgba(15, 23, 42, 0.18)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "24px",
  },
  closeButton: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    width: "34px",
    height: "34px",
    fontSize: "18px",
    color: "#334155",
    cursor: "pointer",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "14px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  projectRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    padding: "14px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  badgeSmall: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    fontSize: "11px",
    fontWeight: "700",
  },
};
