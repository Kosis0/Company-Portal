import { useEffect } from "react";

export default function ClaimModal({
  isOpen,
  onClose,
  claimForm,
  setClaimForm,
  onSubmit,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-modal-title"
      >
        <div className="modal-header">
          <h3 id="claim-modal-title">Submit Expense Claim</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Expense Category</label>
              <select
                className="form-select"
                value={claimForm.category}
                onChange={(e) =>
                  setClaimForm({ ...claimForm, category: e.target.value })
                }
              >
                <option value="Internet & Remote Work Allowance">
                  Internet & Remote Work Allowance
                </option>
                <option value="Client Transport & Fuel">
                  Client Transport & Fuel
                </option>
                <option value="Office & Tech Supplies">
                  Office & Tech Supplies
                </option>
                <option value="Meals & Entertainment">
                  Meals & Entertainment
                </option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount ($ USD)</label>
              <input
                type="text"
                className="form-input"
                placeholder="$150.00"
                value={claimForm.amount}
                onChange={(e) =>
                  setClaimForm({ ...claimForm, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Provide details about the business expense..."
                value={claimForm.description}
                onChange={(e) =>
                  setClaimForm({ ...claimForm, description: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Receipt File</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. invoice_august_2026.pdf"
                value={claimForm.receiptName}
                onChange={(e) =>
                  setClaimForm({ ...claimForm, receiptName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
