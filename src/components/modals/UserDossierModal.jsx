import { useEffect } from "react";

export default function UserDossierModal({
  selectedUserDossier,
  onClose,
  getTierLabel,
}) {
  useEffect(() => {
    if (!selectedUserDossier) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedUserDossier, onClose]);

  if (!selectedUserDossier) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-modal-title"
      >
        <div className="modal-header">
          <h3 id="dossier-modal-title">Employee Dossier • {selectedUserDossier.name}</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--accent-primary)",
                color: "var(--accent-primary-text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "16px",
              }}
            >
              {selectedUserDossier.avatarInitials ||
                selectedUserDossier.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700 }}>
                {selectedUserDossier.name}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {selectedUserDossier.title} • {selectedUserDossier.department}
              </div>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Employee ID</div>
              <div className="detail-value">{selectedUserDossier.id}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Authority Tier</div>
              <div className="detail-value">
                {getTierLabel(selectedUserDossier.tier)}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Reporting Line Manager</div>
              <div className="detail-value">
                {selectedUserDossier.managerName || "Board of Directors"}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Work Location</div>
              <div className="detail-value">{selectedUserDossier.location}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Monthly Compensation</div>
              <div
                className="detail-value"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {selectedUserDossier.salary}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Performance Review Rating</div>
              <div className="detail-value">{selectedUserDossier.score}</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
