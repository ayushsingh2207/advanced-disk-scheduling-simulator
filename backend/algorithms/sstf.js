/**
 * SSTF — Shortest Seek Time First Disk Scheduling
 *
 * Greedy algorithm: always moves to the nearest pending request.
 * Reduces overall seek time compared to FCFS but can cause starvation.
 *
 * @param {number[]} requests  - Array of disk track numbers to visit
 * @param {number}   head      - Current position of the disk head
 * @returns {{ sequence: number[], seekTimes: number[], totalSeekTime: number }}
 */
function sstf(requests, head) {
  const pending = [...requests];
  const sequence = [head];
  const seekTimes = [];
  let totalSeekTime = 0;
  let currentPos = head;

  while (pending.length > 0) {
    // Find the request closest to the current head position
    let minDistance = Infinity;
    let minIndex = -1;

    for (let i = 0; i < pending.length; i++) {
      const distance = Math.abs(pending[i] - currentPos);
      if (distance < minDistance) {
        minDistance = distance;
        minIndex = i;
      }
    }

    // Move head to the closest request
    currentPos = pending[minIndex];
    sequence.push(currentPos);
    seekTimes.push(minDistance);
    totalSeekTime += minDistance;
    pending.splice(minIndex, 1);
  }

  return { sequence, seekTimes, totalSeekTime };
}

module.exports = sstf;
