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

/** Layers that dolly forward with the camera, in draw order. */
export const DOLLY_SELECTORS = [
  '[data-cam="pitch"]',
  '[data-cam="fog-bg"]',
  '[data-cam="fog-fg"]',
  '[data-layer="mist"]',
  '[data-layer="vignette"]',
] as const;

/** On low-end devices only the two cheapest surfaces keep moving. */
export const DOLLY_SELECTORS_LITE = [
  '[data-cam="pitch"]',
  '[data-layer="vignette"]',
] as const;

/** Atmosphere layers dropped entirely on low-end devices. */
export const LITE_DISABLED_CAMS = ["fog-fg", "fog-bg"] as const;

/**
 * Pointer parallax: how far (px) each layer counter-moves at full cursor
 * deflection, and the transform it must preserve while doing so.
 */
export const POINTER_LAYERS: ReadonlyArray<{
  selector: string;
  depth: number;
  base: string;
}> = [
  { selector: '[data-layer="fog-fg"]', depth: 15, base: "scaleX(-1) " },
  { selector: '[data-layer="fog-bg"]', depth: 15, base: "" },
  { selector: '[data-layer="pitch"]', depth: 8, base: "" },
];

/** Cursor easing per frame, and the deflection below which we snap and stop. */
export const POINTER_LERP = 0.045;
export const POINTER_EPSILON = 0.0006;

/** Frames of no work before the parallax loop detaches from the ticker. */
export const POINTER_IDLE_FRAMES = 8;

/** Staggered entrance of the hero copy, in seconds after the film opens. */
export const COPY_DELAYS = {
  headlineA: 4.4,
  headlineB: 5,
  lead: 6.4,
  actions: 7.8,
  meta: 8.8,
  scrollCue: 10,
} as const;
