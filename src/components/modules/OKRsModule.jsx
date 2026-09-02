import { TrendingUp } from "lucide-react";

export default function OKRsModule() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Quarterly Performance & Strategic OKRs</h1>
          <p>Quarterly delivery progress and manager review assessments.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <TrendingUp size={15} />
            <span>Q3 2026 Milestone Delivery</span>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "13.5px", fontWeight: 600 }}>
                1. Multi-Tier Enterprise Architecture & RBAC System
              </span>
              <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>95%</span>
            </div>
            <div className="micro-progress-track">
              <div
                className="micro-progress-fill"
                style={{ width: "95%", backgroundColor: "var(--accent-primary)" }}
              />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "13.5px", fontWeight: 600 }}>
                2. Supabase Real-Time Sync & Multi-Device Deployment
              </span>
              <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>90%</span>
            </div>
            <div className="micro-progress-track">
              <div
                className="micro-progress-fill"
                style={{ width: "90%", backgroundColor: "var(--brand-indigo)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
