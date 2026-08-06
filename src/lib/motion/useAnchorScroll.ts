import { useEffect } from "react";

import { useMotionProfile } from "./motionProfile";
import { getLenis } from "./useSmoothScroll";

/** Room left above the target so the fixed nav doesn't cover it. */
const NAV_OFFSET = -90;

/**
 * Routes every in-page anchor through Lenis instead of the browser's native
 * jump.
 *
 * A native jump desyncs Lenis's internal scroll target from the real scrollY,
 * and once a pinned section (which adds real pin-spacing height) is in the mix,
 * that desync can strand the viewport far past the intended target.
 */
export function useAnchorScroll() {
  const { reduce } = useMotionProfile();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute("href")?.slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(target, { offset: NAV_OFFSET });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduce]);
}
