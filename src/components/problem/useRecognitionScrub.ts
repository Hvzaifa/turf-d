import { useEffect, type RefObject } from "react";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import {
  BLUR_PX,
  BRIDGE_RISE_PX,
  BRIDGE_SCALE_FROM,
  BRIDGE_START,
  BRIDGE_WIDTH,
  DIM_STRENGTH,
  FADE_WIDTH,
  MESSAGE_RISE_PX,
  REDUCED_MOTION_THRESHOLD,
  clamp01,
  messageWindow,
} from "./problemMotion";

type Options = {
  sectionRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  lineRef: RefObject<HTMLDivElement | null>;
  profile: MotionProfile;
};

/**
 * Drives the conversation and the bridge line straight from scroll position.
 *
 * The messages carry no CSS transition: opacity and transform are written from
 * the scroll offset every frame, so scrubbing up or down moves them in lockstep
 * with the scrollbar instead of replaying a fixed-length animation.
 *
 * Progress is read from the section's own travel over the trigger's height
 * rather than from the trigger's rect. Deriving it from the trigger breaks as
 * soon as the sticky stage is taller than one viewport, because most of the pin
 * budget then goes on just bringing the trigger's top to zero.
 *
 * The loop polls with rAF rather than subscribing to scroll: a scroll event can
 * be coalesced, missed, or stop firing across mounts, and a position read
 * cannot get stuck that way.
 */
export function useRecognitionScrub({
  sectionRef,
  triggerRef,
  contentRef,
  lineRef,
  profile,
}: Options) {
  const { reduce } = profile;

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;
    const content = contentRef.current;
    const line = lineRef.current;
    if (!section || !trigger) return;

    const messages = Array.from(
      section.querySelectorAll<HTMLElement>("[data-recog-msg]"),
    );

    /** Dim and blur the conversation as the bridge line takes over. */
    const setDim = (t: number) => {
      if (!content) return;
      content.style.opacity = String(1 - DIM_STRENGTH * t);
      content.style.filter = `blur(${t * BLUR_PX}px)`;
    };

    const setBridge = (t: number) => {
      if (!line) return;
      line.style.opacity = String(t);
      line.style.transform =
        t >= 1
          ? "none"
          : `translateY(${BRIDGE_RISE_PX * (1 - t)}px) scale(${
              BRIDGE_SCALE_FROM + (1 - BRIDGE_SCALE_FROM) * t
            })`;
    };

    if (reduce) {
      for (const message of messages) {
        message.style.opacity = "1";
        message.style.transform = "none";
      }
      if (line) line.style.opacity = "0";

      // Still reveal the bridge on scroll, just without the motion.
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const on = entry.isIntersecting ? 1 : 0;
            setDim(on);
            if (line) line.style.opacity = String(on);
          }
        },
        { threshold: REDUCED_MOTION_THRESHOLD },
      );
      observer.observe(trigger);
      return () => observer.disconnect();
    }

    for (const message of messages) {
      message.style.transition = "none";
      message.style.opacity = "0";
      message.style.transform = `translateY(${MESSAGE_RISE_PX}px)`;
    }
    if (line) {
      line.style.transition = "none";
      setBridge(0);
    }

    const compute = () => {
      const span = Math.max(1, trigger.offsetHeight);
      const p = clamp01(-section.getBoundingClientRect().top / span);

      messages.forEach((message, index) => {
        const { start } = messageWindow(index, messages.length);
        const t = clamp01((p - start) / FADE_WIDTH);
        message.style.opacity = String(t);
        message.style.transform = `translateY(${MESSAGE_RISE_PX * (1 - t)}px)`;
      });

      const bridgeT = clamp01((p - BRIDGE_START) / BRIDGE_WIDTH);
      setDim(bridgeT);
      setBridge(bridgeT);
    };

    let running = true;
    const loop = () => {
      if (!running) return;
      compute();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    window.addEventListener("resize", compute);
    compute();

    return () => {
      running = false;
      window.removeEventListener("resize", compute);
    };
  }, [sectionRef, triggerRef, contentRef, lineRef, reduce]);
}
