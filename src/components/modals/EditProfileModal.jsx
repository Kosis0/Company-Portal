import { useEffect } from "react";

export default function EditProfileModal({
  isOpen,
  onClose,
  editProfileForm,
  setEditProfileForm,
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
        aria-labelledby="edit-profile-modal-title"
      >
        <div className="modal-header">
          <h3 id="edit-profile-modal-title">Edit Personal Details</h3>
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
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={editProfileForm.name || ""}
                onChange={(e) =>
                  setEditProfileForm({ ...editProfileForm, name: e.target.value })
                }
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editProfileForm.phone || ""}
                  onChange={(e) =>
                    setEditProfileForm({ ...editProfileForm, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Work Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={editProfileForm.location || ""}
                  onChange={(e) =>
                    setEditProfileForm({ ...editProfileForm, location: e.target.value })
                  }
                  required
                />
              </div>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
