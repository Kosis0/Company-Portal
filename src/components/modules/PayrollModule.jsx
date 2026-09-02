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
        <div className="table-responsive">
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
      </div>
    </div>
  );
}
