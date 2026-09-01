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
  TrendingDown,
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
  Crown,
  Search,
  Package,
  Truck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  DollarSign,
  Flame,
  Send,
  Check,
  Boxes,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import OrgChart from "./OrgChart";
import TeamLeadHub from "./TeamLeadHub";
import DepartmentHubs from "./DepartmentHubs";
import ExecutiveCockpit from "./ExecutiveCockpit";
import {
  RevenueExpensesTrendChart,
  SalesByRegionDonutChart,
  CashFlowForecastChart,
  TopOperatingExpensesChart,
} from "./AnalyticsCharts";
import { ShipmentTimeline } from "./ShipmentTimeline";

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
  const [activeNav, setActiveNav] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [globalSearch, setGlobalSearch] = useState("");

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [selectedUserDossier, setSelectedUserDossier] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Operational State for Financials & Invoices
  const [invoices, setInvoices] = useState([
    { id: "INV-2026-089", customer: "Apex Technologies Inc.", email: "ap@apextech.io", issueDate: "2026-08-01", dueDate: "2026-08-15", amount: "$345,000.00", daysOverdue: 17, status: "Overdue" },
    { id: "INV-2026-092", customer: "Horizon Global Logistics Ltd", email: "billing@horizonlog.com", issueDate: "2026-08-05", dueDate: "2026-08-20", amount: "$180,000.00", daysOverdue: 12, status: "Overdue" },
    { id: "INV-2026-095", customer: "Vertex Nordic Semiconductor", email: "finance@vertexnordic.se", issueDate: "2026-08-10", dueDate: "2026-08-25", amount: "$95,000.00", daysOverdue: 7, status: "Overdue" },
    { id: "INV-2026-098", customer: "Sterling Energy Corp", email: "accounts@sterlingcorp.com", issueDate: "2026-08-20", dueDate: "2026-09-05", amount: "$420,000.00", daysOverdue: 0, status: "Due Soon" },
    { id: "INV-2026-101", customer: "Solaria Power Systems", email: "payables@solaria.eu", issueDate: "2026-08-25", dueDate: "2026-09-10", amount: "$200,000.00", daysOverdue: 0, status: "Pending" },
  ]);

  // Operational State for Inventory & Stock Alerts
  const [stockAlerts, setStockAlerts] = useState([
    { sku: "SKU-9901", name: "Apex Sensor Modules", category: "Hardware Components", currentStock: 14, minThreshold: 50, supplier: "Apex Silicon Dist.", unitCost: "$45.00", status: "Critical" },
    { sku: "SKU-9904", name: "High-Density Optical Transceivers", category: "Network Equipment", currentStock: 8, minThreshold: 30, supplier: "Global Logistics", unitCost: "$120.00", status: "Critical" },
    { sku: "SKU-9908", name: "Monolith Micro-Controllers v2", category: "Microchips", currentStock: 22, minThreshold: 60, supplier: "Monolith Raw Mat.", unitCost: "$18.50", status: "Low Stock" },
    { sku: "SKU-9912", name: "Enterprise NVMe SSD 2TB", category: "Storage Hardware", currentStock: 19, minThreshold: 40, supplier: "Supplier ABC", unitCost: "$85.00", status: "Low Stock" },
  ]);

  const [notificationToast, setNotificationToast] = useState(null);

  const showToast = (message) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleSendReminder = (invId, customer) => {
    showToast(`Payment reminder dispatched to ${customer} for invoice ${invId}`);
  };

  const handleMarkInvoicePaid = (invId) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invId ? { ...inv, status: "Paid", daysOverdue: 0 } : inv
      )
    );
    showToast(`Invoice ${invId} marked as settled.`);
  };

  const handleCreatePO = (item) => {
    const poNumber = `PO-${item.sku.replace(/\D/g, "")}`;
    setStockAlerts((prev) =>
      prev.map((alertItem) =>
        alertItem.sku === item.sku
          ? { ...alertItem, currentStock: alertItem.minThreshold + 20, status: "Adequate" }
          : alertItem
      )
    );
    showToast(`Purchase Order ${poNumber} created for ${item.name} (${item.minThreshold - item.currentStock + 20} units) from ${item.supplier}`);
  };

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

  const recentActivities = [
    { id: "ACT-01", actor: "Dr. Alexander Vance", role: "CEO", department: "Executive", action: "Published strategic Q3 enterprise bulletin", timestamp: "12m ago", status: "Active" },
    { id: "ACT-02", actor: "Marcus Brody", role: "Head of Finance", department: "Finance", action: "Executed August Company Batch Payroll ($68,500)", timestamp: "45m ago", status: "Executed" },
    { id: "ACT-03", actor: "Victoria Sterling", role: "VP HR", department: "HR", action: "Approved Level-1 Leave Request LV-201 (5 days)", timestamp: "1h ago", status: "Approved" },
    { id: "ACT-04", actor: "Sarah Chen", role: "Frontend Lead", department: "Engineering", action: "Verified Out-of-Pocket Expense Claim CLM-301", timestamp: "2h ago", status: "Verified" },
    { id: "ACT-05", actor: "Tunde Bakare", role: "VP Engineering", department: "Engineering", action: "Requisitioned Cloud Sandbox AWS-PROD-EAST", timestamp: "3h ago", status: "Active" },
    { id: "ACT-06", actor: "David Okonjo", role: "DevOps Lead", department: "Engineering", action: "Allocated MacBook Pro M3 (AST-105) to Design", timestamp: "4h ago", status: "Completed" },
    { id: "ACT-07", actor: "Global Logistics", role: "Carrier", department: "Supply Chain", action: "Inbound Shipment SHP-001 arriving tomorrow", timestamp: "5h ago", status: "In Transit" },
  ];

  const topProducts = [
    { sku: "SKU-1001", name: "Apex Industrial Edge Controller", category: "Industrial IoT", unitsSold: "1,240", revenue: "$496,000", margin: "42.5%", status: "In Stock" },
    { sku: "SKU-1002", name: "Monolith Core Processor v4", category: "Semiconductors", unitsSold: "980", revenue: "$784,000", margin: "51.2%", status: "In Stock" },
    { sku: "SKU-1003", name: "Enterprise Mesh Gateway Pro", category: "Networking", unitsSold: "750", revenue: "$225,000", margin: "38.0%", status: "Low Stock" },
    { sku: "SKU-1004", name: "Secure Enclave HSM Module", category: "Security Hardware", unitsSold: "620", revenue: "$310,000", margin: "64.0%", status: "In Stock" },
  ];

  return (
    <div className="app-container">
      {/* Dynamic Action Toast */}
      {notificationToast && (
        <div className="toast-container">
          <div className="toast toast-info">
            <CheckCircle2 className="toast-icon" color="var(--brand-sage)" />
            <div className="toast-content">
              <h4>System Notification</h4>
              <p>{notificationToast}</p>
            </div>
          </div>
        </div>
      )}

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
          {/* SECTION 1: OPERATIONS */}
          <div className="sidebar-section-title">OPERATIONS</div>
          <button
            type="button"
            className={`nav-item ${activeNav === "overview" || activeNav === "dashboard" ? "active" : ""}`}
            onClick={() => { setActiveNav("overview"); setMobileMenuOpen(false); }}
          >
            <LayoutDashboard className="nav-item-icon" />
            <span>Organization Overview</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "financials" ? "active" : ""}`}
            onClick={() => { setActiveNav("financials"); setMobileMenuOpen(false); }}
          >
            <TrendingUp className="nav-item-icon" />
            <span>Financial Performance</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "inventory" ? "active" : ""}`}
            onClick={() => { setActiveNav("inventory"); setMobileMenuOpen(false); }}
          >
            <Package className="nav-item-icon" />
            <span>Inventory & Supply Chain</span>
          </button>

          {/* SECTION 2: PERSONAL WORKSPACE */}
          <div className="sidebar-section-title" style={{ marginTop: "12px" }}>MY WORKSPACE</div>
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
            {myClaims.filter(c => c.status !== "Approved").length > 0 && (
              <span className="nav-item-badge">{myClaims.filter(c => c.status !== "Approved").length}</span>
            )}
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
            <Activity className="nav-item-icon" />
            <span>OKRs & Performance</span>
          </button>

          {/* SECTION 3: TEAM LEAD HUB (TIER 3+) */}
          {isManager && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: "12px" }}>
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

          {/* SECTION 4: DEPARTMENT TOOLKITS */}
          {(isDirector || isExecutive || currentUser.department !== "Executive") && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: "12px" }}>
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

          {/* SECTION 5: ORGANIZATION */}
          <div className="sidebar-section-title" style={{ marginTop: "12px" }}>
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

          {/* SECTION 6: EXECUTIVE SUITE (TIER 5) */}
          {isExecutive && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: "12px" }}>
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
              <span className="current">
                {activeNav === "dashboard" || activeNav === "overview"
                  ? "ORGANIZATION OVERVIEW"
                  : activeNav.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Rounded Search Bar */}
          <div className="top-navbar-search">
            <div className="top-search-wrapper">
              <Search className="top-search-icon" size={15} />
              <input
                type="text"
                className="top-search-input"
                placeholder="Search workforce, invoices, inventory, reports..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="top-navbar-right">
            {/* Notification Bell with indicator dot */}
            <button
              type="button"
              className="notification-btn"
              title="Notifications"
              aria-label="Notifications"
              onClick={() => showToast("3 Active Alerts: 1 Overdue Customer Invoice, 2 Low Stock Threshold Alerts, 1 Pending Team Leave.")}
            >
              <Bell size={16} />
              <span className="notification-dot" />
            </button>

            {/* Live Tier Chip */}
            <span className="badge badge-neutral" style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>
              <ShieldCheck size={13} color="var(--brand-sage)" />
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

            {/* Circular User Avatar */}
            <div
              className="header-user-avatar"
              onClick={() => setActiveNav("profile")}
              title={`${currentUser.name} (${currentUser.title})`}
            >
              {currentUser.avatarInitials || currentUser.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>

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
          {/* TAB 1: ORGANIZATION OVERVIEW DASHBOARD */}
          {(activeNav === "overview" || activeNav === "dashboard") && (
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
                    <Activity size={13} color={attendanceStatus?.isClockedIn ? "var(--brand-sage)" : "var(--text-tertiary)"} />
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
                  <h1>Organization Overview</h1>
                  <p>Enterprise health, operational throughput, multi-line trend metrics, and audit activities</p>
                </div>
                <div className="page-actions">
                  <button type="button" className="btn btn-primary" onClick={() => setActiveNav("financials")}>
                    <TrendingUp size={14} />
                    <span>Financial Metrics</span>
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveNav("inventory")}>
                    <Package size={14} />
                    <span>Supply Chain</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Total Revenue</span>
                    <div className="stat-icon-wash sage">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$13.5M</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "84%", backgroundColor: "var(--brand-sage)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">
                      <ArrowUpRight size={12} />
                      <span>+12.4%</span>
                    </span>
                    <span>vs. previous month</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Company Headcount</span>
                    <div className="stat-icon-wash neutral">
                      <Users size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{allUsers.length || 10} Active</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "92%", backgroundColor: "#475569" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">
                      <ArrowUpRight size={12} />
                      <span>+4 New</span>
                    </span>
                    <span>Q3 Talent Expansion</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Operational Burn</span>
                    <div className="stat-icon-wash sand">
                      <Flame size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$68,500/mo</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "68%", backgroundColor: "var(--accent-sand)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge neutral">On Target</span>
                    <span>-2.1% under forecast</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">System Uptime & SLA</span>
                    <div className="stat-icon-wash sage">
                      <ShieldCheck size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">99.94%</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "99.9%", backgroundColor: "var(--brand-sage)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">
                      <ArrowUpRight size={12} />
                      <span>+0.02%</span>
                    </span>
                    <span>Enterprise SLA Met</span>
                  </div>
                </div>
              </div>

              {/* Visualization Grid: Trend Multi-line Chart + Donut Segmented Chart */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "22px" }}>
                <div className="card">
                  <RevenueExpensesTrendChart />
                </div>
                <div className="card">
                  <SalesByRegionDonutChart />
                </div>
              </div>

              {/* Recent Operational Activities Audit Table */}
              <div className="card" style={{ marginBottom: "22px" }}>
                <div className="card-header">
                  <div>
                    <span className="card-title">
                      <Activity size={16} color="var(--brand-sage)" />
                      <span>Recent Operational Activities</span>
                    </span>
                    <span className="card-subtitle">Live real-time multi-department operational event stream</span>
                  </div>
                  <span className="badge badge-sage">Live Sync Active</span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Actor & Role</th>
                        <th>Action & Target</th>
                        <th>Department</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((act) => (
                        <tr key={act.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                              <div
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "6px",
                                  backgroundColor: "var(--bg-surface-elevated)",
                                  border: "1px solid var(--border-default)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: "var(--text-primary)",
                                  flexShrink: 0,
                                }}
                              >
                                {act.actor.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: "13px" }}>{act.actor}</div>
                                <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{act.role}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 500 }}>{act.action}</td>
                          <td>
                            <span className="badge badge-neutral">{act.department}</span>
                          </td>
                          <td style={{ fontSize: "12px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                            {act.timestamp}
                          </td>
                          <td>
                            <span className={`badge ${act.status === "Approved" || act.status === "Executed" || act.status === "Completed" ? "badge-sage" : act.status === "In Transit" ? "badge-info" : "badge-neutral"}`}>
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Personal Quick Actions & Leaves Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <CalendarRange size={15} />
                      <span>My Leave Summary</span>
                    </span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setActiveNav("leaves")}>
                      <span>Manage Leaves</span>
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
                                <span className={`badge ${req.status === "Approved" ? "badge-sage" : req.status.includes("Pending") ? "badge-pending" : "badge-rejected"}`}>
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
                      <span>Strategic Broadcasts</span>
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

          {/* TAB 1B: FINANCIAL PERFORMANCE DASHBOARD */}
          {activeNav === "financials" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Financial Performance</h1>
                  <p>Cash flow projections, operating expense breakdowns, and customer accounts receivable</p>
                </div>
                <div className="page-actions">
                  <button type="button" className="btn btn-primary" onClick={() => showToast("Exporting Q3 Comprehensive Financial Statement (CSV/PDF)...")}>
                    <Download size={14} />
                    <span>Export Statement</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Monthly Inflow</span>
                    <div className="stat-icon-wash sage">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$18.0M</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "90%", backgroundColor: "var(--brand-sage)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">
                      <ArrowUpRight size={12} />
                      <span>+15.2%</span>
                    </span>
                    <span>above forecast</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Monthly Outflow</span>
                    <div className="stat-icon-wash sand">
                      <TrendingDown size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$8.5M</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "47%", backgroundColor: "var(--accent-sand)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge neutral">
                      <ArrowDownRight size={12} />
                      <span>-4.1%</span>
                    </span>
                    <span>cost reduction</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Net Cash Position</span>
                    <div className="stat-icon-wash sage">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$42.8M</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "85%", backgroundColor: "var(--brand-sage)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">
                      <ArrowUpRight size={12} />
                      <span>+24.6%</span>
                    </span>
                    <span>Treasury Reserve</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Outstanding Receivables</span>
                    <div className="stat-icon-wash terracotta">
                      <AlertTriangle size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">$1.24M</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "28%", backgroundColor: "var(--accent-terracotta)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge down">
                      <span>{invoices.filter((i) => i.status === "Overdue").length} Overdue</span>
                    </span>
                    <span>Action required</span>
                  </div>
                </div>
              </div>

              {/* Visualizations: Cash Flow Forecast + Top Operating Expenses */}
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px", marginBottom: "22px" }}>
                <div className="card">
                  <CashFlowForecastChart />
                </div>
                <div className="card">
                  <TopOperatingExpensesChart />
                </div>
              </div>

              {/* Unpaid Customer Invoices Table with Terracotta Badges */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <span className="card-title">
                      <Receipt size={16} color="var(--accent-terracotta)" />
                      <span>Unpaid Customer Invoices & Receivables</span>
                    </span>
                    <span className="card-subtitle">Customer invoices pending settlement with automated collection actions</span>
                  </div>
                  <span className="badge badge-terracotta">
                    {invoices.filter((i) => i.status === "Overdue").length} Overdue Notices
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Customer / Client Entity</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{inv.id}</td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600 }}>{inv.customer}</div>
                              <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{inv.email}</div>
                            </div>
                          </td>
                          <td style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}>{inv.issueDate}</td>
                          <td style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}>{inv.dueDate}</td>
                          <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{inv.amount}</td>
                          <td>
                            {inv.status === "Overdue" ? (
                              <span className="badge badge-overdue">
                                {inv.daysOverdue} Days Overdue
                              </span>
                            ) : inv.status === "Paid" ? (
                              <span className="badge badge-sage">Settled</span>
                            ) : (
                              <span className="badge badge-sand">{inv.status}</span>
                            )}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                              {inv.status !== "Paid" && (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleSendReminder(inv.id, inv.customer)}
                                    title="Send payment reminder email"
                                  >
                                    <Send size={12} />
                                    <span>Remind</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sage btn-sm"
                                    onClick={() => handleMarkInvoicePaid(inv.id)}
                                    title="Record payment received"
                                  >
                                    <Check size={12} />
                                    <span>Mark Paid</span>
                                  </button>
                                </>
                              )}
                              {inv.status === "Paid" && (
                                <span style={{ fontSize: "12px", color: "var(--brand-sage)", fontWeight: 600 }}>
                                  ✓ Settled
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1C: INVENTORY & SUPPLY CHAIN DASHBOARD */}
          {activeNav === "inventory" && (
            <div>
              <div className="page-header">
                <div className="page-title">
                  <h1>Inventory & Supply Chain</h1>
                  <p>Stock level monitoring, supplier fulfillment, reorder requisitions, and incoming logistics</p>
                </div>
                <div className="page-actions">
                  <button
                    type="button"
                    className="btn btn-sage"
                    onClick={() => {
                      showToast("Purchase Requisition wizard opened.");
                    }}
                  >
                    <Plus size={14} />
                    <span>Create Purchase Order</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">SKUs in Stock</span>
                    <div className="stat-icon-wash sage">
                      <Package size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">2,450 SKUs</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "98.2%", backgroundColor: "var(--brand-sage)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">98.2%</span>
                    <span>Availability Rate</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Low Stock Items</span>
                    <div className="stat-icon-wash terracotta">
                      <AlertOctagon size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">{stockAlerts.length} Alerts</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "25%", backgroundColor: "var(--accent-terracotta)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge down">Critical</span>
                    <span>Reorder Required</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Active Shipments</span>
                    <div className="stat-icon-wash sage">
                      <Truck size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">8 In Transit</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "75%", backgroundColor: "var(--brand-sage)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">2 Arriving</span>
                    <span>Schedule on time</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Supplier Fulfillment</span>
                    <div className="stat-icon-wash sage">
                      <ShieldCheck size={16} />
                    </div>
                  </div>
                  <div className="stat-card-value">99.4%</div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: "99.4%", backgroundColor: "var(--brand-sage)" }} />
                  </div>
                  <div className="stat-card-footer">
                    <span className="trend-badge up">+1.2%</span>
                    <span>Weekly SLA Index</span>
                  </div>
                </div>
              </div>

              {/* 2-Column Grid: Stock Level Alerts (with Sage 'Create PO' buttons) + Connected Shipment Timeline */}
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px", marginBottom: "22px" }}>
                <div className="card">
                  <div className="card-header">
                    <div>
                      <span className="card-title">
                        <AlertOctagon size={16} color="var(--accent-terracotta)" />
                        <span>Stock Level Alerts</span>
                      </span>
                      <span className="card-subtitle">Items below safety reorder threshold</span>
                    </div>
                    <span className="badge badge-terracotta">{stockAlerts.length} Action Items</span>
                  </div>

                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>SKU & Name</th>
                          <th>Stock Level</th>
                          <th>Supplier</th>
                          <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockAlerts.map((item) => (
                          <tr key={item.sku}>
                            <td>
                              <div>
                                <div style={{ fontWeight: 600 }}>{item.name}</div>
                                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                                  {item.sku} • {item.category}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontWeight: 700, color: "var(--accent-terracotta)", fontFamily: "var(--font-mono)" }}>
                                  {item.currentStock}
                                </span>
                                <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                                  / {item.minThreshold} min
                                </span>
                                <span className={item.status === "Critical" ? "badge badge-terracotta" : "badge badge-sand"} style={{ fontSize: "10px", padding: "1px 6px" }}>
                                  {item.status}
                                </span>
                              </div>
                            </td>
                            <td style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{item.supplier}</td>
                            <td style={{ textAlign: "right" }}>
                              <button
                                type="button"
                                className="btn btn-sage btn-sm"
                                onClick={() => handleCreatePO(item)}
                              >
                                <Plus size={12} />
                                <span>Create PO</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card">
                  <ShipmentTimeline />
                </div>
              </div>

              {/* Top Selling Products Table */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <span className="card-title">
                      <Boxes size={16} color="var(--brand-sage)" />
                      <span>Top Selling Products & High-Velocity Inventory</span>
                    </span>
                    <span className="card-subtitle">Volume ranking and gross margin contribution</span>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Units Sold</th>
                        <th>Total Revenue</th>
                        <th>Gross Margin</th>
                        <th>Stock Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((prod) => (
                        <tr key={prod.sku}>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{prod.sku}</td>
                          <td style={{ fontWeight: 600 }}>{prod.name}</td>
                          <td>
                            <span className="badge badge-neutral">{prod.category}</span>
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>{prod.unitsSold} units</td>
                          <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{prod.revenue}</td>
                          <td style={{ fontFamily: "var(--font-mono)", color: "var(--brand-sage)", fontWeight: 700 }}>
                            {prod.margin}
                          </td>
                          <td>
                            <span className={`badge ${prod.status === "In Stock" ? "badge-sage" : "badge-sand"}`}>
                              {prod.status}
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
