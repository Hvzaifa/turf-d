import { useEffect, type RefObject } from "react";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import { LITE_DISABLED_CAMS } from "./heroMotion";

type Options = {
  heroRef: RefObject<HTMLElement | null>;
  profile: MotionProfile;
};

/**
 * Keeps the hero's ambient layers from costing anything they don't have to.
 *
 * - On low-end devices the expensive atmosphere layers are removed outright.
 * - Whenever the hero leaves the viewport its looping animations pause and
 *   `will-change` is dropped, so the compositor stops holding promoted
 *   textures for a section nobody is looking at.
 *
 * Both are driven by the `--amb` / `--wc` custom properties the layers read.
 */
export function useHeroAmbientGating({ heroRef, profile }: Options) {
  const { reduce, lite } = profile;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    if (lite && !reduce) {
      for (const cam of LITE_DISABLED_CAMS) {
        hero.querySelector<HTMLElement>(`[data-cam="${cam}"]`)?.style.setProperty("display", "none");
      }
      hero.querySelector<HTMLElement>('[data-layer="grain"]')?.style.setProperty("display", "none");
      const leaves = hero.querySelector<HTMLElement>('[data-layer="leaves"] img');
      if (leaves) leaves.style.animation = "none";
    }

    if (reduce) {
      hero.style.setProperty("--amb", "paused");
      hero.style.setProperty("--wc", "auto");
      return;
    }

    // Promoted only across the scrub range the camera actually uses.
    hero.style.setProperty("--wc", "transform");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          hero.style.setProperty("--amb", entry.isIntersecting ? "running" : "paused");
          hero.style.setProperty("--wc", entry.isIntersecting ? "transform" : "auto");
        }
      },
      { threshold: 0 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, [heroRef, reduce, lite]);
}
