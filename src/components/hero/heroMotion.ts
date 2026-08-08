/**
 * Motion constants for the hero, transcribed from the design prototype
 * (design/project/Turfd Landing.dc.html — `initCinematic`, `initScrollFX`).
 *
 * Everything here is a number the design chose deliberately; changing a value
 * changes the look, so they live in one place rather than inline in JSX.
 */

/** Scroll budget the sticky hero is scrubbed across. */
export const HERO_TRACK_HEIGHT = "260svh";

/** Shared focal point for every dollying layer — the camera never re-aims. */
export const DOLLY_ORIGIN = "50% 62%";
export const DOLLY_SCALE = 1.34;

/**
 * Layers that dolly forward with the camera, in draw order.
 *
 * Every entry here is a full-viewport surface re-rastered at a new scale on
 * every frame of the scrub, so the list is the hero's frame budget. It was
 * five; the second fog sheet and the standalone vignette are gone and the two
 * cross-fading grades were moved out of the pitch cell, which leaves three.
 */
export const DOLLY_SELECTORS = [
  '[data-cam="pitch"]',
  '[data-cam="fog"]',
  '[data-layer="mist"]',
] as const;

/** On low-end devices only the two cheapest surfaces keep moving. */
export const DOLLY_SELECTORS_LITE = [
  '[data-cam="pitch"]',
  '[data-layer="mist"]',
] as const;

/** Atmosphere layers dropped entirely on low-end devices. */
export const LITE_DISABLED_CAMS = ["fog"] as const;

/**
 * Pointer parallax: how far (px) each layer counter-moves at full cursor
 * deflection, and the transform it must preserve while doing so.
 */
export const POINTER_LAYERS: ReadonlyArray<{
  selector: string;
  depth: number;
  base: string;
}> = [
  { selector: '[data-layer="fog"]', depth: 15, base: "" },
  { selector: '[data-layer="pitch"]', depth: 8, base: "" },
];

/** Cursor easing per frame, and the deflection below which we snap and stop. */
export const POINTER_LERP = 0.045;
export const POINTER_EPSILON = 0.0006;

/** Frames of no work before the parallax loop detaches from the ticker. */
export const POINTER_IDLE_FRAMES = 8;

/**
 * Staggered entrance of the hero copy, in seconds.
 *
 * The design's original beats ran from 4.4s to 10s, behind a 4.6s film open.
 * That is a title sequence, not a landing page: the product has to be legible
 * inside three seconds, so the veil lifts in 1.6s (see `introLift`) and every
 * line that explains what Turf'd is has arrived by ~1.5s. The order and the
 * feel of the stagger are unchanged — only its scale.
 */
export const COPY_DELAYS = {
  headlineA: 0.5,
  headlineB: 0.72,
  lead: 1,
  tickets: 1.2,
  actions: 1.44,
  sports: 1.62,
  meta: 1.8,
  scrollCue: 2.1,
} as const;

