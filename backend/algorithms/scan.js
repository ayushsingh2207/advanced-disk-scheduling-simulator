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
function scan(requests, head, direction = "right", maxTrack = 199) {
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

  if (direction === "right") {
    // Serve all requests to the right first
    right.forEach((track) => addMove(track));
    // Go to end of disk
    if (currentPos !== maxTrack) addMove(maxTrack);
    // Then serve all requests to the left (in reverse)
    left.reverse().forEach((track) => addMove(track));
  } else {
    // Serve all requests to the left first (in reverse order)
    left.reverse().forEach((track) => addMove(track));
    // Go to beginning of disk
    if (currentPos !== 0) addMove(0);
    // Then serve all requests to the right
    right.forEach((track) => addMove(track));
  }

  return { sequence, seekTimes, totalSeekTime };
}

module.exports = scan;
