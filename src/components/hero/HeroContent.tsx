import type { CSSProperties } from "react";

import { COPY_DELAYS } from "./heroMotion";
import { HeroSports } from "./HeroSports";
import { HeroTickets } from "./HeroTickets";
import { HeroWaitlistForm, type HeroWaitlistFormProps } from "./HeroWaitlistForm";

/** Each line of copy rises in on its own beat once the film has opened. */
const rise = (delay: number): CSSProperties => ({
  animation: `filmRise 1.8s cubic-bezier(.16,1,.3,1) ${delay}s both`,
});

export type HeroContentProps = HeroWaitlistFormProps & {
  /** Opens the product preview — the modal itself lives outside the hero. */
  onWatchFilm?: () => void;
};

/**
 * The hero copy, now centred on the axis the ticket stack sits on.
 *
 * The column used to be left-aligned against the right-hand side of the frame,
 * which is what the photograph wanted when there was nothing else in it. The
 * tickets are a physical object with a centre of gravity, and fanning them out
 * of a left-hand column reads as clutter; centred, the copy and the fan share
 * one axis and the stack looks set down beneath the headline rather than
 * parked next to it.
 */
export function HeroContent({ onSubmit, onWatchFilm }: HeroContentProps) {
  return (
    <div
      data-layer="content"
      className="relative z-6 mx-auto flex w-full items-center justify-center"
      style={{
        maxWidth: "1280px",
        padding:
          "clamp(96px,13vh,124px) clamp(20px,4vw,52px) clamp(48px,7vh,72px)",
      }}
    >
      {/* `minWidth: 0` matters: this is a flex item, so without it the column
          refuses to shrink under its widest row and the waitlist field and the
          sports row run off the right edge of a phone. */}
      <div
        className="flex flex-col items-center text-center"
        style={{ width: "min(100%,720px)", minWidth: 0 }}
      >
        <h1
          className="m-0 font-display font-bold text-chalk uppercase"
          style={{
            fontSize: "clamp(2.7rem,5.8vw,5rem)",
            lineHeight: 0.92,
            letterSpacing: "-.005em",
            textWrap: "balance",
            textShadow: "0 2px 30px rgba(0,0,0,.35)",
          }}
        >
          <span className="block" style={rise(COPY_DELAYS.headlineA)}>
            Find. Book.
          </span>
          <span className="block" style={rise(COPY_DELAYS.headlineB)}>
            Play.
          </span>
        </h1>

        <p
          style={{
            margin: "clamp(18px,2.6vh,24px) 0 0",
            maxWidth: "440px",
            fontSize: "clamp(15px,1.5vw,17px)",
            lineHeight: 1.62,
            textWrap: "pretty",
            color: "rgba(245,251,247,.72)",
            ...rise(COPY_DELAYS.lead),
          }}
        >
          Pakistan's sports booking app — see every nearby court, its open
          hours and its price, and lock a slot in seconds. When the floodlights
          come on, the hours are yours.
        </p>

        {/* The stack sits directly under the copy, on the same axis, and is
            the only thing in the hero you can put a hand on. */}
        <div style={{ marginTop: "clamp(24px,3.6vh,40px)", ...rise(COPY_DELAYS.tickets) }}>
          <HeroTickets />
        </div>

        <div
          className="flex flex-wrap items-end justify-center"
          style={{
            marginTop: "clamp(26px,4vh,38px)",
            gap: "16px 34px",
            ...rise(COPY_DELAYS.actions),
          }}
        >
          <HeroWaitlistForm onSubmit={onSubmit} />

          <button
            type="button"
            onClick={onWatchFilm}
            className="cursor-pointer border-none bg-transparent py-2.25 text-[14px] font-medium text-[rgba(245,251,247,.66)] transition-[border-color,color] duration-140 [border-bottom:1px_solid_rgba(245,251,247,.14)] hover:border-b-[rgba(245,251,247,.4)] hover:text-chalk"
          >
            Watch the film
          </button>
        </div>

        <HeroSports style={{ justifyContent: "center", ...rise(COPY_DELAYS.sports) }} />

        <div
          className="font-mono uppercase"
          style={{
            marginTop: "clamp(18px,2.8vh,28px)",
            fontSize: "11px",
            letterSpacing: ".2em",
            color: "rgba(245,251,247,.42)",
            ...rise(COPY_DELAYS.meta),
          }}
        >
          Launching Islamabad · Q4 2026
        </div>
      </div>
    </div>
  );
}
