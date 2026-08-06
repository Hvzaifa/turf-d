import { useRef } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import {
  HEADLINE,
  LEAD,
  LIVE_LABEL,
  LIVE_TIMESTAMP,
  SLOTS,
} from "./availabilityContent";
import { TRACK_HEIGHT } from "./availabilityMotion";
import { SlotRow } from "./SlotRow";
import { useLiveTimelineScrub } from "./useLiveTimelineScrub";

/**
 * Live availability — five scroll-pinned chapters, driven entirely by scroll
 * position.
 *
 * The evening's slots ladder in, the 7:00 PM row walks Available → Held →
 * Booked → Confirmed as you scroll, and once it settles the other rows recede
 * so the confirmed slot is the only thing left reading.
 *
 * Below 760px the design drops the pin entirely: the track collapses to auto
 * height, the stage goes static and the grid stacks (see index.css).
 */
export function AvailabilitySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const profile = useMotionProfile();

  useLiveTimelineScrub({ trackRef, stageRef, profile });

  return (
    <section
      aria-label="Live availability, always trustworthy"
      className="relative"
      style={{ background: "#000" }}
    >
      <div ref={trackRef} data-timeline-track className="relative" style={{ height: TRACK_HEIGHT }}>
        <div
          ref={stageRef}
          data-timeline-stage
          className="sticky top-0 flex items-center overflow-hidden"
          style={{
            height: "100vh",
            padding: "clamp(32px,6vh,120px) clamp(24px,5vw,72px)",
          }}
        >
          <div
            data-timeline-grid
            className="mx-auto grid w-full items-center"
            style={{
              maxWidth: "1440px",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)",
              gap: "clamp(48px,7vw,120px)",
            }}
          >
            <div>
              <h2
                className="m-0 font-display font-bold text-chalk uppercase"
                style={{
                  fontSize: "clamp(2.3rem,5vw,4.2rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-.01em",
                  maxWidth: "15ch",
                  textWrap: "balance",
                }}
              >
                {HEADLINE}
              </h2>
              <p
                style={{
                  margin: "clamp(28px,4.5vh,44px) 0 0",
                  maxWidth: "23ch",
                  fontSize: "clamp(18px,1.3vw,20px)",
                  lineHeight: 1.85,
                  color: "#A9C6B7",
                }}
              >
                {LEAD}
              </p>
            </div>

            <div data-timeline-rows className="flex flex-col">
              <div
                data-tl-live-indicator
                className="flex items-center font-mono uppercase opacity-0"
                style={{
                  gap: "10px",
                  fontSize: "11px",
                  letterSpacing: ".18em",
                  color: "rgba(245,251,247,.45)",
                  marginBottom: "clamp(20px,3vh,32px)",
                }}
              >
                <span style={{ color: "#34D498" }}>{LIVE_LABEL}</span>
                <span data-tl-live-ts>{LIVE_TIMESTAMP}</span>
              </div>

              {SLOTS.map((slot, index) => (
                <SlotRow
                  key={slot.time}
                  {...slot}
                  index={index}
                  last={index === SLOTS.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
