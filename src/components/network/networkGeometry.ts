/**
 * Diagram geometry — design/project/Turfd Landing.dc.html §354–458 and
 * `initNetworkChain`. All coordinates are in the SVG's 0–100 user space.
 */

export type NodeId =
  | "live-discovery"
  | "slot-lock"
  | "payment"
  | "booking-confirmed"
  | "owner-dashboard"
  | "game-night";

/** Where each node sits on the ring. */
export const NODE_POSITION: Record<NodeId, { cx: number; cy: number }> = {
  "live-discovery": { cx: 50, cy: 12 },
  "slot-lock": { cx: 82.91, cy: 31 },
  payment: { cx: 82.91, cy: 69 },
  "booking-confirmed": { cx: 50, cy: 88 },
  "owner-dashboard": { cx: 17.09, cy: 69 },
  "game-night": { cx: 17.09, cy: 31 },
};

export const NODE_RADIUS = 1.15;

/**
 * Path 1 is the spoke out of the centre — the tap itself — and is the only one
 * drawn in lime and without an arrowhead. Paths 2–7 are the ring.
 */
export const PATHS: ReadonlyArray<{
  id: string;
  d: string;
  stroke: string;
  strokeWidth: number;
  arrow: boolean;
}> = [
  { id: "1", d: "M50,50 L50,12", stroke: "rgba(198,255,60,.22)", strokeWidth: 0.26, arrow: false },
  { id: "2", d: "M50,12 Q70.5,14.49 82.91,31", stroke: "rgba(245,251,247,.16)", strokeWidth: 0.32, arrow: true },
  { id: "3", d: "M82.91,31 Q91,50 82.91,69", stroke: "rgba(245,251,247,.16)", strokeWidth: 0.32, arrow: true },
  { id: "4", d: "M82.91,69 Q70.5,85.51 50,88", stroke: "rgba(245,251,247,.16)", strokeWidth: 0.32, arrow: true },
  { id: "5", d: "M50,88 Q29.5,85.51 17.09,69", stroke: "rgba(245,251,247,.16)", strokeWidth: 0.32, arrow: true },
  { id: "6", d: "M17.09,69 Q9,50 17.09,31", stroke: "rgba(245,251,247,.16)", strokeWidth: 0.32, arrow: true },
  { id: "7", d: "M17.09,31 Q29.5,14.5 50,12", stroke: "rgba(245,251,247,.16)", strokeWidth: 0.32, arrow: true },
];

export type ChainStep = {
  /** Absent on the closing step — path 7 returns to an already-lit node. */
  node?: NodeId;
  card?: NodeId;
  path: string;
  /** Travel of the pulse along this step, in user space. */
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** The loop closing back on live-discovery, which re-pulses it. */
  closeLoop?: boolean;
};

/** One booking, in the order it actually moves through the system. */
export const CHAIN: readonly ChainStep[] = [
  { node: "live-discovery", card: "live-discovery", path: "1", from: { x: 50, y: 50 }, to: { x: 50, y: 12 } },
  { node: "slot-lock", card: "slot-lock", path: "2", from: { x: 50, y: 12 }, to: { x: 82.91, y: 31 } },
  { node: "payment", card: "payment", path: "3", from: { x: 82.91, y: 31 }, to: { x: 82.91, y: 69 } },
  { node: "booking-confirmed", card: "booking-confirmed", path: "4", from: { x: 82.91, y: 69 }, to: { x: 50, y: 88 } },
  { node: "owner-dashboard", card: "owner-dashboard", path: "5", from: { x: 50, y: 88 }, to: { x: 17.09, y: 69 } },
  { node: "game-night", card: "game-night", path: "6", from: { x: 17.09, y: 69 }, to: { x: 17.09, y: 31 } },
  { path: "7", closeLoop: true, from: { x: 17.09, y: 31 }, to: { x: 50, y: 12 } },
];

/** Paths touching each node — used to highlight direct connections on hover. */
export const ADJACENCY: Record<NodeId, readonly string[]> = {
  "live-discovery": ["1", "2", "7"],
  "slot-lock": ["2", "3"],
  payment: ["3", "4"],
  "booking-confirmed": ["4", "5"],
  "owner-dashboard": ["5", "6"],
  "game-night": ["6", "7"],
};

/** The nodes each path connects, so a hover can light both ends. */
export const PATH_ENDPOINTS: Record<string, readonly NodeId[]> = {
  "1": ["live-discovery"],
  "2": ["live-discovery", "slot-lock"],
  "3": ["slot-lock", "payment"],
  "4": ["payment", "booking-confirmed"],
  "5": ["booking-confirmed", "owner-dashboard"],
  "6": ["owner-dashboard", "game-night"],
  "7": ["game-night", "live-discovery"],
};

/** Two cards are centred on the ring's vertical axis and must keep that shift. */
export const CARD_BASE_TRANSFORM: Partial<Record<NodeId, string>> = {
  "live-discovery": "translateX(-50%)",
  "booking-confirmed": "translateX(-50%)",
};

/** Where each card is pinned inside the square diagram. */
export const CARD_POSITION: Record<NodeId, Record<string, string>> = {
  "live-discovery": { top: "0%", left: "50%" },
  "slot-lock": { top: "18%", right: "2%" },
  payment: { top: "73%", right: "2%" },
  "booking-confirmed": { top: "97%", left: "50%" },
  "owner-dashboard": { top: "65%", left: "2%" },
  "game-night": { top: "15%", left: "2%" },
};
