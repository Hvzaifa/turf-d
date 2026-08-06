import type { CSSProperties } from "react";

import type { ChatMessage } from "./problemContent";

const SURFACE = {
  them: "rgba(255,255,255,.06)",
  us: "rgba(255,255,255,.07)",
} as const;

/** Body copy shared by every bubble except the payoff. */
const BODY: CSSProperties = {
  fontSize: "clamp(.82rem,1.3vw,1.25rem)",
  lineHeight: 1.45,
  letterSpacing: "-.01em",
  color: "#D8E8DF",
};

/** The closing line is set at display size and carries its own colour. */
const PAYOFF: CSSProperties = {
  maxWidth: "82%",
  marginTop: "clamp(22px,4vw,44px)",
  padding: "11px 16px",
  borderRadius: "14px",
  background: "rgba(255,255,255,.09)",
  fontWeight: 600,
  fontSize: "clamp(1.05rem,2.2vw,2.1rem)",
  lineHeight: 1.15,
  letterSpacing: "-.02em",
  color: "#F5FBF7",
};

/**
 * One line of the conversation. Opacity and transform are owned by the scroll
 * scrub, so nothing here sets either.
 */
export function ChatBubble({ text, side, opener, payoff }: ChatMessage) {
  const right = side === "us";

  const style: CSSProperties = payoff
    ? { alignSelf: "flex-end", textAlign: "right", ...PAYOFF }
    : {
        alignSelf: right ? "flex-end" : "flex-start",
        textAlign: right ? "right" : undefined,
        maxWidth: "78%",
        padding: opener ? "13px 19px" : "9px 14px",
        borderRadius: opener ? "16px" : "14px",
        background: SURFACE[side],
        ...BODY,
      };

  return (
    <div data-recog-msg style={style}>
      {text}
    </div>
  );
}
