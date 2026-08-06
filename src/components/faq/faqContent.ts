/** FAQ copy — design/project/Turfd Landing.dc.html §496–531 and `this.faq`. */

export const EYEBROW = "Questions, answered";
export const HEADLINE = { lead: "Ask the ", accent: "team." };

export type FaqEntry = { q: string; a: string };

export const FAQ: readonly FaqEntry[] = [
  {
    q: "Yaar, when do you actually launch?",
    a: "We're booting up in Islamabad in Q4 2026, with Lahore and Karachi rolling out weeks later. Waitlist members get 3 days of early access before the public open.",
  },
  {
    q: "Which cities are you starting with?",
    a: "Islamabad first — full coverage of F-sectors, Bahria and DHA. Lahore + Karachi close behind. Drop your city when you join and we'll prioritise onboarding there.",
  },
  {
    q: "Is it free to join the waitlist?",
    a: "100% free. Waitlist members get founder pricing (locked forever), zero booking fees for the first 3 months, and a private community channel.",
  },
  {
    q: "How do mobile wallet payments actually work?",
    a: "One tap. Pick EasyPaisa or JazzCash at checkout, confirm on your wallet, done. Owners are settled instantly — no 5-day bank clearing, no ledger hassle.",
  },
];
