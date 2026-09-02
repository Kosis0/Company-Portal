import { useState } from "react";
import {
  Crown,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building,
  Megaphone
} from "lucide-react";

export default function ExecutiveCockpit({
  departments = [],
  allUsers = [],
  announcements = [],
  onAddAnnouncement,
}) {
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annForm, setAnnForm] = useState({
    title: "",
    type: "Important",
    content: "",
  });

  const totalMonthlyPayroll = allUsers.reduce((acc, u) => acc + (u.monthlyBasePay || 3500), 0);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!annForm.title || !annForm.content) return;
    if (onAddAnnouncement) {
      onAddAnnouncement(annForm);
    }
    setAnnForm({ title: "", type: "Important", content: "" });
    setShowAnnounceModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Executive Command Cockpit • C-Suite Overview</h1>
          <p>
            Strategic corporate health, organization burn rate, and executive governance.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAnnounceModal(true)}
        >
          <Megaphone size={14} />
          <span>Broadcast Strategic Notice</span>
        </button>
      </div>

      {/* High-Level Executive Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Corporate Headcount</span>
            <div className="stat-icon-wash purple">
              <Crown size={16} />
            </div>
          </div>
          <div className="stat-card-value">{allUsers.length} Full-Time</div>
          <div className="micro-progress-track">
            <div className="micro-progress-fill" style={{ width: "100%", backgroundColor: "var(--purple-text)" }} />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge up">100% Active</span>
            <span>Across 4 Operating Units</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Monthly Payroll Outlay</span>
            <div className="stat-icon-wash indigo">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="stat-card-value">${totalMonthlyPayroll.toLocaleString()}.00</div>
          <div className="micro-progress-track">
            <div className="micro-progress-fill" style={{ width: "80%", backgroundColor: "var(--brand-indigo)" }} />
          </div>
          <div className="stat-card-footer">
            <span>Automated PAYE Remitted</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Annualized Retention Rate</span>
            <div className="stat-icon-wash emerald">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="stat-card-value">100%</div>
          <div className="micro-progress-track">
            <div className="micro-progress-fill" style={{ width: "100%", backgroundColor: "var(--success)" }} />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge up">Optimal</span>
            <span>Zero voluntary turnover</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Average Performance Score</span>
            <div className="stat-icon-wash amber">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="stat-card-value">4.7 / 5.0</div>
          <div className="stat-card-footer">
            <span className="trend-badge up">Exceeding Targets</span>
          </div>
        </div>
      </div>

      {/* Strategic Department Allocations */}
      <div className="responsive-split-grid-balanced" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Building size={15} />
              <span>Departmental Budget Allocations & Operating Units</span>
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {departments.map((dept) => (
              <div
                key={dept.id}
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700 }}>{dept.name}</div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                      Lead: {dept.headName} ({dept.headTitle}) • {dept.headcount} Staff
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                      {dept.monthlyBudget}
                    </span>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Budget / mo</div>
                  </div>
                </div>

                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px", fontStyle: "italic" }}>
                  "{dept.leadObjective}"
                </p>

                <div style={{ marginTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "4px" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>Budget Utilization</span>
                    <span style={{ fontWeight: 700 }}>{dept.budgetUtilization}</span>
                  </div>
                  <div className="micro-progress-track">
                    <div className="micro-progress-fill" style={{ width: dept.budgetUtilization, backgroundColor: "var(--accent-primary)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Broadcast Notices */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Megaphone size={15} />
              <span>Active Strategic Bulletins</span>
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{ann.title}</div>
                  <span className={`badge ${ann.type === "Important" ? "badge-rejected" : "badge-neutral"}`}>
                    {ann.type}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>{ann.content}</p>
                <div style={{ fontSize: "10.5px", color: "var(--text-tertiary)", marginTop: "4px" }}>
                  Published on {ann.date} by {ann.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: BROADCAST ANNOUNCEMENT */}
      {showAnnounceModal && (
        <div className="modal-backdrop" onClick={() => setShowAnnounceModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Broadcast Executive Notice</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAnnounceModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBroadcast}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Notice Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Q3 Townhall Keynotes & Expansion"
                    value={annForm.title}
                    onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Classification Tier</label>
                  <select
                    className="form-select"
                    value={annForm.type}
                    onChange={(e) => setAnnForm({ ...annForm, type: e.target.value })}
                  >
                    <option value="Important">Important (Urgent Banner)</option>
                    <option value="General">General Corporate Bulletin</option>
                    <option value="Policy">Governance & Policy Update</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message Body</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Write the organization-wide message..."
                    value={annForm.content}
                    onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAnnounceModal(false)}
                >
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
    </div>
  );
}
