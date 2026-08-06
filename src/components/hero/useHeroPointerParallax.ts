import { useEffect, type RefObject } from "react";
import gsap from "gsap";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import { getLenis } from "../../lib/motion/useSmoothScroll";
import {
  POINTER_EPSILON,
  POINTER_IDLE_FRAMES,
  POINTER_LAYERS,
  POINTER_LERP,
} from "./heroMotion";

type Options = {
  heroRef: RefObject<HTMLElement | null>;
  profile: MotionProfile;
};

/**
 * Depth parallax driven by the cursor, at rest until something actually moves.
 *
 * The worker rides the shared GSAP ticker instead of its own rAF loop, and
 * detaches itself after a few idle frames so a still cursor costs nothing.
 * It only runs while the hero is the viewport's first screen.
 */
export function useHeroPointerParallax({ heroRef, profile }: Options) {
  const { reduce, liteHero: lite } = profile;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reduce || lite) return;

    const layers = POINTER_LAYERS.map(({ selector, depth, base }) => ({
      el: hero.querySelector<HTMLElement>(selector),
      depth,
      base,
    })).filter((layer): layer is { el: HTMLElement; depth: number; base: string } =>
      Boolean(layer.el),
    );
    if (!layers.length) return;

    // target (tx, ty) is where the cursor is; current (cx, cy) chases it.
    const pointer = { tx: 0, ty: 0, cx: 0, cy: 0 };
    let viewportHeight = window.innerHeight;
    let idleFrames = 0;
    let settled = true;
    let active = false;

    const frame = () => {
      const scrollY = getLenis()?.scroll ?? window.scrollY;
      let busy = false;

      if (scrollY < viewportHeight) {
        pointer.cx += (pointer.tx - pointer.cx) * POINTER_LERP;
        pointer.cy += (pointer.ty - pointer.cy) * POINTER_LERP;

        const moved =
          Math.abs(pointer.tx - pointer.cx) > POINTER_EPSILON ||
          Math.abs(pointer.ty - pointer.cy) > POINTER_EPSILON;

        if (moved || !settled) {
          if (!moved) {
            // Snap on settle so the loop stops cleanly, with no residual frames.
            pointer.cx = pointer.tx;
            pointer.cy = pointer.ty;
          }
          settled = !moved;

          for (const { el, depth, base } of layers) {
            const x = (-pointer.cx * depth).toFixed(2);
            const y = (-pointer.cy * depth).toFixed(2);
            el.style.transform = `${base}translate3d(${x}px,${y}px,0)`;
          }
        }

        if (moved) busy = true;
      }

      if (busy) {
        idleFrames = 0;
      } else if (++idleFrames > POINTER_IDLE_FRAMES) {
        gsap.ticker.remove(frame);
        active = false;
      }
    };

    const wake = () => {
      if (active) return;
      idleFrames = 0;
      active = true;
      gsap.ticker.add(frame);
    };

    const onMove = (event: MouseEvent) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
      wake();
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
      wake();
    };
    const onResize = () => {
      viewportHeight = window.innerHeight;
      wake();
    };
    /**
     * Scrolling can carry the hero in or out of parallax range, but if the
     * cursor has not moved there is nothing to redraw — waking the ticker
     * would burn a run of frames writing transforms that never change.
     */
    const onScroll = () => {
      if (!settled) wake();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize", onResize);
    // A scroll can carry the hero in or out of the parallax range.
    const lenis = getLenis();
    lenis?.on("scroll", onScroll);
    if (!lenis) window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      lenis?.off("scroll", onScroll);
      if (!lenis) window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(frame);
      // Restore each layer's resting transform (some are mirrored).
      for (const { el, base } of layers) el.style.transform = base.trim();
    };
  }, [heroRef, reduce, lite]);
}
