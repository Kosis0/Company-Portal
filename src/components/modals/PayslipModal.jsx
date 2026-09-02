import { useEffect } from "react";
import { Download } from "lucide-react";

export default function PayslipModal({
  selectedPayslip,
  onClose,
  currentUser,
  showToast,
}) {
  useEffect(() => {
    if (!selectedPayslip) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPayslip, onClose]);

  if (!selectedPayslip) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payslip-modal-title"
      >
        <div className="modal-header">
          <h3 id="payslip-modal-title">Itemized Payslip • {selectedPayslip.month}</h3>
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
              justifyContent: "space-between",
              padding: "12px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "16px",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                Employee
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                {currentUser.id} • {currentUser.title}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                Disbursed On
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {selectedPayslip.payDate}
              </div>
              <span className="badge badge-approved" style={{ marginTop: "4px" }}>
                PAID
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Basic Gross Salary</span>
              <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                {selectedPayslip.gross}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>PAYE Statutory Tax</span>
              <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
                -{selectedPayslip.tax}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Pension Contribution (8%)</span>
              <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
                -{selectedPayslip.pension}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>HMO Medical Withholding</span>
              <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
                -{selectedPayslip.medical}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                marginTop: "4px",
                fontSize: "14.5px",
                fontWeight: 700,
                borderTop: "2px solid var(--border-default)",
              }}
            >
              <span>Net Disbursed Take-Home</span>
              <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                {selectedPayslip.net}
              </span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              showToast
                ? showToast("Downloading Itemized PDF Statement...")
                : alert("Downloading Itemized PDF Statement...")
            }
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
