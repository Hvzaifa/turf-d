import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import {
  DEVICE_ARRIVE_DURATION,
  DEVICE_ARRIVE_FROM,
  DEVICE_ARRIVE_START,
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

    if (reduce) {
      /**
       * Nothing scrubs, so the phone never arrives. That is the right outcome
       * rather than a gap: it stands dead centre of the frame, so revealing it
       * at rest would bury the copy and the ticket stack under it. The hero
       * still says everything it needs to without it, and the phone is taken
       * out of the layer stack entirely instead of sitting there invisible.
       */
      const device = hero.querySelector<HTMLElement>("[data-hero-device]");
      if (device?.parentElement) device.parentElement.style.display = "none";
      return;
    }

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
          // The device walks to a position measured from the live layout, so
          // the tween has to be re-read whenever the viewport changes.
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

      // The canopy lifts faster than the scene (near-depth) and is gone early.
      // It no longer scales with the dolly: it was re-rasterizing a very large
      // sheet every frame to travel 22% up the screen before fading out.
      if (leaves) tl.to(leaves, { yPercent: -22, opacity: 0, duration: 0.6 }, 0);

      // Your gaze lifts from the copy toward the pitch.
      tl.to(content, { yPercent: -12, autoAlpha: 0, duration: 0.5 }, 0.06);
      if (cue) tl.to(cue, { autoAlpha: 0, duration: 0.12 }, 0);

      /**
       * The phone is not part of the hero any more — the ticket stack is. It
       * arrives on its own, only once the copy and the tickets have finished
       * clearing and the frame is nothing but the empty ground, so it never
       * shares the screen with them.
       */
      const device = q<HTMLElement>("[data-hero-device]");
      if (device) {
        tl.fromTo(
          device,
          { autoAlpha: 0, ...DEVICE_ARRIVE_FROM },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: DEVICE_ARRIVE_DURATION,
            ease: "power2.out",
          },
          DEVICE_ARRIVE_START,
        );
      }

      /**
       * The slot card is the one beat here that is not scrubbed: a lock that
       * slid back down when you scrolled up would read as a loop. It plays
       * once, forwards, and the trigger kills itself afterwards.
       */
      const card = q<HTMLElement>("[data-device-card]");
      if (card) {
        ScrollTrigger.create({
          trigger: track,
          // Just after the phone has arrived — the scrub reaches
          // `DEVICE_ARRIVE_START` at roughly one viewport of scroll into the
          // 260svh track. Firing at 40px, as it used to, locked the slot on a
          // phone nobody could see yet.
          start: "top top-=105%",
          once: true,
          onEnter: () =>
            gsap.to(card, {
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              onComplete: () => {
                card.style.willChange = "auto";
              },
            }),
        });
      }
    }, hero);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [trackRef, heroRef, reduce, lite]);
}
