import MetricsCard from "./MetricsCard";
import DiskChart from "./DiskChart";

/* ── Single Algorithm View ──────────────────────────────── */
function SingleResult({ data }) {
  const algLabel = data.algorithm?.toUpperCase() || "—";

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Result badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          display: "inline-flex", alignItems: "center",
          borderRadius: 6, backgroundColor: "var(--tag-bg)", color: "var(--tag-text)",
          padding: "3px 10px", fontSize: 12, fontWeight: 600,
        }}>
          {algLabel}
        </span>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Head starts at track{" "}
          <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>{data.head}</strong>
        </span>
      </div>

      {/* Metrics grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <MetricsCard icon="→" label="Total Seek"    value={data.totalSeekTime}      unit="tracks"    />
        <MetricsCard icon="~" label="Avg Seek"      value={data.avgSeekTime}        unit="tracks"    />
        <MetricsCard icon="↑" label="Max Seek"      value={data.maxSeekTime}        unit="tracks"    />
        <MetricsCard icon="σ" label="Variance"      value={data.variance}           unit="tracks²"   />
        <MetricsCard icon="±" label="Std Deviation" value={data.standardDeviation}  unit="tracks"    />
        <MetricsCard icon="⚡" label="Throughput"   value={data.throughput}         unit="req/track" />
      </div>

      {/* Chart */}
      <DiskChart results={data} isComparison={false} />

      {/* Seek sequence */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Seek Sequence</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>
            {data.sequence.length} steps
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.sequence.map((track, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center",
              borderRadius: 6, padding: "4px 10px",
              fontSize: 12, fontFamily: "monospace", fontWeight: 500,
              backgroundColor: i === 0 ? "var(--tag-bg)" : "var(--bg-subtle)",
              color: i === 0 ? "var(--tag-text)" : "var(--text-secondary)",
              border: "1px solid var(--border)",
              transition: "background-color 0.15s ease",
            }}>
              {track}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Comparison View ────────────────────────────────────── */
function ComparisonResult({ data }) {
  const algNames = Object.keys(data.results);
  const bestSeek = Math.min(...algNames.map((a) => data.results[a].totalSeekTime));

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          display: "inline-flex", alignItems: "center",
          borderRadius: 6, border: "1px solid var(--border)",
          backgroundColor: "var(--bg-raised)", color: "var(--text-secondary)",
          padding: "3px 10px", fontSize: 12, fontWeight: 600,
        }}>
          Comparison
        </span>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          All algorithms · Head at{" "}
          <strong style={{ color: "var(--text-primary)" }}>{data.head}</strong>
        </span>
      </div>

      {/* Chart */}
      <DiskChart results={data.results} isComparison={true} />

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 8
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
            Performance Comparison
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-subtle)" }}>
                {["Algorithm", "Total Seek", "Avg Seek", "Max Seek", "Variance", "Throughput"].map((col, i) => (
                  <th key={col} style={{
                    padding: "10px 16px",
                    textAlign: i === 0 ? "left" : "right",
                    fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                    letterSpacing: "0.06em", color: "var(--text-label)", whiteSpace: "nowrap"
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {algNames.map((alg) => {
                const r = data.results[alg];
                const isBest = r.totalSeekTime === bestSeek;
                return (
                  <tr key={alg} style={{
                    borderBottom: "1px solid var(--border-soft)",
                    backgroundColor: isBest ? "var(--best-bg)" : "transparent",
                    transition: "background-color 0.1s ease",
                  }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{alg}</span>
                        {isBest && (
                          <span style={{
                            borderRadius: 20, padding: "2px 8px",
                            fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
                            color: "var(--best-text)", backgroundColor: "var(--best-bg)",
                            border: "1px solid var(--best-border)",
                          }}>
                            Best
                          </span>
                        )}
                      </div>
                    </td>
                    {[r.totalSeekTime, r.avgSeekTime, r.maxSeekTime, r.variance, r.throughput].map((val, i) => (
                      <td key={i} style={{
                        padding: "12px 16px", textAlign: "right",
                        fontFamily: "monospace", fontSize: 13,
                        fontWeight: i === 0 ? 600 : 400,
                        color: i === 0 ? "var(--text-primary)" : "var(--text-secondary)"
                      }}>
                        {val}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPanel({ data, mode }) {
  if (!data) return null;
  if (mode === "single") return <SingleResult data={data} />;
  return <ComparisonResult data={data} />;
}
