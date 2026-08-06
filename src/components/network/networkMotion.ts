/**
 * Chain timings — design/project/Turfd Landing.dc.html `initNetworkChain`.
 */

/** How long the pulse takes to travel one edge. */
export const STEP_DURATION_MS = 650;

/** Slack after the travel before the destination node lights up. */
export const ARRIVAL_SLACK_MS = 40;

/** Pause between one step landing and the next departing. */
export const STEP_GAP_MS = 150;

/** Beat before the chain starts, after the centre badge appears. */
export const START_DELAY_MS = 500;

/** How long a node stays enlarged after the pulse hits it. */
export const NODE_FLASH_MS = 260;

/** After the loop closes, the last card settles back to rest. */
export const FINAL_SETTLE_MS = 400;

/** The ring that expands out of each node as the pulse lands. */
export const RING = {
  from: 1.4,
  to: 5,
  fromOpacity: "0.85",
  transition: "r 550ms cubic-bezier(.22,1,.36,1), opacity 550ms ease",
} as const;

/** Node appearance in each state. */
export const NODE_STATE = {
  idle: { opacity: "0.38", fill: "#F5FBF7", scale: "scale(.92)" },
  /** Visited at least once — brighter than idle, but not lit. */
  visited: { opacity: "0.65", fill: "#F5FBF7", scale: "scale(1)" },
  active: { opacity: "1", fill: "#34D498", scale: "scale(1.12)" },
  /** The close-the-loop re-pulse is a touch smaller than a first arrival. */
  loopBack: { opacity: "1", fill: "#34D498", scale: "scale(1.1)" },
  dimmed: "0.12",
  highlighted: "1",
} as const;

/** Path opacity while a neighbour is hovered. */
export const PATH_HOVER = { active: "0.9", dimmed: "0.06" } as const;

/** Stroke a path takes on once the pulse has travelled it. */
export const PATH_TRAVELLED = "rgba(125,237,191,.16)";

/** Fraction of the diagram that must be on screen before the chain runs. */
export const VISIBILITY_RATIO = 0.3;
