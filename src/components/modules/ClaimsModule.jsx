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
        {myClaims.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
            No reimbursement claims filed yet. Click "Submit Expense Claim" above to file an expense.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-responsive has-mobile-cards">
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

            {/* Mobile Card List */}
            <div className="mobile-card-list">
              {myClaims.map((claim) => (
                <div key={claim.id} className="mobile-data-card">
                  <div className="mobile-data-card-header">
                    <div>
                      <div className="mobile-data-card-title">{claim.category}</div>
                      <div className="mobile-data-card-sub">{claim.date}</div>
                    </div>
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
                  </div>

                  <div className="mobile-data-card-body">
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Claim Amount</span>
                      <span
                        className="mobile-data-card-val"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--brand-sage)" }}
                      >
                        {claim.amount}
                      </span>
                    </div>
                    {claim.description && (
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Purpose</span>
                        <span className="mobile-data-card-val" style={{ maxWidth: "60%", textAlign: "right" }}>
                          {claim.description}
                        </span>
                      </div>
                    )}
                    {claim.receipt && (
                      <div className="mobile-data-card-row">
                        <span className="mobile-data-card-label">Receipt</span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FileText size={12} />
                          <span>{claim.receipt}</span>
                        </span>
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
