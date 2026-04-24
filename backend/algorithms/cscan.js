/**
 * C-SCAN — Circular SCAN Disk Scheduling Algorithm
 *
 * Like SCAN, but instead of reversing direction the head jumps
 * back to the beginning of the disk after reaching the end,
 * servicing requests only in one direction. This provides a
 * more uniform wait time compared to SCAN.
 *
 * @param {number[]} requests   - Array of disk track numbers to visit
 * @param {number}   head       - Current position of the disk head
 * @param {number}   maxTrack   - Maximum track number on the disk (e.g. 199)
 * @returns {{ sequence: number[], seekTimes: number[], totalSeekTime: number }}
 */
/**
 * C-SCAN — Circular SCAN Disk Scheduling Algorithm (Time-Aware)
 *
 * @param {Array<{track: number, arrivalTime: number}>} requests - Disk requests
 * @param {number} head - Initial head position
 * @param {number} maxTrack - Maximum track number
 * @returns {{ sequence: number[], seekTimes: number[], totalSeekTime: number, endTime: number }}
 */
function cscan(requests, head, maxTrack = 199) {
  const sequence = [head];
  const seekTimes = [];
  let totalSeekTime = 0;
  let currentPos = head;
  let currentTime = 0;

  const left = requests.filter((r) => r.track < head).sort((a, b) => a.track - b.track);
  const right = requests.filter((r) => r.track >= head).sort((a, b) => a.track - b.track);

  const addMove = (track, arrivalTime = 0) => {
    if (currentTime < arrivalTime) {
      currentTime = arrivalTime;
    }

    const seekTime = Math.abs(track - currentPos);
    sequence.push(track);
    seekTimes.push(seekTime);
    totalSeekTime += seekTime;
    currentPos = track;
    currentTime += seekTime;
  };

  // Step 1: Serve all requests to the right
  right.forEach((r) => addMove(r.track, r.arrivalTime));

  // Step 2: Go to end of disk
  if (currentPos !== maxTrack) addMove(maxTrack);

  // Step 3: Jump to beginning of disk (circular jump)
  // Usually, the jump takes time equal to the distance or a fixed overhead. 
  // Here we count it as distance maxTrack.
  addMove(0);

  // Step 4: Serve all requests from the beginning up to the original head position
  left.forEach((r) => addMove(r.track, r.arrivalTime));

  return { sequence, seekTimes, totalSeekTime, endTime: currentTime };
}

module.exports = cscan;
