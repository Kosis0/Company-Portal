import {
  Package,
  Plus,
  AlertOctagon,
  Truck,
  ShieldCheck,
  Boxes,
} from "lucide-react";
import { ShipmentTimeline } from "../ShipmentTimeline";

export default function InventoryDashboard({
  stockAlerts = [],
  onCreatePO,
  topProducts = [],
  showToast,
}) {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Inventory & Supply Chain</h1>
          <p>
            Stock level monitoring, supplier fulfillment, reorder requisitions, and incoming logistics
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-sage"
            onClick={() => {
              showToast("Purchase Requisition wizard opened.");
            }}
          >
            <Plus size={14} />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">SKUs in Stock</span>
            <div className="stat-icon-wash sage">
              <Package size={16} />
            </div>
          </div>
          <div className="stat-card-value">2,450 SKUs</div>
          <div className="micro-progress-track">
            <div
              className="micro-progress-fill"
              style={{ width: "98.2%", backgroundColor: "var(--brand-sage)" }}
            />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge up">98.2%</span>
            <span>Availability Rate</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Low Stock Items</span>
            <div className="stat-icon-wash terracotta">
              <AlertOctagon size={16} />
            </div>
          </div>
          <div className="stat-card-value">{stockAlerts.length} Alerts</div>
          <div className="micro-progress-track">
            <div
              className="micro-progress-fill"
              style={{
                width: "25%",
                backgroundColor: "var(--accent-terracotta)",
              }}
            />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge down">Critical</span>
            <span>Reorder Required</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Active Shipments</span>
            <div className="stat-icon-wash sage">
              <Truck size={16} />
            </div>
          </div>
          <div className="stat-card-value">8 In Transit</div>
          <div className="micro-progress-track">
            <div
              className="micro-progress-fill"
              style={{ width: "75%", backgroundColor: "var(--brand-sage)" }}
            />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge up">2 Arriving</span>
            <span>Schedule on time</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Supplier Fulfillment</span>
            <div className="stat-icon-wash sage">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="stat-card-value">99.4%</div>
          <div className="micro-progress-track">
            <div
              className="micro-progress-fill"
              style={{ width: "99.4%", backgroundColor: "var(--brand-sage)" }}
            />
          </div>
          <div className="stat-card-footer">
            <span className="trend-badge up">+1.2%</span>
            <span>Weekly SLA Index</span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Stock Level Alerts (with Sage 'Create PO' buttons) + Connected Shipment Timeline */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">
                <AlertOctagon size={16} color="var(--accent-terracotta)" />
                <span>Stock Level Alerts</span>
              </span>
              <span className="card-subtitle">
                Items below safety reorder threshold
              </span>
            </div>
            <span className="badge badge-terracotta">
              {stockAlerts.length} Action Items
            </span>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>SKU & Name</th>
                  <th>Stock Level</th>
                  <th>Supplier</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stockAlerts.map((item) => (
                  <tr key={item.sku}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-tertiary)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {item.sku} • {item.category}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            color: "var(--accent-terracotta)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {item.currentStock}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          / {item.minThreshold} min
                        </span>
                        <span
                          className={
                            item.status === "Critical"
                              ? "badge badge-terracotta"
                              : "badge badge-sand"
                          }
                          style={{ fontSize: "10px", padding: "1px 6px" }}
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.supplier}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-sage btn-sm"
                        onClick={() => onCreatePO(item)}
                      >
                        <Plus size={12} />
                        <span>Create PO</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <ShipmentTimeline />
        </div>
      </div>

      {/* Top Selling Products Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="card-title">
              <Boxes size={16} color="var(--brand-sage)" />
              <span>Top Selling Products & High-Velocity Inventory</span>
            </span>
            <span className="card-subtitle">
              Volume ranking and gross margin contribution
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Total Revenue</th>
                <th>Gross Margin</th>
                <th>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((prod) => (
                <tr key={prod.sku}>
                  <td
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                    }}
                  >
                    {prod.sku}
                  </td>
                  <td style={{ fontWeight: 600 }}>{prod.name}</td>
                  <td>
                    <span className="badge badge-neutral">{prod.category}</span>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>
                    {prod.unitsSold} units
                  </td>
                  <td
                    style={{
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {prod.revenue}
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--brand-sage)",
                      fontWeight: 700,
                    }}
                  >
                    {prod.margin}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        prod.status === "In Stock"
                          ? "badge-sage"
                          : "badge-sand"
                      }`}
                    >
                      {prod.status}
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
