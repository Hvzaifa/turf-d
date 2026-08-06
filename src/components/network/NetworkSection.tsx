import { useRef } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import { RevealOnScroll } from "../common/RevealOnScroll";
import { EYEBROW, HEADLINE, LEAD } from "./networkContent";
import { NetworkDiagram } from "./NetworkDiagram";
import { NetworkList } from "./NetworkList";
import { useNetworkChain } from "./useNetworkChain";

/**
 * Why Turf'd — one tap, and an entire evening moves.
 *
 * A single booking is traced around the six systems it sets off, in order.
 * Below 760px the diagram is replaced by a numbered list (see index.css).
 */
export function NetworkSection() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const profile = useMotionProfile();

  useNetworkChain({ rootRef: diagramRef, profile });

  return (
    <section
      id="why-turf-d"
      className="relative overflow-hidden"
      style={{ padding: "clamp(110px,14vw,175px) clamp(20px,4vw,40px)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 42% at 50% 58%,rgba(16,96,67,.055),transparent 74%)",
        }}
      />

      <div className="relative mx-auto" style={{ maxWidth: "1120px" }}>
        <RevealOnScroll
          className="text-center"
          style={{ maxWidth: "640px", margin: "0 auto" }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: ".28em",
              color: "rgba(245,251,247,.5)",
            }}
          >
            {EYEBROW}
          </span>

          <h2
            className="font-display font-bold uppercase"
            style={{
              fontSize: "clamp(2.4rem,6vw,4.8rem)",
              lineHeight: 0.95,
              letterSpacing: "-.01em",
              margin: "16px 0 0",
            }}
          >
            <span style={{ color: "#C6FF3C" }}>{HEADLINE.accent}</span>
            <br />
            {HEADLINE.rest}
          </h2>

          <p
            style={{
              color: "rgba(245,251,247,.7)",
              fontSize: "clamp(16px,1.5vw,18px)",
              lineHeight: 1.6,
              margin: "20px auto 0",
              maxWidth: "520px",
            }}
          >
            {LEAD}
          </p>
        </RevealOnScroll>

        <NetworkDiagram rootRef={diagramRef} />
        <NetworkList />
      </div>
    </section>
  );
}
