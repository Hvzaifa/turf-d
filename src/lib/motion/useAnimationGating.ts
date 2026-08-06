import { useEffect } from "react";

import { useMotionProfile } from "./motionProfile";

/** Start pausing a little before the section actually leaves the viewport. */
const ROOT_MARGIN = "160px 0px";

/**
 * Pauses a section's looping animations while it is off screen.
 *
 * The hero manages its own ambient layers via `--amb`. These sections instead
 * run unmanaged, continuous loops that keep the compositor busy even when
 * nobody can see them, so they are paused wholesale through the Web Animations
 * API on the way out.
 */
export function useAnimationGating(selectors: readonly string[]) {
  const { reduce } = useMotionProfile();
  const key = selectors.join(",");

  useEffect(() => {
    const groups = Array.from(document.querySelectorAll(key));
    if (!groups.length) return;

    /** Everything this hook paused must be released, or it stays frozen. */
    const resumeAll = () => {
      for (const group of groups) {
        let animations: Animation[] = [];
        try {
          animations = group.getAnimations({ subtree: true });
        } catch {
          continue;
        }
        for (const animation of animations) {
          try {
            animation.play();
          } catch {
            /* already finished or cancelled */
          }
        }
      }
    };

    // `useMotionProfile` starts optimistic, so this effect can have run once
    // and paused things before learning the user wants reduced motion.
    if (reduce) {
      resumeAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          let animations: Animation[] = [];
          try {
            animations = entry.target.getAnimations({ subtree: true });
          } catch {
            continue;
          }
          for (const animation of animations) {
            try {
              if (entry.isIntersecting) animation.play();
              else animation.pause();
            } catch {
              /* an animation can be cancelled mid-flight; nothing to do */
            }
          }
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    for (const group of groups) observer.observe(group);

    return () => {
      observer.disconnect();
      resumeAll();
    };
  }, [key, reduce]);
}
