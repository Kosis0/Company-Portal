import { useState } from "react";
import {
  Users,
  ChevronDown,
  ChevronRight,
  Shield,
  Briefcase,
  MapPin,
  Mail,
  Award,
  Layers,
  Crown
} from "lucide-react";

export default function OrgChart({ orgTree, allUsers = [], onSelectUser }) {
  const [expandedNodes, setExpandedNodes] = useState({
    "USR-001": true,
    "USR-002": true,
    "USR-003": true,
    "USR-004": true,
    "USR-005": true,
  });

  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const toggleExpand = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 5:
        return { label: "Tier 5 • C-Suite / Executive", color: "var(--purple-wash)", text: "var(--purple-text)", icon: Crown };
      case 4:
        return { label: "Tier 4 • Head of Department", color: "var(--brand-indigo-light)", text: "var(--brand-indigo)", icon: Shield };
      case 3:
        return { label: "Tier 3 • Team Lead / Manager", color: "var(--warning-wash)", text: "var(--warning)", icon: Users };
      case 2:
        return { label: "Tier 2 • Senior Contributor", color: "var(--info-wash)", text: "var(--info)", icon: Award };
      default:
        return { label: "Tier 1 • Staff Associate", color: "var(--success-wash)", text: "var(--success)", icon: Briefcase };
    }
  };

  // Render a recursive organization tree node
  const renderTreeNode = (node, depth = 0) => {
    if (!node) return null;
    const hasChildren = node.directReports && node.directReports.length > 0;
    const isExpanded = Boolean(expandedNodes[node.id]);
    const tierMeta = getTierBadge(node.tier);
    const TierIcon = tierMeta.icon;

    if (selectedDepartment !== "All" && node.department !== selectedDepartment && depth > 0 && !node.directReports?.some(r => r.department === selectedDepartment)) {
      return null;
    }

    return (
      <div key={node.id} style={{ marginLeft: depth > 0 ? "20px" : "0px", marginTop: "10px", position: "relative" }}>
        {depth > 0 && (
          <div
            style={{
              position: "absolute",
              left: "-14px",
              top: "22px",
              width: "14px",
              height: "1px",
              backgroundColor: "var(--border-subtle)",
            }}
          />
        )}

        <div
          className="card"
          style={{
            padding: "12px 14px",
            borderRadius: "var(--radius-md)",
            border: node.tier === 5 ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-surface)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: node.tier === 5 ? "var(--shadow-sm)" : "none",
            transition: "var(--transition-fast)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {hasChildren ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-icon-only"
                  onClick={() => toggleExpand(node.id)}
                  style={{ width: "24px", height: "24px", padding: "2px" }}
                  aria-label="Toggle subordinate branch"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <div style={{ width: "24px" }} />
              )}

              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--accent-primary-text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "13px",
                  flexShrink: 0,
                }}
              >
                {node.avatarInitials || node.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>

              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>{node.name}</span>
                  {node.tier === 5 && <Crown size={14} color="var(--purple-text)" />}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {node.title} • <span style={{ fontWeight: 600 }}>{node.department}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: tierMeta.color,
                  color: tierMeta.text,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <TierIcon size={12} />
                <span>Tier {node.tier}</span>
              </span>

              {hasChildren && (
                <span className="badge badge-neutral" style={{ fontSize: "11px" }}>
                  {node.directReports.length} direct reports
                </span>
              )}

              {onSelectUser && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSelectUser(node)}
                >
                  Dossier
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "11.5px", color: "var(--text-tertiary)", paddingLeft: "34px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Mail size={12} />
              <span>{node.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={12} />
              <span>{node.location || "Office"}</span>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div style={{ paddingLeft: "8px", borderLeft: "1px dashed var(--border-subtle)", marginLeft: "14px" }}>
            {node.directReports.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Interactive Organizational Hierarchy</h1>
          <p>Visual 5-tier chain of command, reporting lines, and departmental structure.</p>
        </div>

        <div className="segment-tabs" style={{ overflowX: "auto" }}>
          {["All", "Executive", "Engineering", "Human Resources", "Finance & Operations", "Product & Design"].map((dept) => (
            <button
              key={dept}
              type="button"
              className={`segment-tab-btn ${selectedDepartment === dept ? "active" : ""}`}
              onClick={() => setSelectedDepartment(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Organization Headcount</span>
            <div className="stat-icon-wash indigo">
              <Users size={16} />
            </div>
          </div>
          <div className="stat-card-value">{allUsers.length || 10} Staff</div>
          <div className="stat-card-footer">
            <span className="trend-badge up">100% Active</span>
            <span>Across 4 Locations</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Leadership Tiers</span>
            <div className="stat-icon-wash purple">
              <Layers size={16} />
            </div>
          </div>
          <div className="stat-card-value">5 Tiers</div>
          <div className="stat-card-footer">
            <span>Executive down to Interns</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">People Managers</span>
            <div className="stat-icon-wash amber">
              <Shield size={16} />
            </div>
          </div>
          <div className="stat-card-value">6 Leads / Directors</div>
          <div className="stat-card-footer">
            <span>Direct reporting chains</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Operating Units</span>
            <div className="stat-icon-wash emerald">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="stat-card-value">4 Departments</div>
          <div className="stat-card-footer">
            <span>Engineering, HR, Fin, Ops</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        {orgTree ? renderTreeNode(orgTree, 0) : (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--text-tertiary)" }}>
            Loading organizational hierarchy...
          </div>
        )}
      </div>
    </div>
  );
}
