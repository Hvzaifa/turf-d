import { RevealOnScroll } from "../common/RevealOnScroll";
import type { FaqEntry } from "./faqContent";

/** The three bouncing dots shown while the reply is being "written". */
function TypingDots() {
  return (
    <div className="flex" style={{ gap: "5px", padding: "4px 0" }}>
      {[0, 0.2, 0.4].map((delay) => (
        <span
          key={delay}
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "999px",
            background: "#7DEDBF",
            animation: `typedot 1.2s ease-in-out ${delay ? `${delay}s ` : ""}infinite`,
          }}
        />
      ))}
    </div>
  );
}

export type FaqItemProps = FaqEntry & {
  open: boolean;
  typed: string;
  typing: boolean;
  onOpen: () => void;
};

/**
 * One exchange, set as a chat: your question on the right, Turf'd's reply on
 * the left. Only the open item shows a reply, and it types itself out.
 */
export function FaqItem({ q, open, typed, typing, onOpen }: FaqItemProps) {
  return (
    <RevealOnScroll>
      <div
        onClick={onOpen}
        className="flex cursor-pointer items-start justify-end"
        style={{ gap: "12px" }}
      >
        <div
          className="transition-[background,border-color] duration-140 hover:border-[rgba(255,255,255,.22)] hover:bg-[rgba(255,255,255,.08)]"
          style={{
            maxWidth: "min(80%,540px)",
            padding: "14px 20px",
            borderRadius: "22px 22px 6px 22px",
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.12)",
            overflowWrap: "anywhere",
          }}
        >
          <div
            className="font-mono uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: ".15em",
              color: "rgba(245,251,247,.4)",
              marginBottom: "4px",
            }}
          >
            You
          </div>
          <div style={{ fontSize: "clamp(15px,1.6vw,18px)", lineHeight: 1.6 }}>{q}</div>
        </div>

        <div
          className="flex flex-shrink-0 items-center justify-center font-bold"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "999px",
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.12)",
            fontSize: "14px",
          }}
        >
          U
        </div>
      </div>

      {open && (
        <div className="flex items-start" style={{ gap: "12px", marginTop: "14px" }}>
          <div
            className="flex flex-shrink-0 items-center justify-center font-display"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "999px",
              background: "radial-gradient(circle at 35% 30%,#7DEDBF,#34D498 60%,#106043)",
              fontSize: "18px",
              color: "#04301F",
              boxShadow: "0 0 18px rgba(52,212,152,.6)",
            }}
          >
            T
          </div>
          <div
            style={{
              maxWidth: "min(82%,560px)",
              padding: "16px 20px",
              borderRadius: "22px 22px 22px 6px",
              background: "linear-gradient(135deg,#106043,#0A3A26)",
              boxShadow: "0 10px 40px -10px rgba(16,96,67,.8)",
              overflowWrap: "anywhere",
            }}
          >
            <div
              className="font-mono uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: ".15em",
                color: "#7DEDBF",
                marginBottom: "6px",
              }}
            >
              Turf'd
            </div>
            {typing && <TypingDots />}
            <div style={{ fontSize: "16px", lineHeight: 1.55, color: "#F5FBF7" }}>{typed}</div>
          </div>
        </div>
      )}
    </RevealOnScroll>
  );
}
