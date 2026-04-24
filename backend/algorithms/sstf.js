/**
 * SSTF — Shortest Seek Time First Disk Scheduling
 *
 * Greedy algorithm: always moves to the nearest pending request that has arrived.
 *
 * @param {Array<{track: number, arrivalTime: number}>} requests - Disk requests
 * @param {number} head - Initial head position
 * @returns {{ sequence: number[], seekTimes: number[], totalSeekTime: number, endTime: number }}
 */
function sstf(requests, head) {
  const pending = [...requests];
  const sequence = [head];
  const seekTimes = [];
  let totalSeekTime = 0;
  let currentPos = head;
  let currentTime = 0;

  while (pending.length > 0) {
    // Only consider requests that have arrived
    const available = pending.filter(r => r.arrivalTime <= currentTime);

    if (available.length === 0) {
      // If nothing has arrived, jump time to the next closest arrival
      const nextArrival = Math.min(...pending.map(r => r.arrivalTime));
      currentTime = nextArrival;
      continue;
    }

    // Find the request closest to the current head position among available ones
    let minDistance = Infinity;
    let minIndexInAvailable = -1;

    for (let i = 0; i < available.length; i++) {
      const distance = Math.abs(available[i].track - currentPos);
      if (distance < minDistance) {
        minDistance = distance;
        minIndexInAvailable = i;
      }
    }

    const chosenRequest = available[minIndexInAvailable];
    const minIndexInPending = pending.indexOf(chosenRequest);

    // Move head to the closest request
    currentPos = chosenRequest.track;
    sequence.push(currentPos);
    seekTimes.push(minDistance);
    totalSeekTime += minDistance;
    currentTime += minDistance;
    pending.splice(minIndexInPending, 1);
  }

  return { sequence, seekTimes, totalSeekTime, endTime: currentTime };
}

module.exports = sstf;
