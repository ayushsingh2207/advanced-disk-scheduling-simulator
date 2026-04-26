import React, { useEffect, useState, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const NeedleTrack = ({ 
  currentHead, 
  requests, 
  maxTrack = 199, 
  isSimulating, 
  onTrackClick, 
  currentTarget, 
  simTime, 
  direction,
  history = [], 
  reasoning = "", 
  isThinking = false, 
  ripples = [],
  activePolicy = ""
}) => {
  const controls = useAnimation();
  const [justServiced, setJustServiced] = useState(false);

  // Helper to map track to percentage within the padded area
  // We use 4% to 96% to keep everything safely inside the container
  const getPos = (track) => 4 + (track / maxTrack) * 92;

  useEffect(() => {
    const isAtRequest = requests.some(r => Math.abs(r.track - currentHead) < 0.5 && !r.serviced);
    if (isAtRequest) {
      setJustServiced(true);
      setTimeout(() => setJustServiced(false), 300);
    }
  }, [currentHead, requests]);

  const getIntentText = () => {
    if (isThinking) return reasoning || "CALCULATING...";
    if (!isSimulating) return "IDLE";
    if (currentTarget === null) return "FINISHING...";
    return `TARGET: ${currentTarget}`;
  };

  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = rect.width * 0.04;
    const activeWidth = rect.width * 0.92;
    const track = Math.round(((x - padding) / activeWidth) * maxTrack);
    const clampedTrack = Math.max(0, Math.min(maxTrack, track));
    if (onTrackClick) onTrackClick(clampedTrack);
  };

  useEffect(() => {
    controls.start({
      left: `${getPos(currentHead)}%`,
      transition: { type: 'spring', stiffness: 50, damping: 20 }
    });
  }, [currentHead, controls, maxTrack]);

  const trailPath = useMemo(() => {
    if (history.length < 2) return "";
    return history.map((pos, i) => {
      const x = getPos(pos);
      return `${i === 0 ? 'M' : 'L'} ${x} 50`;
    }).join(" ");
  }, [history, maxTrack]);

  return (
    <div 
      className="relative w-full h-64 bg-gray-950 rounded-xl border border-gray-800 shadow-2xl p-4 mb-8 cursor-crosshair group"
      onClick={handleTrackClick}
    >
      {/* Legend */}
      <div className="absolute top-3 left-6 flex gap-6 pointer-events-none opacity-80 text-[11px] font-bold text-gray-400">
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> ARRIVED</div>
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange-500 opacity-60" /> FUTURE</div>
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /> SERVICED</div>
      </div>

      {/* Track Background */}
      <div 
        className="absolute top-1/2 h-0.5 bg-gray-900 -translate-y-1/2 rounded-full" 
        style={{ left: '4%', right: '4%' }}
      />
      
      {/* Electric Trail */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path 
          d={trailPath} 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="opacity-40"
        />
      </svg>

      {/* Target Line */}
      {isSimulating && currentTarget !== null && !isThinking && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          className="absolute top-1/2 h-px -translate-y-1/2 bg-yellow-400"
          style={{
            left: `${Math.min(getPos(currentHead), getPos(currentTarget))}%`,
            width: `${Math.abs(getPos(currentHead) - getPos(currentTarget))}%`,
          }}
        />
      )}

      {/* Track Marks */}
      <div className="absolute top-1/2 h-4 -translate-y-1/2 flex justify-between pointer-events-none" style={{ left: '4%', right: '4%' }}>
        {[0, 50, 100, 150, 199].map((mark) => (
          <div key={mark} className="flex flex-col items-center">
            <div className="h-full w-px bg-gray-800" />
            <span className="text-[9px] text-gray-600 mt-1">{mark}</span>
          </div>
        ))}
      </div>

      {/* Ripples */}
      {ripples.map((rip) => (
        <div 
          key={rip.id}
          className="ripple-effect"
          style={{ 
            left: `${getPos(rip.track)}%`,
            top: '50%',
            width: '40px', height: '40px', marginTop: '-20px', marginLeft: '-20px'
          }}
        />
      ))}

      {/* Requests */}
      <div className="absolute top-1/2 h-0 -translate-y-1/2" style={{ left: '4%', right: '4%' }}>
        {requests.map((req, idx) => {
          const hasArrived = req.arrivalTime <= simTime;
          const waitTime = hasArrived && !req.serviced ? simTime - req.arrivalTime : 0;
          
          const starvationLevel = Math.min(waitTime / 150, 1);
          const isStarving = starvationLevel > 0.6;
          const isExtreme = starvationLevel > 0.9;

          return (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ 
                scale: req.track === currentTarget && isSimulating ? 1.3 : 1,
                opacity: hasArrived ? 1 : 0.6,
                backgroundColor: req.serviced ? '#22c55e' : 
                                !hasArrived ? '#f97316' : // Solid Muted Orange for Future
                                isExtreme ? '#b91c1c' :   // Deep Blood Red for Extreme
                                isStarving ? '#ef4444' :  // Red for Starving
                                `rgb(${37 + starvationLevel * 200}, ${99 - starvationLevel * 80}, ${235 - starvationLevel * 200})`
              }}
              className={`absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 z-20 group/node 
                ${req.serviced ? 'border-green-200 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 
                  !hasArrived ? 'border-orange-600 opacity-50' : // Muted Future
                  isExtreme ? 'starving border-red-400 shadow-[0_0_20px_#ef4444]' : // Intense Starving
                  isStarving ? 'border-red-300 shadow-[0_0_12px_#ef4444]' :
                  req.track === currentTarget ? 'border-yellow-200 shadow-[0_0_12px_rgba(250,204,21,0.6)]' :
                  'border-blue-300 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                }`}
              style={{ left: `${(req.track / maxTrack) * 100}%` }}
            >
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover/node:opacity-100 transition-opacity z-50 shadow-xl border border-gray-700 whitespace-nowrap font-mono">
                T:{req.track} | Wait:{Math.round(waitTime)}
              </div>
              
              {/* Heatmap Label - Multi-level stagger + background to avoid overlap/overwrite */}
              {!req.serviced && waitTime > 40 && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 text-[9px] font-black text-orange-400 bg-gray-950/80 px-1.5 py-0.5 rounded uppercase whitespace-nowrap pointer-events-none z-10 tracking-tight"
                  style={{ 
                    top: `${20 + (req.track % 4) * 14}px`,
                    opacity: 0.9 + starvationLevel * 0.1
                  }}
                >
                  {isExtreme ? '⚠️ STARVING' : 'WAITING'}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* The Needle */}
      <motion.div
        animate={controls}
        className={`absolute top-1/2 h-16 w-1 -translate-y-1/2 z-30 transition-colors ${
          isThinking ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]' :
          justServiced ? 'bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 
          'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
        }`}
        style={{ left: `${getPos(currentHead)}%` }}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={getIntentText()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded border border-gray-700 shadow-2xl pointer-events-none font-bold tracking-tight text-[10px] uppercase
              ${isThinking ? 'bg-yellow-900/95 border-yellow-500 text-yellow-100 thinking-bubble' : 'bg-gray-900/95 text-gray-200'}
            `}
            style={{ zIndex: 100 }}
          >
            {getIntentText()}
          </motion.div>
        </AnimatePresence>

        <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${isThinking ? 'bg-yellow-400' : justServiced ? 'bg-green-400' : 'bg-red-500'}`} />
        <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${isThinking ? 'bg-yellow-400' : justServiced ? 'bg-green-400' : 'bg-red-500'}`} />
        
        {isSimulating && !isThinking && (
          <div className={`absolute top-1/2 -translate-y-1/2 ${direction === 'right' ? '-right-4' : '-left-4'} text-xs font-bold text-red-500/50`}>
            {direction === 'right' ? '»' : '«'}
          </div>
        )}
      </motion.div>

      {/* Info Bar */}
      <div className="absolute top-3 right-6 flex items-center gap-4">
        {activePolicy && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-violet-900/40 border border-violet-500/50 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.2)]">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[9px] font-black text-violet-200 uppercase tracking-tighter">POLICY: {activePolicy}</span>
          </div>
        )}
        <span className="text-[11px] font-mono text-gray-400">SIM_TIME: {Math.round(simTime)}</span>
        <span className={`text-[11px] font-mono font-bold uppercase tracking-widest ${isSimulating ? 'text-green-500' : 'text-red-500'}`}>
          {isThinking ? '• THINKING' : isSimulating ? '• ACTIVE' : '• IDLE'}
        </span>
      </div>
      
      {/* Track Value */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-950/90 px-3 py-1 rounded-full border border-gray-800 z-40 shadow-inner">
        <span className="text-[11px] font-bold text-gray-300 tracking-tighter">TRACK: {Math.round(currentHead)}</span>
      </div>
    </div>
  );
};

export default NeedleTrack;
