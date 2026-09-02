import { useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarRange,
  DollarSign,
  TrendingUp,
  FileText
} from "lucide-react";

export default function TeamLeadHub({
  currentUser,
  directReports = [],
  teamAttendance = [],
  teamLeaves = [],
  teamClaims = [],
  onUpdateLeaveStatus,
  onUpdateClaimStatus,
  onSelectUserDossier,
}) {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  const pendingLeaves = teamLeaves.filter((l) => l.status === "Pending Manager" || l.status === "Pending");
  const pendingClaims = teamClaims.filter((c) => c.status === "Pending Lead" || c.status === "Pending");

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Team Lead & People Management Hub</h1>
          <p>
            Overseeing direct reports under {currentUser.name} • {currentUser.title}
          </p>
        </div>

        <div className="segment-tabs">
          <button
            type="button"
            className={`segment-tab-btn ${activeSubTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveSubTab("overview")}
          >
            Team Overview
          </button>
          <button
            type="button"
            className={`segment-tab-btn ${activeSubTab === "approvals" ? "active" : ""}`}
            onClick={() => setActiveSubTab("approvals")}
          >
            Pending Approvals ({pendingLeaves.length + pendingClaims.length})
          </button>
          <button
            type="button"
            className={`segment-tab-btn ${activeSubTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveSubTab("attendance")}
          >
            Live Team Shifts
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">My Direct Reports</span>
            <div className="stat-icon-wash indigo">
              <Users size={16} />
            </div>
          </div>
          <div className="stat-card-value">{directReports.length} Members</div>
          <div className="micro-progress-track">
            <div className="micro-progress-fill" style={{ width: "100%", backgroundColor: "var(--brand-indigo)" }} />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge up">100% On-Track</span>
            <span>{currentUser.department}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Level-1 Leave Requests</span>
            <div className="stat-icon-wash amber">
              <CalendarRange size={16} />
            </div>
          </div>
          <div className="stat-card-value">{pendingLeaves.length}</div>
          <div className="micro-progress-track">
            <div className="micro-progress-fill" style={{ width: pendingLeaves.length > 0 ? "50%" : "0%", backgroundColor: "var(--warning)" }} />
          </div>
          <div className="stat-card-footer">
            <span>{pendingLeaves.length > 0 ? "Action Required" : "All reviewed"}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Expense Claims to Verify</span>
            <div className="stat-icon-wash rose">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="stat-card-value">{pendingClaims.length}</div>
          <div className="micro-progress-track">
            <div className="micro-progress-fill" style={{ width: pendingClaims.length > 0 ? "50%" : "0%", backgroundColor: "var(--danger)" }} />
          </div>
          <div className="stat-card-footer">
            <span>Awaiting lead sign-off</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Team Average Rating</span>
            <div className="stat-icon-wash emerald">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="stat-card-value">4.6 / 5.0</div>
          <div className="stat-card-footer">
            <span className="trend-badge up">Exceeds Target</span>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: TEAM OVERVIEW */}
      {activeSubTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Users size={15} />
                <span>Direct Reports Roster</span>
              </span>
              <span className="card-subtitle">{directReports.length} team members</span>
            </div>

            {/* Desktop Table */}
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Job Title</th>
                    <th>Work Location</th>
                    <th>Compensation</th>
                    <th>Annual Leave Bal.</th>
                    <th>Performance</th>
                    <th>Shift Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {directReports.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{member.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{member.id} • {member.email}</div>
                      </td>
                      <td>{member.title}</td>
                      <td>{member.location}</td>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{member.salary}</td>
                      <td>{member.annualLeaveBalance} days left</td>
                      <td>
                        <span className="trend-badge up">{member.score}</span>
                      </td>
                      <td>
                        <span className="badge badge-approved">
                          <span className="badge-dot" />
                          <span>Active / On Shift</span>
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onSelectUserDossier(member)}
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
              {directReports.map((member) => (
                <div key={member.id} className="mobile-data-card">
                  <div className="mobile-data-card-header">
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700 }}>{member.name}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--text-tertiary)" }}>{member.id} • {member.title}</div>
                    </div>
                    <span className="badge badge-approved">Active</span>
                  </div>
                  <div className="mobile-data-card-row">
                    <span className="mobile-data-card-label">Annual Leave</span>
                    <span className="mobile-data-card-val">{member.annualLeaveBalance} days remaining</span>
                  </div>
                  <div className="mobile-data-card-row">
                    <span className="mobile-data-card-label">Performance</span>
                    <span className="mobile-data-card-val" style={{ fontWeight: 700 }}>{member.score}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: "6px", width: "100%" }}
                    onClick={() => onSelectUserDossier(member)}
                  >
                    <FileText size={14} />
                    <span>View Member Dossier</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: APPROVALS */}
      {activeSubTab === "approvals" && (
        <div className="responsive-split-grid-balanced" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
          {/* Team Leaves Queue */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <CalendarRange size={15} />
                <span>Level-1 Leave Approvals Queue</span>
              </span>
              <span className="card-subtitle">{pendingLeaves.length} pending</span>
            </div>

            {pendingLeaves.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
                <CheckCircle2 size={24} color="var(--success)" style={{ margin: "0 auto 8px" }} />
                <p>No pending leave requests from your direct reports.</p>
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
                        <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>{req.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {req.type} • {req.dates} ({req.days} days)
                        </div>
                      </div>
                      <span className="badge badge-pending">Level 1 Review</span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontStyle: "italic" }}>
                      "{req.reason}"
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                      <button
                        type="button"
                        className="btn btn-danger-ghost btn-sm"
                        onClick={() => onUpdateLeaveStatus(req.id, "Rejected", currentUser.name)}
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => onUpdateLeaveStatus(req.id, "Approved", currentUser.name)}
                      >
                        <CheckCircle2 size={14} />
                        <span>Approve Leave</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Claims Queue */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <DollarSign size={15} />
                <span>Expense Verification Queue</span>
              </span>
              <span className="card-subtitle">{pendingClaims.length} claims</span>
            </div>

            {pendingClaims.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
                <CheckCircle2 size={24} color="var(--success)" style={{ margin: "0 auto 8px" }} />
                <p>All direct report claims verified.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {pendingClaims.map((c) => (
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
                        <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>{c.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {c.category} • {c.date}
                        </div>
                      </div>
                      <span style={{ fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{c.amount}</span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>{c.description}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                      <button
                        type="button"
                        className="btn btn-danger-ghost btn-sm"
                        onClick={() => onUpdateClaimStatus(c.id, "Rejected")}
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => onUpdateClaimStatus(c.id, "Pending Finance")}
                      >
                        <CheckCircle2 size={14} />
                        <span>Verify & Forward to Finance</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TEAM ATTENDANCE */}
      {activeSubTab === "attendance" && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Clock size={15} />
              <span>Direct Reports Real-Time Shifts</span>
            </span>
          </div>

          {/* Desktop Table */}
          <div className="table-responsive has-mobile-cards">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Duration</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamAttendance.map((rec, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{rec.name}</td>
                    <td>{rec.date}</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{rec.in}</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{rec.out}</td>
                    <td>{rec.hours}</td>
                    <td>{rec.location}</td>
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

          {/* Mobile Card List */}
          <div className="mobile-card-list">
            {teamAttendance.map((rec, i) => (
              <div key={i} className="mobile-data-card">
                <div className="mobile-data-card-header">
                  <div>
                    <div className="mobile-data-card-title">{rec.name}</div>
                    <div className="mobile-data-card-sub">{rec.date} • {rec.location}</div>
                  </div>
                  <span className="badge badge-approved">{rec.status}</span>
                </div>
                <div className="mobile-data-card-body">
                  <div className="mobile-data-card-row">
                    <span className="mobile-data-card-label">Shift Hours</span>
                    <span className="mobile-data-card-val" style={{ fontFamily: "var(--font-mono)" }}>
                      {rec.in} — {rec.out}
                    </span>
                  </div>
                  <div className="mobile-data-card-row">
                    <span className="mobile-data-card-label">Duration</span>
                    <span className="mobile-data-card-val" style={{ fontWeight: 700 }}>
                      {rec.hours}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
