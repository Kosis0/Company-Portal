import { ShieldPlus, Building } from "lucide-react";

export default function HMOModule({ currentUser }) {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>HMO Health Insurance & Clinic Network</h1>
          <p>Corporate medical tier, hospital networks, and 24/7 careline.</p>
        </div>
      </div>

      <div className="form-row-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <ShieldPlus size={15} />
              <span>Corporate Enrollee Card</span>
            </span>
            <span className="badge badge-approved">Gold Tier</span>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">HMO Provider</div>
              <div className="detail-value">Axa Mansard Health</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Enrollee Member ID</div>
              <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                ENR-{currentUser.id.replace("USR-", "2026-")}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Primary Hospital</div>
              <div className="detail-value">Sonabel Medical (PH) / St. Nicholas (Lagos)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Emergency Careline</div>
              <div className="detail-value" style={{ fontFamily: "var(--font-mono)" }}>
                +234 1 280 1234
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Building size={15} />
              <span>In-Network Clinics</span>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px" }}>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-surface-elevated)",
              }}
            >
              <strong>Sonabel Medical Center</strong> — 14 Peter Odili Rd, Port Harcourt (Primary Care & Surgery)
            </div>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-surface-elevated)",
              }}
            >
              <strong>St. Nicholas Hospital</strong> — 57 Campbell St, Lagos Island (Specialist Consults)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
