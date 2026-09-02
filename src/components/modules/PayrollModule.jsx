import { FileText } from "lucide-react";

export default function PayrollModule({
  payments = [],
  onViewPayslip,
}) {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Payroll & Payslip Statements</h1>
          <p>Monthly compensation statements, tax deductions, and pension breakdowns.</p>
        </div>
      </div>

      <div className="card">
        {payments.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
            No payroll statements recorded yet.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-responsive has-mobile-cards">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Pay Period</th>
                    <th>Disbursement Date</th>
                    <th>Gross Pay</th>
                    <th>PAYE Tax</th>
                    <th>Pension (8%)</th>
                    <th>Medical</th>
                    <th>Net Take-Home</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 700 }}>{p.month}</td>
                      <td>{p.payDate}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{p.gross}</td>
                      <td style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
                        -{p.tax}
                      </td>
                      <td style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
                        -{p.pension}
                      </td>
                      <td style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
                        -{p.medical}
                      </td>
                      <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{p.net}</td>
                      <td>
                        <span className="badge badge-approved">{p.status}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewPayslip(p)}
                        >
                          <FileText size={13} />
                          <span>View Payslip</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="mobile-card-list">
              {payments.map((p) => (
                <div key={p.id} className="mobile-data-card">
                  <div className="mobile-data-card-header">
                    <div>
                      <div className="mobile-data-card-title">{p.month}</div>
                      <div className="mobile-data-card-sub">Disbursed on {p.payDate}</div>
                    </div>
                    <span className="badge badge-approved">{p.status}</span>
                  </div>

                  <div className="mobile-data-card-body">
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Net Take-Home</span>
                      <span
                        className="mobile-data-card-val"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "15px",
                          color: "var(--brand-sage)",
                          fontWeight: 800,
                        }}
                      >
                        {p.net}
                      </span>
                    </div>
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Basic Gross Salary</span>
                      <span className="mobile-data-card-val" style={{ fontFamily: "var(--font-mono)" }}>
                        {p.gross}
                      </span>
                    </div>
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">PAYE Tax Deducted</span>
                      <span className="mobile-data-card-val" style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
                        -{p.tax}
                      </span>
                    </div>
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Statutory Pension (8%)</span>
                      <span className="mobile-data-card-val" style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
                        -{p.pension}
                      </span>
                    </div>
                  </div>

                  <div className="mobile-data-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onViewPayslip(p)}
                    >
                      <FileText size={14} />
                      <span>View Itemized Statement</span>
                    </button>
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
