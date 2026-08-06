import { useRef } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import { RevealOnScroll } from "../common/RevealOnScroll";
import { ChatBubble } from "./ChatBubble";
import { BRIDGE_LINE, CONVERSATION, EYEBROW, HEADLINE, LEAD } from "./problemContent";
import { TRIGGER_HEIGHT } from "./problemMotion";
import { useRecognitionScrub } from "./useRecognitionScrub";

/**
 * Recognition — the hero dissolves into the moment every game actually begins.
 *
 * The stage is pinned with `position: sticky` while a 200vh trigger below it
 * supplies the scroll budget. The conversation plays out across the first half
 * of that budget, then dims and blurs as the bridge line surfaces over it as
 * the new headline.
 */
export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const profile = useMotionProfile();

  useRecognitionScrub({ sectionRef, triggerRef, contentRef, lineRef, profile });

  return (
    <section
      ref={sectionRef}
      aria-label="How every game gets organized"
      data-recog
      className="relative"
      style={{
        background: "linear-gradient(180deg,#0a1f18 0%,#071a12 26%,#04120C 100%)",
      }}
    >
      <div
        data-recog-stage
        className="sticky top-0 flex items-center overflow-hidden"
        style={{
          height: "100svh",
          minHeight: "100svh",
          padding: "clamp(48px,6vh,100px) clamp(20px,3.5vw,48px)",
        }}
      >
        <div
          ref={contentRef}
          data-recog-content
          className="mx-auto flex w-full flex-nowrap items-center"
          style={{
            maxWidth: "1200px",
            gap: "clamp(16px,3vw,56px)",
            transition: "opacity 1.6s ease,filter 1.6s ease",
          }}
        >
          {/* Left — editorial */}
          <RevealOnScroll className="min-w-0 flex-[1_1_300px]">
            <div
              className="font-mono uppercase"
              style={{
                fontSize: "12px",
                letterSpacing: ".28em",
                color: "#34D498",
                opacity: 0.9,
              }}
            >
              {EYEBROW}
            </div>

            <h2
              className="font-sans font-semibold text-chalk"
              style={{
                fontSize: "clamp(1.7rem,4.2vw,4.6rem)",
                lineHeight: 1.05,
                letterSpacing: "-.025em",
                margin: "clamp(14px,2vw,32px) 0 0",
                textWrap: "balance",
              }}
            >
              {HEADLINE[0]}
              <br />
              {HEADLINE[1]}
            </h2>

            <div
              className="flex flex-col"
              style={{
                maxWidth: "38ch",
                margin: "clamp(16px,2.6vw,42px) 0 0",
                gap: "8px",
                fontSize: "clamp(12px,1vw,19px)",
                lineHeight: 1.5,
                color: "#A9C6B7",
              }}
            >
              {LEAD.map((line) => (
                <p key={line} style={{ margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>
          </RevealOnScroll>

          {/* Right — the chat, held in one quiet column */}
          <div
            data-recog-convo
            className="flex w-full min-w-0 flex-[1_1_320px] flex-col"
            style={{
              maxWidth: "480px",
              marginLeft: "clamp(-40px,-3vw,0px)",
              gap: "clamp(8px,1.6vw,26px)",
            }}
          >
            {CONVERSATION.map((message) => (
              <ChatBubble key={message.text} {...message} />
            ))}
          </div>
        </div>

        {/* The bridge, centred over the dimmed conversation */}
        <div
          ref={lineRef}
          data-recog-line
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-center"
          style={{ padding: "clamp(22px,5vw,56px)" }}
        >
          <p
            className="font-sans font-medium text-chalk"
            style={{
              margin: 0,
              maxWidth: "16ch",
              fontSize: "clamp(2.1rem,5.4vw,4rem)",
              lineHeight: 1.12,
              letterSpacing: "-.03em",
              textWrap: "balance",
            }}
          >
            {BRIDGE_LINE}
            <span style={{ color: "#34D498" }}>.</span>
          </p>
        </div>
      </div>

      {/* Pins the stage long enough for the reveal to happen on scroll */}
      <div ref={triggerRef} data-recog-trigger aria-hidden="true" style={{ height: TRIGGER_HEIGHT }} />
    </section>
  );
}
