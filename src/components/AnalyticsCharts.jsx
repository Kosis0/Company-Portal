import { useState } from "react";

/**
 * Interactive SVG Line Chart: Revenue vs. Expenses Trend
 */
export function RevenueExpensesTrendChart({
  data = [
    { month: "Jan", revenue: 5.2, expenses: 3.8 },
    { month: "Feb", revenue: 8.4, expenses: 5.9 },
    { month: "Mar", revenue: 7.1, expenses: 5.4 },
    { month: "Apr", revenue: 11.6, expenses: 8.2 },
    { month: "May", revenue: 9.8, expenses: 6.7 },
    { month: "Jun", revenue: 13.5, expenses: 10.1 },
  ],
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const width = 580;
  const height = 220;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 25;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = Math.max(16, ...data.map((d) => Math.max(d.revenue || 0, d.expenses || 0)));
  const minVal = 0;

  const getX = (index) =>
    data.length <= 1 ? padLeft + chartW / 2 : padLeft + (index / (data.length - 1)) * chartW;
  const getY = (val) => padTop + chartH - ((val - minVal) / (maxVal - minVal || 1)) * chartH;

  // Create smooth bezier curves
  const createCurvedPath = (points) => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const revPointObjs = data.map((d, i) => ({ x: getX(i), y: getY(d.revenue) }));
  const expPointObjs = data.map((d, i) => ({ x: getX(i), y: getY(d.expenses) }));

  const revCurvedPath = createCurvedPath(revPointObjs);
  const expCurvedPath = createCurvedPath(expPointObjs);

  const yTicks = [
    { label: "$15M", val: 15 },
    { label: "$10M", val: 10 },
    { label: "$5M", val: 5 },
    { label: "$0", val: 0 },
  ];

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
          Revenue vs. Expenses Trend
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#3D644B" }} />
            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Revenue</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#C8A27A" }} />
            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Expenses</span>
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", overflow: "visible" }}
      >
        {/* Horizontal grid lines & Y-axis labels */}
        {yTicks.map((tick, i) => {
          const y = getY(tick.val);
          return (
            <g key={i}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--text-tertiary)"
                fontSize="10.5"
                fontFamily="var(--font-mono)"
              >
                {tick.label}
              </text>
            </g>
          );
        })}

        {/* Expenses Line (Warm Sand) */}
        <path
          d={expCurvedPath}
          fill="none"
          stroke="#C8A27A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Revenue Line (Forest Green) */}
        <path
          d={revCurvedPath}
          fill="none"
          stroke="#3D644B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Interactive Dots and Month labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const yRev = getY(d.revenue);
          const yExp = getY(d.expenses);
          const isHovered = hoveredIdx === i;

          return (
            <g key={i}>
              {/* Vertical hover indicator line */}
              {isHovered && (
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + chartH}
                  stroke="var(--brand-green)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
              )}

              {/* Month label on X-axis */}
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fill={isHovered ? "var(--text-primary)" : "var(--text-secondary)"}
                fontWeight={isHovered ? 700 : 500}
                fontSize="11"
              >
                {d.month}
              </text>

              {/* Expenses dot */}
              <circle
                cx={x}
                cy={yExp}
                r={isHovered ? 5 : 3.5}
                fill="#FFFFFF"
                stroke="#C8A27A"
                strokeWidth="2"
                style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />

              {/* Revenue dot */}
              <circle
                cx={x}
                cy={yRev}
                r={isHovered ? 5.5 : 4}
                fill="#FFFFFF"
                stroke="#3D644B"
                strokeWidth="2.5"
                style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIdx !== null && (
        <div
          style={{
            position: "absolute",
            left: `${(getX(hoveredIdx) / width) * 100}%`,
            top: "30%",
            transform: "translate(-50%, -100%)",
            backgroundColor: "var(--bg-surface-elevated)",
            padding: "6px 10px",
            borderRadius: "6px",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-default)",
            fontSize: "11.5px",
            pointerEvents: "none",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "2px" }}>{data[hoveredIdx].month}</div>
          <div style={{ color: "#3D644B", fontWeight: 600 }}>Rev: ${data[hoveredIdx].revenue}M</div>
          <div style={{ color: "#C8A27A", fontWeight: 600 }}>Exp: ${data[hoveredIdx].expenses}M</div>
        </div>
      )}
    </div>
  );
}

/**
 * Interactive SVG Donut Chart: Sales by Region
 */
export function SalesByRegionDonutChart({
  regions = [
    { name: "North America", percentage: 50, color: "#3D644B" },
    { name: "Europe", percentage: 30, color: "#78C6B1" },
    { name: "Asia", percentage: 20, color: "#D4A373" },
  ],
}) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const size = 180;
  const center = size / 2;
  const radius = 68;
  const innerRadius = 46;

  // Compute SVG arc slices immutably
  const segments = regions.reduce(
    (acc, item) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = acc.currentAngle;
      const endAngle = acc.currentAngle + angle;

      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const x3 = center + innerRadius * Math.cos(endRad);
      const y3 = center + innerRadius * Math.sin(endRad);
      const x4 = center + innerRadius * Math.cos(startRad);
      const y4 = center + innerRadius * Math.sin(startRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
        Z
      `;

      // Midpoint for percentage label
      const midAngle = startAngle + angle / 2;
      const midRad = ((midAngle - 90) * Math.PI) / 180;
      const labelX = center + ((radius + innerRadius) / 2) * Math.cos(midRad);
      const labelY = center + ((radius + innerRadius) / 2) * Math.sin(midRad);

      acc.list.push({
        ...item,
        pathData,
        labelX,
        labelY,
      });
      acc.currentAngle = endAngle;
      return acc;
    },
    { currentAngle: 0, list: [] }
  ).list;

  return (
    <div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
        Sales by Region
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", gap: "12px" }}>
        {/* SVG Donut */}
        <div style={{ width: `${size}px`, height: `${size}px`, position: "relative" }}>
          <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", height: "100%" }}>
            {segments.map((seg, i) => {
              const isHovered = hoveredSegment === seg.name;
              return (
                <path
                  key={i}
                  d={seg.pathData}
                  fill={seg.color}
                  opacity={hoveredSegment && !isHovered ? 0.6 : 1}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    transformOrigin: `${center}px ${center}px`,
                    transform: isHovered ? "scale(1.04)" : "scale(1)",
                  }}
                  onMouseEnter={() => setHoveredSegment(seg.name)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}

            {/* Central White Cutout */}
            <circle cx={center} cy={center} r={innerRadius - 4} fill="var(--bg-surface)" />

            {/* Percentage text in center */}
            <text
              x={center}
              y={center + 5}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="16"
              fontWeight="800"
              fontFamily="var(--font-mono)"
            >
              {hoveredSegment
                ? `${regions.find((r) => r.name === hoveredSegment)?.percentage}%`
                : "100%"}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {regions.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12.5px",
                cursor: "pointer",
                fontWeight: hoveredSegment === r.name ? 700 : 500,
                color: hoveredSegment === r.name ? "var(--text-primary)" : "var(--text-secondary)",
              }}
              onMouseEnter={() => setHoveredSegment(r.name)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: r.color,
                  flexShrink: 0,
                }}
              />
              <span>{r.name}</span>
              <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", marginLeft: "auto" }}>
                {r.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive SVG Grouped Bar Chart: Cash Flow Forecast (Weeks 1 to 4)
 */
export function CashFlowForecastChart({
  weeks = [
    { name: "Week 1", cashIn: 13.2, cashOut: 7.8 },
    { name: "Week 2", cashIn: 14.5, cashOut: 6.2 },
    { name: "Week 3", cashIn: 16.1, cashOut: 9.4 },
    { name: "Week 4", cashIn: 18.0, cashOut: 8.5 },
  ],
}) {
  const width = 560;
  const height = 210;
  const padLeft = 45;
  const padRight = 15;
  const padTop = 20;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const maxVal = 20;

  const getY = (val) => padTop + chartH - (val / maxVal) * chartH;
  const getH = (val) => (val / maxVal) * chartH;

  const groupW = chartW / weeks.length;
  const barW = 28;

  const yTicks = [
    { label: "$15M", val: 15 },
    { label: "$10M", val: 10 },
    { label: "$5M", val: 5 },
    { label: "$0", val: 0 },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
          Cash Flow Forecast
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#3D644B" }} />
            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Cash In</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#9C948B" }} />
            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Cash Out</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
        {/* Gridlines */}
        {yTicks.map((tick, i) => {
          const y = getY(tick.val);
          return (
            <g key={i}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--text-tertiary)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {tick.label}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {weeks.map((w, i) => {
          const groupX = padLeft + i * groupW + groupW / 2;
          const inX = groupX - barW - 2;
          const outX = groupX + 2;

          const inH = getH(w.cashIn);
          const outH = getH(w.cashOut);

          return (
            <g key={i}>
              {/* Cash In Bar */}
              <rect
                x={inX}
                y={getY(w.cashIn)}
                width={barW}
                height={inH}
                fill="#3D644B"
                rx="3"
                style={{ transition: "all 0.2s" }}
              />

              {/* Cash Out Bar */}
              <rect
                x={outX}
                y={getY(w.cashOut)}
                width={barW}
                height={outH}
                fill="#9C948B"
                rx="3"
                style={{ transition: "all 0.2s" }}
              />

              {/* Week Label */}
              <text
                x={groupX}
                y={height - 8}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="11"
                fontWeight="500"
              >
                {w.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Horizontal Bar Chart: Top Operating Expenses
 */
export function TopOperatingExpensesChart({
  expenses = [
    { label: "Payroll", amount: "$320,000", val: 320, color: "#3D644B" },
    { label: "Rent", amount: "$75,000", val: 75, color: "#3D644B" },
    { label: "Software", amount: "$95,000", val: 95, color: "#3D644B" },
    { label: "Marketing", amount: "$15,000", val: 15, color: "#3D644B" },
    { label: "Others", amount: "$8,000", val: 8, color: "#3D644B" },
  ],
}) {
  const maxVal = 350;

  return (
    <div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px" }}>
        Top Operating Expenses
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {expenses.map((exp, i) => {
          const widthPercent = maxVal > 0 ? Math.min(100, Math.max(0, ((exp.val || 0) / maxVal) * 100)) : 0;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  width: "80px",
                  fontSize: "12.5px",
                  color: "var(--text-secondary)",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {exp.label}
              </span>

              <div
                style={{
                  flex: 1,
                  height: "22px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${widthPercent}%`,
                    backgroundColor: exp.color,
                    borderRadius: "4px",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>

              <span
                style={{
                  width: "75px",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-primary)",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {exp.amount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
