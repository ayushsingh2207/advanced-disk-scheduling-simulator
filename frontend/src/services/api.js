const API_BASE = "/api";

/**
 * Run a single algorithm simulation.
 */
export async function simulateAlgorithm({ requests, head, algorithm, direction, maxTrack }) {
  const response = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requests, head, algorithm, direction, maxTrack }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Simulation failed");
  }
  return response.json();
}

/**
 * Compare all algorithms on the same input.
 */
export async function compareAlgorithms({ requests, head, direction, maxTrack }) {
  const response = await fetch(`${API_BASE}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requests, head, direction, maxTrack }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Comparison failed");
  }
  return response.json();
}
