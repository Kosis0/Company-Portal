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
        <div className="table-responsive">
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
      </div>
    </div>
  );
}
