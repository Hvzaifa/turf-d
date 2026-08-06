import { useEffect, useRef } from "react";

import { getLenis } from "../../lib/motion/useSmoothScroll";

/** Scroll depth past which the bar takes on a background. */
const SOLID_AT = 60;
/** How long after the last scroll tick the bar returns to full opacity. */
const SETTLE_MS = 90;

/**
 * The fixed top bar. It is transparent over the hero and picks up a background
 * once you have scrolled past it, dimming very slightly while in motion.
 *
 * The bar deliberately does not parallax: translating a backdrop-filtered
 * element forces a per-frame backdrop re-blur, which is not worth ±2px of drift.
 */
export function SiteNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;

    let solid: boolean | null = null;
    let lastY = -1;
    let settle: ReturnType<typeof setTimeout>;

    const update = () => {
      const y = getLenis()?.scroll ?? window.scrollY;

      const nextSolid = y > SOLID_AT;
      if (nextSolid !== solid) {
        solid = nextSolid;
        nav.style.background = nextSolid ? "rgba(4,48,31,.94)" : "transparent";
        nav.style.borderBottom = nextSolid
          ? "1px solid rgba(255,255,255,.06)"
          : "1px solid transparent";
      }

      if (y !== lastY) {
        lastY = y;
        nav.style.opacity = "0.9";
        clearTimeout(settle);
        settle = setTimeout(() => {
          nav.style.opacity = "1";
        }, SETTLE_MS);
      }
    };

    const lenis = getLenis();
    if (lenis) lenis.on("scroll", update);
    else window.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      clearTimeout(settle);
      lenis?.off("scroll", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <nav
      ref={ref}
      className="fixed top-0 right-0 left-0 flex items-center justify-between"
      style={{
        zIndex: 60,
        padding: "18px clamp(20px,4vw,40px)",
        transition: "background .4s,backdrop-filter .4s,opacity .25s ease",
      }}
    >
      <a href="#hero" className="flex items-center" style={{ gap: "12px", color: "#F5FBF7" }}>
        <span className="font-display" style={{ fontSize: "23px", letterSpacing: ".14em" }}>
          TURF'D
        </span>
      </a>
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="flex flex-col items-center justify-center"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "999px",
          background: "rgba(10,58,38,.62)",
          border: "1px solid rgba(255,255,255,.12)",
          gap: "5px",
        }}
      >
        <span style={{ width: "20px", height: "2px", background: "#F5FBF7", display: "block" }} />
        <span style={{ width: "20px", height: "2px", background: "#F5FBF7", display: "block" }} />
      </button>
    </nav>
  );
}
