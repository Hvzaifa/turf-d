import type { StatusLabel } from "./availabilityContent";

/**
 * Scrub constants for the live timeline, transcribed from
 * design/project/Turfd Landing.dc.html — `initLiveTimeline`.
 *
 * Progress `p` runs 0→1 over the track's travel past the pinned stage.
 */

/** Scroll budget the pinned stage is scrubbed across. */
export const TRACK_HEIGHT = "420vh";

/** Fade in / fade out of a single element. */
export const REVEAL = { duration: 0.4, ease: "power2.out", offsetY: 8 } as const;

/** The two halves of a status word swapping out for another. */
export const SWAP_OUT = { duration: 0.12, ease: "power1.in", offsetY: -6 } as const;
export const SWAP_IN = { duration: 0.35, ease: "power2.out", offsetY: 6 } as const;

/** The live badge appears almost immediately, then the rows ladder in. */
export const LIVE_INDICATOR_AT = 0.02;
export const TIME_BASE_AT = 0.02;
export const TIME_STAGGER = 0.015;

/** Static rows: row 4 is held back so the timeline doesn't fill top-down. */
export const STATUS_BASE_AT = 0.22;
export const STATUS_STAGGER = 0.05;
export const LAST_ROW_STATUS_AT = 0.74;

/** Halfway through, the timestamp quietly ages. */
export const TIMESTAMP_AGES_AT = 0.5;

/**
 * The live row's lifecycle. The first threshold a progress value falls under
 * wins; below the first one the status is hidden entirely.
 */
export const LIVE_ROW_SEQUENCE: ReadonlyArray<{ until: number; status: StatusLabel }> = [
  { until: 0.52, status: "Available" },
  { until: 0.6, status: "Held" },
  { until: 0.9, status: "Booked" },
  { until: Infinity, status: "Confirmed" },
];

/** Below this the live row shows no status at all. */
export const LIVE_ROW_VISIBLE_AT = 0.27;

/**
 * Once the story lands, the other rows recede so the confirmed slot is the only
 * thing left reading. The delay lets the status swap finish (~0.47s) and adds a
 * beat of quiet before the dim.
 */
export const SETTLE_AT = 0.9;
export const SETTLE_DELAY_MS = 950;
export const SETTLE_OPACITY = 0.32;
export const SETTLE_DURATION = 0.6;
export const UNSETTLE_DURATION = 0.4;

export const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
