import {
  Activity,
  Play,
  Square,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Flame,
  ShieldCheck,
  ArrowUpRight,
  CalendarRange,
  ChevronRight,
  Bell,
} from "lucide-react";
import {
  RevenueExpensesTrendChart,
  SalesByRegionDonutChart,
} from "../AnalyticsCharts";

export default function OverviewDashboard({
  allUsers = [],
  attendanceStatus,
  elapsedSeconds,
  formatTimer,
  onClockToggle,
  setActiveNav,
  recentActivities = [],
  myLeaves = [],
  announcements = [],
}) {
  return (
    <div>
      {/* Mobile Hero Attendance Widget */}
      <div className="mobile-clock-hero-card">
        <div>
          <div
            style={{
              fontSize: "11.5px",
              color: "var(--text-tertiary)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Today's Shift Attendance
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
              marginTop: "2px",
            }}
          >
            {attendanceStatus?.isClockedIn ? formatTimer(elapsedSeconds) : "00:00:00"}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Activity
              size={13}
              color={
                attendanceStatus?.isClockedIn
                  ? "var(--brand-sage)"
                  : "var(--text-tertiary)"
              }
            />
            <span>
              {attendanceStatus?.isClockedIn
                ? `Clocked in at ${attendanceStatus.clockInTime}`
                : "Shift standard: 09:00 - 17:00"}
            </span>
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
          <p>
            Enterprise health, operational throughput, multi-line trend metrics, and audit activities
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setActiveNav("financials")}
          >
            <TrendingUp size={14} />
            <span>Financial Metrics</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveNav("inventory")}
          >
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
            <div
              className="micro-progress-fill"
              style={{ width: "84%", backgroundColor: "var(--brand-sage)" }}
            />
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
            <div
              className="micro-progress-fill"
              style={{ width: "92%", backgroundColor: "#475569" }}
            />
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
            <div
              className="micro-progress-fill"
              style={{ width: "68%", backgroundColor: "var(--accent-sand)" }}
            />
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
            <div
              className="micro-progress-fill"
              style={{ width: "99.9%", backgroundColor: "var(--brand-sage)" }}
            />
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
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
            <span className="card-subtitle">
              Live real-time multi-department operational event stream
            </span>
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                      }}
                    >
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
                        {act.actor
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "13px" }}>
                          {act.actor}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          {act.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{act.action}</td>
                  <td>
                    <span className="badge badge-neutral">{act.department}</span>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      color: "var(--text-tertiary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {act.timestamp}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        act.status === "Approved" ||
                        act.status === "Executed" ||
                        act.status === "Completed"
                          ? "badge-sage"
                          : act.status === "In Transit"
                          ? "badge-info"
                          : "badge-neutral"
                      }`}
                    >
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <CalendarRange size={15} />
              <span>My Leave Summary</span>
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveNav("leaves")}
            >
              <span>Manage Leaves</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {myLeaves.length === 0 ? (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                color: "var(--text-tertiary)",
                fontSize: "13px",
              }}
            >
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
                        <span
                          className={`badge ${
                            req.status === "Approved"
                              ? "badge-sage"
                              : req.status.includes("Pending")
                              ? "badge-pending"
                              : "badge-rejected"
                          }`}
                        >
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
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
                <div style={{ fontSize: "13px", fontWeight: 700 }}>
                  {ann.title}
                </div>
                <div
                  style={{
                    fontSize: "11.5px",
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                  }}
                >
                  {ann.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
