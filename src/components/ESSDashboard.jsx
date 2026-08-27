import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UserCircle,
  Clock,
  CalendarRange,
  Wallet,
  Receipt,
  LifeBuoy,
  ShieldPlus,
  TrendingUp,
  Sun,
  Moon,
  Menu,
  X,
  Plus,
  CheckCircle2,
  Clock4,
  Download,
  Building,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Bell,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Play,
  Square,
  Activity,
  Layers,
  LogOut
} from "lucide-react";

export default function ESSDashboard({
  profile,
  theme,
  onToggleTheme,
  onLogout,
  onUpdateProfile,
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

  const employee = {
    name: profile?.name || "Udeh Kosisochukwu Emmanuel",
    id: profile?.id || "USR-002",
    title: profile?.title || "Software Developer Intern",
    department: profile?.department || "Engineering",
    email: profile?.email || "employee@company.com",
    phone: profile?.phone || "+234 812 345 6789",
    joinDate: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Aug 1, 2026",
    manager: profile?.manager || "Sarah Chen (Tech Lead)",
    location: profile?.location || "Port Harcourt, Nigeria",
    bankName: profile?.bankName || "First Bank of Nigeria",
    accountNumber: profile?.accountNumber || "3049283482",
    taxId: profile?.taxId || "TIN-98234711",
    pensionPin: profile?.pensionPin || "PEN-100293847",
    annualLeaveBalance: profile?.annualLeaveBalance ?? 14,
    sickLeaveBalance: profile?.sickLeaveBalance ?? 8,
    casualLeaveBalance: profile?.casualLeaveBalance ?? 4,
  };

  const [editProfileForm, setEditProfileForm] = useState(employee);

  useEffect(() => {
    if (!attendanceStatus?.isClockedIn) {
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      setElapsedSeconds(0);
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
    if (onUpdateProfile) {
      onUpdateProfile(editProfileForm);
    }
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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Personnel Profile", icon: UserCircle },
    { id: "attendance", label: "Shift Attendance", icon: Clock },
    { id: "leave", label: "Leave Manager", icon: CalendarRange, badge: leaveRequests.filter(r => r.status === "Pending").length || null },
    { id: "payroll", label: "Payroll & Payslips", icon: Wallet },
    { id: "claims", label: "Reimbursements", icon: Receipt, badge: claims.filter(c => c.status === "Pending").length || null },
    { id: "helpdesk", label: "Helpdesk Support", icon: LifeBuoy, badge: tickets.filter(t => t.status === "In Progress").length || null },
    { id: "hmo", label: "HMO & Benefits", icon: ShieldPlus },
    { id: "performance", label: "Performance & OKRs", icon: TrendingUp },
  ];

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
              <span className="sidebar-brand-sub">Employee Portal</span>
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
          <div className="sidebar-section-title">MAIN WORKSPACE</div>
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
              {employee.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="user-profile-meta">
              <div className="user-profile-name">{employee.name}</div>
              <div className="user-profile-role">{employee.title}</div>
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
              aria-label="Toggle navigation drawer"
            >
              <Menu size={18} />
            </button>
            <div className="top-navbar-breadcrumb">
              <span>Portal</span>
              <span>/</span>
              <span className="current">{navItems.find(n => n.id === activeTab)?.label}</span>
            </div>
          </div>

          <div className="top-navbar-right">
            {/* Live Attendance Clock Status */}
            <div className="live-shift-chip" onClick={onClockToggle} style={{ cursor: "pointer" }}>
              <span className={`live-pulse-dot ${attendanceStatus?.isClockedIn ? "active" : ""}`} />
              <span className="live-timer-text">
                {attendanceStatus?.isClockedIn ? formatTimer(elapsedSeconds) : "Off Shift"}
              </span>
              <span style={{ fontSize: "10.5px", fontWeight: 700, opacity: 0.8 }}>
                {attendanceStatus?.isClockedIn ? "OUT" : "IN"}
              </span>
            </div>

            {/* Theme Toggle Button */}
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
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              {/* Mobile Hero Attendance Widget */}
              <div className="mobile-clock-hero-card">
                <div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Today's Shift Attendance
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                    {attendanceStatus?.isClockedIn ? formatTimer(elapsedSeconds) : "00:00:00"}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Activity size={13} color={attendanceStatus?.isClockedIn ? "var(--success)" : "var(--text-tertiary)"} />
                    <span>{attendanceStatus?.isClockedIn ? `Clocked in at ${attendanceStatus.clockInTime}` : "Shift starts at 09:00 AM"}</span>
                  </div>
                </div>

                <button
                  className={`btn ${attendanceStatus?.isClockedIn ? "btn-danger" : "btn-primary"}`}
                  onClick={onClockToggle}
                  style={{ padding: "10px 18px", borderRadius: "var(--radius-md)" }}
                >
                  {attendanceStatus?.isClockedIn ? <Square size={16} /> : <Play size={16} />}
                  <span>{attendanceStatus?.isClockedIn ? "Clock Out" : "Clock In"}</span>
                </button>
              </div>

              <div className="page-header">
                <div className="page-title">
                  <h1>Welcome back, {employee.name.split(" ")[0]}</h1>
                  <p>Daily operational overview, attendance summary, and workforce actions.</p>
                </div>
                <div className="page-actions">
                  <button className="btn btn-primary" onClick={() => setShowLeaveModal(true)}>
                    <Plus size={14} />
                    <span>Apply for Leave</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowClaimModal(true)}>
                    <Receipt size={14} />
                    <span>Submit Claim</span>
                  </button>
                </div>
              </div>

              {/* Stats Metrics Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Annual Leave</span>
                    <div className="stat-icon-wash emerald">
                      <CalendarRange size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{employee.annualLeaveBalance} Days</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: `${Math.min(100, (employee.annualLeaveBalance / 20) * 100)}%`, backgroundColor: "var(--success)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Available</span>
                    <span>Remaining out of 20 days</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Pending Claims</span>
                    <div className="stat-icon-wash amber">
                      <Receipt size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">
                    ${claims.filter(c => c.status === "Pending").reduce((acc, c) => acc + parseInt(c.amount.replace(/[^0-9]/g, "") || 0), 0)}
                  </div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "40%", backgroundColor: "var(--warning)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge neutral">
                      {claims.filter(c => c.status === "Pending").length} Claims
                    </span>
                    <span>Under HR review</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Net Monthly Salary</span>
                    <div className="stat-icon-wash indigo">
                      <Wallet size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$2,900.00</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "82%", backgroundColor: "var(--brand-indigo)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Paid</span>
                    <span>Payday: 28th monthly</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Performance Rating</span>
                    <div className="stat-icon-wash purple">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">4.5 / 5.0</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "90%", backgroundColor: "var(--purple-text)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Exceeds</span>
                    <span>Q2 Review Score</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Broadcasts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "16px", marginBottom: "20px" }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <Briefcase size={15} />
                      <span>Quick Shortcuts</span>
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div className="quick-action-card" onClick={() => setShowLeaveModal(true)}>
                      <div className="quick-action-icon-box" style={{ color: "var(--brand-indigo)", backgroundColor: "var(--brand-indigo-light)" }}>
                        <CalendarRange size={18} />
                      </div>
                      <div className="quick-action-info">
                        <h4>Apply Leave</h4>
                        <p>Time off request</p>
                      </div>
                    </div>

                    <div className="quick-action-card" onClick={() => setShowClaimModal(true)}>
                      <div className="quick-action-icon-box" style={{ color: "var(--warning)", backgroundColor: "var(--warning-light)" }}>
                        <Receipt size={18} />
                      </div>
                      <div className="quick-action-info">
                        <h4>File Expense</h4>
                        <p>Claim refund</p>
                      </div>
                    </div>

                    <div className="quick-action-card" onClick={() => setShowTicketModal(true)}>
                      <div className="quick-action-icon-box" style={{ color: "var(--info)", backgroundColor: "var(--info-light)" }}>
                        <LifeBuoy size={18} />
                      </div>
                      <div className="quick-action-info">
                        <h4>Helpdesk</h4>
                        <p>IT & HR Support</p>
                      </div>
                    </div>

                    <div className="quick-action-card" onClick={() => setActiveTab("payroll")}>
                      <div className="quick-action-icon-box" style={{ color: "var(--success)", backgroundColor: "var(--success-light)" }}>
                        <Wallet size={18} />
                      </div>
                      <div className="quick-action-info">
                        <h4>Payslips</h4>
                        <p>View monthly pay</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <Bell size={15} />
                      <span>Company Broadcasts</span>
                    </span>
                    <span className="card-subtitle">{announcements.length} updates</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "var(--bg-surface-elevated)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                            {ann.title}
                          </span>
                          <span className={`badge ${ann.type === "Important" ? "badge-rejected" : "badge-neutral"}`}>
                            {ann.type}
                          </span>
                        </div>
                        <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                          {ann.content}
                        </p>
                        <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "6px" }}>
                          {ann.date} • {ann.author}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Leave Requests */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <CalendarRange size={15} />
                    <span>Recent Leave Applications</span>
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab("leave")}>
                    <span>View All</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Desktop Table */}
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>Duration</th>
                        <th>Days</th>
                        <th>Reason</th>
                        <th>Applied On</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.slice(0, 3).map((req) => (
                        <tr key={req.id}>
                          <td style={{ fontWeight: 600 }}>{req.type}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List */}
                <div className="mobile-card-list">
                  {leaveRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <span className="mobile-data-card-title">{req.type}</span>
                        <span className={`badge ${
                          req.status === "Approved" ? "badge-approved" :
                          req.status === "Pending" ? "badge-pending" : "badge-rejected"
                        }`}>
                          <span className="badge-dot" />
                          <span>{req.status}</span>
                        </span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Dates</span>
                        <span className="mobile-data-card-val">{req.dates} ({req.days} days)</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Reason</span>
                        <span className="mobile-data-card-val">{req.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONNEL PROFILE */}
          {activeTab === "profile" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Personnel Profile & Credentials</h1>
                  <p>Verified employee record, corporate identity, and banking details.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => { setEditProfileForm(employee); setIsEditingProfile(true); }}>
                  <span>Edit Profile</span>
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
                <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "24px 18px" }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--accent-primary)",
                      color: "var(--accent-primary-text)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: 800,
                      marginBottom: "14px",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {employee.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {employee.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {employee.title}
                  </p>
                  <span className="badge badge-approved" style={{ marginTop: "10px" }}>
                    <span className="badge-dot" />
                    <span>Active Full-Time</span>
                  </span>

                  <div style={{ width: "100%", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", textAlign: "left" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Mail size={14} color="var(--text-tertiary)" />
                        <span>{employee.email}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Phone size={14} color="var(--text-tertiary)" />
                        <span>{employee.phone}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <MapPin size={14} color="var(--text-tertiary)" />
                        <span>{employee.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">
                        <Briefcase size={15} />
                        <span>Employment Details</span>
                      </span>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">Employee ID</div>
                        <div className="detail-value">{employee.id}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Department</div>
                        <div className="detail-value">{employee.department}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Reporting Manager</div>
                        <div className="detail-value">{employee.manager}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Joining Date</div>
                        <div className="detail-value">{employee.joinDate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">
                        <CreditCard size={15} />
                        <span>Banking & Statutory Details</span>
                      </span>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">Bank Institution</div>
                        <div className="detail-value">{employee.bankName}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Account Number</div>
                        <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                          {employee.accountNumber}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Tax Identification (TIN)</div>
                        <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                          {employee.taxId}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Pension PIN</div>
                        <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                          {employee.pensionPin}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === "attendance" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Shift Attendance & Time Tracking</h1>
                  <p>Real-time clock tracking, monthly work hours, and daily compliance logs.</p>
                </div>
                <button
                  className={`btn ${attendanceStatus?.isClockedIn ? "btn-danger" : "btn-primary"}`}
                  onClick={onClockToggle}
                >
                  {attendanceStatus?.isClockedIn ? <Square size={14} /> : <Play size={14} />}
                  <span>{attendanceStatus?.isClockedIn ? "Clock Out of Shift" : "Clock In to Shift"}</span>
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Current Status</span>
                    <div className="stat-icon-wash emerald">
                      <Clock size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">
                    {attendanceStatus?.isClockedIn ? "Active" : "Off Duty"}
                  </div>
                  <div className="stat-card-footer">
                    <span className="live-timer-text">
                      {attendanceStatus?.isClockedIn ? formatTimer(elapsedSeconds) : "00:00:00"}
                    </span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Monthly On-Time Rate</span>
                    <div className="stat-icon-wash indigo">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">98.4%</div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">+2.1%</span>
                    <span>vs last month</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Average Daily Hours</span>
                    <div className="stat-icon-wash purple">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">8.2 hrs</div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Optimal</span>
                    <span>Target: 8.0 hrs/day</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Shift Window</span>
                    <div className="stat-icon-wash neutral">
                      <Briefcase size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">09:00 - 17:00</div>
                  <div className="stat-card-footer">
                    <span>Engineering Core Hours</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <Clock size={15} />
                    <span>Attendance Log History</span>
                  </span>
                </div>

                {/* Desktop Table */}
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Total Hours</th>
                        <th>Work Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords?.map((rec, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{rec.date}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{rec.in}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{rec.out}</td>
                          <td>{rec.hours}</td>
                          <td>{rec.location || "Office (Port Harcourt)"}</td>
                          <td>
                            <span className={`badge ${
                              rec.status === "On Time" ? "badge-approved" :
                              rec.status === "Present" ? "badge-approved" : "badge-pending"
                            }`}>
                              <span className="badge-dot" />
                              <span>{rec.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List */}
                <div className="mobile-card-list">
                  {attendanceRecords?.map((rec, i) => (
                    <div key={i} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <span className="mobile-data-card-title">{rec.date}</span>
                        <span className="badge badge-approved">
                          <span className="badge-dot" />
                          <span>{rec.status}</span>
                        </span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">In / Out</span>
                        <span className="mobile-data-card-val" style={{ fontFamily: "var(--font-mono)" }}>{rec.in} - {rec.out}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Duration</span>
                        <span className="mobile-data-card-val">{rec.hours}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAVE MANAGER */}
          {activeTab === "leave" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Leave Management & Allowances</h1>
                  <p>Check leave entitlements, submit requests, and track supervisor approvals.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowLeaveModal(true)}>
                  <Plus size={14} />
                  <span>Apply for Leave</span>
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Annual Leave</span>
                    <div className="stat-icon-wash emerald">
                      <CalendarRange size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{employee.annualLeaveBalance} / 20</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: `${Math.min(100, (employee.annualLeaveBalance / 20) * 100)}%`, backgroundColor: "var(--success)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span>{employee.annualLeaveBalance} days remaining</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Sick Leave</span>
                    <div className="stat-icon-wash indigo">
                      <ShieldCheck size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{employee.sickLeaveBalance} / 10</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: `${Math.min(100, (employee.sickLeaveBalance / 10) * 100)}%`, backgroundColor: "var(--brand-indigo)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span>{employee.sickLeaveBalance} days remaining</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Casual Leave</span>
                    <div className="stat-icon-wash purple">
                      <UserCircle size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{employee.casualLeaveBalance} / 5</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: `${Math.min(100, (employee.casualLeaveBalance / 5) * 100)}%`, backgroundColor: "var(--purple-text)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span>{employee.casualLeaveBalance} days remaining</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Pending Approval</span>
                    <div className="stat-icon-wash amber">
                      <Clock4 size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">
                    {leaveRequests.filter(r => r.status === "Pending").length}
                  </div>
                  <div className="stat-card-footer">
                    <span>Awaiting Line Manager</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <CalendarRange size={15} />
                    <span>Leave Request Records</span>
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>Dates</th>
                        <th>Days</th>
                        <th>Reason</th>
                        <th>Applied On</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((req) => (
                        <tr key={req.id}>
                          <td style={{ fontWeight: 600 }}>{req.type}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-card-list">
                  {leaveRequests.map((req) => (
                    <div key={req.id} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <span className="mobile-data-card-title">{req.type}</span>
                        <span className={`badge ${
                          req.status === "Approved" ? "badge-approved" :
                          req.status === "Pending" ? "badge-pending" : "badge-rejected"
                        }`}>
                          <span className="badge-dot" />
                          <span>{req.status}</span>
                        </span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Dates</span>
                        <span className="mobile-data-card-val">{req.dates} ({req.days} days)</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Reason</span>
                        <span className="mobile-data-card-val">{req.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAYROLL */}
          {activeTab === "payroll" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Payroll & Payslip Statements</h1>
                  <p>Monthly compensation statements, tax deductions, and pension breakdowns.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Monthly Net Salary</span>
                    <div className="stat-icon-wash emerald">
                      <Wallet size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$2,900.00</div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Active</span>
                    <span>Gross: {employee.salary || "$3,500.00"}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Total Deductions</span>
                    <div className="stat-icon-wash rose">
                      <Receipt size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$600.00</div>
                  <div className="stat-card-footer">
                    <span>Tax, Pension, Medical</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Next Pay Date</span>
                    <div className="stat-icon-wash indigo">
                      <CalendarRange size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">Aug 28, 2026</div>
                  <div className="stat-card-footer">
                    <span>Direct Deposit</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">YTD Disbursed</span>
                    <div className="stat-icon-wash purple">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$20,300.00</div>
                  <div className="stat-card-footer">
                    <span>7 Pay Cycles</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <Wallet size={15} />
                    <span>Disbursement History</span>
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Pay Period</th>
                        <th>Disbursement Date</th>
                        <th>Gross Pay</th>
                        <th>Tax</th>
                        <th>Pension</th>
                        <th>Medical</th>
                        <th>Net Paid</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 600 }}>{p.month}</td>
                          <td>{p.payDate}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{p.gross}</td>
                          <td style={{ fontFamily: "var(--font-mono)", color: "var(--danger)" }}>-{p.tax}</td>
                          <td style={{ fontFamily: "var(--font-mono)", color: "var(--danger)" }}>-{p.pension}</td>
                          <td style={{ fontFamily: "var(--font-mono)", color: "var(--danger)" }}>-{p.medical}</td>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{p.net}</td>
                          <td>
                            <span className="badge badge-approved">
                              <span className="badge-dot" />
                              <span>{p.status}</span>
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setSelectedPayslip(p)}
                            >
                              <FileText size={13} />
                              <span>View Payslip</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-card-list">
                  {payments.map((p) => (
                    <div key={p.id} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <span className="mobile-data-card-title">{p.month}</span>
                        <span className="badge badge-approved">
                          <span className="badge-dot" />
                          <span>{p.status}</span>
                        </span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Net Disbursed</span>
                        <span className="mobile-data-card-val" style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{p.net}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Pay Date</span>
                        <span className="mobile-data-card-val">{p.payDate}</span>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: "6px", width: "100%" }}
                        onClick={() => setSelectedPayslip(p)}
                      >
                        <FileText size={14} />
                        <span>View Itemized Payslip</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REIMBURSEMENTS / CLAIMS */}
          {activeTab === "claims" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Expense Reimbursements & Claims</h1>
                  <p>Submit work-related out-of-pocket expenses and track reimbursement payouts.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowClaimModal(true)}>
                  <Plus size={14} />
                  <span>Submit Expense Claim</span>
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Pending Claims</span>
                    <div className="stat-icon-wash amber">
                      <Clock4 size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">
                    ${claims.filter(c => c.status === "Pending").reduce((acc, c) => acc + parseInt(c.amount.replace(/[^0-9]/g, "") || 0), 0)}
                  </div>
                  <div className="stat-card-footer">
                    <span>Awaiting Finance verification</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Approved & Paid (YTD)</span>
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
                    <span className="stat-card-label">Allowance Limit</span>
                    <div className="stat-icon-wash indigo">
                      <CreditCard size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$500 / mo</div>
                  <div className="stat-card-footer">
                    <span>Remote work allowance</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Total Claims Submitted</span>
                    <div className="stat-icon-wash purple">
                      <Receipt size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{claims.length}</div>
                  <div className="stat-card-footer">
                    <span>All Time</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <Receipt size={15} />
                    <span>Submitted Expense Claims</span>
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date Incurred</th>
                        <th>Description</th>
                        <th>Receipt Attached</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((claim) => (
                        <tr key={claim.id}>
                          <td style={{ fontWeight: 600 }}>{claim.category}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-card-list">
                  {claims.map((claim) => (
                    <div key={claim.id} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <span className="mobile-data-card-title">{claim.category}</span>
                        <span className={`badge ${
                          claim.status === "Approved" ? "badge-approved" :
                          claim.status === "Pending" ? "badge-pending" : "badge-rejected"
                        }`}>
                          <span className="badge-dot" />
                          <span>{claim.status}</span>
                        </span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Amount</span>
                        <span className="mobile-data-card-val" style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{claim.amount}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Date & Details</span>
                        <span className="mobile-data-card-val">{claim.date} • {claim.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: HELPDESK */}
          {activeTab === "helpdesk" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>IT & Operations Helpdesk</h1>
                  <p>Submit IT hardware requests, access issues, and HR inquiries.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowTicketModal(true)}>
                  <Plus size={14} />
                  <span>Create Support Ticket</span>
                </button>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <LifeBuoy size={15} />
                    <span>My Support Tickets</span>
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Subject</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Created Date</th>
                        <th>Assigned Engineer</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr key={t.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{t.id}</td>
                          <td style={{ fontWeight: 600 }}>{t.subject}</td>
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
                          <td>{t.assignedTo || "Unassigned"}</td>
                          <td>
                            <span className={`badge ${
                              t.status === "Resolved" ? "badge-approved" :
                              t.status === "In Progress" ? "badge-info" : "badge-neutral"
                            }`}>
                              <span className="badge-dot" />
                              <span>{t.status}</span>
                            </span>
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
                          t.status === "Resolved" ? "badge-approved" :
                          t.status === "In Progress" ? "badge-info" : "badge-neutral"
                        }`}>
                          <span className="badge-dot" />
                          <span>{t.status}</span>
                        </span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">ID & Category</span>
                        <span className="mobile-data-card-val">{t.id} • {t.category}</span>
                      </div>
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Priority</span>
                        <span className="mobile-data-card-val">{t.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: HMO & BENEFITS */}
          {activeTab === "hmo" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>HMO & Healthcare Coverage</h1>
                  <p>Corporate medical plan details, primary hospital network, and emergency contacts.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <ShieldPlus size={15} />
                      <span>Corporate Medical Plan</span>
                    </span>
                    <span className="badge badge-approved">Active Tier</span>
                  </div>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <div className="detail-label">HMO Administrator</div>
                      <div className="detail-value">Axa Mansard Health</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Coverage Tier</div>
                      <div className="detail-value">Gold Executive Plan</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Policy Number</div>
                      <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                        AXA-CORP-8923
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Enrollee Member ID</div>
                      <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                        ENR-2026-904
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <Phone size={15} />
                      <span>Emergency Medical Hotline</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ padding: "12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>24/7 HMO Careline</div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                        +234 1 280 1234
                      </div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>Company Medical Officer</div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                        +234 803 999 4422
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <Building size={15} />
                    <span>Primary Provider Clinic Network</span>
                  </span>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Clinic / Hospital Name</th>
                        <th>City / Region</th>
                        <th>Address</th>
                        <th>Services Covered</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600 }}>St. Nicholas Hospital</td>
                        <td>Lagos (Lagos Island)</td>
                        <td>57 Campbell Street, Lagos</td>
                        <td>Inpatient, Outpatient, Dental, Optical</td>
                        <td><span className="badge badge-approved">In-Network</span></td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Sonabel Medical Center</td>
                        <td>Port Harcourt</td>
                        <td>14 Peter Odili Road, PH</td>
                        <td>Primary Care, Emergency, Pharmacy</td>
                        <td><span className="badge badge-approved">In-Network</span></td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Reddington Hospital</td>
                        <td>Lagos (Victoria Island)</td>
                        <td>12 Idowu Martins St, VI</td>
                        <td>Specialist Consults, Surgery, Imaging</td>
                        <td><span className="badge badge-approved">In-Network</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mobile-card-list">
                  <div className="mobile-data-card">
                    <div className="mobile-data-card-header">
                      <span className="mobile-data-card-title">Sonabel Medical Center</span>
                      <span className="badge badge-approved">Port Harcourt</span>
                    </div>
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Address</span>
                      <span className="mobile-data-card-val">14 Peter Odili Road, PH</span>
                    </div>
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Care Tier</span>
                      <span className="mobile-data-card-val">Primary, Emergency, Pharmacy</span>
                    </div>
                  </div>
                  <div className="mobile-data-card">
                    <div className="mobile-data-card-header">
                      <span className="mobile-data-card-title">St. Nicholas Hospital</span>
                      <span className="badge badge-approved">Lagos</span>
                    </div>
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Address</span>
                      <span className="mobile-data-card-val">57 Campbell St, Lagos Island</span>
                    </div>
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Care Tier</span>
                      <span className="mobile-data-card-val">Full Inpatient & Outpatient</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PERFORMANCE */}
          {activeTab === "performance" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Quarterly Performance & OKRs</h1>
                  <p>Objective key results, milestone progress, and manager review cycles.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Current Rating</span>
                    <div className="stat-icon-wash emerald">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{employee.score || "4.5 / 5.0"}</div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Exceeds</span>
                    <span>Q2 Review Score</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">OKR Completion</span>
                    <div className="stat-icon-wash indigo">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">84%</div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">On Track</span>
                    <span>Q3 2026 Objectives</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Next Review</span>
                    <div className="stat-icon-wash amber">
                      <CalendarRange size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">Sept 30, 2026</div>
                  <div className="stat-card-footer">
                    <span>Q3 Assessment</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Reviewer</span>
                    <div className="stat-icon-wash neutral">
                      <UserCircle size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{employee.manager.split(" ")[0]} {employee.manager.split(" ")[1]}</div>
                  <div className="stat-card-footer">
                    <span>Engineering Lead</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <TrendingUp size={15} />
                    <span>Q3 Strategic Objectives & Key Results (OKRs)</span>
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        1. Architecture & Front-End Redesign of Enterprise ERP
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>90%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                      <div style={{ width: "90%", height: "100%", backgroundColor: "var(--accent-primary)", borderRadius: "var(--radius-full)" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        2. Automate Attendance Logging & Shift Clock Synchronization
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>85%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                      <div style={{ width: "85%", height: "100%", backgroundColor: "var(--accent-primary)", borderRadius: "var(--radius-full)" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        3. Complete TypeScript Refactoring and Unit Test Coverage (&gt;80%)
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>75%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                      <div style={{ width: "75%", height: "100%", backgroundColor: "var(--accent-primary)", borderRadius: "var(--radius-full)" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        <button
          className={`mobile-bottom-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Home</span>
        </button>

        <button
          className={`mobile-bottom-item ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          <Clock className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Shift</span>
          {attendanceStatus?.isClockedIn && <span className="mobile-bottom-badge" style={{ backgroundColor: "var(--success)" }} />}
        </button>

        <button
          className={`mobile-bottom-item ${activeTab === "leave" ? "active" : ""}`}
          onClick={() => setActiveTab("leave")}
        >
          <CalendarRange className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Leave</span>
          {leaveRequests.filter(r => r.status === "Pending").length > 0 && <span className="mobile-bottom-badge" />}
        </button>

        <button
          className={`mobile-bottom-item ${activeTab === "payroll" ? "active" : ""}`}
          onClick={() => setActiveTab("payroll")}
        >
          <Wallet className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Payslips</span>
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

      {/* MODAL: APPLY LEAVE */}
      {showLeaveModal && (
        <div className="modal-backdrop" onClick={() => setShowLeaveModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Leave</h3>
              <button className="modal-close-btn" onClick={() => setShowLeaveModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleLeaveSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Leave Category</label>
                  <select
                    className="form-select"
                    value={leaveForm.type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  >
                    <option value="Annual Leave">Annual Leave ({employee.annualLeaveBalance} Days Left)</option>
                    <option value="Sick Leave">Sick Leave ({employee.sickLeaveBalance} Days Left)</option>
                    <option value="Casual Leave">Casual Leave ({employee.casualLeaveBalance} Days Left)</option>
                    <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason / Justification</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Briefly state reason for leave request..."
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeaveModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT EXPENSE CLAIM */}
      {showClaimModal && (
        <div className="modal-backdrop" onClick={() => setShowClaimModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Expense Reimbursement Claim</h3>
              <button className="modal-close-btn" onClick={() => setShowClaimModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleClaimSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Expense Category</label>
                  <select
                    className="form-select"
                    value={claimForm.category}
                    onChange={(e) => setClaimForm({ ...claimForm, category: e.target.value })}
                  >
                    <option value="Internet & Data Allowance">Internet & Data Allowance</option>
                    <option value="Client Transport & Fuel">Client Transport & Fuel</option>
                    <option value="Office & Tech Supplies">Office & Tech Supplies</option>
                    <option value="Meals & Entertainment">Meals & Entertainment</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount (USD / NGN)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="$150.00"
                    value={claimForm.amount}
                    onChange={(e) => setClaimForm({ ...claimForm, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description of Expense</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Provide details about the business expense..."
                    value={claimForm.description}
                    onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Attach Proof / Receipt</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. invoice_august_receipt.pdf"
                    value={claimForm.receiptName}
                    onChange={(e) => setClaimForm({ ...claimForm, receiptName: e.target.value })}
                  />
                  <span className="form-hint">Upload receipt file or specify invoice reference number.</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowClaimModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SUPPORT TICKET */}
      {showTicketModal && (
        <div className="modal-backdrop" onClick={() => setShowTicketModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Support Ticket</h3>
              <button className="modal-close-btn" onClick={() => setShowTicketModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleTicketSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    >
                      <option value="IT Hardware">IT Hardware & Equipment</option>
                      <option value="Software Access">Software & VPN Access</option>
                      <option value="HR Inquiries">HR Operations Inquiry</option>
                      <option value="Facility & Office">Facility & Workstation</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority (Urgent)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Request for Second Monitor Adapter"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Provide relevant context, error messages, or workstation details..."
                    value={ticketForm.details}
                    onChange={(e) => setTicketForm({ ...ticketForm, details: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTicketModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAYSLIP DETAILED BREAKDOWN */}
      {selectedPayslip && (
        <div className="modal-backdrop" onClick={() => setSelectedPayslip(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Itemized Payslip • {selectedPayslip.month}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedPayslip(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Employee Name</div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>{employee.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{employee.id} • {employee.title}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Disbursed On</div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>{selectedPayslip.payDate}</div>
                  <span className="badge badge-approved" style={{ marginTop: "4px" }}>PAID</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Basic Gross Earnings</span>
                  <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{selectedPayslip.gross}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>PAYE Tax Deduction</span>
                  <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>-{selectedPayslip.tax}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Pension Contribution (8%)</span>
                  <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>-{selectedPayslip.pension}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Medical / HMO Premium</span>
                  <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>-{selectedPayslip.medical}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", marginTop: "4px", fontSize: "14.5px", fontWeight: 700, borderTop: "2px solid var(--border-default)" }}>
                  <span>Net Disbursed Take-Home</span>
                  <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{selectedPayslip.net}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => alert("Downloading PDF Payslip...")}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setSelectedPayslip(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROFILE */}
      {isEditingProfile && (
        <div className="modal-backdrop" onClick={() => setIsEditingProfile(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Personal Details</h3>
              <button className="modal-close-btn" onClick={() => setIsEditingProfile(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleProfileSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editProfileForm.name}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editProfileForm.phone}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editProfileForm.location}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editProfileForm.bankName}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, bankName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editProfileForm.accountNumber}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, accountNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
