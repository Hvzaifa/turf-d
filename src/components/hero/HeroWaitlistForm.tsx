import { useState, type FormEvent } from "react";

export type HeroWaitlistFormProps = {
  /** Resolves when the address has been accepted; rejects to show nothing. */
  onSubmit?: (email: string) => void | Promise<void>;
};

/**
 * The hero's inline waitlist capture: a single underlined field that gives way
 * to a quiet confirmation line once submitted.
 */
export function HeroWaitlistForm({ onSubmit }: HeroWaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit?.(email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="font-mono text-[12px] tracking-[.16em] uppercase"
        style={{
          padding: "6px 0",
          color: "rgba(245,251,247,.62)",
          animation: "fadeUpQuiet 1.4s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        See you under the lights.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-[26px]">
      <label className="sr-only" htmlFor="hero-waitlist-email">
        Email address
      </label>
      {/* The placeholder colour is stated explicitly: the design was drawn
          against the UA default (#757575), and Preflight's `currentColor 50%`
          reads greener and brighter over the pitch. */}
      <input
        id="hero-waitlist-email"
        type="email"
        required
        placeholder="you@team.pk"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="min-w-0 border-none bg-transparent py-2.25 text-[16px] text-chalk outline-none transition-[border-color] duration-140 [border-bottom:1px_solid_rgba(245,251,247,.28)] placeholder:text-[#757575] focus:border-b-[rgba(214,209,142,.7)]"
        style={{ width: "min(58vw,236px)" }}
      />
      <button
        type="submit"
        className="cursor-pointer border-none bg-transparent py-2.25 text-[15px] font-semibold whitespace-nowrap text-[#D6D18E] transition-[border-color,color] duration-140 [border-bottom:1px_solid_rgba(214,209,142,.4)] hover:border-b-[#D6D18E] hover:text-[#E6E2AC]"
      >
        Join the waitlist
      </button>
    </form>
  );
}
