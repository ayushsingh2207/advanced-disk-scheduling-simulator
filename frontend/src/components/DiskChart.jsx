import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";

const PALETTE = ["var(--chart-color-1)", "var(--chart-color-2)", "var(--chart-color-3)", "var(--chart-color-4)"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: "rgba(15, 23, 42, 0.8)", 
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: 12, padding: "12px 16px", fontSize: 12,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
      color: "#fff"
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
        Step {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "3px 0" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }} />
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{entry.name}:</span>
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }) {
  if (!payload) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 12 }}>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, backgroundColor: entry.color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)" }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DiskChart({ results, isComparison }) {
  if (!results) return null;

  let chartData = [], lines = [];

  if (isComparison) {
    const algNames = Object.keys(results);
    const maxLen = Math.max(...algNames.map((a) => results[a].sequence.length));
    for (let i = 0; i < maxLen; i++) {
      const pt = { step: i };
      algNames.forEach((alg) => { pt[alg] = results[alg].sequence[i] ?? null; });
      chartData.push(pt);
    }
    lines = algNames.map((alg, idx) => ({ key: alg, color: PALETTE[idx % PALETTE.length] }));
  } else {
    chartData = results.sequence.map((track, i) => ({ step: i, Track: track }));
    lines = [{ key: "Track", color: "#6366f1" }]; // Indigo/Violet primary
  }

  const ChartComponent = isComparison ? LineChart : AreaChart;

  return (
    <div className="card animate-slide-up" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Disk Head Movement</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {isComparison ? "All algorithms overlaid" : "Head traverse sequence"}
          </p>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
          {chartData.length} steps
        </span>
      </div>

      <div style={{ height: 400, width: "100%", position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorTrack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="5 5" stroke="var(--border-soft)" vertical={false} />
            <XAxis dataKey="step"
              tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 600 }}
              tickLine={false} axisLine={false}
              dy={10}
            />
            <YAxis
              domain={[0, results.maxTrack || 199]}
              tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 600 }}
              tickLine={false} axisLine={false}
              dx={-5}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }} 
            />
            {isComparison && <Legend content={<CustomLegend />} verticalAlign="bottom" />}
            
            {lines.map((line) => {
              const commonProps = {
                key: line.key,
                type: "monotone",
                dataKey: line.key,
                stroke: line.color,
                strokeWidth: 3,
                dot: { r: 4, fill: "#0f172a", stroke: line.color, strokeWidth: 2 },
                activeDot: { r: 6, fill: line.color, strokeWidth: 0, shadow: `0 0 15px ${line.color}` },
                animationDuration: 1000,
                animationEasing: "ease-in-out",
                style: { filter: "url(#glow)" }
              };

              return isComparison ? (
                <Line {...commonProps} />
              ) : (
                <Area 
                  {...commonProps}
                  fillOpacity={1}
                  fill="url(#colorTrack)"
                />
              );
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
