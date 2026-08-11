import React, { useState, useEffect } from "react";

export default function ESSDashboard({
  profile,
  theme,
  onToggleTheme,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (attendanceStatus?.isClockedIn) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [attendanceStatus?.isClockedIn]);

  const formatTimer = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile data
  const [employee, setEmployee] = useState({
    name: profile?.name || "Udeh Kosisochukwu Emmanuel",
    id: "EMP-2026-042",
    title: "Software Developer Intern",
    department: profile?.department || "Software Engineering",
    email: profile?.email || "udeh.emmanuel@nexus.com",
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

  // Forms State
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
    receiptName: "",
  });

  const [ticketForm, setTicketForm] = useState({
    category: "IT Hardware",
    priority: "Medium",
    subject: "",
    details: "",
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    setEmployee(editProfileForm);
    setIsEditingProfile(false);
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate) return;
    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    onSubmitLeave({
      type: leaveForm.type,
      dates: `${leaveForm.startDate} - ${leaveForm.endDate}`,
      days,
      reason: leaveForm.reason,
    });
    setLeaveForm({ type: "Annual Leave", startDate: "", endDate: "", reason: "" });
    setShowLeaveModal(false);
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimForm.amount) return;
    onSubmitClaim(claimForm);
    setClaimForm({ category: "Internet & Data Allowance", amount: "", description: "", receiptName: "" });
    setShowClaimModal(false);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject) return;
    onAddTicket(ticketForm);
    setTicketForm({ category: "IT Hardware", priority: "Medium", subject: "", details: "" });
    setShowTicketModal(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard Overview" },
    { id: "profile", label: "Personnel Profile" },
    { id: "attendance", label: "Shift Attendance" },
    { id: "leave", label: "Leave Manager" },
    { id: "payroll", label: "Payroll & Payslips" },
    { id: "claims", label: "Reimbursements" },
    { id: "helpdesk", label: "IT & HR Helpdesk" },
    { id: "hmo", label: "HMO & Benefits" },
    { id: "performance", label: "Performance & OKRs" },
  ];

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
            <div className="sidebar-brand-logo">N</div>
            <div className="sidebar-brand-text">
              <h2>Nexus ERP</h2>
              <p>Employee Portal</p>
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
            <div className="avatar-circle">UK</div>
            <div className="user-profile-info">
              <div className="user-profile-name">{employee.name}</div>
              <div className="user-profile-role">{employee.title}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
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
              Employee Portal
            </div>
          </div>

          <div className="top-navbar-right">
            {/* Live Clock Button in Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 10px", borderRadius: "var(--radius-sm)", background: attendanceStatus?.isClockedIn ? "var(--success-light)" : "var(--bg-app)", border: "1px solid var(--border-color)", fontSize: "12px", fontWeight: 600 }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: attendanceStatus?.isClockedIn ? "var(--success)" : "var(--text-muted)", display: "inline-block" }} />
              <span style={{ whiteSpace: "nowrap" }}>{attendanceStatus?.isClockedIn ? `Shift (${formatTimer(elapsedSeconds)})` : "Off Shift"}</span>
              <button
                className={`btn btn-sm ${attendanceStatus?.isClockedIn ? "btn-danger" : "btn-primary"}`}
                onClick={onClockToggle}
                style={{ padding: "3px 8px", fontSize: "11px" }}
              >
                {attendanceStatus?.isClockedIn ? "Clock Out" : "Clock In"}
              </button>
            </div>

            <button className="theme-toggle-btn" onClick={onToggleTheme}>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Welcome, {employee.name.split(" ")[0]}</h1>
                  <p>Here is your daily operational summary and workspace shortcuts.</p>
                </div>
                <div>
                  <button className="btn btn-primary" onClick={() => setShowLeaveModal(true)}>
                    Apply for Leave
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Shift Status</span>
                  </div>
                  <div className="stat-card-value">
                    {attendanceStatus?.isClockedIn ? formatTimer(elapsedSeconds) : "00:00:00"}
                  </div>
                  <div className="stat-card-footer">
                    <span className={`badge ${attendanceStatus?.isClockedIn ? "badge-approved" : "badge-pending"}`}>
                      {attendanceStatus?.isClockedIn ? "Active Shift" : "Off Shift"}
                    </span>
                    <span>Started at {attendanceStatus?.clockInTime || "—"}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Annual Leave Balance</span>
                  </div>
                  <div className="stat-card-value">15 Days</div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">75% Available</span>
                    <span>Out of 20 days entitlement</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Pending Reimbursements</span>
                  </div>
                  <div className="stat-card-value">$150.00</div>
                  <div className="stat-card-footer">
                    <span>1 claim under review</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Support Tickets</span>
                  </div>
                  <div className="stat-card-value">1 Open</div>
                  <div className="stat-card-footer">
                    <span className="badge badge-info">In Progress</span>
                    <span>TCK-401 Battery</span>
                  </div>
                </div>
              </div>

              {/* Grid 2 Column Content */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "24px" }}>
                {/* Announcements */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Company Announcements</h3>
                    <span className="badge badge-info">{announcements.length} Notices</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {announcements.map((ann) => (
                      <div key={ann.id} style={{ padding: "12px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>{ann.title}</h4>
                          <span className="badge badge-pending">{ann.type}</span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>{ann.content}</p>
                        <div style={{ fontSize: "11px", color: "var(--text-light)" }}>Posted on {ann.date} by {ann.author || "HR Operations"}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action Shortcuts */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Quick Actions</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button className="btn btn-secondary" style={{ justifyContent: "flex-start" }} onClick={() => setShowLeaveModal(true)}>
                      Apply for Time Off
                    </button>
                    <button className="btn btn-secondary" style={{ justifyContent: "flex-start" }} onClick={() => setShowClaimModal(true)}>
                      Submit Reimbursement
                    </button>
                    <button className="btn btn-secondary" style={{ justifyContent: "flex-start" }} onClick={() => setShowTicketModal(true)}>
                      Log Support Ticket
                    </button>
                    <button className="btn btn-secondary" style={{ justifyContent: "flex-start" }} onClick={() => setActiveTab("payroll")}>
                      View Payslip Statement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONNEL PROFILE */}
          {activeTab === "profile" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Personnel Profile</h1>
                  <p>Manage personal credentials, banking details, and emergency contact info.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsEditingProfile(true)}>
                  Edit Profile Info
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
                {/* ID Card Box */}
                <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
                  <div className="avatar-circle" style={{ width: "80px", height: "80px", fontSize: "28px", margin: "0 auto 14px" }}>
                    UK
                  </div>
                  <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-main)" }}>{employee.name}</h2>
                  <p style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 600, marginTop: "2px" }}>{employee.title}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{employee.department}</p>
                  
                  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border-color)", textAlign: "left", fontSize: "12.5px" }}>
                    <div style={{ marginBottom: "8px" }}><strong>Employee ID:</strong> {employee.id}</div>
                    <div style={{ marginBottom: "8px" }}><strong>Joined Date:</strong> {employee.joinDate}</div>
                    <div style={{ marginBottom: "8px" }}><strong>Reporting Manager:</strong> {employee.manager}</div>
                    <div><strong>Work Location:</strong> {employee.location}</div>
                  </div>
                </div>

                {/* Details Tab Cards */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Employment & Personal Details</h3>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <span className="form-label">Email Address</span>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>{employee.email}</div>
                    </div>
                    <div className="form-group">
                      <span className="form-label">Phone Number</span>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>{employee.phone}</div>
                    </div>
                    <div className="form-group">
                      <span className="form-label">Bank Institution</span>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>{employee.bankName}</div>
                    </div>
                    <div className="form-group">
                      <span className="form-label">Account Number</span>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>{employee.accountNumber}</div>
                    </div>
                    <div className="form-group">
                      <span className="form-label">Tax Identification (TIN)</span>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>{employee.taxId}</div>
                    </div>
                    <div className="form-group">
                      <span className="form-label">Pension PIN</span>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>{employee.pensionPin}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SHIFT ATTENDANCE */}
          {activeTab === "attendance" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Shift Attendance & Time Tracking</h1>
                  <p>Log daily shift check-ins, view overtime, and verify punctuality score.</p>
                </div>
              </div>

              <div className="card" style={{ marginBottom: "20px" }}>
                <div className="card-header">
                  <h3 className="card-title">Live Shift Control</h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Current Shift Elapsed Duration</div>
                    <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.8px" }}>
                      {attendanceStatus?.isClockedIn ? formatTimer(elapsedSeconds) : "00:00:00"}
                    </div>
                  </div>
                  <button
                    className={`btn ${attendanceStatus?.isClockedIn ? "btn-danger" : "btn-primary"}`}
                    onClick={onClockToggle}
                    style={{ padding: "10px 20px", fontSize: "14px" }}
                  >
                    {attendanceStatus?.isClockedIn ? "Clock Out of Shift" : "Clock In to Shift"}
                  </button>
                </div>
              </div>

              {/* Attendance Log Table */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Attendance History Log</h3>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Total Hours</th>
                        <th>Overtime</th>
                        <th>Punctuality Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((r) => (
                        <tr key={r.id}>
                          <td>{r.date}</td>
                          <td>{r.in}</td>
                          <td>{r.out}</td>
                          <td>{r.total}</td>
                          <td>{r.overtime}</td>
                          <td>
                            <span className={`badge ${r.status === "On Time" ? "badge-ontime" : "badge-late"}`}>
                              {r.status}
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

          {/* TAB 4: LEAVE MANAGER */}
          {activeTab === "leave" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Leave Management</h1>
                  <p>Apply for time-off, check remaining entitlements, and track request status.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowLeaveModal(true)}>
                  Request New Leave
                </button>
              </div>

              {/* Entitlement Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-card-label">Annual Leave Balance</span>
                  <div className="stat-card-value">15 Days</div>
                  <div className="stat-card-footer">5 used out of 20 days</div>
                </div>
                <div className="stat-card">
                  <span className="stat-card-label">Sick Leave Balance</span>
                  <div className="stat-card-value">5 Days</div>
                  <div className="stat-card-footer">0 used out of 5 days</div>
                </div>
                <div className="stat-card">
                  <span className="stat-card-label">Casual / Emergency</span>
                  <div className="stat-card-value">3 Days</div>
                  <div className="stat-card-footer">0 used out of 3 days</div>
                </div>
              </div>

              {/* Leave Table */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Leave Request History</h3>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>Dates</th>
                        <th>Duration</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((req) => (
                        <tr key={req.id}>
                          <td><strong>{req.type}</strong></td>
                          <td>{req.dates}</td>
                          <td>{req.days} Day(s)</td>
                          <td>{req.reason}</td>
                          <td>
                            <span className={`badge ${req.status === "Approved" ? "badge-approved" : req.status === "Pending" ? "badge-pending" : "badge-rejected"}`}>
                              {req.status}
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

          {/* TAB 5: PAYROLL & PAYSLIPS */}
          {activeTab === "payroll" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Payroll & Payslips</h1>
                  <p>View monthly disbursement slips, tax breakdowns, and pension logs.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Issued Payslip Statements</h3>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Pay Period</th>
                        <th>Disbursement Date</th>
                        <th>Gross Earnings</th>
                        <th>Tax & Deductions</th>
                        <th>Net Payout</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.month}</strong></td>
                          <td>{p.payDate}</td>
                          <td>{p.gross}</td>
                          <td>{p.tax}</td>
                          <td style={{ color: "var(--success)", fontWeight: 700 }}>{p.net}</td>
                          <td><span className="badge badge-paid">Paid</span></td>
                          <td>
                            <button className="btn btn-sm btn-secondary" onClick={() => setSelectedPayslip(p)}>
                              View Statement
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

          {/* TAB 6: REIMBURSEMENTS */}
          {activeTab === "claims" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Expense Reimbursements</h1>
                  <p>Submit work-related claims with receipt upload simulation for approval.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowClaimModal(true)}>
                  Submit Expense Claim
                </button>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Submitted Reimbursements</h3>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date Submitted</th>
                        <th>Description</th>
                        <th>Attachment</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((c) => (
                        <tr key={c.id}>
                          <td><strong>{c.category}</strong></td>
                          <td style={{ fontWeight: 700 }}>{c.amount}</td>
                          <td>{c.date}</td>
                          <td>{c.description}</td>
                          <td>{c.receipt || "attachment.pdf"}</td>
                          <td>
                            <span className={`badge ${c.status === "Approved" ? "badge-approved" : "badge-pending"}`}>
                              {c.status}
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

          {/* TAB 7: HELPDESK */}
          {activeTab === "helpdesk" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>IT & HR Support Helpdesk</h1>
                  <p>Log technical hardware issues, access requests, or HR operational inquiries.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowTicketModal(true)}>
                  Create New Ticket
                </button>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Active Support Tickets</h3>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Subject</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Date Logged</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr key={t.id}>
                          <td><strong>{t.id}</strong></td>
                          <td>{t.subject}</td>
                          <td>{t.category}</td>
                          <td><span className={`badge ${t.priority === "High" ? "badge-high" : "badge-medium"}`}>{t.priority}</span></td>
                          <td>{t.date}</td>
                          <td>{t.assignedTo || "Helpdesk Queue"}</td>
                          <td><span className="badge badge-info">{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: HMO & BENEFITS */}
          {activeTab === "hmo" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>HMO & Healthcare Benefits</h1>
                  <p>Access your corporate health insurance policy, enrollee ID card, and hospital directory.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Virtual Card */}
                <div className="card" style={{ backgroundColor: "#0f172a", color: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700 }}>AXA MANSARD HEALTH</h3>
                      <p style={{ fontSize: "11px", color: "#94a3b8" }}>Corporate Platinum Tier 2 Policy</p>
                    </div>
                  </div>

                  <div style={{ fontSize: "18px", letterSpacing: "1.5px", fontWeight: 700, marginBottom: "20px" }}>
                    AXM-2026-042-99
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8" }}>
                    <div>
                      <div>ENROLLEE NAME</div>
                      <div style={{ color: "#fff", fontWeight: 600 }}>{employee.name}</div>
                    </div>
                    <div>
                      <div>PRIMARY HOSPITAL</div>
                      <div style={{ color: "#fff", fontWeight: 600 }}>Evercare Hospital, PH</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Policy Entitlements Summary</h3>
                  </div>
                  <ul style={{ listStyle: "none", fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <li>• <strong>Inpatient Care:</strong> 100% Covered (Private Ward)</li>
                    <li>• <strong>Outpatient Consultations:</strong> Unlimited Visits</li>
                    <li>• <strong>Prescription Drugs:</strong> Covered (Generic & Branded)</li>
                    <li>• <strong>Dental & Optical Allowance:</strong> $500 Annual Cap</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PERFORMANCE */}
          {activeTab === "performance" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Performance & Quarterly OKRs</h1>
                  <p>Track your quarterly key deliverables, mentor feedback, and review scores.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-card-label">Task Completion Rate</span>
                  <div className="stat-card-value">93%</div>
                  <div className="stat-card-footer">45 of 48 sprint tasks done</div>
                </div>
                <div className="stat-card">
                  <span className="stat-card-label">Punctuality Score</span>
                  <div className="stat-card-value">97%</div>
                  <div className="stat-card-footer">Top 5% in Engineering</div>
                </div>
                <div className="stat-card">
                  <span className="stat-card-label">Q2 Manager Rating</span>
                  <div className="stat-card-value">4.5 / 5.0</div>
                  <div className="stat-card-footer">Exceeds Expectations</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Apply for Time Off</h3>
              <button style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setShowLeaveModal(false)}>✕</button>
            </div>
            <form onSubmit={handleLeaveSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Leave Category</label>
                  <select className="form-select" value={leaveForm.type} onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}>
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-input" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="date" className="form-input" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason for Request</label>
                  <textarea className="form-textarea" rows="3" placeholder="Provide context..." value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeaveModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Leave Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Claim Modal */}
      {showClaimModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Submit Expense Reimbursement</h3>
              <button style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setShowClaimModal(false)}>✕</button>
            </div>
            <form onSubmit={handleClaimSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Expense Category</label>
                  <select className="form-select" value={claimForm.category} onChange={(e) => setClaimForm({ ...claimForm, category: e.target.value })}>
                    <option>Internet & Data Allowance</option>
                    <option>Client Travel / Taxi</option>
                    <option>Office Software & Tooling</option>
                    <option>Team Lunch & Catering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Claim Amount ($)</label>
                  <input type="text" className="form-input" placeholder="e.g. 150.00" value={claimForm.amount} onChange={(e) => setClaimForm({ ...claimForm, amount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description & Purpose</label>
                  <textarea className="form-textarea" rows="2" placeholder="Detail the business expense..." value={claimForm.description} onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Receipt File Upload</label>
                  <input type="file" className="form-input" onChange={(e) => setClaimForm({ ...claimForm, receiptName: e.target.files[0]?.name })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowClaimModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Create Support Ticket</h3>
              <button style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setShowTicketModal(false)}>✕</button>
            </div>
            <form onSubmit={handleTicketSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={ticketForm.category} onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}>
                      <option>IT Hardware</option>
                      <option>Network & VPN Security</option>
                      <option>Software & License Access</option>
                      <option>HR & Benefits Inquiry</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority Level</label>
                    <select className="form-select" value={ticketForm.priority} onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-input" placeholder="Short description of issue..." value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea className="form-textarea" rows="3" placeholder="Provide reproduction steps or exact device details..." value={ticketForm.details} onChange={(e) => setTicketForm({ ...ticketForm, details: e.target.value })} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTicketModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Log Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {selectedPayslip && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Payslip Statement - {selectedPayslip.month}</h3>
              <button style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setSelectedPayslip(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ padding: "14px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>EMPLOYEE NAME</div>
                <div style={{ fontSize: "15px", fontWeight: 700 }}>{employee.name} ({employee.id})</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Gross Salary:</span>
                  <strong>{selectedPayslip.gross}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--danger)" }}>
                  <span>Income Tax (PAYE):</span>
                  <span>- {selectedPayslip.tax}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--danger)" }}>
                  <span>Pension Contribution (8%):</span>
                  <span>- {selectedPayslip.pension}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--danger)" }}>
                  <span>Medical Insurance Premium:</span>
                  <span>- {selectedPayslip.medical || "$50.00"}</span>
                </div>
                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 700 }}>
                  <span>Net Disbursed Salary:</span>
                  <span style={{ color: "var(--success)" }}>{selectedPayslip.net}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedPayslip(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => alert("Downloading PDF Statement...")}>Download Statement</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Edit Personnel Information</h3>
              <button style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setIsEditingProfile(false)}>✕</button>
            </div>
            <form onSubmit={handleProfileSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-input" value={editProfileForm.phone} onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Bank Name</label>
                  <input type="text" className="form-input" value={editProfileForm.bankName} onChange={(e) => setEditProfileForm({ ...editProfileForm, bankName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Account Number</label>
                  <input type="text" className="form-input" value={editProfileForm.accountNumber} onChange={(e) => setEditProfileForm({ ...editProfileForm, accountNumber: e.target.value })} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
