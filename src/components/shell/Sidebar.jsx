import {
  LayoutDashboard,
  TrendingUp,
  Package,
  UserCircle,
  Clock,
  CalendarRange,
  Wallet,
  Receipt,
  ShieldPlus,
  Activity,
  Users,
  Building,
  Layers,
  Crown,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar({
  currentUser,
  activeNav,
  setActiveNav,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLogout,
  myLeaves = [],
  myClaims = [],
  teamLeaves = [],
}) {
  const isManager = Boolean(currentUser.tier >= 3);
  const isDirector = Boolean(currentUser.tier >= 4);
  const isExecutive = Boolean(currentUser.tier === 5 || currentUser.role === "admin");

  const handleNavClick = (navKey) => {
    setActiveNav(navKey);
    setMobileMenuOpen(false);
  };

  const pendingMyLeavesCount = myLeaves.filter(
    (r) => r.status === "Pending" || r.status === "Pending Manager"
  ).length;

  const pendingMyClaimsCount = myClaims.filter(
    (c) => c.status !== "Approved"
  ).length;

  const pendingTeamLeavesCount = teamLeaves.filter(
    (l) => l.status === "Pending Manager" || l.status === "Pending"
  ).length;

  return (
    <>
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
            onClick={() => handleNavClick("overview")}
          >
            <LayoutDashboard className="nav-item-icon" />
            <span>Organization Overview</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "financials" ? "active" : ""}`}
            onClick={() => handleNavClick("financials")}
          >
            <TrendingUp className="nav-item-icon" />
            <span>Financial Performance</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "inventory" ? "active" : ""}`}
            onClick={() => handleNavClick("inventory")}
          >
            <Package className="nav-item-icon" />
            <span>Inventory & Supply Chain</span>
          </button>

          {/* SECTION 2: PERSONAL WORKSPACE */}
          <div className="sidebar-section-title" style={{ marginTop: "12px" }}>
            MY WORKSPACE
          </div>
          <button
            type="button"
            className={`nav-item ${activeNav === "profile" ? "active" : ""}`}
            onClick={() => handleNavClick("profile")}
          >
            <UserCircle className="nav-item-icon" />
            <span>Personnel Profile</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "attendance" ? "active" : ""}`}
            onClick={() => handleNavClick("attendance")}
          >
            <Clock className="nav-item-icon" />
            <span>Shift Attendance</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "leaves" ? "active" : ""}`}
            onClick={() => handleNavClick("leaves")}
          >
            <CalendarRange className="nav-item-icon" />
            <span>My Leaves</span>
            {pendingMyLeavesCount > 0 && (
              <span className="nav-item-badge">{pendingMyLeavesCount}</span>
            )}
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "payroll" ? "active" : ""}`}
            onClick={() => handleNavClick("payroll")}
          >
            <Wallet className="nav-item-icon" />
            <span>Payslips & Tax</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "claims" ? "active" : ""}`}
            onClick={() => handleNavClick("claims")}
          >
            <Receipt className="nav-item-icon" />
            <span>Reimbursements</span>
            {pendingMyClaimsCount > 0 && (
              <span className="nav-item-badge">{pendingMyClaimsCount}</span>
            )}
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "hmo" ? "active" : ""}`}
            onClick={() => handleNavClick("hmo")}
          >
            <ShieldPlus className="nav-item-icon" />
            <span>HMO Medical Care</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "okrs" ? "active" : ""}`}
            onClick={() => handleNavClick("okrs")}
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
                onClick={() => handleNavClick("team_hub")}
              >
                <Users className="nav-item-icon" />
                <span>Team Lead Hub</span>
                {pendingTeamLeavesCount > 0 && (
                  <span className="nav-item-badge">{pendingTeamLeavesCount}</span>
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
                onClick={() => handleNavClick("departments")}
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
            onClick={() => handleNavClick("org_chart")}
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
                onClick={() => handleNavClick("executive")}
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
              {currentUser.avatarInitials ||
                currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
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
    </>
  );
}
