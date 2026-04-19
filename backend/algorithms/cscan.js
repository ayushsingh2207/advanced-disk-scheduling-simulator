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
function cscan(requests, head, maxTrack = 199) {
  const left = requests.filter((r) => r < head).sort((a, b) => a - b);
  const right = requests.filter((r) => r >= head).sort((a, b) => a - b);

  const sequence = [head];
  const seekTimes = [];
  let totalSeekTime = 0;
  let currentPos = head;

  const addMove = (track) => {
    const seekTime = Math.abs(track - currentPos);
    sequence.push(track);
    seekTimes.push(seekTime);
    totalSeekTime += seekTime;
    currentPos = track;
  };

  // Step 1: Serve all requests to the right
  right.forEach((track) => addMove(track));

  // Step 2: Go to end of disk
  if (currentPos !== maxTrack) addMove(maxTrack);

  // Step 3: Jump to beginning of disk (circular jump)
  addMove(0);

  // Step 4: Serve all requests to the left (now going right from 0)
  left.forEach((track) => addMove(track));

  return { sequence, seekTimes, totalSeekTime };
}

module.exports = cscan;
