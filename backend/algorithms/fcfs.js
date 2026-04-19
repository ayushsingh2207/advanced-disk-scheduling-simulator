/**
 * FCFS — First Come First Served Disk Scheduling
 *
 * Processes disk requests in the exact order they arrive.
 * Simple but often results in high seek times.
 *
 * @param {number[]} requests  - Array of disk track numbers to visit
 * @param {number}   head      - Current position of the disk head
 * @returns {{ sequence: number[], seekTimes: number[], totalSeekTime: number }}
 */
function fcfs(requests, head) {
  const sequence = [head, ...requests];
  const seekTimes = [];
  let totalSeekTime = 0;

  for (let i = 1; i < sequence.length; i++) {
    const seekTime = Math.abs(sequence[i] - sequence[i - 1]);
    seekTimes.push(seekTime);
    totalSeekTime += seekTime;
  }

  return { sequence, seekTimes, totalSeekTime };
}

module.exports = fcfs;
