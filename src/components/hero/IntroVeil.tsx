import { useEffect, useRef } from "react";

/**
 * The film open: the place emerges from black, only the floodlight glowing
 * first. It is a one-shot, so it removes itself once it has played rather than
 * lingering as a full-screen composited layer.
 */
export function IntroVeil({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduce) {
      el.style.display = "none";
      return;
    }

    const onEnd = () => {
      el.style.display = "none";
    };
    el.addEventListener("animationend", onEnd, { once: true });
    return () => el.removeEventListener("animationend", onEnd);
  }, [reduce]);

  return (
    <div
      ref={ref}
      data-layer="intro-veil"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-8 opacity-0"
      style={{
        background:
          "radial-gradient(ellipse 52% 48% at 60% 33%,rgba(40,46,28,.42),rgba(3,9,6,.99) 62%),#020603",
        // 1.6s, not the design's 4.6s: the hero has to be legible in three
        // seconds, and a four-second black frame spends all of them.
        animation: "introLift 1.6s cubic-bezier(.42,0,.3,1) both",
      }}
    />
  );
}
