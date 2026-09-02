import { useEffect } from "react";

export default function LeaveModal({
  isOpen,
  onClose,
  currentUser,
  leaveForm,
  setLeaveForm,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (leaveForm.startDate && leaveForm.endDate && leaveForm.endDate < leaveForm.startDate) {
      alert("End date must be on or after start date.");
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-modal-title"
      >
        <div className="modal-header">
          <h3 id="leave-modal-title">Apply for Leave</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Leave Category</label>
              <select
                className="form-select"
                value={leaveForm.type}
                onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
              >
                <option value="Annual Leave">
                  Annual Leave ({currentUser.annualLeaveBalance} Days Available)
                </option>
                <option value="Sick Leave">
                  Sick Leave ({currentUser.sickLeaveBalance} Days Available)
                </option>
                <option value="Casual Leave">
                  Casual Leave ({currentUser.casualLeaveBalance} Days Available)
                </option>
                <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
              </select>
            </div>

            <div className="form-row-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Justification</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Briefly explain the reason for time-off..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                required
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
              Submit to Manager
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
