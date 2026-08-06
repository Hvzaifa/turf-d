import { Fragment, useRef } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import emptyPitchUrl from "../../assets/process/section-4-1.webp";
import ownerUrl from "../../assets/process/section-4-2.webp";
import arrivalUrl from "../../assets/process/section-4-3.webp";
import { PhotoFrame } from "./PhotoFrame";
import { ARRIVAL, EMPTY_HOURS, HEADLINE, OWNER } from "./processContent";
import { useArrivalBeat } from "./useArrivalBeat";
import { useEmptyHoursBeat } from "./useEmptyHoursBeat";
import { useOwnerBeat } from "./useOwnerBeat";

const OWNER_BODY_COLOR = { muted: "#B6D2C4", bright: "#F5FBF7" } as const;

/**
 * The cost of an empty pitch — one full-bleed photograph, one line, nothing
 * else, told across three beats.
 *
 * Empty hours → the owner's turn → the arrival. Each beat enters on its own
 * IntersectionObserver rather than a scroll scrub, so the section reads at
 * whatever speed you scroll it.
 */
export function ProcessSection() {
  const emptyFrameRef = useRef<HTMLDivElement>(null);
  const emptyImageRef = useRef<HTMLImageElement>(null);
  const ownerBeatRef = useRef<HTMLDivElement>(null);
  const ownerFrameRef = useRef<HTMLDivElement>(null);
  const ownerImageRef = useRef<HTMLImageElement>(null);
  const arrivalBeatRef = useRef<HTMLDivElement>(null);
  const arrivalFrameRef = useRef<HTMLDivElement>(null);
  const profile = useMotionProfile();

  useEmptyHoursBeat({ frameRef: emptyFrameRef, imageRef: emptyImageRef, profile });
  useOwnerBeat({
    beatRef: ownerBeatRef,
    frameRef: ownerFrameRef,
    imageRef: ownerImageRef,
    profile,
  });
  useArrivalBeat({ beatRef: arrivalBeatRef, frameRef: arrivalFrameRef, profile });

  return (
    <section
      id="process"
      aria-label="The cost of an empty pitch"
      className="flex flex-col justify-center"
      style={{
        minHeight: "100svh",
        gap: "clamp(28px,4.5vh,52px)",
        background: "#04120C",
        padding: "clamp(56px,8vh,96px) clamp(20px,5vw,72px)",
      }}
    >
      <div
        className="mx-auto flex w-full flex-col"
        style={{ maxWidth: "1440px", gap: "clamp(28px,4.5vh,52px)" }}
      >
        {/* Beat one — the empty pitch */}
        <PhotoFrame
          data-eh-frame
          frameRef={emptyFrameRef}
          imageRef={emptyImageRef}
          imageProps={{ "data-eh-img": "" }}
          src={emptyPitchUrl}
          alt={EMPTY_HOURS.alt}
          width={1680}
          height={945}
          frameHeight="clamp(58vh,66vh,70vh)"
          objectPosition="center 58%"
          driftDuration="19s"
        >
          <span
            className="absolute font-mono uppercase text-chalk"
            style={{
              top: "clamp(18px,2.6vw,30px)",
              left: "clamp(18px,2.6vw,30px)",
              fontSize: "11px",
              letterSpacing: ".32em",
            }}
          >
            {EMPTY_HOURS.label}
          </span>
        </PhotoFrame>

        <h2
          className="m-0 text-left font-display font-bold text-chalk uppercase"
          style={{
            fontSize: "clamp(2.4rem,5.4vw,4.4rem)",
            lineHeight: 0.98,
            letterSpacing: "-.01em",
            maxWidth: "19ch",
            textWrap: "balance",
          }}
        >
          {HEADLINE}
        </h2>

        {/* Beat two — the owner */}
        <div
          ref={ownerBeatRef}
          data-owner-beat
          className="grid items-center"
          style={{
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            gap: "clamp(32px,5vw,72px)",
            paddingTop: "clamp(52px,8vh,96px)",
          }}
        >
          <PhotoFrame
            data-owner-frame
            frameRef={ownerFrameRef}
            imageRef={ownerImageRef}
            imageProps={{ "data-owner-img": "" }}
            src={ownerUrl}
            alt={OWNER.alt}
            width={1122}
            height={1400}
            frameHeight="clamp(52vh,60vh,66vh)"
            objectPosition="28% 30%"
            driftDuration="22s"
          />

          <div>
            <span
              data-owner-line
              className="block font-mono uppercase"
              style={{ fontSize: "11px", letterSpacing: ".32em", color: "#34D498" }}
            >
              {OWNER.eyebrow}
            </span>

            <h3
              data-owner-line
              className="font-display font-bold text-chalk uppercase"
              style={{
                fontSize: "clamp(2rem,3.6vw,3rem)",
                lineHeight: 1.04,
                letterSpacing: "-.01em",
                margin: "clamp(14px,2vh,20px) 0 0",
                maxWidth: "16ch",
                textWrap: "balance",
              }}
            >
              {OWNER.headline}
            </h3>

            {OWNER.body.map((line, i) => (
              <p
                key={line.text}
                data-owner-line
                style={{
                  color: OWNER_BODY_COLOR[line.tone],
                  fontSize: "clamp(16px,1.3vw,18px)",
                  lineHeight: 1.6,
                  // First line clears the headline, the second sits tight
                  // beneath it, and the turn gets its own breathing room.
                  margin:
                    i === 0
                      ? "clamp(20px,2.8vh,28px) 0 0"
                      : i === 1
                        ? "10px 0 0"
                        : "clamp(18px,2.4vh,24px) 0 0",
                  maxWidth: line.tone === "bright" ? "30ch" : "36ch",
                }}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>

        {/* Beat three — the arrival */}
        <div
          ref={arrivalBeatRef}
          data-arrival-beat
          style={{ paddingTop: "clamp(52px,8vh,96px)" }}
        >
          <PhotoFrame
            data-arrival-frame
            frameRef={arrivalFrameRef}
            src={arrivalUrl}
            alt={ARRIVAL.alt}
            width={1680}
            height={945}
            frameHeight="clamp(56vh,64vh,72vh)"
            objectPosition="center 40%"
          >
            <span
              className="absolute font-sans font-medium text-chalk"
              style={{
                bottom: "clamp(20px,3vw,32px)",
                left: "clamp(18px,2.6vw,30px)",
                fontSize: "clamp(1.3rem,2.4vw,2rem)",
                letterSpacing: "-.02em",
                textShadow: "0 2px 18px rgba(0,0,0,.55)",
              }}
            >
              {ARRIVAL.caption}
            </span>
          </PhotoFrame>

          <div
            data-arrival-metrics
            className="flex items-center justify-center"
            style={{
              gap: "clamp(20px,3vw,40px)",
              marginTop: "clamp(28px,4vh,44px)",
            }}
          >
            {ARRIVAL.metrics.map((metric, i) => (
              <Fragment key={metric}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: "1px",
                      height: "16px",
                      background: "rgba(182,210,196,.3)",
                    }}
                  />
                )}
                <span
                  data-arrival-metric
                  className="text-center font-mono"
                  style={{ fontSize: "12px", letterSpacing: ".08em", color: "#B6D2C4" }}
                >
                  {metric}
                </span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
