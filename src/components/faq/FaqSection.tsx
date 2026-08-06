import { useState } from "react";

import { RevealOnScroll } from "../common/RevealOnScroll";
import { EYEBROW, FAQ, HEADLINE } from "./faqContent";
import { FaqItem } from "./FaqItem";
import { useTypewriter } from "./useTypewriter";

/**
 * Questions, answered — as a conversation.
 *
 * Exactly one answer is open at a time and it types itself out; re-selecting
 * the open question replays it, which is why the typewriter is keyed by a
 * counter rather than by the index alone.
 */
export function FaqSection() {
  const [open, setOpen] = useState(0);
  const [replay, setReplay] = useState(0);
  const { typed, typing } = useTypewriter(FAQ[open].a, replay);

  const select = (index: number) => {
    setOpen(index);
    setReplay((n) => n + 1);
  };

  return (
    <section
      id="faq"
      className="mx-auto"
      style={{ maxWidth: "820px", padding: "clamp(96px,13vw,150px) clamp(20px,4vw,40px)" }}
    >
      <RevealOnScroll>
        <span
          className="font-mono uppercase"
          style={{ fontSize: "12px", letterSpacing: ".28em", color: "#34D498" }}
        >
          {EYEBROW}
        </span>
        <h2
          className="font-display font-bold uppercase"
          style={{
            fontSize: "clamp(2.4rem,6vw,4.8rem)",
            lineHeight: 0.95,
            letterSpacing: "-.01em",
            margin: "16px 0 44px",
          }}
        >
          {HEADLINE.lead}
          <span style={{ color: "#34D498", textShadow: "0 0 40px rgba(52,212,152,.5)" }}>
            {HEADLINE.accent}
          </span>
        </h2>
      </RevealOnScroll>

      <div className="flex flex-col" style={{ gap: "26px" }}>
        {FAQ.map((entry, index) => (
          <FaqItem
            key={entry.q}
            {...entry}
            open={index === open}
            typed={index === open ? typed : ""}
            typing={index === open && typing}
            onOpen={() => select(index)}
          />
        ))}
      </div>
    </section>
  );
}
