import { useEffect, useState } from "react";

/**
 * How much motion this device should be asked to run.
 *
 * - `reduce` — the user asked for less motion. Every scroll-driven effect is
 *   skipped and layers render in their resting state.
 * - `lite` — a low-end device (<= 4 cores or <= 4 GB). The atmosphere layers
 *   (fog, rays, particles, grain) are dropped and smooth scrolling is disabled,
 *   because they are the expensive composited surfaces.
 */
export type MotionProfile = {
  reduce: boolean;
  lite: boolean;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** SSR/first-paint safe default: full motion, corrected on mount. */
const DEFAULT_PROFILE: MotionProfile = { reduce: false, lite: false };

function readProfile(): MotionProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;

  const nav = window.navigator as Navigator & { deviceMemory?: number };

  return {
    reduce: window.matchMedia(REDUCED_MOTION_QUERY).matches,
    lite: (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4,
  };
}

export function useMotionProfile(): MotionProfile {
  const [profile, setProfile] = useState<MotionProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setProfile(readProfile());

    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = () => setProfile(readProfile());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return profile;
}
