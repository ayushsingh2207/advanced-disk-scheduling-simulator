import MetricsCard from "./MetricsCard";
import DiskChart from "./DiskChart";
import { Sparkles, Trophy, ArrowRight, Gauge } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ── Heatmap Component ───────────────────────────────────── */
function IntensityHeatmap({ sequence, currentStep = -1 }) {
  const scrollRef = useRef(null);
  const [showPing, setShowPing] = useState(true);

  useEffect(() => {
    // Reset ping when starting/moving
    if (currentStep < sequence.length - 1) {
      setShowPing(true);
    }
    
    // Auto-stop ping after 5s at the last step
    if (currentStep >= 0 && currentStep === sequence.length - 1) {
      const timer = setTimeout(() => setShowPing(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, sequence.length]);

  useEffect(() => {
    if (currentStep >= 0 && scrollRef.current) {
      const activeEl = scrollRef.current.querySelector(`[data-step="${currentStep}"]`);
      if (activeEl) {
        // Use manual scrollLeft to prevent the main window from jumping vertically
        const container = scrollRef.current;
        const scrollAmount = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
        container.scrollTo({ left: scrollAmount, behavior: "smooth" });
      }
    }
  }, [currentStep]);

  return (
    <div className="card overflow-hidden" style={{ padding: 0 }}>
      <div style={{ 
        padding: "16px 20px", 
        borderBottom: "1px solid var(--border)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        background: "linear-gradient(to right, var(--bg-subtle), transparent)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Gauge size={16} className="text-blue-400" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.02em" }}>Operation Intensity Timeline</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#3b82f6" }} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>Efficient</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#ef4444" }} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>High Stress</span>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="custom-scrollbar" 
        style={{ 
          display: "flex", 
          overflowX: "auto", 
          padding: "20px", 
          gap: "4px",
          backgroundColor: "rgba(0,0,0,0.05)",
          minHeight: "96px"
        }}
      >
        <AnimatePresence>
          {sequence.map((track, i) => {
            const isVisible = currentStep === -1 || i <= currentStep;
            if (!isVisible) return null;

            const isActive = i === currentStep;
            const prevTrack = i > 0 ? sequence[i - 1] : null;
            const distance = prevTrack !== null ? Math.abs(track - prevTrack) : 0;
            
            let color = "#3b82f6";
            let glow = "none";
            if (distance > 30) color = "#f59e0b";
            if (distance > 100) {
              color = "#ef4444";
              glow = "0 0 15px rgba(239, 68, 68, 0.25)";
            }

            return (
              <motion.div 
                key={i} 
                data-step={i}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                {i > 0 && <ArrowRight size={12} className="text-gray-600 opacity-30" />}
                <div 
                  className="group relative"
                  style={{
                    minWidth: "48px",
                    height: "56px",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: i === 0 ? "var(--bg-subtle)" : `${color}15`,
                    border: `2px solid ${isActive ? color : (i === 0 ? "var(--border)" : `${color}40`)}`,
                    boxShadow: isActive ? `0 0 15px ${color}` : glow,
                    transition: "all 0.2s ease",
                    cursor: "default",
                    position: "relative"
                  }}
                >
                  {isActive && showPing && (
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-ping" />
                  )}
                  <span style={{ 
                    fontSize: "13px", 
                    fontWeight: 700, 
                    fontFamily: "monospace",
                    color: i === 0 ? "var(--text-primary)" : color 
                  }}>
                    {track}
                  </span>
                  {i > 0 && (
                    <span style={{ 
                      fontSize: "9px", 
                      fontWeight: 800, 
                      color: color, 
                      opacity: 0.6,
                      marginTop: "2px"
                    }}>
                      Δ{distance}
                    </span>
                  )}
                  
                  <div className="absolute invisible group-hover:visible -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-xl border border-gray-700">
                    {i === 0 ? "Start Position" : `Jump: ${distance} tracks`}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Single Algorithm View ──────────────────────────────── */
function SingleResult({ data, currentStep }) {
  const algLabel = data.algorithm?.toUpperCase() || "—";

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Result badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
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

      {/* Intensity Heatmap (Moved to top for better visibility) */}
      <IntensityHeatmap sequence={data.sequence} currentStep={currentStep} />

      {/* Hybrid Policy Breakdown */}
      {data.policyLog && data.algorithm === "HYBRID" && (
        <div className="card bg-violet-900/5 border-violet-500/20" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Gauge size={18} className="text-violet-400" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Dynamic Policy Breakdown</span>
          </div>
          
          {(() => {
            const total = data.policyLog.length;
            const sstfCount = data.policyLog.filter(p => p.includes("SSTF")).length;
            const scanCount = total - sstfCount;
            const sstfPct = Math.round((sstfCount / total) * 100);
            const scanPct = 100 - sstfPct;

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ height: 10, width: "100%", backgroundColor: "var(--border-soft)", borderRadius: 5, overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${sstfPct}%`, backgroundColor: "#3b82f6", transition: "width 1s ease" }} />
                  <div style={{ width: `${scanPct}%`, backgroundColor: "#8b5cf6", transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600 }}>
                  <div style={{ color: "#3b82f6" }}>⚡ SPEED MODE (SSTF): {sstfPct}%</div>
                  <div style={{ color: "#8b5cf6" }}>⚖️ FAIRNESS MODE (SCAN): {scanPct}%</div>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>
                  The kernel optimizer automatically prioritized <strong>{sstfPct > scanPct ? 'throughput' : 'fairness'}</strong> based on current workload density and starvation risk.
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Chart */}
      <DiskChart results={data} isComparison={false} />

      {/* AI Insights Card (Moved to bottom) */}
      {data.aiInsights && (
        <div className="card border-l-4 border-l-purple-500 bg-purple-50/10" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Sparkles size={18} className="text-purple-400" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Expert Insights</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, fontStyle: "italic" }}>
            "{data.aiInsights}"
          </p>
        </div>
      )}
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
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

      {/* Winner Summary (AI) */}
      <div className="card bg-green-50/10 border-l-4 border-l-green-500" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Trophy size={18} className="text-yellow-400" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Comparison Summary</span>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          The <span className="text-green-400 font-bold">{algNames.find(a => data.results[a].totalSeekTime === bestSeek)}</span> algorithm was most efficient with a total seek time of {bestSeek} tracks.
        </p>
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

export default function ResultsPanel({ data, mode, currentStep }) {
  if (!data) return null;
  if (mode === "single") return <SingleResult data={data} currentStep={currentStep} />;
  return <ComparisonResult data={data} />;
}
