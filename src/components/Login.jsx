import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("employee@company.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSelectPersona = (selectedRole, defaultEmail) => {
    setRole(selectedRole);
    setEmail(defaultEmail);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    onLogin({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      selectedRole: role,
    });
  };

  return (
    <div className="login-split-container">
      {/* Left Branding Hero */}
      <div className="login-hero-panel">
        <div className="login-hero-brand">
          <div className="login-hero-logo">N</div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "-0.4px" }}>Nexus ERP</h2>
            <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Enterprise Portal</p>
          </div>
        </div>

        <div className="login-hero-content">
          <h1>Human Capital & Operations Platform</h1>
          <p>Streamline workforce operations, attendance monitoring, payroll processing, leave management, and employee self-service.</p>
          
          <div className="login-feature-list">
            <div className="login-feature-item">
              <span className="login-feature-bullet" />
              <span>Real-Time Attendance & Time Tracking</span>
            </div>
            <div className="login-feature-item">
              <span className="login-feature-bullet" />
              <span>Automated Leave & Expense Workflow Approvals</span>
            </div>
            <div className="login-feature-item">
              <span className="login-feature-bullet" />
              <span>Instant Digital Payslips & Key Performance Analytics</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "#64748b" }}>
          © 2026 Nexus ERP Technologies Inc. All rights reserved.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="login-form-panel">
        <div className="login-form-box">
          <div className="login-form-header">
            <h2>Sign In</h2>
            <p>Select your persona or enter your corporate credentials below.</p>
          </div>

          {/* Quick Persona Selector */}
          <div className="persona-switcher-box">
            <h4>Quick Persona Selector</h4>
            <div className="persona-buttons-grid">
              <button
                type="button"
                className={`persona-btn ${role === "employee" ? "active" : ""}`}
                onClick={() => handleSelectPersona("employee", "employee@company.com")}
              >
                <span className="persona-btn-title">Employee Portal</span>
                <span className="persona-btn-email">employee@company.com</span>
              </button>

              <button
                type="button"
                className={`persona-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => handleSelectPersona("admin", "hr@company.com")}
              >
                <span className="persona-btn-title">HR Admin</span>
                <span className="persona-btn-email">hr@company.com</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Corporate Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label className="form-label" htmlFor="login-password" style={{ margin: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-role">Target Workspace Role</label>
              <select
                id="login-role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="employee">Employee Self-Service (ESS)</option>
                <option value="admin">HR & Operations Admin</option>
              </select>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--danger-light)", color: "var(--danger-text)", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "11px", fontSize: "14px", fontWeight: 600 }}
            >
              Sign In to Workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
