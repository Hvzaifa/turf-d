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
  const { reduce, liteHero: lite } = profile;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Applied in both directions: the profile can flip as the window is
    // resized across the lite threshold, and the layers must come back.
    const drop = lite && !reduce;
    for (const cam of LITE_DISABLED_CAMS) {
      const el = hero.querySelector<HTMLElement>(`[data-cam="${cam}"]`);
      if (el) el.style.display = drop ? "none" : "";
    }

    if (reduce) {
      hero.style.setProperty("--amb", "paused");
      hero.style.setProperty("--wc", "auto");
      hero.style.setProperty("--wc-opacity", "auto");
      return;
    }

    // Promoted only across the scrub range the camera actually uses. The two
    // pitch grades are promoted for `opacity` alone — they are never
    // transformed, and asking for `transform` there would cost a texture for
    // nothing.
    hero.style.setProperty("--wc", "transform");
    hero.style.setProperty("--wc-opacity", "opacity");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          hero.style.setProperty("--amb", entry.isIntersecting ? "running" : "paused");
          hero.style.setProperty("--wc", entry.isIntersecting ? "transform" : "auto");
          hero.style.setProperty(
            "--wc-opacity",
            entry.isIntersecting ? "opacity" : "auto",
          );
        }
      },
      { threshold: 0 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, [heroRef, reduce, lite]);
}
