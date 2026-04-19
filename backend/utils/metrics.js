/**
 * Compute performance metrics from a scheduling result.
 *
 * @param {{ sequence: number[], seekTimes: number[], totalSeekTime: number }} result
 * @returns {{ totalSeekTime, avgSeekTime, throughput, requestCount, maxSeekTime, variance, standardDeviation }}
 */
function computeMetrics(result) {
  const { seekTimes, totalSeekTime } = result;
  const requestCount = seekTimes.length;

  const avgSeekTime = requestCount > 0 ? +(totalSeekTime / requestCount).toFixed(2) : 0;
  const maxSeekTime = requestCount > 0 ? Math.max(...seekTimes) : 0;

  let variance = 0;
  if (requestCount > 0) {
    const sumOfSquares = seekTimes.reduce((sum, val) => sum + Math.pow(val - avgSeekTime, 2), 0);
    variance = +(sumOfSquares / requestCount).toFixed(2);
  }
  
  const standardDeviation = +(Math.sqrt(variance)).toFixed(2);

  return {
    totalSeekTime,
    avgSeekTime,
    maxSeekTime,
    variance,
    standardDeviation,
    // Throughput = requests serviced per unit of total seek movement
    throughput: totalSeekTime > 0 ? +(requestCount / totalSeekTime).toFixed(4) : 0,
    requestCount,
  };
}

module.exports = computeMetrics;
