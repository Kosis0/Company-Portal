import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Send,
  Check,
} from "lucide-react";
import {
  CashFlowForecastChart,
  TopOperatingExpensesChart,
} from "../AnalyticsCharts";

export default function FinancialDashboard({
  invoices = [],
  onSendReminder,
  onMarkInvoicePaid,
  showToast,
}) {
  const overdueInvoices = invoices.filter((i) => i.status === "Overdue");

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Financial Performance</h1>
          <p>
            Cash flow projections, operating expense breakdowns, and customer accounts receivable
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              showToast(
                "Exporting Q3 Comprehensive Financial Statement (CSV/PDF)..."
              )
            }
          >
            <Download size={14} />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Monthly Inflow</span>
            <div className="stat-icon-wash sage">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="stat-card-value">$18.0M</div>
          <div className="micro-progress-track">
            <div
              className="micro-progress-fill"
              style={{ width: "90%", backgroundColor: "var(--brand-sage)" }}
            />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge up">
              <ArrowUpRight size={12} />
              <span>+15.2%</span>
            </span>
            <span>above forecast</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Monthly Outflow</span>
            <div className="stat-icon-wash sand">
              <TrendingDown size={16} />
            </div>
          </div>
          <div className="stat-card-value">$8.5M</div>
          <div className="micro-progress-track">
            <div
              className="micro-progress-fill"
              style={{ width: "47%", backgroundColor: "var(--accent-sand)" }}
            />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge neutral">
              <ArrowDownRight size={12} />
              <span>-4.1%</span>
            </span>
            <span>cost reduction</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Net Cash Position</span>
            <div className="stat-icon-wash sage">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="stat-card-value">$42.8M</div>
          <div className="micro-progress-track">
            <div
              className="micro-progress-fill"
              style={{ width: "85%", backgroundColor: "var(--brand-sage)" }}
            />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge up">
              <ArrowUpRight size={12} />
              <span>+24.6%</span>
            </span>
            <span>Treasury Reserve</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Outstanding Receivables</span>
            <div className="stat-icon-wash terracotta">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="stat-card-value">$1.24M</div>
          <div className="micro-progress-track">
            <div
              className="micro-progress-fill"
              style={{
                width: "28%",
                backgroundColor: "var(--accent-terracotta)",
              }}
            />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge down">
              <span>{overdueInvoices.length} Overdue</span>
            </span>
            <span>Action required</span>
          </div>
        </div>
      </div>

      {/* Visualizations: Cash Flow Forecast + Top Operating Expenses */}
      <div
        className="responsive-split-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        <div className="card">
          <CashFlowForecastChart />
        </div>
        <div className="card">
          <TopOperatingExpensesChart />
        </div>
      </div>

      {/* Unpaid Customer Invoices Table with Terracotta Badges */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="card-title">
              <Receipt size={16} color="var(--accent-terracotta)" />
              <span>Unpaid Customer Invoices & Receivables</span>
            </span>
            <span className="card-subtitle">
              Customer invoices pending settlement with automated collection actions
            </span>
          </div>
          <span className="badge badge-terracotta">
            {overdueInvoices.length} Overdue Notices
          </span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer / Client Entity</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                    {inv.id}
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{inv.customer}</div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {inv.email}
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {inv.issueDate}
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {inv.dueDate}
                  </td>
                  <td
                    style={{
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {inv.amount}
                  </td>
                  <td>
                    {inv.status === "Overdue" ? (
                      <span className="badge badge-overdue">
                        {inv.daysOverdue} Days Overdue
                      </span>
                    ) : inv.status === "Paid" ? (
                      <span className="badge badge-sage">Settled</span>
                    ) : (
                      <span className="badge badge-sand">{inv.status}</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "6px",
                      }}
                    >
                      {inv.status !== "Paid" && (
                        <>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              onSendReminder(inv.id, inv.customer)
                            }
                            title="Send payment reminder email"
                          >
                            <Send size={12} />
                            <span>Remind</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sage btn-sm"
                            onClick={() => onMarkInvoicePaid(inv.id)}
                            title="Record payment received"
                          >
                            <Check size={12} />
                            <span>Mark Paid</span>
                          </button>
                        </>
                      )}
                      {inv.status === "Paid" && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--brand-sage)",
                            fontWeight: 600,
                          }}
                        >
                          ✓ Settled
                        </span>
                      )}
                    </div>
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
