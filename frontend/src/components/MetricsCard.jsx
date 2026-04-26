const VARIANTS = {
  default: { bar: "#555555", value: "var(--text-primary)" },
  blue:    { bar: "#555555", value: "var(--text-primary)" },
  green:   { bar: "#555555", value: "var(--text-primary)" },
  amber:   { bar: "#555555", value: "var(--text-primary)" },
  red:     { bar: "#555555", value: "var(--text-primary)" },
};

export default function MetricsCard({ icon, label, value, unit }) {
  return (
    <div className="card metrics-card-animated" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Icon */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)", fontSize: 14,
        flexShrink: 0, alignSelf: "center"
      }}>
        {icon}
      </div>

      {/* Value */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 22, fontWeight: 600, lineHeight: 1, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {unit && (
          <p style={{ marginTop: 4, fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {unit}
          </p>
        )}
      </div>

      {/* Label + bar */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ height: 2, width: 24, borderRadius: 9999, backgroundColor: "var(--text-secondary)", marginBottom: 8 }} />
        <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</p>
      </div>
    </div>
  );
}
