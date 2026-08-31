import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UserCircle,
  Clock,
  CalendarRange,
  Wallet,
  Receipt,
  ShieldPlus,
  TrendingUp,
  Sun,
  Moon,
  Menu,
  X,
  Plus,
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
  LogOut,
  Users,
  Crown
} from "lucide-react";
import OrgChart from "./OrgChart";
import TeamLeadHub from "./TeamLeadHub";
import DepartmentHubs from "./DepartmentHubs";
import ExecutiveCockpit from "./ExecutiveCockpit";

export default function EnterpriseShell({
  currentUser,
  theme,
  onToggleTheme,
  onLogout,
  onUpdateProfile,
  // Database States
  leaveRequests = [],
  onSubmitLeave,
  onUpdateLeaveStatus,
  claims = [],
  onSubmitClaim,
  onUpdateClaimStatus,
  attendanceRecords = [],
  attendanceStatus,
  onClockToggle,
  announcements = [],
  onAddAnnouncement,
  departments = [],
  assets = [],
  sprints = [],
  allUsers = [],
  onAddAsset,
  orgTree,
}) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [selectedUserDossier, setSelectedUserDossier] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Direct reports & permissions checks
  const isManager = Boolean(currentUser.tier >= 3 || allUsers.some((u) => u.managerId === currentUser.id));
  const isDirector = Boolean(currentUser.tier >= 4);
  const isExecutive = Boolean(currentUser.tier === 5 || currentUser.role === "admin");

  const directReports = allUsers.filter((u) => u.managerId === currentUser.id);
  const directReportIds = new Set(directReports.map((d) => d.id));

  const teamLeaves = leaveRequests.filter((l) => directReportIds.has(l.userId) || l.managerId === currentUser.id);
  const teamClaims = claims.filter((c) => directReportIds.has(c.userId) || c.managerId === currentUser.id);
  const teamAttendance = attendanceRecords.filter((a) => directReportIds.has(a.userId));

  // Forms State
  const [leaveForm, setLeaveForm] = useState({
    type: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [claimForm, setClaimForm] = useState({
    category: "Internet & Remote Work Allowance",
    amount: "",
    description: "",
    receiptName: "",
  });

  const [editProfileForm, setEditProfileForm] = useState(currentUser);

  useEffect(() => {
    if (!attendanceStatus?.isClockedIn) return;
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
      managerId: currentUser.managerId,
    });
    setLeaveForm({ type: "Annual Leave", startDate: "", endDate: "", reason: "" });
    setShowLeaveModal(false);
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimForm.amount) return;
    onSubmitClaim({
      ...claimForm,
      managerId: currentUser.managerId,
    });
    setClaimForm({ category: "Internet & Remote Work Allowance", amount: "", description: "", receiptName: "" });
    setShowClaimModal(false);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (onUpdateProfile) onUpdateProfile(editProfileForm);
    setIsEditingProfile(false);
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case 5:
        return "Tier 5 • Executive (C-Suite)";
      case 4:
        return "Tier 4 • Head of Department";
      case 3:
        return "Tier 3 • Team Lead / Manager";
      case 2:
        return "Tier 2 • Senior Staff";
      default:
        return "Tier 1 • Staff Associate";
    }
  };

  const myLeaves = leaveRequests.filter((l) => l.userId === currentUser.id);
  const myClaims = claims.filter((c) => c.userId === currentUser.id);
  const myAttendance = attendanceRecords.filter((a) => a.userId === currentUser.id);

  const defaultPayments = [
    {
      id: 1,
      month: "August 2026",
      payDate: "2026-08-31",
      gross: currentUser.salary || "$3,500.00",
      tax: "$450.00",
      pension: "$180.00",
      medical: "$60.00",
      net: "$2,810.00",
      status: "Paid",
    },
    {
      id: 2,
      month: "July 2026",
      payDate: "2026-07-28",
      gross: currentUser.salary || "$3,500.00",
      tax: "$450.00",
      pension: "$180.00",
      medical: "$60.00",
      net: "$2,810.00",
      status: "Paid",
    },
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
              <span className="sidebar-brand-sub">Workforce OS</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="sidebar-nav">
          {/* SECTION 1: PERSONAL WORKSPACE */}
          <div className="sidebar-section-title">MY WORKSPACE</div>
          <button
            type="button"
            className={`nav-item ${activeNav === "dashboard" ? "active" : ""}`}
            onClick={() => { setActiveNav("dashboard"); setMobileMenuOpen(false); }}
          >
            <LayoutDashboard className="nav-item-icon" />
            <span>Overview</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "profile" ? "active" : ""}`}
            onClick={() => { setActiveNav("profile"); setMobileMenuOpen(false); }}
          >
            <UserCircle className="nav-item-icon" />
            <span>Personnel Profile</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "attendance" ? "active" : ""}`}
            onClick={() => { setActiveNav("attendance"); setMobileMenuOpen(false); }}
          >
            <Clock className="nav-item-icon" />
            <span>Shift Attendance</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "leaves" ? "active" : ""}`}
            onClick={() => { setActiveNav("leaves"); setMobileMenuOpen(false); }}
          >
            <CalendarRange className="nav-item-icon" />
            <span>My Leaves</span>
            {myLeaves.filter(r => r.status === "Pending" || r.status === "Pending Manager").length > 0 && (
              <span className="nav-item-badge">{myLeaves.filter(r => r.status === "Pending" || r.status === "Pending Manager").length}</span>
            )}
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "payroll" ? "active" : ""}`}
            onClick={() => { setActiveNav("payroll"); setMobileMenuOpen(false); }}
          >
            <Wallet className="nav-item-icon" />
            <span>Payslips & Tax</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "claims" ? "active" : ""}`}
            onClick={() => { setActiveNav("claims"); setMobileMenuOpen(false); }}
          >
            <Receipt className="nav-item-icon" />
            <span>Reimbursements</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "hmo" ? "active" : ""}`}
            onClick={() => { setActiveNav("hmo"); setMobileMenuOpen(false); }}
          >
            <ShieldPlus className="nav-item-icon" />
            <span>HMO Medical Care</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "okrs" ? "active" : ""}`}
            onClick={() => { setActiveNav("okrs"); setMobileMenuOpen(false); }}
          >
            <TrendingUp className="nav-item-icon" />
            <span>OKRs & Performance</span>
          </button>

          {/* SECTION 2: TEAM LEAD HUB (TIER 3+) */}
          {isManager && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: "16px" }}>
                PEOPLE MANAGEMENT
              </div>
              <button
                type="button"
                className={`nav-item ${activeNav === "team_hub" ? "active" : ""}`}
                onClick={() => { setActiveNav("team_hub"); setMobileMenuOpen(false); }}
              >
                <Users className="nav-item-icon" />
                <span>Team Lead Hub</span>
                {teamLeaves.filter(l => l.status === "Pending Manager" || l.status === "Pending").length > 0 && (
                  <span className="nav-item-badge">
                    {teamLeaves.filter(l => l.status === "Pending Manager" || l.status === "Pending").length}
                  </span>
                )}
              </button>
            </>
          )}

          {/* SECTION 3: DEPARTMENT TOOLKITS */}
          {(isDirector || isExecutive || currentUser.department !== "Executive") && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: "16px" }}>
                DEPARTMENT TOOLKIT
              </div>
              <button
                type="button"
                className={`nav-item ${activeNav === "departments" ? "active" : ""}`}
                onClick={() => { setActiveNav("departments"); setMobileMenuOpen(false); }}
              >
                <Building className="nav-item-icon" />
                <span>Department Workspaces</span>
              </button>
            </>
          )}

          {/* SECTION 4: ORGANIZATION & ORG CHART */}
          <div className="sidebar-section-title" style={{ marginTop: "16px" }}>
            ORGANIZATION
          </div>
          <button
            type="button"
            className={`nav-item ${activeNav === "org_chart" ? "active" : ""}`}
            onClick={() => { setActiveNav("org_chart"); setMobileMenuOpen(false); }}
          >
            <Layers className="nav-item-icon" />
            <span>Interactive Org Tree</span>
          </button>

          {/* SECTION 5: EXECUTIVE COCKPIT (TIER 5) */}
          {isExecutive && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: "16px" }}>
                EXECUTIVE SUITE
              </div>
              <button
                type="button"
                className={`nav-item ${activeNav === "executive" ? "active" : ""}`}
                onClick={() => { setActiveNav("executive"); setMobileMenuOpen(false); }}
              >
                <Crown className="nav-item-icon" />
                <span>Executive Cockpit</span>
              </button>
            </>
          )}
        </div>

        {/* Sidebar Footer User Tile */}
        <div className="sidebar-footer">
          <div className="user-profile-tile">
            <div className="user-avatar-initials">
              {currentUser.avatarInitials || currentUser.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="user-profile-meta">
              <div className="user-profile-name">{currentUser.name}</div>
              <div className="user-profile-role">{currentUser.title}</div>
            </div>
            <button
              type="button"
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
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation drawer"
            >
              <Menu size={18} />
            </button>
            <div className="top-navbar-breadcrumb">
              <span>{currentUser.department}</span>
              <span>/</span>
              <span className="current">{activeNav.replace("_", " ").toUpperCase()}</span>
            </div>
          </div>

          <div className="top-navbar-right">
            {/* Live Tier Chip */}
            <span className="badge badge-neutral" style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>
              <ShieldCheck size={13} color="var(--accent-primary)" />
              <span>{getTierLabel(currentUser.tier)}</span>
            </span>

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
              type="button"
              className="btn btn-secondary btn-icon-only"
              onClick={onToggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Logout Button */}
            <button
              type="button"
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
          {/* TAB 1: PERSONAL DASHBOARD */}
          {activeNav === "dashboard" && (
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
                    <span>{attendanceStatus?.isClockedIn ? `Clocked in at ${attendanceStatus.clockInTime}` : "Shift standard: 09:00 - 17:00"}</span>
                  </div>
                </div>

                <button
                  type="button"
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
                  <h1>Welcome back, {currentUser.name.split(" ")[0]}</h1>
                  <p>{currentUser.title} • {currentUser.department} (Reporting to {currentUser.managerName || "Board"})</p>
                </div>
                <div className="page-actions">
                  <button type="button" className="btn btn-primary" onClick={() => setShowLeaveModal(true)}>
                    <Plus size={14} />
                    <span>Apply for Leave</span>
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowClaimModal(true)}>
                    <Receipt size={14} />
                    <span>Submit Claim</span>
                  </button>
                </div>
              </div>

              {/* Stats Metrics Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Annual Leave Balance</span>
                    <div className="stat-icon-wash emerald">
                      <CalendarRange size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{currentUser.annualLeaveBalance} Days</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: `${Math.min(100, (currentUser.annualLeaveBalance / 25) * 100)}%`, backgroundColor: "var(--success)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Available</span>
                    <span>Accrued statutory balance</span>
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
                    ${myClaims.filter(c => c.status === "Pending Lead" || c.status === "Pending Finance").reduce((acc, c) => acc + parseInt(c.amount.replace(/[^0-9]/g, "") || 0), 0)}
                  </div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "40%", backgroundColor: "var(--warning)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span>{myClaims.filter(c => c.status !== "Approved").length} in review chain</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Net Monthly Salary</span>
                    <div className="stat-icon-wash indigo">
                      <Wallet size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$2,810.00</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "82%", backgroundColor: "var(--brand-indigo)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Paid</span>
                    <span>Gross: {currentUser.salary}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Performance Rating</span>
                    <div className="stat-icon-wash purple">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{currentUser.score || "4.5 / 5.0"}</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "90%", backgroundColor: "var(--purple-text)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">Exceeds</span>
                    <span>Reviewed by {currentUser.managerName?.split(" ")[0]}</span>
                  </div>
                </div>
              </div>

              {/* Announcements & Recent Leaves */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <CalendarRange size={15} />
                      <span>My Recent Leave Applications</span>
                    </span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setActiveNav("leaves")}>
                      <span>View All</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {myLeaves.length === 0 ? (
                    <div style={{ padding: "24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
                      No leave applications submitted yet.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Leave Type</th>
                            <th>Dates</th>
                            <th>Days</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myLeaves.slice(0, 3).map((req) => (
                            <tr key={req.id}>
                              <td style={{ fontWeight: 600 }}>{req.type}</td>
                              <td>{req.dates}</td>
                              <td>{req.days} days</td>
                              <td>
                                <span className={`badge ${req.status === "Approved" ? "badge-approved" : req.status.includes("Pending") ? "badge-pending" : "badge-rejected"}`}>
                                  {req.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <Bell size={15} />
                      <span>Company Bulletins</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "var(--bg-surface-elevated)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        <div style={{ fontSize: "13px", fontWeight: 700 }}>{ann.title}</div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>{ann.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONNEL PROFILE */}
          {activeNav === "profile" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Personnel Profile & Organizational Record</h1>
                  <p>Verified credentials, department hierarchy, and compensation details.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setEditProfileForm(currentUser); setIsEditingProfile(true); }}
                >
                  Edit Personal Details
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
                    }}
                  >
                    {currentUser.avatarInitials || currentUser.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{currentUser.name}</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>{currentUser.title}</p>
                  <span className="badge badge-approved" style={{ marginTop: "8px" }}>
                    {getTierLabel(currentUser.tier)}
                  </span>

                  <div style={{ width: "100%", marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)", textAlign: "left", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <Mail size={14} color="var(--text-tertiary)" />
                      <span>{currentUser.email}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <Phone size={14} color="var(--text-tertiary)" />
                      <span>{currentUser.phone}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <MapPin size={14} color="var(--text-tertiary)" />
                      <span>{currentUser.location}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">
                        <Briefcase size={15} />
                        <span>Corporate Placement & Reporting Line</span>
                      </span>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">Employee ID</div>
                        <div className="detail-value">{currentUser.id}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Department</div>
                        <div className="detail-value">{currentUser.department}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Reporting Line Manager</div>
                        <div className="detail-value">{currentUser.managerName || "Board of Directors"}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Authority Level</div>
                        <div className="detail-value">{getTierLabel(currentUser.tier)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">
                        <CreditCard size={15} />
                        <span>Statutory & Financial Details</span>
                      </span>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">Bank Institution</div>
                        <div className="detail-value">{currentUser.bankName || "First Bank of Nigeria"}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Account Number</div>
                        <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                          {currentUser.accountNumber || "3049283482"}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Tax ID (TIN)</div>
                        <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                          {currentUser.taxId || "TIN-98234711"}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Pension PIN</div>
                        <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                          {currentUser.pensionPin || "PEN-100293847"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SHIFT ATTENDANCE */}
          {activeNav === "attendance" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Shift Attendance & Time Log</h1>
                  <p>Real-time clock tracking, monthly work hours, and daily compliance records.</p>
                </div>
                <button
                  type="button"
                  className={`btn ${attendanceStatus?.isClockedIn ? "btn-danger" : "btn-primary"}`}
                  onClick={onClockToggle}
                >
                  {attendanceStatus?.isClockedIn ? <Square size={14} /> : <Play size={14} />}
                  <span>{attendanceStatus?.isClockedIn ? "Clock Out of Shift" : "Clock In to Shift"}</span>
                </button>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Duration</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAttendance.map((rec, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{rec.date}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{rec.in}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{rec.out}</td>
                          <td>{rec.hours}</td>
                          <td>{rec.location}</td>
                          <td>
                            <span className="badge badge-approved">{rec.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MY LEAVES */}
          {activeNav === "leaves" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Leave Management & Allowances</h1>
                  <p>Check leave entitlements, submit requests, and track supervisor approvals.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setShowLeaveModal(true)}>
                  <Plus size={14} />
                  <span>Apply for Leave</span>
                </button>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>Dates</th>
                        <th>Days</th>
                        <th>Reason</th>
                        <th>Applied On</th>
                        <th>Approval Stage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myLeaves.map((req) => (
                        <tr key={req.id}>
                          <td style={{ fontWeight: 600 }}>{req.type}</td>
                          <td>{req.dates}</td>
                          <td>{req.days} days</td>
                          <td style={{ color: "var(--text-secondary)" }}>{req.reason}</td>
                          <td>{req.appliedOn}</td>
                          <td>
                            <span className={`badge ${req.status === "Approved" ? "badge-approved" : req.status.includes("Pending") ? "badge-pending" : "badge-rejected"}`}>
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

          {/* TAB 5: PAYSLIPS */}
          {activeNav === "payroll" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Payroll & Payslip Statements</h1>
                  <p>Monthly compensation statements, tax deductions, and pension breakdowns.</p>
                </div>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Pay Period</th>
                        <th>Disbursement Date</th>
                        <th>Gross Pay</th>
                        <th>PAYE Tax</th>
                        <th>Pension (8%)</th>
                        <th>Medical</th>
                        <th>Net Take-Home</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {defaultPayments.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 700 }}>{p.month}</td>
                          <td>{p.payDate}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{p.gross}</td>
                          <td style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>-{p.tax}</td>
                          <td style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>-{p.pension}</td>
                          <td style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>-{p.medical}</td>
                          <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{p.net}</td>
                          <td><span className="badge badge-approved">{p.status}</span></td>
                          <td>
                            <button
                              type="button"
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
              </div>
            </div>
          )}

          {/* TAB 6: REIMBURSEMENTS */}
          {activeNav === "claims" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Expense Reimbursements & Claims</h1>
                  <p>Submit work-related out-of-pocket expenses and track multi-tier reimbursement approvals.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setShowClaimModal(true)}>
                  <Plus size={14} />
                  <span>Submit Expense Claim</span>
                </button>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date Incurred</th>
                        <th>Description</th>
                        <th>Receipt Attached</th>
                        <th>Approval Stage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myClaims.map((claim) => (
                        <tr key={claim.id}>
                          <td style={{ fontWeight: 600 }}>{claim.category}</td>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{claim.amount}</td>
                          <td>{claim.date}</td>
                          <td>{claim.description}</td>
                          <td>
                            <span style={{ fontSize: "11.5px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <FileText size={13} />
                              <span>{claim.receipt}</span>
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${claim.status === "Approved" ? "badge-approved" : claim.status.includes("Pending") ? "badge-pending" : "badge-rejected"}`}>
                              {claim.status}
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

          {/* TAB 7: HMO MEDICAL */}
          {activeNav === "hmo" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>HMO Health Insurance & Clinic Network</h1>
                  <p>Corporate medical tier, hospital networks, and 24/7 careline.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <ShieldPlus size={15} />
                      <span>Corporate Enrollee Card</span>
                    </span>
                    <span className="badge badge-approved">Gold Tier</span>
                  </div>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <div className="detail-label">HMO Provider</div>
                      <div className="detail-value">Axa Mansard Health</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Enrollee Member ID</div>
                      <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                        ENR-{currentUser.id.replace("USR-", "2026-")}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Primary Hospital</div>
                      <div className="detail-value">Sonabel Medical (PH) / St. Nicholas (Lagos)</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Emergency Careline</div>
                      <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>+234 1 280 1234</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <Building size={15} />
                      <span>In-Network Clinics</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px" }}>
                    <div style={{ padding: "8px 10px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface-elevated)" }}>
                      <strong>Sonabel Medical Center</strong> — 14 Peter Odili Rd, Port Harcourt (Primary Care & Surgery)
                    </div>
                    <div style={{ padding: "8px 10px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface-elevated)" }}>
                      <strong>St. Nicholas Hospital</strong> — 57 Campbell St, Lagos Island (Specialist Consults)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: OKRS & REVIEWS */}
          {activeNav === "okrs" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Quarterly Performance & Strategic OKRs</h1>
                  <p>Quarterly delivery progress and manager review assessments.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <TrendingUp size={15} />
                    <span>Q3 2026 Milestone Delivery</span>
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13.5px", fontWeight: 600 }}>1. Multi-Tier Enterprise Architecture & RBAC System</span>
                      <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>95%</span>
                    </div>
                    <div className="micro-progress-track">
                      <div className="micro-progress-fill" style={{ width: "95%", backgroundColor: "var(--accent-primary)" }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13.5px", fontWeight: 600 }}>2. Supabase Real-Time Sync & Multi-Device Deployment</span>
                      <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>90%</span>
                    </div>
                    <div className="micro-progress-track">
                      <div className="micro-progress-fill" style={{ width: "90%", backgroundColor: "var(--brand-indigo)" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEAM LEAD HUB (IF TIER 3+) */}
          {activeNav === "team_hub" && isManager && (
            <TeamLeadHub
              currentUser={currentUser}
              directReports={directReports}
              teamAttendance={teamAttendance}
              teamLeaves={teamLeaves}
              teamClaims={teamClaims}
              onUpdateLeaveStatus={onUpdateLeaveStatus}
              onUpdateClaimStatus={onUpdateClaimStatus}
              onSelectUserDossier={setSelectedUserDossier}
            />
          )}

          {/* TAB: DEPARTMENT WORKSPACES */}
          {activeNav === "departments" && (
            <DepartmentHubs
              activeDeptKey={currentUser.department === "Finance & Operations" ? "finance" : currentUser.department === "Human Resources" ? "hr" : "engineering"}
              departments={departments}
              assets={assets}
              sprints={sprints}
              claims={claims}
              allUsers={allUsers}
              onUpdateClaimStatus={onUpdateClaimStatus}
              onAddAsset={onAddAsset}
            />
          )}

          {/* TAB: INTERACTIVE ORG CHART */}
          {activeNav === "org_chart" && (
            <OrgChart
              orgTree={orgTree}
              allUsers={allUsers}
              onSelectUser={setSelectedUserDossier}
            />
          )}

          {/* TAB: EXECUTIVE COCKPIT (IF TIER 5 / C-SUITE) */}
          {activeNav === "executive" && isExecutive && (
            <ExecutiveCockpit
              currentUser={currentUser}
              departments={departments}
              allUsers={allUsers}
              announcements={announcements}
              onAddAnnouncement={onAddAnnouncement}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        <button
          type="button"
          className={`mobile-bottom-item ${activeNav === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveNav("dashboard")}
        >
          <LayoutDashboard className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Home</span>
        </button>

        <button
          type="button"
          className={`mobile-bottom-item ${activeNav === "attendance" ? "active" : ""}`}
          onClick={() => setActiveNav("attendance")}
        >
          <Clock className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Shift</span>
          {attendanceStatus?.isClockedIn && <span className="mobile-bottom-badge" style={{ backgroundColor: "var(--success)" }} />}
        </button>

        {isManager && (
          <button
            type="button"
            className={`mobile-bottom-item ${activeNav === "team_hub" ? "active" : ""}`}
            onClick={() => setActiveNav("team_hub")}
          >
            <Users className="mobile-bottom-icon" />
            <span className="mobile-bottom-label">Team</span>
            {teamLeaves.filter(l => l.status.includes("Pending")).length > 0 && <span className="mobile-bottom-badge" />}
          </button>
        )}

        <button
          type="button"
          className={`mobile-bottom-item ${activeNav === "org_chart" ? "active" : ""}`}
          onClick={() => setActiveNav("org_chart")}
        >
          <Layers className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Org Tree</span>
        </button>

        <button
          type="button"
          className="mobile-bottom-item"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open full menu"
        >
          <Menu className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Menu</span>
        </button>
      </nav>

      {/* MODAL: APPLY LEAVE */}
      {showLeaveModal && (
        <div className="modal-backdrop" onClick={() => setShowLeaveModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Leave</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowLeaveModal(false)}
              >
                ✕
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
                    <option value="Annual Leave">Annual Leave ({currentUser.annualLeaveBalance} Days Available)</option>
                    <option value="Sick Leave">Sick Leave ({currentUser.sickLeaveBalance} Days Available)</option>
                    <option value="Casual Leave">Casual Leave ({currentUser.casualLeaveBalance} Days Available)</option>
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
                    placeholder="Briefly explain the reason for time-off..."
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLeaveModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit to Manager
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
              <h3>Submit Expense Claim</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowClaimModal(false)}
              >
                ✕
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
                    <option value="Internet & Remote Work Allowance">Internet & Remote Work Allowance</option>
                    <option value="Client Transport & Fuel">Client Transport & Fuel</option>
                    <option value="Office & Tech Supplies">Office & Tech Supplies</option>
                    <option value="Meals & Entertainment">Meals & Entertainment</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount ($ USD)</label>
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
                  <label className="form-label">Description</label>
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
                  <label className="form-label">Receipt File</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. invoice_august_2026.pdf"
                    value={claimForm.receiptName}
                    onChange={(e) => setClaimForm({ ...claimForm, receiptName: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowClaimModal(false)}
                >
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

      {/* MODAL: PAYSLIP DETAILED BREAKDOWN */}
      {selectedPayslip && (
        <div className="modal-backdrop" onClick={() => setSelectedPayslip(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Itemized Payslip • {selectedPayslip.month}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedPayslip(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Employee</div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>{currentUser.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{currentUser.id} • {currentUser.title}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Disbursed On</div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>{selectedPayslip.payDate}</div>
                  <span className="badge badge-approved" style={{ marginTop: "4px" }}>PAID</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Basic Gross Salary</span>
                  <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{selectedPayslip.gross}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>PAYE Statutory Tax</span>
                  <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>-{selectedPayslip.tax}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Pension Contribution (8%)</span>
                  <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>-{selectedPayslip.pension}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>HMO Medical Withholding</span>
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
                onClick={() => alert("Downloading Itemized PDF Statement...")}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedPayslip(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: USER DOSSIER VIEW */}
      {selectedUserDossier && (
        <div className="modal-backdrop" onClick={() => setSelectedUserDossier(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Employee Dossier • {selectedUserDossier.name}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedUserDossier(null)}
              >
                ✕
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
                    fontSize: "16px",
                  }}
                >
                  {selectedUserDossier.avatarInitials || selectedUserDossier.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700 }}>{selectedUserDossier.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {selectedUserDossier.title} • {selectedUserDossier.department}
                  </div>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Employee ID</div>
                  <div className="detail-value">{selectedUserDossier.id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Authority Tier</div>
                  <div className="detail-value">{getTierLabel(selectedUserDossier.tier)}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Reporting Line Manager</div>
                  <div className="detail-value">{selectedUserDossier.managerName || "Board of Directors"}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Work Location</div>
                  <div className="detail-value">{selectedUserDossier.location}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Monthly Compensation</div>
                  <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                    {selectedUserDossier.salary}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Performance Review Rating</div>
                  <div className="detail-value">{selectedUserDossier.score}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedUserDossier(null)}
              >
                Close Dossier
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
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsEditingProfile(false)}
              >
                ✕
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
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditingProfile(false)}
                >
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
