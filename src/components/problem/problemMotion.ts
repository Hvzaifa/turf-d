/**
 * Scrub constants for the recognition beat, transcribed from
 * design/project/Turfd Landing.dc.html — `initRecognition`.
 *
 * Progress `p` runs 0→1 across the section's pin budget. Every value below is
 * a position within that budget, so the messages and the bridge line track the
 * scrollbar itself rather than playing out over a fixed duration.
 */

/** Scroll travel that holds the stage pinned while the reveal happens. */
export const TRIGGER_HEIGHT = "200vh";

/** Each message fades in over this much of the budget. */
export const FADE_WIDTH = 0.16;

/** All messages are in by this point, leaving room for the bridge. */
export const CONVERSATION_END = 0.46;

/** Distance a message travels up as it fades in. */
export const MESSAGE_RISE_PX = 8;

/** Where the bridge line starts surfacing, and over how much travel. */
export const BRIDGE_START = 0.56;
export const BRIDGE_WIDTH = 0.2;

/** How far the conversation is dimmed and blurred once the bridge is up. */
export const DIM_STRENGTH = 0.92;
export const BLUR_PX = 3;

/** The bridge line's own entrance offsets. */
export const BRIDGE_RISE_PX = 20;
export const BRIDGE_SCALE_FROM = 0.985;

/** Threshold at which the reduced-motion fallback swaps the two states. */
export const REDUCED_MOTION_THRESHOLD = 0.12;

export const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/**
 * The scroll window a message occupies. Its window *ends* at the point it used
 * to snap in, and starts a fade-width earlier — so message 0 begins below zero
 * and is already visible when the section arrives.
 */
export function messageWindow(index: number, total: number) {
  const end = (index / total) * CONVERSATION_END;
  return { start: end - FADE_WIDTH, end };
}
