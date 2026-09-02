import { Plus } from "lucide-react";

export default function LeavesModule({
  myLeaves = [],
  onOpenApplyLeave,
}) {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Leave Management & Allowances</h1>
          <p>Check leave entitlements, submit requests, and track supervisor approvals.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenApplyLeave}
        >
          <Plus size={14} />
          <span>Apply for Leave</span>
        </button>
      </div>

      <div className="card">
        {myLeaves.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
            No leave requests filed yet. Click "Apply for Leave" above to submit a request.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-responsive has-mobile-cards">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Applied On</th>
                    <th>Approval Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 600 }}>{req.type}</td>
                      <td>{req.dates}</td>
                      <td>{req.days} days</td>
                      <td style={{ color: "var(--text-secondary)" }}>{req.reason}</td>
                      <td>{req.appliedOn}</td>
                      <td>
                        <span
                          className={`badge ${
                            req.status === "Approved"
                              ? "badge-approved"
                              : req.status.includes("Pending")
                              ? "badge-pending"
                              : "badge-rejected"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="mobile-card-list">
              {myLeaves.map((req) => (
                <div key={req.id} className="mobile-data-card">
                  <div className="mobile-data-card-header">
                    <div>
                      <div className="mobile-data-card-title">{req.type}</div>
                      <div className="mobile-data-card-sub">Applied on {req.appliedOn}</div>
                    </div>
                    <span
                      className={`badge ${
                        req.status === "Approved"
                          ? "badge-approved"
                          : req.status.includes("Pending")
                          ? "badge-pending"
                          : "badge-rejected"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="mobile-data-card-body">
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Dates</span>
                      <span className="mobile-data-card-val">{req.dates}</span>
                    </div>
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Duration</span>
                      <span className="mobile-data-card-val" style={{ fontFamily: "var(--font-mono)" }}>
                        {req.days} {req.days === 1 ? "day" : "days"}
                      </span>
                    </div>
                    {req.reason && (
                      <div style={{ marginTop: "4px", fontSize: "12px", color: "var(--text-secondary)" }}>
                        "{req.reason}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
