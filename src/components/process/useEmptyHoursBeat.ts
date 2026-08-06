import { useEffect, type RefObject } from "react";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import { clearMotionStyles, gateAnimation, observeOnce } from "../../lib/motion/observeOnce";
import { DRIFT_GATE_THRESHOLD, EMPTY_HOURS_BEAT as BEAT } from "./processMotion";

type Options = {
  frameRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
  profile: MotionProfile;
};

/**
 * The empty pitch settles out of a faint over-scale as it comes into view, and
 * its slow drift starts only after the settle has finished.
 */
export function useEmptyHoursBeat({ frameRef, imageRef, profile }: Options) {
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (profile.reduce) {
      clearMotionStyles(frame);
      return;
    }

    const image = imageRef.current;
    let entered = false;
    let driftTimer: ReturnType<typeof setTimeout> | undefined;

    frame.style.transition = BEAT.transition;
    frame.style.opacity = BEAT.fromOpacity;
    frame.style.transform = BEAT.fromTransform;

    const stopEnter = observeOnce(frame, BEAT.threshold, () => {
      entered = true;
      frame.style.opacity = "1";
      frame.style.transform = "scale(1)";
      if (image) {
        driftTimer = setTimeout(() => {
          image.style.animationPlayState = "running";
        }, BEAT.driftDelayMs);
      }
    });

    const stopGate = image
      ? gateAnimation(frame, image, DRIFT_GATE_THRESHOLD, () => entered)
      : undefined;

    return () => {
      clearTimeout(driftTimer);
      stopEnter();
      stopGate?.();
      clearMotionStyles(frame);
    };
  }, [frameRef, imageRef, profile.reduce]);
}
