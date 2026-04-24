/**
 * SCAN — Elevator Disk Scheduling Algorithm
 *
 * The disk head moves in one direction servicing all requests,
 * then reverses direction. It goes all the way to the end of
 * the disk (track 0 or maxTrack) before reversing.
 *
 * @param {number[]} requests   - Array of disk track numbers to visit
 * @param {number}   head       - Current position of the disk head
 * @param {string}   direction  - Initial direction: "left" or "right"
 * @param {number}   maxTrack   - Maximum track number on the disk (e.g. 199)
 * @returns {{ sequence: number[], seekTimes: number[], totalSeekTime: number }}
 */
/**
 * SCAN — Elevator Disk Scheduling Algorithm (Time-Aware)
 *
 * @param {Array<{track: number, arrivalTime: number}>} requests - Disk requests
 * @param {number} head - Initial head position
 * @param {string} direction - Initial direction: "left" or "right"
 * @param {number} maxTrack - Maximum track number
 * @returns {{ sequence: number[], seekTimes: number[], totalSeekTime: number, endTime: number }}
 */
function scan(requests, head, direction = "right", maxTrack = 199) {
  const sequence = [head];
  const seekTimes = [];
  let totalSeekTime = 0;
  let currentPos = head;
  let currentTime = 0;

  const left = requests.filter((r) => r.track < head).sort((a, b) => a.track - b.track);
  const right = requests.filter((r) => r.track >= head).sort((a, b) => a.track - b.track);

  const addMove = (track, arrivalTime = 0) => {
    // If we're servicing a specific request, we might need to wait for its arrival
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

  if (direction === "right") {
    // Right side
    right.forEach((r) => addMove(r.track, r.arrivalTime));
    // Boundary
    if (currentPos !== maxTrack) addMove(maxTrack);
    // Left side (reverse)
    [...left].reverse().forEach((r) => addMove(r.track, r.arrivalTime));
  } else {
    // Left side
    [...left].reverse().forEach((r) => addMove(r.track, r.arrivalTime));
    // Boundary
    if (currentPos !== 0) addMove(0);
    // Right side
    right.forEach((r) => addMove(r.track, r.arrivalTime));
  }

  return { sequence, seekTimes, totalSeekTime, endTime: currentTime };
}

module.exports = scan;
