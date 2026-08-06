import { useEffect, type RefObject } from "react";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import { clearMotionStyles, observeOnce } from "../../lib/motion/observeOnce";
import { ARRIVAL_BEAT as BEAT } from "./processMotion";

type Options = {
  beatRef: RefObject<HTMLDivElement | null>;
  frameRef: RefObject<HTMLDivElement | null>;
  profile: MotionProfile;
};

/**
 * The arrival photograph fades up early, then the metrics land one after
 * another — both watching the frame, but at different thresholds, so the
 * numbers only arrive once the photo is properly in view.
 */
export function useArrivalBeat({ beatRef, frameRef, profile }: Options) {
  useEffect(() => {
    const beat = beatRef.current;
    const frame = frameRef.current;
    if (!beat || !frame) return;

    const metrics = Array.from(
      beat.querySelectorAll<HTMLElement>("[data-arrival-metric]"),
    );
    if (profile.reduce) {
      clearMotionStyles(frame, ...metrics);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];

    frame.style.transition = BEAT.frameTransition;
    frame.style.opacity = "0";
    for (const metric of metrics) {
      metric.style.transition = BEAT.metricTransition;
      metric.style.opacity = "0";
      metric.style.transform = BEAT.metricFromTransform;
    }

    const stopFrame = observeOnce(frame, BEAT.frameThreshold, () => {
      frame.style.opacity = "1";
    });

    const stopMetrics = observeOnce(frame, BEAT.metricThreshold, () => {
      metrics.forEach((metric, i) => {
        timers.push(
          setTimeout(() => {
            metric.style.opacity = "1";
            metric.style.transform = "none";
          }, i * BEAT.metricStaggerMs),
        );
      });
    });

    return () => {
      for (const timer of timers) clearTimeout(timer);
      stopFrame();
      stopMetrics();
      clearMotionStyles(frame, ...metrics);
    };
  }, [beatRef, frameRef, profile.reduce]);
}
