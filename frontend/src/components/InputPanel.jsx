import { useState } from "react";

const ALGORITHMS = [
  { id: "fcfs",  label: "FCFS",   name: "First Come First Served",  desc: "Requests served in arrival order" },
  { id: "sstf",  label: "SSTF",   name: "Shortest Seek Time First", desc: "Always move to nearest track" },
  { id: "scan",  label: "SCAN",   name: "Elevator Algorithm",       desc: "Sweep back and forth across disk" },
  { id: "cscan", label: "C-SCAN", name: "Circular SCAN",            desc: "One-directional sweep, resets at end" },
];

export default function InputPanel({ onSimulate, onCompare, loading }) {
  const [requests,  setRequests]  = useState("98, 183, 37, 122, 14, 124, 65, 67");
  const [head,      setHead]      = useState("53");
  const [maxTrack,  setMaxTrack]  = useState("199");
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [direction, setDirection] = useState("right");

  const parseInputs = () => ({
    requests: requests.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)),
    head:     parseInt(head, 10),
    maxTrack: parseInt(maxTrack, 10),
    algorithm,
    direction,
  });

  const labelStyle = {
    display: "block", marginBottom: 6,
    fontSize: 11, fontWeight: 600,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "var(--text-label)",
  };

  return (
    <div className="card animate-slide-up" style={{ padding: 24 }}>

      {/* Panel header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 24, paddingBottom: 20,
        borderBottom: "1px solid var(--border-soft)"
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 8,
          backgroundColor: "var(--bg-subtle)"
        }}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 15, height: 15, color: "var(--text-secondary)" }}>
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Configuration</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Set up your simulation</p>
        </div>
      </div>

      {/* Disk Access Requests */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }} htmlFor="disk-requests-input">Disk Access Requests</label>
          <button
            onClick={() => {
              const max = parseInt(maxTrack, 10) || 199;
              // Generate 6 to 10 random requests
              const count = Math.floor(Math.random() * 5) + 6;
              const randomReqs = Array.from({ length: count }, () => Math.floor(Math.random() * (max + 1)));
              setRequests(randomReqs.join(", "));
            }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
              background: "none", border: "none", cursor: "pointer",
              padding: 0, fontFamily: "inherit", transition: "color 0.15s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
            title="Generate random requests"
          >
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12 }}>
              <path d="M13.5 2.5a6.5 6.5 0 1 0 1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.5 1v3.5H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Randomize
          </button>
        </div>
        <textarea
          id="disk-requests-input"
          rows={2}
          className="input-field"
          style={{ resize: "none", fontFamily: "monospace", fontSize: 13, lineHeight: 1.5 }}
          placeholder="e.g. 98, 183, 37, 122, 14, 124, 65, 67"
          value={requests}
          onChange={(e) => setRequests(e.target.value)}
        />
        <p style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>Comma-separated track numbers</p>
      </div>

      {/* Head + Max Track */}
      <div style={{ marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { id: "head-position-input", label: "Head Position", val: head, set: setHead, ph: "53" },
          { id: "max-track-input",     label: "Max Track",     val: maxTrack, set: setMaxTrack, ph: "199" },
        ].map(({ id, label, val, set, ph }) => (
          <div key={id}>
            <label style={labelStyle} htmlFor={id}>{label}</label>
            <input id={id} type="number" className="input-field" placeholder={ph}
              value={val} onChange={(e) => set(e.target.value)} />
          </div>
        ))}
      </div>

      {/* Algorithm selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Algorithm</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ALGORITHMS.map((algo) => {
            const active = algorithm === algo.id;
            return (
              <button
                key={algo.id}
                id={`algo-btn-${algo.id}`}
                onClick={() => setAlgorithm(algo.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  borderRadius: 8, padding: "10px 14px", textAlign: "left",
                  border: `1px solid ${active ? "var(--algo-active-border)" : "var(--border)"}`,
                  backgroundColor: active ? "var(--algo-active-bg)" : "var(--bg-raised)",
                  cursor: "pointer", transition: "all 0.15s ease", fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
                    e.currentTarget.style.borderColor = "var(--border-soft)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "var(--bg-raised)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }
                }}
              >
                {/* Radio dot */}
                <span style={{
                  flexShrink: 0, width: 14, height: 14, borderRadius: "50%",
                  border: `2px solid ${active ? "var(--algo-active-text)" : "var(--text-muted)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {active && <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--algo-active-text)", display: "block" }} />}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 500, color: active ? "var(--algo-active-text)" : "var(--text-primary)" }}>
                    {algo.label}
                    <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400, color: active ? "var(--algo-active-text-sec)" : "var(--text-secondary)" }}>
                      {algo.name}
                    </span>
                  </span>
                  <span style={{ display: "block", fontSize: 11, color: active ? "var(--algo-active-text-muted)" : "var(--text-muted)", marginTop: 2 }}>
                    {algo.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Direction (SCAN only) */}
      {algorithm === "scan" && (
        <div className="animate-fade-in" style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Initial Direction</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {["left", "right"].map((dir) => {
              const active = direction === dir;
              return (
                <button
                  key={dir}
                  id={`direction-btn-${dir}`}
                  onClick={() => setDirection(dir)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 500,
                    border: `1px solid ${active ? "var(--algo-active-border)" : "var(--border)"}`,
                    backgroundColor: active ? "var(--algo-active-bg)" : "var(--bg-raised)",
                    color: active ? "var(--algo-active-text)" : "var(--text-primary)",
                    cursor: "pointer", transition: "all 0.15s ease", fontFamily: "inherit",
                  }}
                >
                  {dir === "left" ? "← Left" : "Right →"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-soft)", display: "flex", flexDirection: "column", gap: 8 }}>
        <button id="simulate-btn" className="btn-primary" style={{ width: "100%" }}
          onClick={() => onSimulate(parseInputs())} disabled={loading}>
          {loading ? (
            <svg className="animate-spin-fast" viewBox="0 0 24 24" fill="none" style={{ width: 15, height: 15 }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 13, height: 13 }}>
              <path d="M5 3l8 5-8 5V3z" fill="currentColor"/>
            </svg>
          )}
          {loading ? "Simulating…" : "Run Simulation"}
        </button>
        <button id="compare-btn" className="btn-secondary" style={{ width: "100%" }}
          onClick={() => onCompare(parseInputs())} disabled={loading}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 13, height: 13 }}>
            <path d="M2 4h4v8H2zM6 6h4v6H6zM10 2h4v10h-4z" fill="currentColor" opacity="0.7"/>
          </svg>
          Compare All Algorithms
        </button>
      </div>
    </div>
  );
}
