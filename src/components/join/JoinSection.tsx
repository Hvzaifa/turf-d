import { useState, type FormEvent } from "react";

import grainUrl from "../../assets/hero/grain.webp";
import { RevealOnScroll } from "../common/RevealOnScroll";

const EYEBROW = "Early Access";
const HEADLINE = "Your next game shouldn't start with three phone calls.";
const LEAD =
  "Leave your email and be among the first players to experience a simpler way to discover, book and play. Launching first in Islamabad.";
const CONFIRMATION = {
  headline: "✓ You're in.",
  body: "We'll let you know when evenings get easier.",
};
const FOOTNOTES = [
  "Launching first in Islamabad",
  "Android First",
  "No spam",
  "Unsubscribe anytime",
];

export type JoinSectionProps = {
  /** Called with the submitted address before the confirmation swaps in. */
  onSubmit?: (email: string) => void | Promise<void>;
};

/** Early access — the page's closing call to action. */
export function JoinSection({ onSubmit }: JoinSectionProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit?.(email);
    setSubmitted(true);
  };

  return (
    <section
      id="join"
      className="relative overflow-hidden text-center"
      style={{
        background: "#050F0B",
        padding: "clamp(140px,18vw,220px) clamp(20px,4vw,40px)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%,rgba(16,96,67,.16) 0%,transparent 68%)",
        }}
      />
      <div
        data-layer="grain"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.035,
          backgroundImage: `url(${grainUrl})`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px",
        }}
      />

      <RevealOnScroll
        className="relative mx-auto"
        style={{ maxWidth: "680px", margin: "0 auto" }}
      >
        <span
          className="block font-mono uppercase"
          style={{ fontSize: "11px", letterSpacing: ".32em", color: "rgba(245,251,247,.45)" }}
        >
          {EYEBROW}
        </span>
        <h2
          className="font-display font-bold text-chalk uppercase"
          style={{
            fontSize: "clamp(2.1rem,4.6vw,3.6rem)",
            lineHeight: 1.08,
            letterSpacing: "-.005em",
            margin: "26px 0 0",
            textWrap: "balance",
          }}
        >
          {HEADLINE}
        </h2>
        <p
          style={{
            color: "rgba(245,251,247,.6)",
            fontSize: "clamp(15px,1.2vw,17px)",
            lineHeight: 1.7,
            maxWidth: "46ch",
            margin: "22px auto 0",
          }}
        >
          {LEAD}
        </p>

        {submitted ? (
          <div
            data-cta-result
            style={{
              margin: "40px auto 0",
              maxWidth: "420px",
              animation: "fadeUpQuiet .5s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <div
              className="font-bold"
              style={{
                padding: "17px 28px",
                borderRadius: "10px",
                background: "linear-gradient(180deg,#34D498,#106043)",
                color: "#04301F",
                fontSize: "16px",
              }}
            >
              {CONFIRMATION.headline}
            </div>
            <p style={{ color: "rgba(245,251,247,.5)", fontSize: "13px", margin: "14px 0 0" }}>
              {CONFIRMATION.body}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex items-stretch"
            style={{ gap: "10px", margin: "40px auto 0", maxWidth: "420px" }}
          >
            <label className="sr-only" htmlFor="join-email">
              Email address
            </label>
            <input
              id="join-email"
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-w-0 flex-1 text-chalk outline-none placeholder:text-[#757575]"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: "8px",
                fontSize: "15px",
                padding: "15px 18px",
              }}
            />
            <button
              type="submit"
              className="border-none font-bold whitespace-nowrap transition-[filter,transform,box-shadow] duration-140 hover:-translate-y-px hover:brightness-105 active:translate-y-0 active:[box-shadow:inset_0_1px_0_rgba(255,255,255,.2),0_1px_1px_rgba(0,0,0,.18)]"
              style={{
                padding: "15px 26px",
                borderRadius: "8px",
                background: "#34D498",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,.35),0 1px 2px rgba(0,0,0,.18),0 6px 14px -6px rgba(0,0,0,.35)",
                color: "#04301F",
                fontSize: "15px",
              }}
            >
              Get Early Access
            </button>
          </form>
        )}

        <div
          className="flex flex-wrap justify-center font-mono uppercase"
          style={{
            gap: "8px 22px",
            marginTop: "34px",
            fontSize: "10.5px",
            letterSpacing: ".1em",
            color: "rgba(245,251,247,.35)",
          }}
        >
          {FOOTNOTES.map((note) => (
            <span key={note}>{note}</span>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
