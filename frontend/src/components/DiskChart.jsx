import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const PALETTE = ["var(--chart-color-1)", "var(--chart-color-2)", "var(--chart-color-3)", "var(--chart-color-4)"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: "var(--bg-raised)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "10px 14px", fontSize: 12,
      boxShadow: "var(--shadow-panel)"
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        Step {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 0" }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: entry.color, flexShrink: 0 }} />
          <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>{entry.name}:</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 11 }}>Track {entry.value}</span>
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
    lines = [{ key: "Track", color: "var(--text-primary)" }];
  }

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

      <div style={{ height: 360, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="step"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickLine={false} axisLine={{ stroke: "var(--border)" }}
              label={{ value: "Step", position: "insideBottom", offset: -18, fill: "var(--text-label)", fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickLine={false} axisLine={false}
              label={{ value: "Track", angle: -90, position: "insideLeft", offset: 14, fill: "var(--text-label)", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1.5 }} />
            {isComparison && <Legend content={<CustomLegend />} verticalAlign="bottom" />}
            {lines.map((line) => (
              <Line key={line.key} type="monotone" dataKey={line.key}
                stroke={line.color} strokeWidth={2}
                dot={{ r: 3.5, fill: "var(--bg-raised)", stroke: line.color, strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: line.color, strokeWidth: 0 }}
                animationDuration={800} animationEasing="ease-out" connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
