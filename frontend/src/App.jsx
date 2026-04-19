import { useState } from "react";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import ResultsPanel from "./components/ResultsPanel";
import { simulateAlgorithm, compareAlgorithms } from "./services/api";

export default function App() {
  const [result, setResult]   = useState(null);
  const [mode, setMode]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [dark, setDark]       = useState(true);

  const handleSimulate = async (inputs) => {
    setLoading(true); setError(null);
    try {
      const data = await simulateAlgorithm(inputs);
      setResult(data); setMode("single");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleCompare = async (inputs) => {
    setLoading(true); setError(null);
    try {
      const data = await compareAlgorithms(inputs);
      setResult(data); setMode("compare");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div
      className={dark ? "dark" : ""}
      style={{ minHeight: "100vh", backgroundColor: "var(--bg)", color: "var(--text-primary)", transition: "background-color 0.2s ease, color 0.2s ease" }}
    >
      <Header dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "340px 1fr" }}>
          {/* Left — sticky config */}
          <div style={{ position: "sticky", top: 24, alignSelf: "start" }}>
            <InputPanel onSimulate={handleSimulate} onCompare={handleCompare} loading={loading} />
          </div>

          {/* Right — results */}
          <div style={{ minWidth: 0 }}>
            {error && (
              <div className="animate-fade-in" style={{
                marginBottom: 20,
                display: "flex", alignItems: "flex-start", gap: 10,
                borderRadius: 8, border: "1px solid #e0a0a0",
                backgroundColor: "rgba(200,60,60,0.08)",
                padding: "12px 16px", fontSize: 13, color: "#c03030"
              }}>
                <svg viewBox="0 0 16 16" fill="none" style={{ width: 15, height: 15, marginTop: 1, flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span><strong>Error: </strong>{error}</span>
              </div>
            )}

            {result ? (
              <ResultsPanel data={result} mode={mode} />
            ) : (
              <div className="animate-fade-in" style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: 440, borderRadius: 12, textAlign: "center", padding: 40,
                border: "1.5px dashed var(--border)", backgroundColor: "var(--bg-raised)"
              }}>
                <div style={{
                  marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center",
                  width: 56, height: 56, borderRadius: 16, backgroundColor: "var(--bg-subtle)"
                }}>
                  <svg viewBox="0 0 32 32" fill="none" style={{ width: 28, height: 28, color: "var(--text-muted)" }}>
                    <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
                    <path d="M16 3v4M16 25v4M3 16h4M25 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                  No simulation yet
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 300 }}>
                  Configure your disk access requests and initial head position, then click{" "}
                  <strong style={{ color: "var(--text-primary)" }}>Run Simulation</strong> to visualize.
                </p>
                <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                  {["FCFS", "SSTF", "SCAN", "C-SCAN"].map((alg) => (
                    <span key={alg} style={{
                      borderRadius: 20, border: "1px solid var(--border)",
                      padding: "4px 12px", fontSize: 12, fontWeight: 500,
                      color: "var(--text-secondary)"
                    }}>
                      {alg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 64, borderTop: "1px solid var(--border)",
        backgroundColor: "var(--bg-raised)",
        padding: "20px 24px"
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12
        }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>DiskSim</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Advanced Disk Scheduling Simulator · Operating Systems Project
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {["FCFS", "SSTF", "SCAN", "C-SCAN"].map((a) => (
              <span key={a} style={{ fontSize: 12, color: "var(--text-muted)" }}>{a}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
