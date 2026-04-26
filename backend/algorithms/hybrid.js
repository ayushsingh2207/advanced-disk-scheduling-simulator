/**
 * HYBRID (Dynamic Kernel Optimizer)
 * 
 * Logic:
 * 1. Starts in SSTF mode for maximum throughput.
 * 2. Monitors "Starvation Risk" (Wait Time).
 * 3. If any request waits > 10 steps OR the queue > 5, 
 *    it switches to SCAN mode to clear the disk fairly.
 * 4. Switches back to SSTF once the density is low.
 */

function hybrid(requests, head) {
  let currentHead = head;
  let remaining = requests.map((r, i) => ({ ...r, id: i, wait: 0 }));
  let sequence = [head];
  let policyLog = ["START (SSTF)"];
  let seekTimes = [];
  let totalSeekTime = 0;

  const SCAN_THRESHOLD = 3; 
  const STARVATION_LIMIT = 4;

  while (remaining.length > 0) {
    // Check for starvation or high density
    const maxWait = Math.max(...remaining.map(r => r.wait));
    const useScan = remaining.length >= SCAN_THRESHOLD || maxWait >= STARVATION_LIMIT;
    
    let nextIndex = -1;
    let policyName = useScan ? "SCAN (Fairness)" : "SSTF (Speed)";

    if (useScan) {
      // SCAN Logic: Find closest track in current logical direction (up)
      remaining.sort((a, b) => a.track - b.track);
      nextIndex = remaining.findIndex(r => r.track >= currentHead);
      if (nextIndex === -1) nextIndex = remaining.length - 1; 
    } else {
      // SSTF Logic: Closest track
      let minDistance = Infinity;
      remaining.forEach((r, idx) => {
        const dist = Math.abs(r.track - currentHead);
        if (dist < minDistance) {
          minDistance = dist;
          nextIndex = idx;
        }
      });
    }

    const target = remaining[nextIndex];
    const seekDistance = Math.abs(target.track - currentHead);
    
    sequence.push(target.track);
    seekTimes.push(seekDistance);
    totalSeekTime += seekDistance;
    policyLog.push(policyName);
    
    currentHead = target.track;
    
    remaining.splice(nextIndex, 1);
    remaining.forEach(r => r.wait++);
  }

  return { 
    sequence, 
    seekTimes, 
    totalSeekTime, 
    policyLog 
  };
}

module.exports = hybrid;
