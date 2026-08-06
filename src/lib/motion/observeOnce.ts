/**
 * Clear the inline properties an entrance animation writes.
 *
 * `useMotionProfile` starts optimistic and corrects on mount, so a hook can
 * apply its hidden state once before learning the user wants reduced motion.
 * Without this, that first pass would strand the element offset or invisible.
 */
export function clearMotionStyles(...elements: Array<HTMLElement | null | undefined>) {
  for (const el of elements) {
    if (!el) continue;
    el.style.opacity = "";
    el.style.transform = "";
    el.style.transition = "";
  }
}

/**
 * Fire `onEnter` the first time `target` crosses `threshold`, then stop
 * observing it. Returns a disconnect function for effect cleanup.
 */
export function observeOnce(
  target: Element,
  threshold: number,
  onEnter: () => void,
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        onEnter();
      }
    },
    { threshold },
  );
  observer.observe(target);
  return () => observer.disconnect();
}

/**
 * Pause an element's CSS animation whenever `gate` leaves the viewport, and
 * resume it on the way back in — but only once `hasEntered` says the beat has
 * actually played, so the drift never starts ahead of its entrance.
 */
export function gateAnimation(
  gate: Element,
  animated: HTMLElement,
  threshold: number,
  hasEntered: () => boolean,
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          animated.style.animationPlayState = "paused";
        } else if (hasEntered()) {
          animated.style.animationPlayState = "running";
        }
      }
    },
    { threshold },
  );
  observer.observe(gate);
  return () => observer.disconnect();
}
