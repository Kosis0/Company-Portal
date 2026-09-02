import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

export default function TopNavbar({
  currentUser,
  activeNav,
  setActiveNav,
  mobileMenuOpen,
  setMobileMenuOpen,
  globalSearch,
  setGlobalSearch,
  theme,
  onToggleTheme,
  attendanceStatus,
  elapsedSeconds,
  onClockToggle,
  onLogout,
  showToast,
  formatTimer,
  getTierLabel,
}) {
  return (
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
          <span className="top-navbar-breadcrumb-dept">{currentUser.department}</span>
          <span className="top-navbar-breadcrumb-sep">/</span>
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
          className="notification-btn top-navbar-notification-btn"
          title="Notifications"
          aria-label="Notifications"
          onClick={() =>
            showToast(
              "3 Active Alerts: 1 Overdue Customer Invoice, 2 Low Stock Threshold Alerts, 1 Pending Team Leave."
            )
          }
        >
          <Bell size={16} />
          <span className="notification-dot" />
        </button>

        {/* Live Tier Chip (hidden on small phone screens) */}
        <span
          className="badge badge-neutral top-navbar-tier-badge"
          style={{
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <ShieldCheck size={13} color="var(--brand-sage)" />
          <span>{getTierLabel(currentUser.tier)}</span>
        </span>

        {/* Live Attendance Clock Status */}
        <div
          className="live-shift-chip"
          onClick={onClockToggle}
          style={{ cursor: "pointer" }}
        >
          <span
            className={`live-pulse-dot ${
              attendanceStatus?.isClockedIn ? "active" : ""
            }`}
          />
          <span className="live-timer-text">
            {attendanceStatus?.isClockedIn
              ? formatTimer(elapsedSeconds)
              : "Off Shift"}
          </span>
          <span
            style={{ fontSize: "10.5px", fontWeight: 700, opacity: 0.8 }}
          >
            {attendanceStatus?.isClockedIn ? "OUT" : "IN"}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="btn btn-secondary btn-icon-only top-navbar-theme-btn"
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
          {currentUser.avatarInitials ||
            currentUser.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
        </div>

        {/* Logout Button */}
        <button
          type="button"
          className="btn btn-secondary btn-icon-only top-navbar-logout-btn"
          onClick={onLogout}
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
