import {
  LayoutDashboard,
  Clock,
  Users,
  Layers,
  Menu,
} from "lucide-react";

export default function MobileBottomBar({
  activeNav,
  setActiveNav,
  setMobileMenuOpen,
  attendanceStatus,
  isManager,
  teamLeaves = [],
}) {
  const pendingLeavesCount = teamLeaves.filter((l) =>
    l.status.includes("Pending")
  ).length;

  const isSubModule = ![
    "overview",
    "dashboard",
    "attendance",
    "team_hub",
    "org_chart",
  ].includes(activeNav);

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      <button
        type="button"
        className={`mobile-bottom-item ${
          activeNav === "overview" || activeNav === "dashboard" ? "active" : ""
        }`}
        onClick={() => setActiveNav("overview")}
      >
        <LayoutDashboard className="mobile-bottom-icon" />
        <span className="mobile-bottom-label">Home</span>
      </button>

      <button
        type="button"
        className={`mobile-bottom-item ${
          activeNav === "attendance" ? "active" : ""
        }`}
        onClick={() => setActiveNav("attendance")}
      >
        <Clock className="mobile-bottom-icon" />
        <span className="mobile-bottom-label">Shift</span>
        {attendanceStatus?.isClockedIn && (
          <span
            className="mobile-bottom-badge"
            style={{ backgroundColor: "var(--success)" }}
          />
        )}
      </button>

      {isManager && (
        <button
          type="button"
          className={`mobile-bottom-item ${
            activeNav === "team_hub" ? "active" : ""
          }`}
          onClick={() => setActiveNav("team_hub")}
        >
          <Users className="mobile-bottom-icon" />
          <span className="mobile-bottom-label">Team</span>
          {pendingLeavesCount > 0 && <span className="mobile-bottom-badge" />}
        </button>
      )}

      <button
        type="button"
        className={`mobile-bottom-item ${
          activeNav === "org_chart" ? "active" : ""
        }`}
        onClick={() => setActiveNav("org_chart")}
      >
        <Layers className="mobile-bottom-icon" />
        <span className="mobile-bottom-label">Org Tree</span>
      </button>

      <button
        type="button"
        className={`mobile-bottom-item ${isSubModule ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open full menu"
      >
        <Menu className="mobile-bottom-icon" />
        <span className="mobile-bottom-label">Menu</span>
        {isSubModule && (
          <span
            className="mobile-bottom-badge"
            style={{ backgroundColor: "var(--accent-primary)" }}
          />
        )}
      </button>
    </nav>
  );
}
