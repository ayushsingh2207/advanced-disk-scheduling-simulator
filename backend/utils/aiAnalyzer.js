/**
 * AI Insight Analyzer for Disk Scheduling
 * 
 * Provides human-readable analysis based on simulation metrics.
 */
function getAIInsights(algorithm, results) {
  const { totalSeekTime, avgSeekTime, variance, throughput, requestCount } = results;

  let insights = [];

  // Efficiency Analysis
  if (avgSeekTime < 20) {
    insights.push("The efficiency is exceptional for this workload.");
  } else if (avgSeekTime > 60) {
    insights.push("The seek overhead is quite high. Consider if a different algorithm would better group these requests.");
  }

  // Fairness Analysis
  if (variance > 1000) {
    insights.push("High variance detected! Some requests are waiting significantly longer than others (Starvation Risk).");
  } else {
    insights.push("The service distribution is relatively fair across all requests.");
  }

  // Algorithm Specifics
  switch (algorithm.toLowerCase()) {
    case 'fcfs':
      insights.push("FCFS is completely fair but mathematically inefficient for random workloads.");
      break;
    case 'sstf':
      insights.push("SSTF minimized your total distance, but it often ignores 'outlier' tracks far from the center.");
      break;
    case 'scan':
      insights.push("The Elevator algorithm (SCAN) provides a good balance between efficiency and preventing starvation.");
      break;
    case 'cscan':
      insights.push("C-SCAN provides the most uniform wait time by always moving in one direction.");
      break;
  }

  // Workload Characterization
  if (requestCount > 15) {
    insights.push("Heavy workload detected. Advanced algorithms like SCAN or CSCAN are generally more stable here.");
  }

  return insights.join(" ");
}

module.exports = getAIInsights;
