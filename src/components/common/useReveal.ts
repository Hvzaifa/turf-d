import { useEffect, type RefObject } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import { clearMotionStyles } from "../../lib/motion/observeOnce";

const TRANSITION =
  "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)";

const THRESHOLD = 0.1;
const ROOT_MARGIN = "0px 0px -8% 0px";

/**
 * The page-wide entrance: content rises 44px into place the first time it
 * enters the viewport, then stops being observed.
 *
 * Attach this directly when the revealed element already carries layout styles
 * of its own — wrapping it in {@link RevealOnScroll} would add a DOM level and
 * move it. Reduced motion opts out entirely, which is why the hidden state is
 * applied from script rather than CSS.
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  const { reduce } = useMotionProfile();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      clearMotionStyles(el);
      return;
    }

    el.style.opacity = "0";
    el.style.transform = "translateY(44px)";
    el.style.transition = TRANSITION;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.style.opacity = "1";
          target.style.transform = "none";
          observer.unobserve(target);
        }
      },
      { threshold: THRESHOLD, rootMargin: ROOT_MARGIN },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearMotionStyles(el);
    };
  }, [ref, reduce]);
}
