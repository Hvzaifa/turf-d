import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import type { MotionProfile } from "./motionProfile";

gsap.registerPlugin(ScrollTrigger);

/**
 * One Lenis instance and one GSAP ticker for the whole document, kept at module
 * scope so a StrictMode double-mount (or a route remount) never races two
 * smooth-scroll loops against each other.
 */
let lenis: Lenis | null = null;
let ticker: ((time: number) => void) | null = null;
let refCount = 0;

function acquire(): Lenis {
  if (!lenis) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    ticker = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
  }
  refCount += 1;
  return lenis;
}

function release() {
  refCount = Math.max(0, refCount - 1);
  if (refCount > 0 || !lenis) return;

  if (ticker) gsap.ticker.remove(ticker);
  lenis.destroy();
  lenis = null;
  ticker = null;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/**
 * Smooth scrolling, enabled only when the device can afford it. On `lite` or
 * `reduce` the page falls back to native scrolling and ScrollTrigger reads
 * `window.scrollY` directly.
 */
export function useSmoothScroll({ reduce, lite }: MotionProfile) {
  useEffect(() => {
    if (reduce || lite) {
      document.documentElement.style.scrollBehavior = "auto";
      return;
    }

    // GSAP drives the frame; native smooth scrolling would fight it.
    document.documentElement.style.scrollBehavior = "auto";
    acquire();
    return release;
  }, [reduce, lite]);
}
