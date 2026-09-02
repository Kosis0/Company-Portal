import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
} from "lucide-react";

export default function ProfileModule({
  currentUser,
  getTierLabel,
  onOpenEditProfile,
}) {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Personnel Profile & Organizational Record</h1>
          <p>Verified credentials, department hierarchy, and compensation details.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onOpenEditProfile}
        >
          Edit Personal Details
        </button>
      </div>

      <div className="responsive-split-grid-asymmetric" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "24px 18px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--accent-primary)",
              color: "var(--accent-primary-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              marginBottom: "14px",
            }}
          >
            {currentUser.avatarInitials ||
              currentUser.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{currentUser.name}</h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {currentUser.title}
          </p>
          <span className="badge badge-approved" style={{ marginTop: "8px" }}>
            {getTierLabel(currentUser.tier)}
          </span>

          <div
            style={{
              width: "100%",
              marginTop: "18px",
              paddingTop: "14px",
              borderTop: "1px solid var(--border-subtle)",
              textAlign: "left",
              fontSize: "12.5px",
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Mail size={14} color="var(--text-tertiary)" />
              <span>{currentUser.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Phone size={14} color="var(--text-tertiary)" />
              <span>{currentUser.phone}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={14} color="var(--text-tertiary)" />
              <span>{currentUser.location}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Briefcase size={15} />
                <span>Corporate Placement & Reporting Line</span>
              </span>
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Employee ID</div>
                <div className="detail-value">{currentUser.id}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Department</div>
                <div className="detail-value">{currentUser.department}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Reporting Line Manager</div>
                <div className="detail-value">{currentUser.managerName || "Board of Directors"}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Authority Level</div>
                <div className="detail-value">{getTierLabel(currentUser.tier)}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <CreditCard size={15} />
                <span>Statutory & Financial Details</span>
              </span>
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Bank Institution</div>
                <div className="detail-value">{currentUser.bankName || "First Bank of Nigeria"}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Account Number</div>
                <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                  {currentUser.accountNumber || "3049283482"}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Tax ID (TIN)</div>
                <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                  {currentUser.taxId || "TIN-98234711"}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Pension PIN</div>
                <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                  {currentUser.pensionPin || "PEN-100293847"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
