import type { CSSProperties } from "react";

import { STATUS_COLOR, type Slot } from "./availabilityContent";

const ROW: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  alignItems: "baseline",
  gap: "clamp(20px,3vw,40px)",
  padding: "clamp(8px,2.2vh,30px) 0",
  borderTop: "1px solid rgba(255,255,255,.08)",
};

const TIME: CSSProperties = {
  fontWeight: 500,
  fontSize: "clamp(60px,6.5vw,80px)",
  lineHeight: 1.05,
  letterSpacing: "-.01em",
  color: "#F5FBF7",
  opacity: 0,
  transition: "opacity .9s ease",
};

const STATUS: CSSProperties = {
  fontSize: "clamp(28px,3vw,36px)",
  letterSpacing: ".02em",
  textTransform: "uppercase",
  textAlign: "right",
  opacity: 0,
  transition: "opacity .5s ease",
};

export type SlotRowProps = Slot & {
  index: number;
  /** The final row closes the list with a bottom rule. */
  last?: boolean;
};

/**
 * One hour of the evening. Opacity, position and — for the live row — the
 * status text itself are owned by the scroll scrub, so this only paints the
 * resting state.
 */
export function SlotRow({ time, status, live, index, last }: SlotRowProps) {
  return (
    <div
      data-tl-row
      data-tl-idx={index}
      data-tl-live={live ? "true" : undefined}
      style={last ? { ...ROW, borderBottom: "1px solid rgba(255,255,255,.08)" } : ROW}
    >
      <span data-tl-time className="font-sans" style={TIME}>
        {time}
      </span>
      <span
        data-tl-status
        className="font-mono"
        style={{ ...STATUS, color: STATUS_COLOR[status] }}
      >
        {status}
      </span>
    </div>
  );
}
