import { useEffect, type RefObject } from "react";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import { clearMotionStyles, gateAnimation, observeOnce } from "../../lib/motion/observeOnce";
import { DRIFT_GATE_THRESHOLD, OWNER_BEAT as BEAT } from "./processMotion";

type Options = {
  beatRef: RefObject<HTMLDivElement | null>;
  frameRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
  profile: MotionProfile;
};

/**
 * The owner rises into frame and his copy ladders in behind him, one line every
 * 80ms. The photograph's drift is held back until the frame has fully arrived.
 */
export function useOwnerBeat({ beatRef, frameRef, imageRef, profile }: Options) {
  useEffect(() => {
    const beat = beatRef.current;
    const frame = frameRef.current;
    if (!beat) return;

    const image = imageRef.current;
    const lines = Array.from(beat.querySelectorAll<HTMLElement>("[data-owner-line]"));
    if (profile.reduce) {
      clearMotionStyles(frame, ...lines);
      return;
    }
    if (!frame && !lines.length) return;

    let entered = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (frame) {
      frame.style.transition = BEAT.frameTransition;
      frame.style.opacity = "0";
      frame.style.transform = BEAT.fromTransform;
    }
    for (const line of lines) {
      line.style.transition = BEAT.lineTransition;
      line.style.opacity = "0";
      line.style.transform = BEAT.fromTransform;
    }

    // The frame leads; if there is no frame the first line stands in for it.
    const target = frame ?? lines[0];

    const stopEnter = observeOnce(target, BEAT.threshold, () => {
      entered = true;
      if (frame) {
        frame.style.opacity = "1";
        frame.style.transform = "none";
      }
      lines.forEach((line, i) => {
        timers.push(
          setTimeout(() => {
            line.style.opacity = "1";
            line.style.transform = "none";
          }, i * BEAT.lineStaggerMs),
        );
      });
      if (image) {
        timers.push(
          setTimeout(() => {
            image.style.animationPlayState = "running";
          }, BEAT.driftDelayMs),
        );
      }
    });

    const stopGate =
      image && frame
        ? gateAnimation(frame, image, DRIFT_GATE_THRESHOLD, () => entered)
        : undefined;

    return () => {
      for (const timer of timers) clearTimeout(timer);
      stopEnter();
      stopGate?.();
      clearMotionStyles(frame, ...lines);
    };
  }, [beatRef, frameRef, imageRef, profile.reduce]);
}
