/**
 * FCFS — First Come First Served Disk Scheduling
 *
 * Processes disk requests in the exact order they arrive (based on arrivalTime).
 * Each track move is assumed to take 1 unit of time.
 *
 * @param {Array<{track: number, arrivalTime: number}>} requests - Disk requests
 * @param {number} head - Initial head position
 * @returns {{ sequence: number[], seekTimes: number[], totalSeekTime: number, endTime: number }}
 */
function fcfs(requests, head) {
  // Sort by arrival time to ensure FCFS order
  const sortedRequests = [...requests].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const sequence = [head];
  const seekTimes = [];
  let totalSeekTime = 0;
  let currentHead = head;
  let currentTime = 0;

  for (const req of sortedRequests) {
    // If request arrives in the future, jump to arrival time (idle wait)
    if (currentTime < req.arrivalTime) {
      currentTime = req.arrivalTime;
    }

    const seekTime = Math.abs(req.track - currentHead);
    seekTimes.push(seekTime);
    totalSeekTime += seekTime;
    
    currentTime += seekTime; // Move time by distance
    currentHead = req.track;
    sequence.push(currentHead);
  }

  return { sequence, seekTimes, totalSeekTime, endTime: currentTime };
}

module.exports = fcfs;
