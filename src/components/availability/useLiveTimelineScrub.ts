import { useEffect, type RefObject } from "react";
import gsap from "gsap";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import { getLenis } from "../../lib/motion/useSmoothScroll";
import { STATUS_COLOR, type StatusLabel } from "./availabilityContent";
import {
  LAST_ROW_STATUS_AT,
  MIN_PIN_RATIO,
  LIVE_INDICATOR_AT,
  LIVE_ROW_SEQUENCE,
  LIVE_ROW_VISIBLE_AT,
  REVEAL,
  SETTLE_AT,
  SETTLE_DELAY_MS,
  SETTLE_DURATION,
  SETTLE_OPACITY,
  STATUS_BASE_AT,
  STATUS_STAGGER,
  SWAP_IN,
  SWAP_OUT,
  TIMESTAMP_AGES_AT,
  TIME_BASE_AT,
  TIME_STAGGER,
  UNSETTLE_DURATION,
  clamp01,
} from "./availabilityMotion";

type Options = {
  trackRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  profile: MotionProfile;
};

/**
 * Scrubs the availability timeline: rows ladder in, the 7:00 PM slot walks its
 * whole lifecycle, and the rest recede once it lands on Confirmed.
 *
 * Scroll position is computed straight from the track's own rect rather than
 * through the shared ScrollTrigger registry, which other sections' mount and
 * unmount cycles can clear unpredictably.
 */
export function useLiveTimelineScrub({ trackRef, stageRef, profile }: Options) {
  const { reduce } = profile;

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const rows = Array.from(stage.querySelectorAll<HTMLElement>("[data-tl-row]")).map(
      (row) => ({
        row,
        time: row.querySelector<HTMLElement>("[data-tl-time]"),
        status: row.querySelector<HTMLElement>("[data-tl-status]"),
        live: row.dataset.tlLive === "true",
      }),
    );
    const indicator = stage.querySelector<HTMLElement>("[data-tl-live-indicator]");
    const timestamp = stage.querySelector<HTMLElement>("[data-tl-live-ts]");

    if (reduce) {
      for (const { time, status } of rows) {
        if (time) time.style.opacity = "1";
        if (status) status.style.opacity = "1";
      }
      if (indicator) indicator.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      for (const { time, status } of rows) {
        if (time) {
          gsap.set(time, { opacity: 0, y: REVEAL.offsetY });
          time.dataset.shown = "0";
        }
        if (status) {
          gsap.set(status, { opacity: 0, y: REVEAL.offsetY });
          status.dataset.shown = "0";
          // Seed from what is rendered, so re-asserting the same status is a
          // no-op instead of a flash.
          status.dataset.cur = status.textContent ?? "";
        }
      }
      if (indicator) {
        gsap.set(indicator, { opacity: 0, y: REVEAL.offsetY });
        indicator.dataset.shown = "0";
      }
      if (timestamp) timestamp.dataset.cur = timestamp.textContent ?? "";

      const reveal = (el: HTMLElement | null, show: boolean) => {
        if (!el) return;
        if (show === (el.dataset.shown === "1")) return;
        el.dataset.shown = show ? "1" : "0";
        gsap.to(el, {
          opacity: show ? 1 : 0,
          y: show ? 0 : REVEAL.offsetY,
          duration: REVEAL.duration,
          ease: REVEAL.ease,
          overwrite: true,
        });
      };

      const swapText = (el: HTMLElement | null, text: string, color: string) => {
        if (!el || el.dataset.cur === text) return;
        el.dataset.cur = text;
        gsap.to(el, {
          opacity: 0,
          y: SWAP_OUT.offsetY,
          duration: SWAP_OUT.duration,
          ease: SWAP_OUT.ease,
          overwrite: true,
          onComplete: () => {
            el.textContent = text;
            el.style.color = color;
            gsap.fromTo(
              el,
              { opacity: 0, y: SWAP_IN.offsetY },
              { opacity: 1, y: 0, duration: SWAP_IN.duration, ease: SWAP_IN.ease },
            );
          },
        });
      };

      const swapStatus = (el: HTMLElement | null, status: StatusLabel) =>
        swapText(el, status, STATUS_COLOR[status]);

      const otherRows = rows.filter((r) => !r.live).map((r) => r.row);
      let settled = false;
      let settleTimer: ReturnType<typeof setTimeout> | undefined;

      const trySettle = (p: number) => {
        if (p >= SETTLE_AT) {
          if (settled) return;
          settled = true;
          clearTimeout(settleTimer);
          settleTimer = setTimeout(() => {
            if (settled) {
              gsap.to(otherRows, {
                opacity: SETTLE_OPACITY,
                duration: SETTLE_DURATION,
                ease: "power2.out",
                overwrite: true,
              });
            }
          }, SETTLE_DELAY_MS);
        } else if (settled) {
          settled = false;
          clearTimeout(settleTimer);
          gsap.to(otherRows, {
            opacity: 1,
            duration: UNSETTLE_DURATION,
            ease: "power2.out",
            overwrite: true,
          });
        }
      };

      const applyProgress = (p: number) => {
        reveal(indicator, p >= LIVE_INDICATOR_AT);
        if (p >= TIMESTAMP_AGES_AT) {
          swapText(timestamp, "Updated moments ago", "rgba(245,251,247,.45)");
        }
        trySettle(p);

        rows.forEach(({ time, status, live }, i) => {
          reveal(time, p >= TIME_BASE_AT + i * TIME_STAGGER);

          if (live) {
            if (p < LIVE_ROW_VISIBLE_AT) {
              reveal(status, false);
              return;
            }
            reveal(status, true);
            const step = LIVE_ROW_SEQUENCE.find(({ until }) => p < until);
            if (step) swapStatus(status, step.status);
          } else if (i === rows.length - 1) {
            reveal(status, p >= LAST_ROW_STATUS_AT);
          } else {
            reveal(status, p >= STATUS_BASE_AT + i * STATUS_STAGGER);
          }
        });
      };

      let raf = 0;
      const compute = () => {
        const rect = track.getBoundingClientRect();
        const viewport = window.innerHeight;
        // Below 760px the design drops the pin: the track collapses to its own
        // height, leaving no pin budget to scrub against. Fall back to the
        // section's travel through the viewport so the story still plays out
        // on scroll instead of arriving all at once.
        const pinBudget = rect.height - viewport;
        const progress =
          pinBudget > viewport * MIN_PIN_RATIO
            ? -rect.top / pinBudget
            : (viewport - rect.top) / (viewport + rect.height);
        applyProgress(clamp01(progress));
      };
      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          compute();
        });
      };

      const lenis = getLenis();
      if (lenis) lenis.on("scroll", onScroll);
      else window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      compute();

      return () => {
        if (raf) cancelAnimationFrame(raf);
        clearTimeout(settleTimer);
        lenis?.off("scroll", onScroll);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }, stage);

    return () => ctx.revert();
  }, [trackRef, stageRef, reduce]);
}
