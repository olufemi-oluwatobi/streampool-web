class LogService {
  logRenderPerformance(
    id: string, // the "id" prop of the Profiler tree that has just committed
    phase: "mount" | "update", // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration: number, // time spent rendering the committed update
    baseDuration: number, // estimated time to render the entire subtree without memoization
    startTime: number, // when React began rendering this update
    commitTime: number, // when React committed this update
    interactions: any
  ) {
    console.log({
      id, // the "id" prop of the Profiler tree that has just committed
      phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
      actualDuration, // time spent rendering the committed update
      baseDuration, // estimated time to render the entire subtree without memoization
      startTime, // when React began rendering this update
      commitTime, // when React committed this update
      interactions, // the Set of interactions belonging to this update
    });
  }
}

export default new LogService();
