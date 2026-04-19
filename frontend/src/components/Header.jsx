export default function Header({ dark, onToggleDark }) {
  return (
    <header style={{
      backgroundColor: "var(--bg-raised)",
      borderBottom: "1px solid var(--border)",
      transition: "background-color 0.2s ease, border-color 0.2s ease"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>

          {/* ── Dark mode toggle (top left) ── */}
          <button
            onClick={onToggleDark}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: 8,
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-subtle)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "background-color 0.15s ease, border-color 0.15s ease",
              padding: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--btn-outline-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-subtle)"; }}
          >
            {dark ? (
              /* sun icon — switch to light */
              <svg viewBox="0 0 20 20" fill="none" style={{ width: 16, height: 16 }}>
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              /* moon icon — switch to dark */
              <svg viewBox="0 0 20 20" fill="none" style={{ width: 16, height: 16 }}>
                <path d="M17 11.5A7 7 0 1 1 8.5 3a5.5 5.5 0 0 0 8.5 8.5z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* ── Title ── */}
          <div style={{ flexShrink: 0 }}>
            <p className="section-label" style={{ marginBottom: 2 }}>Operating Systems · Disk I/O</p>
            <h1 style={{
              fontSize: 20, fontWeight: 600, lineHeight: 1.2,
              letterSpacing: "-0.02em", whiteSpace: "nowrap",
              color: "var(--text-primary)"
            }}>
              Disk Scheduling{" "}
              <span style={{ color: "var(--text-muted)" }}>Simulator</span>
            </h1>
          </div>

          {/* ── Divider ── */}
          <div style={{ width: 1, height: 36, backgroundColor: "var(--border)", flexShrink: 0 }} />

          {/* ── Description ── */}
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Visualize and compare{" "}
            <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>FCFS</strong>,{" "}
            <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>SSTF</strong>,{" "}
            <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>SCAN</strong>, and{" "}
            <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>C-SCAN</strong>{" "}
            disk scheduling algorithms with interactive graphs and real-time performance metrics.
          </p>

        </div>
      </div>
    </header>
  );
}
