import React, { useMemo, useState } from "react";

const roleOptions = [
  { value: "employee", label: "Employee" },
  { value: "admin", label: "HR Admin" },
];

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");

  const autoRole = useMemo(() => {
    const normalized = email.trim().toLowerCase();
    if (normalized === "hr@company.com") return "admin";
    if (normalized === "employee@company.com") return "employee";
    return null;
  }, [email]);

  const effectiveRole = autoRole || role;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    onLogin({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      selectedRole: effectiveRole,
    });
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-branding">
          <div className="login-brand-mark">ERP</div>
          <div>
            <h1>Sign in to Nexus ERP</h1>
            <p>Use your corporate email to access the employee portal or HR admin dashboard.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="login-input"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-role">Role</label>
            <select
              id="login-role"
              className="login-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={Boolean(autoRole)}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="login-meta">
            <span>Quick access:</span>
            <span className="login-meta-credential">hr@company.com</span>
            <span className="login-meta-credential">employee@company.com</span>
          </div>

          {autoRole ? (
            <div className="login-note">
              Email detected for <strong>{autoRole === "admin" ? "HR Admin" : "Employee"}</strong>. Role selection has been locked.
            </div>
          ) : (
            <div className="login-note">Select your role from the dropdown if you do not use one of the quick-access credentials.</div>
          )}

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
