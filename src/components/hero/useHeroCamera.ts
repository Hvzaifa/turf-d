import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import {
  DOLLY_ORIGIN,
  DOLLY_SCALE,
  DOLLY_SELECTORS,
  DOLLY_SELECTORS_LITE,
} from "./heroMotion";

gsap.registerPlugin(ScrollTrigger);

type Options = {
  trackRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  profile: MotionProfile;
};

/**
 * One continuous camera move scrubbed against the hero's scroll track:
 * standing outside → walking in → arriving on the field.
 *
 * Each layer is transformed on its own promoted texture rather than through a
 * shared parent, so no surface has to re-rasterize its children. The pin is
 * CSS `position: sticky`; ScrollTrigger only scrubs, and never mutates the DOM
 * out from under React.
 */
export function useHeroCamera({ trackRef, heroRef, profile }: Options) {
  const { reduce, liteHero: lite } = profile;

  useLayoutEffect(() => {
    const track = trackRef.current;
    const hero = heroRef.current;
    if (!track || !hero) return;

    // Nothing scrubs under reduced motion, and there is nothing left in the
    // frame that only the scrub reveals, so there is nothing to tidy away.
    if (reduce) return;

    const ctx = gsap.context(() => {
      const q = <T extends Element>(selector: string): T | null =>
        hero.querySelector<T>(selector);

      const dolly = Array.from(
        hero.querySelectorAll<HTMLElement>(
          (lite ? DOLLY_SELECTORS_LITE : DOLLY_SELECTORS).join(","),
        ),
      );
      if (!dolly.length) return;

      const mist = q('[data-layer="mist"]');
      const vignette = q('[data-layer="vignette"]');
      const fog = q('[data-layer="fog"]');
      const pitchScrim = q("[data-pitch-scrim]");
      const pitchGlow = q("[data-pitch-glow]");
      const content = q('[data-layer="content"]');
      const cue = q('[data-layer="scroll-cue"]');

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: lite ? 0.35 : 0.8,
          // Layer travel is measured from the live layout, so the tweens have
          // to be re-read whenever the viewport changes.
          invalidateOnRefresh: true,
        },
      });

      // Steady forward dolly + slight upward tilt, applied per layer.
      tl.to(
        dolly,
        { scale: DOLLY_SCALE, yPercent: -6, transformOrigin: DOLLY_ORIGIN, duration: 1 },
        0,
      );

      // The night opens up around you as you enter.
      tl.to(vignette, { opacity: 0, duration: 1 }, 0);
      tl.to(mist, { opacity: 0.55, duration: 0.92 }, 0.04);

      // Fog parts as you move through it.
      tl.to(fog, { opacity: 0.05, duration: 0.9 }, 0.05);

      // The field fills the frame and catches the light. Both grades are
      // outside the dollying pitch cell, so these are pure compositor work.
      if (pitchScrim) tl.to(pitchScrim, { opacity: 0, duration: 0.85 }, 0.1);
      if (pitchGlow) tl.to(pitchGlow, { opacity: 1, duration: 1 }, 0);

      // Your gaze lifts from the copy toward the pitch.
      tl.to(content, { yPercent: -12, autoAlpha: 0, duration: 0.5 }, 0.06);
      if (cue) tl.to(cue, { autoAlpha: 0, duration: 0.12 }, 0);

      /**
       * There is no third act here any more. The phone that used to walk into
       * the empty frame — and the slot card that locked inside it — are gone,
       * along with the tournament cards that briefly stood in their place. Once
       * the copy and the booking pass clear, the shot is the pitch and nothing
       * else, which is the whole point of the dolly.
       */
    }, hero);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [trackRef, heroRef, reduce, lite]);
}
