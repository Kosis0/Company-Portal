import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  FileCheck2,
  CreditCard,
  User,
  Briefcase,
  Building,
  AlertCircle
} from "lucide-react";

export default function Login({ onLogin, onRegister }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  
  // Sign In Form State
  const [email, setEmail] = useState("employee@company.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign Up Form State
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    title: "",
    department: "Engineering",
    role: "employee",
    location: "Port Harcourt",
    phone: "",
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      await onLogin({ email: email.trim(), password: password.trim() });
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!signupForm.name.trim() || !signupForm.email.trim() || !signupForm.password.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await onRegister(signupForm);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Left Branding Hero Panel */}
      <div className="login-hero-panel">
        <div className="login-hero-brand">
          <div className="login-hero-logo">M</div>
          <div>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>
              MONOLITH ERP
            </h2>
            <p style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 500 }}>
              Human Capital & Operations Platform
            </p>
          </div>
        </div>

        <div className="login-hero-content">
          <div className="login-tag">
            <Sparkles size={13} />
            <span>Production-Grade Cloud Workspace</span>
          </div>

          <h1>Real-Time Workforce OS with Utilitarian Precision.</h1>
          <p>
            An integrated operating system for automated shift attendance, multi-tiered leave approvals,
            digital reimbursement workflows, and organizational directory management.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-item">
              <Clock className="login-feature-icon" />
              <span>Real-Time Shift Attendance & Activity Tracking</span>
            </div>
            <div className="login-feature-item">
              <FileCheck2 className="login-feature-icon" />
              <span>Multi-Tier Leave & Expense Workflow Approvals</span>
            </div>
            <div className="login-feature-item">
              <CreditCard className="login-feature-icon" />
              <span>Instant Digital Payslips & Reimbursement Processing</span>
            </div>
            <div className="login-feature-item">
              <Layers className="login-feature-icon" />
              <span>Organizational Directory & Statutory Dossiers</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: "11.5px", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={15} />
          <span>SOC-2 Type II Certified Corporate Workspace • v2.8.0</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-form-panel">
        <div className="login-form-box">
          <div className="login-form-header">
            <h2>{mode === "signin" ? "Sign In to Workspace" : "Create Staff Account"}</h2>
            <p>{mode === "signin" ? "Enter your corporate credentials to access your portal." : "Register a verified account in the company directory."}</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="segment-tabs" style={{ width: "100%", marginBottom: "18px", display: "grid", gridTemplateColumns: "1fr 1fr", padding: "4px" }}>
            <button
              type="button"
              className={`segment-tab-btn ${mode === "signin" ? "active" : ""}`}
              onClick={() => { setMode("signin"); setError(""); }}
              style={{ textAlign: "center", padding: "6px" }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`segment-tab-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => { setMode("signup"); setError(""); }}
              style={{ textAlign: "center", padding: "6px" }}
            >
              Register New Account
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--danger-light)",
                border: "1px solid var(--danger-border)",
                color: "var(--danger-text)",
                fontSize: "12.5px",
                marginBottom: "16px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === "signin" && (
            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">
                  Corporate Email Address
                </label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="form-input input-with-icon"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  <label className="form-label" htmlFor="login-password" style={{ margin: 0 }}>
                    Password
                  </label>
                </div>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="form-input input-with-icon"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: "100%", padding: "10px 14px", fontSize: "13.5px", marginTop: "8px" }}
              >
                <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
                {!loading && <ArrowRight size={15} />}
              </button>

              <div style={{ marginTop: "16px", padding: "10px 12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", fontSize: "11.5px", color: "var(--text-secondary)" }}>
                <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>5-Tier Enterprise Seed Accounts (Password: <span style={{ fontFamily: "var(--font-mono)" }}>password123</span>):</div>
                <div>• <strong>Tier 5 • CEO / C-Suite:</strong> <span style={{ fontFamily: "var(--font-mono)" }}>ceo@company.com</span></div>
                <div>• <strong>Tier 4 • VP of People / Admin:</strong> <span style={{ fontFamily: "var(--font-mono)" }}>admin@company.com</span></div>
                <div>• <strong>Tier 4 • VP of Engineering:</strong> <span style={{ fontFamily: "var(--font-mono)" }}>vpeng@company.com</span></div>
                <div>• <strong>Tier 3 • Tech Lead / Manager:</strong> <span style={{ fontFamily: "var(--font-mono)" }}>sarah.chen@company.com</span></div>
                <div>• <strong>Tier 1 • Developer Intern / Staff:</strong> <span style={{ fontFamily: "var(--font-mono)" }}>employee@company.com</span></div>
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    className="form-input input-with-icon"
                    placeholder="e.g. Jordan Hayes"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Email</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    className="form-input input-with-icon"
                    placeholder="jordan.hayes@company.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <div className="input-icon-wrapper">
                    <Briefcase className="input-icon" />
                    <input
                      type="text"
                      className="form-input input-with-icon"
                      placeholder="e.g. Product Engineer"
                      value={signupForm.title}
                      onChange={(e) => setSignupForm({ ...signupForm, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={signupForm.department}
                    onChange={(e) => setSignupForm({ ...signupForm, department: e.target.value })}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Finance & Operations">Finance & Operations</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="form-group">
                  <label className="form-label">Account Role</label>
                  <select
                    className="form-select"
                    value={signupForm.role}
                    onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                  >
                    <option value="employee">Staff (Self-Service)</option>
                    <option value="admin">HR / Operations Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <div className="input-icon-wrapper">
                    <Building className="input-icon" />
                    <input
                      type="text"
                      className="form-input input-with-icon"
                      placeholder="Port Harcourt / Remote"
                      value={signupForm.location}
                      onChange={(e) => setSignupForm({ ...signupForm, location: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input input-with-icon"
                    placeholder="At least 6 characters"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: "100%", padding: "10px 14px", fontSize: "13.5px", marginTop: "6px" }}
              >
                <span>{loading ? "Creating Account..." : "Create Account & Sign In"}</span>
                {!loading && <ArrowRight size={15} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
