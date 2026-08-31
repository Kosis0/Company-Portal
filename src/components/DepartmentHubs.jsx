import { useState } from "react";
import {
  Code,
  Terminal,
  Server,
  DollarSign,
  CreditCard,
  Users,
  Shield,
  HardDrive,
  Plus,
  CheckCircle2,
  Clock,
  Play,
  Calendar,
  Sparkles,
  Cpu
} from "lucide-react";

export default function DepartmentHubs({
  activeDeptKey = "engineering",
  departments = [],
  assets = [],
  sprints = [],
  claims = [],
  allUsers = [],
  onUpdateClaimStatus,
  onAddAsset,
}) {
  const [activeTab, setActiveTab] = useState(activeDeptKey);
  const [payrollRunning, setPayrollRunning] = useState(false);
  const [payrollSuccess, setPayrollSuccess] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);

  const [assetForm, setAssetForm] = useState({
    name: "",
    category: "Workstation",
    serial: "",
    assignedToId: "",
    value: "$1,500.00",
  });

  const handleRunPayroll = () => {
    setPayrollRunning(true);
    setTimeout(() => {
      setPayrollRunning(false);
      setPayrollSuccess(true);
      setTimeout(() => setPayrollSuccess(false), 5000);
    }, 1500);
  };

  const handleCreateAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name || !assetForm.serial) return;
    const assignee = allUsers.find(u => u.id === assetForm.assignedToId);
    if (onAddAsset) {
      onAddAsset({
        ...assetForm,
        assignedToName: assignee ? assignee.name : "Unassigned Pool",
        department: assignee ? assignee.department : "IT Storage",
      });
    }
    setAssetForm({ name: "", category: "Workstation", serial: "", assignedToId: "", value: "$1,500.00" });
    setShowAssetModal(false);
  };

  const pendingFinanceClaims = claims.filter(c => c.status === "Pending Finance" || c.status === "Pending Lead");

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Departmental Operations & Functional Toolkits</h1>
          <p>Domain-specific administrative workspaces for Engineering, Finance, HR, and IT.</p>
        </div>

        <div className="segment-tabs" style={{ overflowX: "auto" }}>
          <button
            type="button"
            className={`segment-tab-btn ${activeTab === "engineering" ? "active" : ""}`}
            onClick={() => setActiveTab("engineering")}
          >
            <Code size={14} style={{ marginRight: "4px" }} />
            <span>Tech & Engineering</span>
          </button>
          <button
            type="button"
            className={`segment-tab-btn ${activeTab === "finance" ? "active" : ""}`}
            onClick={() => setActiveTab("finance")}
          >
            <DollarSign size={14} style={{ marginRight: "4px" }} />
            <span>Finance & Payroll</span>
          </button>
          <button
            type="button"
            className={`segment-tab-btn ${activeTab === "hr" ? "active" : ""}`}
            onClick={() => setActiveTab("hr")}
          >
            <Users size={14} style={{ marginRight: "4px" }} />
            <span>People & Talent</span>
          </button>
          <button
            type="button"
            className={`segment-tab-btn ${activeTab === "it" ? "active" : ""}`}
            onClick={() => setActiveTab("it")}
          >
            <HardDrive size={14} style={{ marginRight: "4px" }} />
            <span>IT & Asset Registry</span>
          </button>
        </div>
      </div>

      {/* 1. ENGINEERING & TECHNOLOGY HUB */}
      {activeTab === "engineering" && (
        <div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Active Sprint</span>
                <div className="stat-icon-wash indigo">
                  <Terminal size={16} />
                </div>
              </div>
              <div className="stat-card-value">Sprint 42</div>
              <div className="micro-progress-track">
                <div className="micro-progress-fill" style={{ width: "84%", backgroundColor: "var(--brand-indigo)" }} />
              </div>
              <div className="stat-card-footer">
                <span className="trend-badge up">84% Complete</span>
                <span>Velocity: 48 pts</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Cloud Infrastructure Health</span>
                <div className="stat-icon-wash emerald">
                  <Server size={16} />
                </div>
              </div>
              <div className="stat-card-value">99.98%</div>
              <div className="stat-card-footer">
                <span className="trend-badge up">Optimal</span>
                <span>AWS & Supabase</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">On-Call Primary Lead</span>
                <div className="stat-icon-wash purple">
                  <Cpu size={16} />
                </div>
              </div>
              <div className="stat-card-value">David Okonjo</div>
              <div className="stat-card-footer">
                <span>DevOps Lead • Tier 3</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Monthly Engineering Budget</span>
                <div className="stat-icon-wash neutral">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="stat-card-value">$42,000</div>
              <div className="stat-card-footer">
                <span>76% Utilized</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <Terminal size={15} />
                  <span>Sprint Delivery & Technical Milestones</span>
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {sprints.map((sprint) => (
                  <div
                    key={sprint.id}
                    style={{
                      padding: "14px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700 }}>{sprint.title}</div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-tertiary)" }}>
                          Lead: {sprint.lead} • {sprint.startDate} - {sprint.endDate}
                        </div>
                      </div>
                      <span className={`badge ${sprint.status === "Active" ? "badge-approved" : "badge-neutral"}`}>
                        {sprint.status}
                      </span>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>Milestone Progress</span>
                        <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{sprint.progress}</span>
                      </div>
                      <div className="micro-progress-track">
                        <div className="micro-progress-fill" style={{ width: sprint.progress, backgroundColor: "var(--brand-indigo)" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <Sparkles size={15} />
                  <span>Developer Sandbox & Cloud Requisitions</span>
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ padding: "12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>AWS Staging Cluster Access</div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>Auto-provisioned for all Engineering Tier 2+ staff</div>
                  <span className="badge badge-approved" style={{ marginTop: "6px" }}>Active Sandbox</span>
                </div>
                <div style={{ padding: "12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>GitHub Enterprise & Copilot Seat</div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>Assigned to Udeh Kosisochukwu Emmanuel</div>
                  <span className="badge badge-approved" style={{ marginTop: "6px" }}>Assigned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FINANCE & PAYROLL HUB */}
      {activeTab === "finance" && (
        <div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Monthly Gross Payroll</span>
                <div className="stat-icon-wash indigo">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="stat-card-value">$68,500.00</div>
              <div className="stat-card-footer">
                <span>10 Active Employees</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Statutory Withholdings (PAYE/Pension)</span>
                <div className="stat-icon-wash rose">
                  <CreditCard size={16} />
                </div>
              </div>
              <div className="stat-card-value">$14,200.00</div>
              <div className="stat-card-footer">
                <span>Remittance Batch</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Level-2 Expense Claims</span>
                <div className="stat-icon-wash amber">
                  <Clock size={16} />
                </div>
              </div>
              <div className="stat-card-value">{pendingFinanceClaims.length}</div>
              <div className="stat-card-footer">
                <span>Awaiting finance sign-off</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Next Scheduled Pay Date</span>
                <div className="stat-icon-wash emerald">
                  <Calendar size={16} />
                </div>
              </div>
              <div className="stat-card-value">Aug 31, 2026</div>
              <div className="stat-card-footer">
                <span className="trend-badge up">Ready</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <Play size={15} />
                  <span>Automated Batch Payroll Execution Engine</span>
                </span>
              </div>

              <div style={{ padding: "16px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)" }}>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "14px", lineHeight: 1.5 }}>
                  Execute automated gross salary calculations, PAYE tax deductions, 8% statutory pension remittances, and HMO contributions across all 10 corporate accounts.
                </p>

                {payrollSuccess && (
                  <div style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--success-wash)", color: "var(--success)", fontSize: "13px", fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={16} />
                    <span>August 2026 Payroll Batch Disbursed Successfully ($68,500.00 Gross / $54,300.00 Net).</span>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRunPayroll}
                  disabled={payrollRunning}
                  style={{ width: "100%", padding: "12px" }}
                >
                  <Play size={15} />
                  <span>{payrollRunning ? "Processing Batch Calculations & Direct Deposits..." : "Execute August 2026 Payroll Run"}</span>
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <DollarSign size={15} />
                  <span>Level-2 Finance Reimbursement Queue</span>
                </span>
              </div>

              {pendingFinanceClaims.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
                  <CheckCircle2 size={24} color="var(--success)" style={{ margin: "0 auto 8px" }} />
                  <p>All expense claims have been audited and authorized.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {pendingFinanceClaims.map((claim) => (
                    <div
                      key={claim.id}
                      style={{
                        padding: "12px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "var(--bg-surface-elevated)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <div style={{ fontWeight: 700, fontSize: "13px" }}>{claim.name}</div>
                        <div style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{claim.amount}</div>
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>{claim.category} • {claim.description}</div>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginTop: "8px" }}>
                        <button
                          type="button"
                          className="btn btn-danger-ghost btn-sm"
                          onClick={() => onUpdateClaimStatus(claim.id, "Rejected")}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => onUpdateClaimStatus(claim.id, "Approved")}
                        >
                          Authorize Payout
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. PEOPLE & TALENT HUB */}
      {activeTab === "hr" && (
        <div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Active Headcount</span>
                <div className="stat-icon-wash indigo">
                  <Users size={16} />
                </div>
              </div>
              <div className="stat-card-value">{allUsers.length} Employees</div>
              <div className="stat-card-footer">
                <span className="trend-badge up">100% Retention</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Onboarding Pipeline</span>
                <div className="stat-icon-wash emerald">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="stat-card-value">2 In Pipeline</div>
              <div className="stat-card-footer">
                <span>Q3 Engineering Growth</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">HMO Network Utilization</span>
                <div className="stat-icon-wash purple">
                  <Shield size={16} />
                </div>
              </div>
              <div className="stat-card-value">Gold Tier</div>
              <div className="stat-card-footer">
                <span>Axa Mansard Comprehensive</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Monthly People Ops Budget</span>
                <div className="stat-icon-wash neutral">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="stat-card-value">$18,500</div>
              <div className="stat-card-footer">
                <span>64% Utilized</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Users size={15} />
                <span>Workforce Department Distribution</span>
              </span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Department Head</th>
                    <th>Headcount</th>
                    <th>Monthly Budget</th>
                    <th>Utilization</th>
                    <th>Primary Hub</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td style={{ fontWeight: 700 }}>{dept.name}</td>
                      <td>{dept.headName} ({dept.headTitle})</td>
                      <td>{dept.headcount} staff</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{dept.monthlyBudget}</td>
                      <td>
                        <span className="trend-badge up">{dept.budgetUtilization}</span>
                      </td>
                      <td>{dept.primaryLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. IT & ASSET REGISTRY HUB */}
      {activeTab === "it" && (
        <div>
          <div className="page-header" style={{ marginBottom: "16px" }}>
            <div className="page-title">
              <h2>Company Hardware Assets & Security Tokens</h2>
              <p>Workstation tracking, serial numbers, and equipment assignments.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAssetModal(true)}
            >
              <Plus size={14} />
              <span>Deploy New Hardware Asset</span>
            </button>
          </div>

          <div className="card">
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Asset ID</th>
                    <th>Hardware / Device Name</th>
                    <th>Category</th>
                    <th>Serial Number</th>
                    <th>Assigned Employee</th>
                    <th>Department</th>
                    <th>Asset Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id}>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{asset.id}</td>
                      <td style={{ fontWeight: 600 }}>{asset.name}</td>
                      <td>{asset.category}</td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{asset.serial}</td>
                      <td style={{ fontWeight: 600 }}>{asset.assignedToName}</td>
                      <td>{asset.department}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{asset.value}</td>
                      <td>
                        <span className="badge badge-approved">
                          <span className="badge-dot" />
                          <span>{asset.status}</span>
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

      {/* MODAL: ADD NEW IT ASSET */}
      {showAssetModal && (
        <div className="modal-backdrop" onClick={() => setShowAssetModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Deploy New Hardware Asset</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAssetModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateAsset}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Hardware Device Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder='e.g. MacBook Pro 14" M3 Pro (18GB)'
                    value={assetForm.name}
                    onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={assetForm.category}
                      onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
                    >
                      <option value="Workstation">Workstation Laptop</option>
                      <option value="Display & Peripheral">Display & Monitor</option>
                      <option value="Security Token">2FA Security Key</option>
                      <option value="Mobile Device">Testing Device</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Serial Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. SN-2026-99238"
                      value={assetForm.serial}
                      onChange={(e) => setAssetForm({ ...assetForm, serial: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Assign to Employee</label>
                    <select
                      className="form-select"
                      value={assetForm.assignedToId}
                      onChange={(e) => setAssetForm({ ...assetForm, assignedToId: e.target.value })}
                      required
                    >
                      <option value="">Select Employee...</option>
                      {allUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Asset Valuation</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$2,499.00"
                      value={assetForm.value}
                      onChange={(e) => setAssetForm({ ...assetForm, value: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAssetModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Deploy Asset to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
