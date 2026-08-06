import { useEffect, useState } from "react";

/**
 * How much motion this device should be asked to run.
 *
 * - `reduce` — the user asked for less motion. Every scroll-driven effect is
 *   skipped and layers render in their resting state.
 * - `lite` — a low-end device (<= 4 cores or <= 4 GB). Smooth scrolling is
 *   disabled and the hero is simplified.
 * - `liteHero` — this screen cannot afford the hero's full layer stack, which
 *   is a separate question from how fast the machine is. Only the hero reads
 *   it, so a large monitor keeps smooth scrolling and every other section.
 */
export type MotionProfile = {
  reduce: boolean;
  lite: boolean;
  liteHero: boolean;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Viewport area, in CSS megapixels, above which the hero runs in lite mode.
 *
 * The hero stacks roughly a dozen full-viewport translucent layers, so its
 * cost is fill-rate bound: it scales with viewport *area*, not with how fast
 * the machine is. Measured frame times climb from ~16ms at phone size to
 * ~40ms at laptop size to ~150ms at 2560x1440 — which is why the section is
 * smooth on a phone and janky on a large monitor, and why layer memory
 * pressure there shows up as flickering or vanishing layers.
 *
 * 2.2MP sits above a 1920x1080 desktop and below 2560x1440. Raise it to keep
 * the full atmosphere on bigger screens, lower it to drop out sooner.
 */
export const LITE_VIEWPORT_MEGAPIXELS = 2.2;

/** SSR/first-paint safe default: full motion, corrected on mount. */
const DEFAULT_PROFILE: MotionProfile = { reduce: false, lite: false, liteHero: false };

function readProfile(): MotionProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;

  const nav = window.navigator as Navigator & { deviceMemory?: number };
  const weakDevice = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  // CSS pixels, deliberately not device pixels: a phone's high DPR does not
  // make it slow here, since it composites at its own native resolution.
  const megapixels = (window.innerWidth * window.innerHeight) / 1_000_000;

  return {
    reduce: window.matchMedia(REDUCED_MOTION_QUERY).matches,
    lite: weakDevice,
    liteHero: weakDevice || megapixels > LITE_VIEWPORT_MEGAPIXELS,
  };
}

export function useMotionProfile(): MotionProfile {
  const [profile, setProfile] = useState<MotionProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const sync = () =>
      setProfile((current) => {
        const next = readProfile();
        // Keep the same object when nothing changed, so effects keyed on the
        // profile don't tear down and rebuild on every resize event.
        return current.reduce === next.reduce &&
          current.lite === next.lite &&
          current.liteHero === next.liteHero
          ? current
          : next;
      });

    sync();

    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return profile;
}
