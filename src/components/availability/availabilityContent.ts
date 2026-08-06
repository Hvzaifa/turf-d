/** Copy and slot data — design/project/Turfd Landing.dc.html §270–289. */

export const HEADLINE = "The only thing that should change is the score.";

export const LEAD =
  "Every slot updates live. If it’s available, it’s really available.";

export const LIVE_LABEL = "Live";
export const LIVE_TIMESTAMP = "Updated just now";
export const LIVE_TIMESTAMP_LATE = "Updated moments ago";

/** The status vocabulary, and the colour each one is set in. */
export const STATUS_COLOR = {
  Booked: "rgba(245,251,247,.45)",
  Available: "#34D498",
  Held: "#D9A24B",
  Confirmed: "#34D498",
} as const;

export type StatusLabel = keyof typeof STATUS_COLOR;

export type Slot = {
  time: string;
  status: StatusLabel;
  /**
   * The one row that changes as you scroll — it cycles through the whole
   * booking lifecycle while the others simply arrive.
   */
  live?: boolean;
};

export const SLOTS: readonly Slot[] = [
  { time: "6:00 PM", status: "Booked" },
  { time: "7:00 PM", status: "Available", live: true },
  { time: "8:00 PM", status: "Held" },
  { time: "9:00 PM", status: "Booked" },
  { time: "10:00 PM", status: "Available" },
];
