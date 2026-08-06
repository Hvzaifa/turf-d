import type { CSSProperties } from "react";

import { COPY_DELAYS } from "./heroMotion";
import { HeroWaitlistForm, type HeroWaitlistFormProps } from "./HeroWaitlistForm";

/** Each line of copy rises in on its own beat once the film has opened. */
const rise = (delay: number): CSSProperties => ({
  animation: `filmRise 1.8s cubic-bezier(.16,1,.3,1) ${delay}s both`,
});

export type HeroContentProps = HeroWaitlistFormProps & {
  /** Opens the product preview — the modal itself lives outside the hero. */
  onWatchFilm?: () => void;
};

export function HeroContent({ onSubmit, onWatchFilm }: HeroContentProps) {
  return (
    <div
      data-layer="content"
      className="relative z-6 mx-auto flex w-full items-center"
      style={{
        maxWidth: "1280px",
        padding:
          "clamp(104px,16vh,148px) clamp(20px,4vw,52px) clamp(72px,12vh,96px)",
      }}
    >
      <div style={{ width: "min(100%,540px)" }}>
        <h1
          className="m-0 font-display font-bold text-chalk uppercase"
          style={{
            fontSize: "clamp(2.9rem,6.6vw,5.8rem)",
            lineHeight: 0.92,
            letterSpacing: "-.005em",
            textWrap: "balance",
            textShadow: "0 2px 30px rgba(0,0,0,.35)",
          }}
        >
          <span className="block" style={rise(COPY_DELAYS.headlineA)}>
            The night belongs
          </span>
          <span className="block" style={rise(COPY_DELAYS.headlineB)}>
            to the played-in.
          </span>
        </h1>

        <p
          style={{
            margin: "clamp(22px,3.4vh,30px) 0 0 clamp(0px,2vw,30px)",
            maxWidth: "322px",
            fontSize: "clamp(15px,1.5vw,17px)",
            lineHeight: 1.62,
            textWrap: "pretty",
            color: "rgba(245,251,247,.72)",
            ...rise(COPY_DELAYS.lead),
          }}
        >
          When the floodlights come on, the city goes home and the game begins.
          Find your pitch, gather your side, and claim the hours that are yours.
        </p>

        <div
          className="flex flex-wrap items-end"
          style={{
            marginTop: "clamp(30px,4.6vh,40px)",
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

        <div
          className="font-mono uppercase"
          style={{
            marginTop: "clamp(30px,5vh,44px)",
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
