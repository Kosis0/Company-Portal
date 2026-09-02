import { Plus, FileText } from "lucide-react";

export default function ClaimsModule({
  myClaims = [],
  onOpenSubmitClaim,
}) {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Expense Reimbursements & Claims</h1>
          <p>Submit work-related out-of-pocket expenses and track multi-tier reimbursement approvals.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenSubmitClaim}
        >
          <Plus size={14} />
          <span>Submit Expense Claim</span>
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Date Incurred</th>
                <th>Description</th>
                <th>Receipt Attached</th>
                <th>Approval Stage</th>
              </tr>
            </thead>
            <tbody>
              {myClaims.map((claim) => (
                <tr key={claim.id}>
                  <td style={{ fontWeight: 600 }}>{claim.category}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                    {claim.amount}
                  </td>
                  <td>{claim.date}</td>
                  <td>{claim.description}</td>
                  <td>
                    <span
                      style={{
                        fontSize: "11.5px",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FileText size={13} />
                      <span>{claim.receipt}</span>
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        claim.status === "Approved"
                          ? "badge-approved"
                          : claim.status.includes("Pending")
                          ? "badge-pending"
                          : "badge-rejected"
                      }`}
                    >
                      {claim.status}
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
