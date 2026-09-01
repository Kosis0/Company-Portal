import { Truck, CheckCircle2, Clock, Calendar } from "lucide-react";

export function ShipmentTimeline({
  shipments = [
    { id: "SHP-001", title: "Supplier ABC", timing: "Tomorrow", status: "Active", date: "Sept 02, 2026", carrier: "FedEx Freight", origin: "Austin, TX", destination: "Central Hub" },
    { id: "SHP-002", title: "Global Logistics", timing: "Friday", status: "Active", date: "Sept 05, 2026", carrier: "DHL Express", origin: "Rotterdam, NL", destination: "Central Hub" },
    { id: "SHP-003", title: "Apex Silicon Dist.", timing: "Saturday", status: "In Transit", date: "Sept 06, 2026", carrier: "Maersk Line", origin: "Taipei, TW", destination: "West Coast Port" },
    { id: "SHP-004", title: "Monolith Raw Mat.", timing: "Next Week", status: "Scheduled", date: "Sept 12, 2026", carrier: "UPS Supply Chain", origin: "Frankfurt, DE", destination: "Central Hub" },
  ],
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "In Transit":
        return <Truck size={12} color="#3D644B" />;
      case "Scheduled":
        return <Clock size={12} color="#C8A27A" />;
      case "Delivered":
      case "Active":
      default:
        return <CheckCircle2 size={12} color="#3D644B" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "In Transit":
        return "badge badge-info";
      case "Scheduled":
        return "badge badge-warning";
      case "Delivered":
      case "Active":
      default:
        return "badge badge-success";
    }
  };

  return (
    <div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Truck size={16} color="var(--brand-sage, #3D644B)" />
          <span>Incoming Shipments & Logistics</span>
        </div>
        <span style={{ fontSize: "11px", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
          <Calendar size={12} />
          <span>Q3 2026 Schedule</span>
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", position: "relative", paddingLeft: "10px" }}>
        {/* Continuous background connecting line */}
        <div
          style={{
            position: "absolute",
            left: "14px",
            top: "12px",
            bottom: "24px",
            width: "2px",
            backgroundColor: "var(--brand-sage-subtle, rgba(61, 100, 75, 0.15))",
          }}
        />

        {shipments.map((item, i) => {
          const itemTitle = item.title || item.supplier || item.carrier || "Inbound Shipment";
          const itemTiming = item.timing || item.status || "Active";
          const itemDate = item.date || item.expectedDate || "Pending";
          const itemCarrier = item.carrier || item.origin ? `${item.carrier ? item.carrier + " • " : ""}${item.origin || ""}` : null;

          return (
            <div
              key={item.id || i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: i === shipments.length - 1 ? "0" : "18px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Node halo dot with status icon */}
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "var(--bg-surface)",
                  border: "2px solid var(--border-default)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "1px",
                  flexShrink: 0,
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                {getStatusIcon(item.status)}
              </div>

              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span>{itemTitle}</span>
                    <span className={getStatusBadgeClass(item.status)} style={{ fontSize: "10px", padding: "1px 6px" }}>
                      {itemTiming}
                    </span>
                  </div>
                  {itemCarrier && (
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {itemCarrier}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", flexShrink: 0, marginTop: "2px" }}>
                  <Clock size={11} />
                  <span>{itemDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
