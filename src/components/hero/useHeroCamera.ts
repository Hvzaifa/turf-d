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
  const { reduce, lite } = profile;

  useLayoutEffect(() => {
    const track = trackRef.current;
    const hero = heroRef.current;
    if (!track || !hero || reduce) return;

    const ctx = gsap.context(() => {
      const q = <T extends Element>(selector: string): T | null =>
        hero.querySelector<T>(selector);

      const dolly = Array.from(
        hero.querySelectorAll<HTMLElement>(
          (lite ? DOLLY_SELECTORS_LITE : DOLLY_SELECTORS).join(","),
        ),
      );
      if (!dolly.length) return;

      const vignette = q('[data-layer="vignette"]');
      const mist = q('[data-layer="mist"]');
      const fogBg = q('[data-layer="fog-bg"]');
      const fogFg = q('[data-layer="fog-fg"]');
      const pitchScrim = q("[data-pitch-scrim]");
      const pitchGlow = q("[data-pitch-glow]");
      const leaves = q('[data-layer="leaves"]');
      const content = q('[data-layer="content"]');
      const cue = q('[data-layer="scroll-cue"]');

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: lite ? 0.35 : 0.8,
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
      tl.to(fogBg, { opacity: 0.05, duration: 0.9 }, 0.05);
      tl.to(fogFg, { opacity: 0.03, duration: 0.7 }, 0);

      // The field fills the frame and catches the light — an opacity fade
      // rather than a filter, so the animated image stays compositor-cheap.
      if (pitchScrim) tl.to(pitchScrim, { opacity: 0, duration: 0.85 }, 0.1);
      if (pitchGlow) tl.to(pitchGlow, { opacity: 1, duration: 1 }, 0);

      // The canopy dollies with the scene, then lifts faster (near-depth).
      if (leaves) {
        tl.to(leaves, { scale: DOLLY_SCALE, transformOrigin: DOLLY_ORIGIN, duration: 1 }, 0);
        tl.to(leaves, { yPercent: -22, opacity: 0, duration: 0.6 }, 0);
      }

      // Your gaze lifts from the copy toward the pitch.
      tl.to(content, { yPercent: -12, autoAlpha: 0, duration: 0.5 }, 0.06);
      if (cue) tl.to(cue, { autoAlpha: 0, duration: 0.12 }, 0);
    }, hero);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [trackRef, heroRef, reduce, lite]);
}
