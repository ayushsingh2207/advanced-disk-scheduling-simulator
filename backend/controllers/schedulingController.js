const fcfs = require("../algorithms/fcfs");
const sstf = require("../algorithms/sstf");
const scan = require("../algorithms/scan");
const cscan = require("../algorithms/cscan");
const computeMetrics = require("../utils/metrics");

// Map of algorithm names to their functions
const ALGORITHMS = { fcfs, sstf, scan, cscan };

/**
 * POST /api/simulate
 *
 * Body: {
 *   requests:  [number],     // disk track requests, e.g. [98, 183, 37, 122, 14, 124, 65, 67]
 *   head:      number,       // initial head position, e.g. 53
 *   algorithm: string,       // "fcfs" | "sstf" | "scan" | "cscan"
 *   direction: string,       // (optional, for SCAN) "left" | "right" — default "right"
 *   maxTrack:  number        // (optional) max track number — default 199
 * }
 */
exports.simulate = (req, res) => {
  try {
    const { requests, head, algorithm, direction = "right", maxTrack = 199 } = req.body;

    // ── Validation ─────────────────────────────────────
    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({ error: "Please provide a non-empty array of disk requests." });
    }
    if (head === undefined || typeof head !== "number" || head < 0) {
      return res.status(400).json({ error: "Please provide a valid head position (>= 0)." });
    }
    if (!algorithm || !ALGORITHMS[algorithm]) {
      return res
        .status(400)
        .json({ error: `Invalid algorithm. Choose from: ${Object.keys(ALGORITHMS).join(", ")}` });
    }
    if (requests.some((r) => typeof r !== "number" || r < 0 || r > maxTrack)) {
      return res
        .status(400)
        .json({ error: `All requests must be numbers between 0 and ${maxTrack}.` });
    }

    // ── Run algorithm ──────────────────────────────────
    let result;
    if (algorithm === "scan") {
      result = scan(requests, head, direction, maxTrack);
    } else if (algorithm === "cscan") {
      result = cscan(requests, head, maxTrack);
    } else {
      result = ALGORITHMS[algorithm](requests, head);
    }

    // ── Compute metrics ────────────────────────────────
    const metrics = computeMetrics(result);

    return res.json({
      algorithm: algorithm.toUpperCase(),
      head,
      requests,
      direction: algorithm === "scan" ? direction : undefined,
      maxTrack,
      sequence: result.sequence,
      seekTimes: result.seekTimes,
      ...metrics,
    });
  } catch (err) {
    console.error("Simulation error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * POST /api/compare
 *
 * Runs ALL four algorithms on the same input and returns results side-by-side.
 *
 * Body: { requests, head, direction?, maxTrack? }
 */
exports.compare = (req, res) => {
  try {
    const { requests, head, direction = "right", maxTrack = 199 } = req.body;

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({ error: "Please provide a non-empty array of disk requests." });
    }
    if (head === undefined || typeof head !== "number" || head < 0) {
      return res.status(400).json({ error: "Please provide a valid head position (>= 0)." });
    }

    const results = {};

    for (const [name, fn] of Object.entries(ALGORITHMS)) {
      let result;
      if (name === "scan") {
        result = fn(requests, head, direction, maxTrack);
      } else if (name === "cscan") {
        result = fn(requests, head, maxTrack);
      } else {
        result = fn(requests, head);
      }
      results[name.toUpperCase()] = {
        sequence: result.sequence,
        seekTimes: result.seekTimes,
        ...computeMetrics(result),
      };
    }

    return res.json({ head, requests, maxTrack, results });
  } catch (err) {
    console.error("Comparison error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
