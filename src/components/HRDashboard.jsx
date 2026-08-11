import React, { useState } from "react";

export default function HRDashboard({
  profile,
  theme,
  onToggleTheme,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptFilter, setDeptFilter] = useState("All");

  // Roster State
  const [employees, setEmployees] = useState([
    {
      id: "EMP-2026-042",
      name: "Udeh Kosisochukwu",
      title: "Software Developer Intern",
      dept: "Engineering",
      email: "udeh.emmanuel@nexus.com",
      status: "Active",
      location: "Port Harcourt",
      salary: "$3,500/mo",
      score: "4.5 / 5.0",
    },
    {
      id: "EMP-2026-018",
      name: "Sarah Chen",
      title: "Tech Lead",
      dept: "Engineering",
      email: "sarah.chen@nexus.com",
      status: "Active",
      location: "Port Harcourt",
      salary: "$6,200/mo",
      score: "4.8 / 5.0",
    },
    {
      id: "EMP-2026-009",
      name: "Alex Rivera",
      title: "HR Generalist",
      dept: "Human Resources",
      email: "alex.rivera@nexus.com",
      status: "Active",
      location: "Lagos",
      salary: "$4,100/mo",
      score: "4.3 / 5.0",
    },
    {
      id: "EMP-2026-077",
      name: "David O.",
      title: "DevOps Specialist",
      dept: "Engineering",
      email: "david.o@nexus.com",
      status: "On Leave",
      location: "Remote",
      salary: "$5,500/mo",
      score: "4.4 / 5.0",
    },
  ]);

  // Modals state
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [selectedEmpDossier, setSelectedEmpDossier] = useState(null);

  // Forms
  const [newEmpForm, setNewEmpForm] = useState({
    name: "",
    title: "",
    dept: "Engineering",
    email: "",
    salary: "$4,000/mo",
    location: "Port Harcourt",
  });

  const [annForm, setAnnForm] = useState({
    title: "",
    type: "Important",
    content: "",
  });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmpForm.name || !newEmpForm.email) return;
    setEmployees((prev) => [
      {
        id: `EMP-2026-${Math.floor(100 + Math.random() * 900)}`,
        status: "Active",
        score: "4.0 / 5.0",
        ...newEmpForm,
      },
      ...prev,
    ]);
    setNewEmpForm({ name: "", title: "", dept: "Engineering", email: "", salary: "$4,000/mo", location: "Port Harcourt" });
    setShowAddEmpModal(false);
  };

  const handleAddAnn = (e) => {
    e.preventDefault();
    if (!annForm.title || !annForm.content) return;
    onAddAnnouncement(annForm);
    setAnnForm({ title: "", type: "Important", content: "" });
    setShowAnnounceModal(false);
  };

  const navItems = [
    { id: "overview", label: "Command Center" },
    { id: "directory", label: "Employee Roster" },
    { id: "attendance", label: "Company Attendance" },
    { id: "leave", label: "Leave Approvals" },
    { id: "payroll", label: "Payroll & Claims Admin" },
    { id: "helpdesk", label: "Helpdesk Queue" },
    { id: "announcements", label: "Announcements" },
    { id: "reports", label: "Analytics & Reports" },
  ];

  const filteredEmployees = employees.filter((emp) => {
    return deptFilter === "All" || emp.dept === deptFilter;
  });

  return (
    <div className="app-container">
      {/* Mobile Drawer Overlay Backdrop */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? "is-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-wrapper">
            <div className="sidebar-brand-logo" style={{ backgroundColor: "#2563eb" }}>HR</div>
            <div className="sidebar-brand-text">
              <h2>Nexus Admin</h2>
              <p>People Operations</p>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={() => setMobileMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="avatar-circle">HR</div>
            <div className="user-profile-info">
              <div className="user-profile-name">{profile?.name || "HR Administrator"}</div>
              <div className="user-profile-role">People & Culture Lead</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="main-wrapper">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="top-navbar-left">
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <span className="hamburger-icon">
                <span />
                <span />
                <span />
              </span>
              <span>Menu</span>
            </button>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>
              HR Admin Console
            </div>
          </div>

          <div className="top-navbar-right">
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
              Organization: <strong>Nexus HQ</strong>
            </div>

            <button className="theme-toggle-btn" onClick={onToggleTheme}>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* TAB 1: EXECUTIVE COMMAND CENTER */}
          {activeTab === "overview" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Executive Command Center</h1>
                  <p>Real-time enterprise metrics, staff attendance, pending approvals and operational alerts.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="btn btn-primary" onClick={() => setShowAddEmpModal(true)}>
                    Onboard New Staff
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowAnnounceModal(true)}>
                    Post Announcement
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Total Workforce</span>
                  </div>
                  <div className="stat-card-value">{employees.length} Active</div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">+12%</span>
                    <span>Quarter-over-Quarter</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Present Today</span>
                  </div>
                  <div className="stat-card-value">3 / 4 Staff</div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">75% Attendance</span>
                    <span>1 on approved leave</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Pending Leave Requests</span>
                  </div>
                  <div className="stat-card-value">
                    {leaveRequests.filter((r) => r.status === "Pending").length} Action Needed
                  </div>
                  <div className="stat-card-footer">
                    <span className="badge badge-pending">Approval Required</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Monthly Payroll Run</span>
                  </div>
                  <div className="stat-card-value">$19,300.00</div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Ready for Aug 28</span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                {/* Department Distribution Chart */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Department Distribution</h3>
                  </div>
                  <div style={{ padding: "10px 0" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                        <span>Software Engineering (75%)</span>
                        <strong>3 Staff</strong>
                      </div>
                      <div style={{ height: "8px", width: "100%", borderRadius: "4px", background: "var(--bg-app)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: "75%", background: "var(--primary)", borderRadius: "4px" }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                        <span>Human Resources (25%)</span>
                        <strong>1 Staff</strong>
                      </div>
                      <div style={{ height: "8px", width: "100%", borderRadius: "4px", background: "var(--bg-app)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: "25%", background: "var(--warning)", borderRadius: "4px" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Punctuality Trends */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Weekly Punctuality Rate</h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "130px", paddingTop: "20px" }}>
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => {
                      const heights = [80, 95, 100, 90, 85];
                      return (
                        <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                          <div style={{ height: `${heights[idx]}%`, width: "100%", maxWidth: "28px", background: "var(--primary)", borderRadius: "4px 4px 0 0" }} />
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYEE DIRECTORY */}
          {activeTab === "directory" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Employee Roster & Directory</h1>
                  <p>Manage corporate workforce profiles, roles, departments, and compensation.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <select className="form-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={{ width: "170px" }}>
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                  <button className="btn btn-primary" onClick={() => setShowAddEmpModal(true)}>
                    Add New Staff
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>Role Title</th>
                        <th>Department</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Performance Score</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.id}>
                          <td><strong>{emp.id}</strong></td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{emp.name}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{emp.email}</div>
                          </td>
                          <td>{emp.title}</td>
                          <td><span className="badge badge-info">{emp.dept}</span></td>
                          <td>{emp.location}</td>
                          <td><span className={`badge ${emp.status === "Active" ? "badge-active" : "badge-pending"}`}>{emp.status}</span></td>
                          <td>{emp.score}</td>
                          <td>
                            <button className="btn btn-sm btn-secondary" onClick={() => setSelectedEmpDossier(emp)}>
                              View Dossier
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPANY ATTENDANCE */}
          {activeTab === "attendance" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Company Attendance Monitoring</h1>
                  <p>Real-time shift logs, punctuality metrics, and overtime tracking across departments.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Today's Shift Logs ({new Date().toISOString().split("T")[0]})</h3>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Emp ID</th>
                        <th>Employee Name</th>
                        <th>Clock In Time</th>
                        <th>Clock Out Time</th>
                        <th>Shift Hours</th>
                        <th>Overtime</th>
                        <th>Punctuality Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((rec) => (
                        <tr key={rec.id}>
                          <td><strong>{rec.empId}</strong></td>
                          <td>{rec.name}</td>
                          <td>{rec.in}</td>
                          <td>{rec.out}</td>
                          <td>{rec.total}</td>
                          <td>{rec.overtime}</td>
                          <td>
                            <span className={`badge ${rec.status === "On Time" ? "badge-ontime" : "badge-late"}`}>
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAVE APPROVALS */}
          {activeTab === "leave" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Leave Approval Queue</h1>
                  <p>Review staff time-off applications and execute manager approvals.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Applications Requiring Action</h3>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Leave Type</th>
                        <th>Dates</th>
                        <th>Days</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Action Buttons</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((req) => (
                        <tr key={req.id}>
                          <td><strong>{req.name || req.employee}</strong></td>
                          <td>{req.type}</td>
                          <td>{req.dates}</td>
                          <td>{req.days} Day(s)</td>
                          <td>{req.reason}</td>
                          <td>
                            <span className={`badge ${req.status === "Approved" ? "badge-approved" : req.status === "Pending" ? "badge-pending" : "badge-rejected"}`}>
                              {req.status}
                            </span>
                          </td>
                          <td>
                            {req.status === "Pending" ? (
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button className="btn btn-sm btn-success" onClick={() => onUpdateStatus(req.id, "Approved")}>
                                  Approve
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => onUpdateStatus(req.id, "Rejected")}>
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAYROLL & CLAIMS ADMIN */}
          {activeTab === "payroll" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Payroll & Reimbursement Admin</h1>
                  <p>Audit employee expense claims and execute monthly salary disbursements.</p>
                </div>
                <button className="btn btn-primary" onClick={() => alert("Processing Monthly Payroll Batch...")}>
                  Process Payroll Batch
                </button>
              </div>

              <div className="card" style={{ marginBottom: "20px" }}>
                <div className="card-header">
                  <h3 className="card-title">Expense Reimbursement Claims Queue</h3>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((c) => (
                        <tr key={c.id}>
                          <td><strong>{c.name || c.employee}</strong></td>
                          <td>{c.category}</td>
                          <td style={{ fontWeight: 700 }}>{c.amount}</td>
                          <td>{c.date}</td>
                          <td>{c.description}</td>
                          <td>
                            <span className={`badge ${c.status === "Approved" ? "badge-approved" : "badge-pending"}`}>
                              {c.status}
                            </span>
                          </td>
                          <td>
                            {c.status === "Pending" ? (
                              <button className="btn btn-sm btn-success" onClick={() => onUpdateClaimStatus(c.id, "Approved")}>
                                Approve & Pay
                              </button>
                            ) : (
                              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Approved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HELPDESK QUEUE */}
          {activeTab === "helpdesk" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>IT & Operations Support Queue</h1>
                  <p>Assign open tickets to engineers and resolve workforce technical bottlenecks.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Logged Support Tickets</h3>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Requester</th>
                        <th>Subject</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr key={t.id}>
                          <td><strong>{t.id}</strong></td>
                          <td>{t.name}</td>
                          <td>{t.subject}</td>
                          <td>{t.category}</td>
                          <td><span className={`badge ${t.priority === "High" ? "badge-high" : "badge-medium"}`}>{t.priority}</span></td>
                          <td>{t.assignedTo || "Unassigned"}</td>
                          <td><span className="badge badge-info">{t.status}</span></td>
                          <td>
                            {t.status !== "Resolved" ? (
                              <button className="btn btn-sm btn-primary" onClick={() => onUpdateTicketStatus(t.id, "Resolved")}>
                                Mark Resolved
                              </button>
                            ) : (
                              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Closed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Company Broadcast Announcements</h1>
                  <p>Publish policy notices, townhall details, and general company updates.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAnnounceModal(true)}>
                  Post New Notice
                </button>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Active Broadcast Notices</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {announcements.map((ann) => (
                    <div key={ann.id} style={{ padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 700 }}>{ann.title}</h3>
                        <span className="badge badge-pending">{ann.type}</span>
                      </div>
                      <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "8px" }}>{ann.content}</p>
                      <div style={{ fontSize: "11px", color: "var(--text-light)" }}>Published on {ann.date} by HR Admin</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ANALYTICS & REPORTS */}
          {activeTab === "reports" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Executive HR Analytics & Reports</h1>
                  <p>Export workforce audit reports, attendance logs, and payroll summaries.</p>
                </div>
                <button className="btn btn-primary" onClick={() => alert("Exporting Enterprise HR Audit Report...")}>
                  Export Audit Log
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-card-label">Monthly Retention Rate</span>
                  <div className="stat-card-value">98.5%</div>
                  <div className="stat-card-footer">Low voluntary turnover</div>
                </div>
                <div className="stat-card">
                  <span className="stat-card-label">Avg Ticket Resolution</span>
                  <div className="stat-card-value">4.2 Hours</div>
                  <div className="stat-card-footer">Within SLA target</div>
                </div>
                <div className="stat-card">
                  <span className="stat-card-label">Leave Utilization</span>
                  <div className="stat-card-value">28% Used</div>
                  <div className="stat-card-footer">Healthy leave balances</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}

      {/* Onboard Employee Modal */}
      {showAddEmpModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Onboard New Employee</h3>
              <button style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setShowAddEmpModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="Jane Doe" value={newEmpForm.name} onChange={(e) => setNewEmpForm({ ...newEmpForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Corporate Email</label>
                  <input type="email" className="form-input" placeholder="jane.doe@nexus.com" value={newEmpForm.email} onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input type="text" className="form-input" placeholder="Frontend Developer" value={newEmpForm.title} onChange={(e) => setNewEmpForm({ ...newEmpForm, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="form-select" value={newEmpForm.dept} onChange={(e) => setNewEmpForm({ ...newEmpForm, dept: e.target.value })}>
                      <option>Engineering</option>
                      <option>Human Resources</option>
                      <option>Finance & Accounting</option>
                      <option>Sales & Marketing</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddEmpModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Onboard Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Announcement Modal */}
      {showAnnounceModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Post Broadcast Announcement</h3>
              <button style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setShowAnnounceModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddAnn}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-input" placeholder="Notice title..." value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency Type</label>
                  <select className="form-select" value={annForm.type} onChange={(e) => setAnnForm({ ...annForm, type: e.target.value })}>
                    <option>Important</option>
                    <option>General Notice</option>
                    <option>Policy Update</option>
                    <option>Social Event</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Announcement Content</label>
                  <textarea className="form-textarea" rows="4" placeholder="Detailed message for all staff..." value={annForm.content} onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAnnounceModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Broadcast Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Dossier Drawer/Modal */}
      {selectedEmpDossier && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Employee Dossier - {selectedEmpDossier.name}</h3>
              <button style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setSelectedEmpDossier(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "16px" }}>
                <div className="avatar-circle" style={{ width: "50px", height: "50px", fontSize: "18px" }}>{selectedEmpDossier.name.substring(0, 2).toUpperCase()}</div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{selectedEmpDossier.name}</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{selectedEmpDossier.title} • {selectedEmpDossier.dept}</p>
                </div>
              </div>

              <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div><strong>Employee ID:</strong> {selectedEmpDossier.id}</div>
                <div><strong>Email:</strong> {selectedEmpDossier.email}</div>
                <div><strong>Location:</strong> {selectedEmpDossier.location}</div>
                <div><strong>Monthly Salary:</strong> {selectedEmpDossier.salary}</div>
                <div><strong>Quarterly Rating:</strong> {selectedEmpDossier.score}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedEmpDossier(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
