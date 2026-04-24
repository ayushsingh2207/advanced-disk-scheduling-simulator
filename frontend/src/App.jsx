import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import ResultsPanel from "./components/ResultsPanel";
import NeedleTrack from "./components/NeedleTrack";
import { simulateAlgorithm, compareAlgorithms } from "./services/api";

export default function App() {
  const [result, setResult]   = useState(null);
  const [mode, setMode]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [dark, setDark]       = useState(true);

  // Simulation Animation State
  const [currentHeadPos, setCurrentHeadPos] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [servicedIndices, setServicedIndices] = useState(new Set());
  const [lastInjected, setLastInjected] = useState(null);
  const [decisionLog, setDecisionLog] = useState([]);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [simTime, setSimTime] = useState(0);
  const [currentDirection, setCurrentDirection] = useState("right");
  
  // NEW Neural Path States
  const [history, setHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [reasoning, setReasoning] = useState("");
  const [ripples, setRipples] = useState([]);
  
  const simIntervalRef = useRef(null);

  const getReasoning = (algo, current, target, direction) => {
    const a = algo.toLowerCase();
    if (a === 'fcfs') return "Processing next request in arrival queue...";
    if (a === 'sstf') return `Found nearest request at track ${target}`;
    if (a === 'scan' || a === 'look') {
      if (direction === 'right' && target < current) return "End reached. Reversing direction...";
      if (direction === 'left' && target > current) return "End reached. Reversing direction...";
      return `Scanning ${direction} for next track...`;
    }
    if (a === 'cscan' || a === 'clook') {
      if (target < current) return "Cycle complete. Jumping back to start...";
      return `Cycling ${direction} for uniform service...`;
    }
    return "Analyzing optimal path...";
  };

  const handleTrackClick = (track) => {
    setLastInjected(`${track}:0`);
    setDecisionLog(prev => [`User injected request at track ${track}`, ...prev.slice(0, 4)]);
    setTimeout(() => setLastInjected(null), 100);
  };

  const handleSimulate = async (inputs) => {
    setLoading(true); setError(null);
    setIsSimulating(false);
    setServicedIndices(new Set());
    setHistory([]);
    setRipples([]);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    try {
      const data = await simulateAlgorithm(inputs);
      setResult(data); 
      setMode("single");
      setCurrentHeadPos(data.head);
      setHistory([data.head]);
      setSimTime(0);
      setCurrentDirection(inputs.direction || "right");
      
      // Start Simulation Animation
      let step = 0;
      setIsSimulating(true);
      setDecisionLog([`Starting ${data.algorithm} simulation...`]);
      
      const runStep = () => {
        if (step < data.sequence.length) {
          const newPos = data.sequence[step];
          const prevPos = step > 0 ? data.sequence[step - 1] : data.head;
          
          // 1. Thinking Phase
          setIsThinking(true);
          const currentDir = newPos >= prevPos ? "right" : "left";
          setReasoning(getReasoning(data.algorithm, prevPos, newPos, currentDir));
          
          setTimeout(() => {
            // 2. Move Phase
            setIsThinking(false);
            setCurrentHeadPos(newPos);
            setCurrentTarget(newPos);
            setHistory(prev => [...prev, newPos]);
            
            if (newPos > prevPos) setCurrentDirection("right");
            else if (newPos < prevPos) setCurrentDirection("left");

            setSimTime(prev => prev + Math.abs(newPos - prevPos));
            
            if (newPos !== prevPos) {
              setDecisionLog(prev => [`Moving head from ${prevPos} to ${newPos}`, ...prev.slice(0, 4)]);
            }

            // 3. Service Phase
            data.requests.forEach((req, idx) => {
              if (req.track === newPos) {
                setServicedIndices(prev => new Set(prev).add(idx));
                setDecisionLog(prev => [`Servicing request at track ${newPos}`, ...prev.slice(0, 4)]);
                
                // Add Ripple
                const ripId = Date.now() + idx;
                setRipples(prev => [...prev, { id: ripId, track: newPos }]);
                setTimeout(() => {
                  setRipples(prev => prev.filter(r => r.id !== ripId));
                }, 600);
              }
            });

            step++;
            simIntervalRef.current = setTimeout(runStep, 800);
          }, 600); // 600ms thinking delay
        } else {
          setIsSimulating(false);
          setIsThinking(false);
          setCurrentTarget(null);
          setDecisionLog(prev => ["Simulation complete.", ...prev.slice(0, 4)]);
        }
      };

      simIntervalRef.current = setTimeout(runStep, 400);

    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleCompare = async (inputs) => {
    setLoading(true); setError(null);
    setIsSimulating(false);
    setCurrentTarget(null);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    try {
      const data = await compareAlgorithms(inputs);
      setResult(data); setMode("compare");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const displayRequests = result?.requests?.map((req, idx) => ({
    ...req,
    serviced: servicedIndices.has(idx)
  })) || [];

  return (
    <div
      className={dark ? "dark" : ""}
      style={{ minHeight: "100vh", backgroundColor: "var(--bg)", color: "var(--text-primary)", transition: "background-color 0.2s ease, color 0.2s ease" }}
    >
      <Header dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 24px" }}>
        
        {/* Animated Needle Track at the top if result exists */}
        {mode === "single" && result && (
          <div className="animate-fade-in mb-10 grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-4">
              <NeedleTrack 
                currentHead={currentHeadPos} 
                requests={displayRequests} 
                maxTrack={result.maxTrack}
                isSimulating={isSimulating}
                onTrackClick={handleTrackClick}
                currentTarget={currentTarget}
                simTime={simTime}
                direction={currentDirection}
                history={history}
                reasoning={reasoning}
                isThinking={isThinking}
                ripples={ripples}
              />
            </div>
            <div className="card bg-gray-900/50 border-gray-800 p-5 overflow-hidden h-64 flex flex-col">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-3">Live Decision Log</h4>
              <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
                {decisionLog.map((log, i) => (
                  <p key={i} className={`text-[11px] leading-relaxed ${i === 0 ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>
                    {i === 0 ? '⚡ ' : '• '}{log}
                  </p>
                ))}
                {decisionLog.length === 0 && <p className="text-[11px] text-gray-600 italic">Waiting for simulation...</p>}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "340px 1fr" }}>
          {/* Left — sticky config */}
          <div style={{ position: "sticky", top: 24, alignSelf: "start" }}>
            <InputPanel 
              onSimulate={handleSimulate} 
              onCompare={handleCompare} 
              loading={loading} 
              externalRequests={lastInjected}
            />
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
