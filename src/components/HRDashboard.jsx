import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  DollarSign,
  LifeBuoy,
  Megaphone,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  CheckCircle2,
  XCircle,
  CreditCard,
  UserCheck,
  FileText,
  Building,
  ShieldCheck,
  UserPlus,
  Layers,
  LogOut,
  Briefcase
} from "lucide-react";

export default function HRDashboard({
  profile,
  employees = [],
  onAddEmployee,
  theme,
  onToggleTheme,
  onLogout,
  leaveRequests,
  onUpdateStatus,
  announcements,
  onAddAnnouncement,
  claims,
  onUpdateClaimStatus,
  attendanceRecords,
  tickets,
  onUpdateTicketStatus,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptFilter, setDeptFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
    role: "employee",
    password: "password123",
  });

  const [annForm, setAnnForm] = useState({
    title: "",
    type: "Important",
    content: "",
  });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmpForm.name || !newEmpForm.email) return;
    if (onAddEmployee) {
      onAddEmployee({
        name: newEmpForm.name.trim(),
        title: newEmpForm.title.trim() || "Staff Member",
        department: newEmpForm.dept,
        email: newEmpForm.email.trim().toLowerCase(),
        salary: newEmpForm.salary.trim(),
        location: newEmpForm.location.trim(),
        role: newEmpForm.role || "employee",
        password: newEmpForm.password || "password123",
      });
    }
    setNewEmpForm({ name: "", title: "", dept: "Engineering", email: "", salary: "$4,000/mo", location: "Port Harcourt", role: "employee", password: "password123" });
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
    { id: "overview", label: "Command Center", icon: LayoutDashboard },
    { id: "directory", label: "Employee Roster", icon: Users, badge: employees.length },
    { id: "attendance", label: "Company Attendance", icon: Clock },
    { id: "leave", label: "Leave Approvals", icon: CalendarCheck, badge: leaveRequests.filter(r => r.status === "Pending").length || null },
    { id: "payroll", label: "Payroll & Claims", icon: DollarSign, badge: claims.filter(c => c.status === "Pending").length || null },
    { id: "tickets", label: "Helpdesk Queue", icon: LifeBuoy, badge: tickets.filter(t => t.status === "In Progress").length || null },
    { id: "announcements", label: "Broadcasts", icon: Megaphone },
  ];

  const filteredEmployees = employees.filter((emp) => {
    const deptName = emp.dept || emp.department;
    const matchesDept = deptFilter === "All" || deptName === deptFilter;
    const matchesSearch =
      (emp.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.id || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const pendingLeaves = leaveRequests.filter((r) => r.status === "Pending");
  const pendingClaimsList = claims.filter((c) => c.status === "Pending");

  return (
    <div className="app-container">
      {/* Mobile Drawer Overlay */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? "is-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-wrapper">
            <div className="sidebar-brand-mark">M</div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">MONOLITH</span>
              <span className="sidebar-brand-sub">HR & Ops Admin</span>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-section-title">ADMINISTRATION</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon className="nav-item-icon" />
                <span>{item.label}</span>
                {item.badge && <span className="nav-item-badge">{item.badge}</span>}
              </button>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div className="user-profile-tile">
            <div className="user-avatar-initials">
              {(profile?.name || "HR Admin").split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="user-profile-meta">
              <div className="user-profile-name">{profile?.name || "Victoria Sterling"}</div>
              <div className="user-profile-role">{profile?.title || "People Operations Lead"}</div>
            </div>
            <button
              className="btn btn-ghost btn-icon-only"
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign out"
              style={{ width: "30px", height: "30px", padding: "4px" }}
            >
              <LogOut size={15} color="var(--danger)" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="main-wrapper">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="top-navbar-left">
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <Menu size={18} />
            </button>
            <div className="top-navbar-breadcrumb">
              <span>Admin</span>
              <span>/</span>
              <span className="current">{navItems.find(n => n.id === activeTab)?.label}</span>
            </div>
          </div>

          <div className="top-navbar-right">
            <span className="badge badge-neutral" style={{ fontSize: "11px" }}>
              <ShieldCheck size={13} color="var(--success)" />
              <span>Admin Console</span>
            </span>

            <button
              className="btn btn-secondary btn-icon-only"
              onClick={onToggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Logout Button */}
            <button
              className="btn btn-secondary btn-icon-only"
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* TAB 1: COMMAND CENTER / OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>HR Executive Command Center</h1>
                  <p>Workforce metrics, pending approvals, claims processing, and team health.</p>
                </div>
                <div className="page-actions">
                  <button className="btn btn-primary" onClick={() => setShowAddEmpModal(true)}>
                    <UserPlus size={14} />
                    <span>Onboard Employee</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowAnnounceModal(true)}>
                    <Megaphone size={14} />
                    <span>Broadcast Message</span>
                  </button>
                </div>
              </div>

              {/* Stats Metrics Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Total Headcount</span>
                    <div className="stat-icon-wash indigo">
                      <Users size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{employees.length}</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "100%", backgroundColor: "var(--brand-indigo)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">100% Active</span>
                    <span>Engineering & HR</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Pending Leave Queue</span>
                    <div className="stat-icon-wash amber">
                      <CalendarCheck size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{pendingLeaves.length}</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: pendingLeaves.length > 0 ? "60%" : "0%", backgroundColor: "var(--warning)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className={`trend-badge ${pendingLeaves.length > 0 ? "neutral" : "up"}`}>
                      {pendingLeaves.length > 0 ? "Action Required" : "Up to date"}
                    </span>
                    <span>Requests pending</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Pending Reimbursements</span>
                    <div className="stat-icon-wash rose">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">
                    ${pendingClaimsList.reduce((acc, c) => acc + parseInt(c.amount.replace(/[^0-9]/g, "") || 0), 0)}
                  </div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "45%", backgroundColor: "var(--danger)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span>{pendingClaimsList.length} claims awaiting review</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Open Support Tickets</span>
                    <div className="stat-icon-wash sky">
                      <LifeBuoy size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">
                    {tickets.filter(t => t.status === "In Progress").length}
                  </div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "50%", backgroundColor: "var(--info)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge neutral">IT & HR</span>
                    <span>Average resolution: 4 hrs</span>
                  </div>
                </div>
              </div>

              {/* Actionable Feeds */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", marginBottom: "20px" }}>
                {/* Pending Leave Approvals */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <CalendarCheck size={15} />
                      <span>Pending Leave Approvals</span>
                    </span>
                    <span className="card-subtitle">{pendingLeaves.length} awaiting action</span>
                  </div>
                  {pendingLeaves.length === 0 ? (
                    <div style={{ padding: "24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
                      <CheckCircle2 size={24} color="var(--success)" style={{ margin: "0 auto 8px" }} />
                      <p>All leave applications have been reviewed.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {pendingLeaves.map((req) => (
                        <div
                          key={req.id}
                          style={{
                            padding: "14px",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--bg-surface-elevated)",
                            border: "1px solid var(--border-subtle)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                                {req.name || req.employee}
                              </div>
                              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                {req.type} • {req.dates} ({req.days} days)
                              </div>
                            </div>
                            <span className="badge badge-pending">Pending</span>
                          </div>
                          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontStyle: "italic" }}>
                            "{req.reason}"
                          </div>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                            <button
                              className="btn btn-danger-ghost btn-sm"
                              onClick={() => onUpdateStatus(req.id, "Rejected")}
                            >
                              <XCircle size={14} />
                              <span>Reject</span>
                            </button>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => onUpdateStatus(req.id, "Approved")}
                            >
                              <CheckCircle2 size={14} />
                              <span>Approve</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Expense Claims */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <DollarSign size={15} />
                      <span>Reimbursement Verification Queue</span>
                    </span>
                    <span className="card-subtitle">{pendingClaimsList.length} claims</span>
                  </div>
                  {pendingClaimsList.length === 0 ? (
                    <div style={{ padding: "24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
                      <CheckCircle2 size={24} color="var(--success)" style={{ margin: "0 auto 8px" }} />
                      <p>All reimbursement claims verified.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {pendingClaimsList.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            padding: "14px",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--bg-surface-elevated)",
                            border: "1px solid var(--border-subtle)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                                {c.name || c.employee}
                              </div>
                              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                {c.category} • {c.date}
                              </div>
                            </div>
                            <span style={{ fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                              {c.amount}
                            </span>
                          </div>
                          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                            {c.description}
                          </div>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                            <button
                              className="btn btn-danger-ghost btn-sm"
                              onClick={() => onUpdateClaimStatus(c.id, "Rejected")}
                            >
                              <XCircle size={14} />
                              <span>Reject</span>
                            </button>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => onUpdateClaimStatus(c.id, "Approved")}
                            >
                              <CheckCircle2 size={14} />
                              <span>Authorize Payout</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYEE ROSTER & DIRECTORY */}
          {activeTab === "directory" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Employee Roster & Organizational Directory</h1>
                  <p>Manage staff profiles, department assignments, compensation, and performance dossiers.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddEmpModal(true)}>
                  <UserPlus size={14} />
                  <span>Onboard New Employee</span>
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                <div className="segment-tabs" style={{ overflowX: "auto", maxWidth: "100%" }}>
                  {["All", "Engineering", "Human Resources"].map((dept) => (
                    <button
                      key={dept}
                      className={`segment-tab-btn ${deptFilter === dept ? "active" : ""}`}
                      onClick={() => setDeptFilter(dept)}
                    >
                      {dept}
                    </button>
                  ))}
                </div>

                <div className="search-input-wrapper">
                  <Search className="search-input-icon" />
                  <input
                    type="text"
                    className="form-input search-input"
                    placeholder="Search by name, ID, or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "240px" }}
                  />
                </div>
              </div>

              <div className="card">
                {/* Desktop Table */}
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Job Title</th>
                        <th>Department</th>
                        <th>Location</th>
                        <th>Compensation</th>
                        <th>Performance Score</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{emp.id}</td>
                          <td>
                            <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{emp.name}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{emp.email}</div>
                          </td>
                          <td>{emp.title}</td>
                          <td>{emp.dept || emp.department}</td>
                          <td>{emp.location}</td>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{emp.salary || "$3,500/mo"}</td>
                          <td>
                            <span className="trend-badge up">{emp.score || "4.5 / 5.0"}</span>
                          </td>
                          <td>
                            <span className={`badge ${emp.status === "Active" ? "badge-approved" : "badge-neutral"}`}>
                              <span className="badge-dot" />
                              <span>{emp.status || "Active"}</span>
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setSelectedEmpDossier(emp)}
                            >
                              <FileText size={13} />
                              <span>Dossier</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List */}
                <div className="mobile-card-list">
                  {filteredEmployees.map((emp) => (
                    <div key={emp.id} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 700 }}>{emp.name}</div>
                          <div style={{ fontSize: "11.5px", color: "var(--text-tertiary)" }}>{emp.id} • {emp.title}</div>
                        </div>
                        <span className="badge badge-approved">{emp.status || "Active"}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Department</span>
                        <span className="mobile-data-card-val">{emp.dept || emp.department}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Compensation</span>
                        <span className="mobile-data-card-val" style={{ fontFamily: "var(--font-mono)" }}>{emp.salary || "$3,500/mo"}</span>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: "6px", width: "100%" }}
                        onClick={() => setSelectedEmpDossier(emp)}
                      >
                        <FileText size={14} />
                        <span>View Personnel Dossier</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPANY-WIDE ATTENDANCE */}
          {activeTab === "attendance" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Company-Wide Attendance Monitoring</h1>
                  <p>Daily check-in logs, punctuality metrics, and work-from-home activity logs.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Present Today</span>
                    <div className="stat-icon-wash emerald">
                      <UserCheck size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">3 / 4</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "75%", backgroundColor: "var(--success)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">75%</span>
                    <span>1 on approved leave</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">On-Time Rate</span>
                    <div className="stat-icon-wash indigo">
                      <Clock size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">100%</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "100%", backgroundColor: "var(--brand-indigo)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Optimal</span>
                    <span>No late flags</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Remote Check-ins</span>
                    <div className="stat-icon-wash purple">
                      <Building size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">1</div>
                  <div className="stat-card-footer">
                    <span>DevOps Specialist</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Shift Standard</span>
                    <div className="stat-icon-wash neutral">
                      <Briefcase size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">8 Hours</div>
                  <div className="stat-card-footer">
                    <span>09:00 - 17:00 Standard</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <Clock size={15} />
                    <span>Real-Time Attendance Log</span>
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Employee</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Total Hours</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords?.map((rec, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{rec.date}</td>
                          <td>{rec.name || "Staff Member"}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{rec.in}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{rec.out}</td>
                          <td>{rec.hours}</td>
                          <td>{rec.location || "Office"}</td>
                          <td>
                            <span className="badge badge-approved">
                              <span className="badge-dot" />
                              <span>{rec.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-card-list">
                  {attendanceRecords?.map((rec, i) => (
                    <div key={i} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <span className="mobile-data-card-title">{rec.name || "Staff Member"}</span>
                        <span className="badge badge-approved">{rec.status}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Clock In / Out</span>
                        <span className="mobile-data-card-val" style={{ fontFamily: "var(--font-mono)" }}>{rec.in} - {rec.out}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Location</span>
                        <span className="mobile-data-card-val">{rec.location || "Office"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAVE APPROVALS */}
          {activeTab === "leave" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Workforce Leave Applications</h1>
                  <p>Review, authorize, and audit employee time-off requests across all departments.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <CalendarCheck size={15} />
                    <span>All Leave Applications</span>
                  </span>
                  <span className="card-subtitle">{leaveRequests.length} total records</span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Leave Type</th>
                        <th>Duration</th>
                        <th>Days</th>
                        <th>Reason</th>
                        <th>Applied On</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((req) => (
                        <tr key={req.id}>
                          <td style={{ fontWeight: 700 }}>{req.name || req.employee}</td>
                          <td>{req.type}</td>
                          <td>{req.dates}</td>
                          <td>{req.days} days</td>
                          <td style={{ color: "var(--text-secondary)" }}>{req.reason}</td>
                          <td>{req.appliedOn}</td>
                          <td>
                            <span className={`badge ${
                              req.status === "Approved" ? "badge-approved" :
                              req.status === "Pending" ? "badge-pending" : "badge-rejected"
                            }`}>
                              <span className="badge-dot" />
                              <span>{req.status}</span>
                            </span>
                          </td>
                          <td>
                            {req.status === "Pending" ? (
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => onUpdateStatus(req.id, "Approved")}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-danger-ghost btn-sm"
                                  onClick={() => onUpdateStatus(req.id, "Rejected")}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: "11.5px", color: "var(--text-tertiary)" }}>Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-card-list">
                  {leaveRequests.map((req) => (
                    <div key={req.id} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <span className="mobile-data-card-title">{req.name || req.employee}</span>
                        <span className={`badge ${
                          req.status === "Approved" ? "badge-approved" :
                          req.status === "Pending" ? "badge-pending" : "badge-rejected"
                        }`}>
                          <span className="badge-dot" />
                          <span>{req.status}</span>
                        </span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Type & Duration</span>
                        <span className="mobile-data-card-val">{req.type} • {req.days} days</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Dates</span>
                        <span className="mobile-data-card-val">{req.dates}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Reason</span>
                        <span className="mobile-data-card-val" style={{ fontStyle: "italic" }}>"{req.reason}"</span>
                      </div>
                      {req.status === "Pending" && (
                        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                          <button
                            className="btn btn-success btn-sm"
                            style={{ flex: 1 }}
                            onClick={() => onUpdateStatus(req.id, "Approved")}
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            className="btn btn-danger-ghost btn-sm"
                            style={{ flex: 1 }}
                            onClick={() => onUpdateStatus(req.id, "Rejected")}
                          >
                            <XCircle size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAYROLL & CLAIMS ADMIN */}
          {activeTab === "payroll" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Payroll Processing & Claims Administration</h1>
                  <p>Audit monthly payroll batches, statutory tax withholdings, and employee expense reimbursements.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Monthly Payroll Outlay</span>
                    <div className="stat-icon-wash indigo">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$27,800.00</div>
                  <div className="stat-card-footer">
                    <span>{employees.length} Active Employees</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Pending Claims</span>
                    <div className="stat-icon-wash amber">
                      <CreditCard size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">
                    ${pendingClaimsList.reduce((acc, c) => acc + parseInt(c.amount.replace(/[^0-9]/g, "") || 0), 0)}
                  </div>
                  <div className="stat-card-footer">
                    <span>{pendingClaimsList.length} claims</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Approved Claims</span>
                    <div className="stat-icon-wash emerald">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">
                    ${claims.filter(c => c.status === "Approved").reduce((acc, c) => acc + parseInt(c.amount.replace(/[^0-9]/g, "") || 0), 0)}
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Processed</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Disbursement Date</span>
                    <div className="stat-icon-wash neutral">
                      <Clock size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">Aug 28, 2026</div>
                  <div className="stat-card-footer">
                    <span>Automated Batch</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <CreditCard size={15} />
                    <span>Expense Claims Verification Queue</span>
                  </span>
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
                        <th>Receipt Attached</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((claim) => (
                        <tr key={claim.id}>
                          <td style={{ fontWeight: 700 }}>{claim.name || claim.employee}</td>
                          <td>{claim.category}</td>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{claim.amount}</td>
                          <td>{claim.date}</td>
                          <td style={{ color: "var(--text-secondary)" }}>{claim.description}</td>
                          <td>
                            <span style={{ fontSize: "11.5px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <FileText size={13} />
                              <span>{claim.receipt}</span>
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              claim.status === "Approved" ? "badge-approved" :
                              claim.status === "Pending" ? "badge-pending" : "badge-rejected"
                            }`}>
                              <span className="badge-dot" />
                              <span>{claim.status}</span>
                            </span>
                          </td>
                          <td>
                            {claim.status === "Pending" ? (
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => onUpdateClaimStatus(claim.id, "Approved")}
                                >
                                  Authorize
                                </button>
                                <button
                                  className="btn btn-danger-ghost btn-sm"
                                  onClick={() => onUpdateClaimStatus(claim.id, "Rejected")}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: "11.5px", color: "var(--text-tertiary)" }}>Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-card-list">
                  {claims.map((claim) => (
                    <div key={claim.id} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 700 }}>{claim.name || claim.employee}</div>
                          <div style={{ fontSize: "11.5px", color: "var(--text-tertiary)" }}>{claim.category} • {claim.date}</div>
                        </div>
                        <span style={{ fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{claim.amount}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Details</span>
                        <span className="mobile-data-card-val">{claim.description}</span>
                      </div>
                      {claim.status === "Pending" && (
                        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                          <button
                            className="btn btn-success btn-sm"
                            style={{ flex: 1 }}
                            onClick={() => onUpdateClaimStatus(claim.id, "Approved")}
                          >
                            <CheckCircle2 size={14} />
                            <span>Authorize</span>
                          </button>
                          <button
                            className="btn btn-danger-ghost btn-sm"
                            style={{ flex: 1 }}
                            onClick={() => onUpdateClaimStatus(claim.id, "Rejected")}
                          >
                            <XCircle size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HELPDESK QUEUE */}
          {activeTab === "tickets" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>IT & Operations Support Queue</h1>
                  <p>Triage employee equipment requests, software provisioning, and facilities tickets.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <LifeBuoy size={15} />
                    <span>Active Support Tickets</span>
                  </span>
                  <span className="card-subtitle">{tickets.length} total tickets</span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Subject</th>
                        <th>Requester</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Created Date</th>
                        <th>Assigned Agent</th>
                        <th>Status</th>
                        <th>Change Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr key={t.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{t.id}</td>
                          <td style={{ fontWeight: 600 }}>{t.subject}</td>
                          <td>{t.name || "Staff Member"}</td>
                          <td>{t.category}</td>
                          <td>
                            <span className={`badge ${
                              t.priority === "High" ? "badge-rejected" :
                              t.priority === "Medium" ? "badge-pending" : "badge-info"
                            }`}>
                              {t.priority}
                            </span>
                          </td>
                          <td>{t.date}</td>
                          <td>{t.assignedTo || "Dennis V. (IT)"}</td>
                          <td>
                            <span className={`badge ${
                              t.status === "Resolved" ? "badge-approved" :
                              t.status === "In Progress" ? "badge-info" : "badge-neutral"
                            }`}>
                              <span className="badge-dot" />
                              <span>{t.status}</span>
                            </span>
                          </td>
                          <td>
                            <select
                              className="form-select"
                              style={{ width: "120px", padding: "5px 8px", fontSize: "12px" }}
                              value={t.status}
                              onChange={(e) => onUpdateTicketStatus(t.id, e.target.value)}
                            >
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-card-list">
                  {tickets.map((t) => (
                    <div key={t.id} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <span className="mobile-data-card-title">{t.subject}</span>
                        <span className={`badge ${
                          t.priority === "High" ? "badge-rejected" : "badge-pending"
                        }`}>{t.priority}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Requester & ID</span>
                        <span className="mobile-data-card-val">{t.name || "Staff"} ({t.id})</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Change Status</span>
                        <select
                          className="form-select"
                          style={{ width: "130px", padding: "4px 8px", fontSize: "11.5px" }}
                          value={t.status}
                          onChange={(e) => onUpdateTicketStatus(t.id, e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BROADCASTS */}
          {activeTab === "announcements" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Company Broadcasts & Bulletins</h1>
                  <p>Publish organizational notices, policy updates, and executive announcements.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAnnounceModal(true)}>
                  <Megaphone size={14} />
                  <span>Create Announcement</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {announcements.map((ann) => (
                  <div key={ann.id} className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <h3 style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {ann.title}
                        </h3>
                        <div style={{ fontSize: "11.5px", color: "var(--text-tertiary)", marginTop: "2px" }}>
                          Published on {ann.date} by {ann.author}
                        </div>
                      </div>
                      <span className={`badge ${ann.type === "Important" ? "badge-rejected" : "badge-neutral"}`}>
                        {ann.type}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        <button
          className={`mobile-bottom-item ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <LayoutDashboard className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Overview</span>
        </button>

        <button
          className={`mobile-bottom-item ${activeTab === "directory" ? "active" : ""}`}
          onClick={() => setActiveTab("directory")}
        >
          <Users className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Roster</span>
        </button>

        <button
          className={`mobile-bottom-item ${activeTab === "leave" ? "active" : ""}`}
          onClick={() => setActiveTab("leave")}
        >
          <CalendarCheck className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Leave</span>
          {pendingLeaves.length > 0 && <span className="mobile-bottom-badge" />}
        </button>

        <button
          className={`mobile-bottom-item ${activeTab === "payroll" ? "active" : ""}`}
          onClick={() => setActiveTab("payroll")}
        >
          <DollarSign className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Claims</span>
          {pendingClaimsList.length > 0 && <span className="mobile-bottom-badge" />}
        </button>

        <button
          className="mobile-bottom-item"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open full menu"
        >
          <Layers className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Menu</span>
        </button>
      </nav>

      {/* MODAL: ONBOARD NEW EMPLOYEE */}
      {showAddEmpModal && (
        <div className="modal-backdrop" onClick={() => setShowAddEmpModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Onboard New Employee</h3>
              <button className="modal-close-btn" onClick={() => setShowAddEmpModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Jordan Hayes"
                    value={newEmpForm.name}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Frontend Engineer"
                      value={newEmpForm.title}
                      onChange={(e) => setNewEmpForm({ ...newEmpForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={newEmpForm.dept}
                      onChange={(e) => setNewEmpForm({ ...newEmpForm, dept: e.target.value })}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Finance & Operations">Finance & Operations</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Corporate Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="jordan.hayes@company.com"
                    value={newEmpForm.email}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Monthly Compensation</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$4,500/mo"
                      value={newEmpForm.salary}
                      onChange={(e) => setNewEmpForm({ ...newEmpForm, salary: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primary Work Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Port Harcourt / Remote"
                      value={newEmpForm.location}
                      onChange={(e) => setNewEmpForm({ ...newEmpForm, location: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddEmpModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Employee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST ANNOUNCEMENT */}
      {showAnnounceModal && (
        <div className="modal-backdrop" onClick={() => setShowAnnounceModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Company Broadcast</h3>
              <button className="modal-close-btn" onClick={() => setShowAnnounceModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddAnn}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Announcement Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Q3 Townhall and Benefits Update"
                    value={annForm.title}
                    onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <select
                    className="form-select"
                    value={annForm.type}
                    onChange={(e) => setAnnForm({ ...annForm, type: e.target.value })}
                  >
                    <option value="Important">Important (Urgent Banner)</option>
                    <option value="General">General Information</option>
                    <option value="Policy">Policy Update</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Broadcast Content</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Write the company-wide message..."
                    value={annForm.content}
                    onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAnnounceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Broadcast to Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EMPLOYEE DOSSIER */}
      {selectedEmpDossier && (
        <div className="modal-backdrop" onClick={() => setSelectedEmpDossier(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Employee Dossier • {selectedEmpDossier.name}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedEmpDossier(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--accent-primary)",
                    color: "var(--accent-primary-text)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "15px",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  {selectedEmpDossier.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {selectedEmpDossier.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {selectedEmpDossier.title} • {selectedEmpDossier.dept || selectedEmpDossier.department}
                  </div>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Employee ID</div>
                  <div className="detail-value">{selectedEmpDossier.id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Status</div>
                  <div className="detail-value">{selectedEmpDossier.status || "Active"}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Corporate Email</div>
                  <div className="detail-value">{selectedEmpDossier.email}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Work Location</div>
                  <div className="detail-value">{selectedEmpDossier.location || "Office"}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Monthly Compensation</div>
                  <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                    {selectedEmpDossier.salary || "$3,500/mo"}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Performance Review Score</div>
                  <div className="detail-value">{selectedEmpDossier.score || "4.5 / 5.0"}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setSelectedEmpDossier(null)}>
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
