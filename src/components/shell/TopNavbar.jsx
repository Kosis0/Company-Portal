import {
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
  globalSearch,
  setGlobalSearch,
  theme,
  onToggleTheme,
  attendanceStatus,
  elapsedSeconds,
  onLogout,
  showToast,
  formatTimer,
  getTierLabel,
}) {
  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        {/* Company Brand Logo for Mobile */}
        <button
          type="button"
          className="top-navbar-brand-btn"
          onClick={() => setActiveNav("overview")}
          title="Monolith ERP - Go to Overview"
          aria-label="Monolith ERP - Go to Overview"
        >
          <span className="top-navbar-logo">M</span>
        </button>

        {/* Desktop Breadcrumb Hierarchy */}
        <div className="top-navbar-breadcrumb">
          <span className="top-navbar-breadcrumb-dept">{currentUser.department}</span>
          <span className="top-navbar-breadcrumb-sep">/</span>
          <span className="current">
            {activeNav === "dashboard" || activeNav === "overview"
              ? "OVERVIEW"
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

      {/* Shift Status Indicator: Centered symmetrically on mobile */}
      <div
        className="shift-status-indicator"
        title={
          attendanceStatus?.isClockedIn
            ? `Currently On Shift • Elapsed: ${formatTimer(elapsedSeconds)}`
            : "Currently Off Shift"
        }
      >
        <span
          className={`shift-status-dot ${
            attendanceStatus?.isClockedIn ? "is-on-shift" : "is-off-shift"
          }`}
        />
        <span className="shift-status-label">
          {attendanceStatus?.isClockedIn ? "On Shift" : "Off Shift"}
        </span>
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
