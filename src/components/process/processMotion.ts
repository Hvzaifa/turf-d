/**
 * Entrance choreography for the three beats, transcribed from
 * design/project/Turfd Landing.dc.html — `initEmptyHours`, `initOwnerBeat`
 * and `initArrivalBeat`.
 *
 * All three follow the same shape: a frame settles in on an IntersectionObserver,
 * supporting text ladders in behind it, and the photograph's slow ambient drift
 * only starts once the entrance has finished.
 */

const EASE = "cubic-bezier(.22,1,.36,1)";

/** The pitch, settling out of a faint over-scale. */
export const EMPTY_HOURS_BEAT = {
  threshold: 0.3,
  transition: `opacity 1.3s ${EASE}, transform 1.5s ${EASE}`,
  fromOpacity: "0.96",
  fromTransform: "scale(1.03)",
  driftDelayMs: 1350,
} as const;

/** The owner, rising with his copy stepping in behind him. */
export const OWNER_BEAT = {
  threshold: 0.3,
  frameTransition: `opacity 1.1s ${EASE}, transform 1.1s ${EASE}`,
  lineTransition: `opacity .6s ${EASE}, transform .6s ${EASE}`,
  fromTransform: "translateY(24px)",
  lineStaggerMs: 80,
  driftDelayMs: 1100,
} as const;

/** The arrival, and the numbers that land after it. */
export const ARRIVAL_BEAT = {
  frameThreshold: 0.05,
  frameTransition: `opacity 1.1s ${EASE}`,
  /** Deliberately later than the frame — the metrics wait for the photo. */
  metricThreshold: 0.4,
  metricTransition: `opacity .6s ${EASE}, transform .6s ${EASE}`,
  metricFromTransform: "translateY(14px)",
  metricStaggerMs: 160,
} as const;

/** Viewport gate for the ambient drift, shared by both drifting photographs. */
export const DRIFT_GATE_THRESHOLD = 0.15;
