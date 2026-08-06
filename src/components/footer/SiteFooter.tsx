import { useRef } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import { RevealOnScroll } from "../common/RevealOnScroll";
import { BALLS } from "./ballPitProfiles";
import { useBallPit } from "./useBallPit";

const TAGLINE = "One Tap. Every Game.";

const LINKS = [
  { label: "About", href: "#" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "mailto:hello@turfd.pk" },
];

const COLOPHON = ["Launching first in Islamabad.", "© Turf'd 2026"];

export function SiteFooter() {
  const stageRef = useRef<HTMLDivElement>(null);
  const profile = useMotionProfile();

  useBallPit({ stageRef, profile });

  return (
    <footer
      className="relative"
      style={{
        background: "#050F0B",
        borderTop: "1px solid rgba(255,255,255,.06)",
        padding: "clamp(96px,11vw,132px) clamp(20px,4vw,40px) clamp(32px,4vw,40px)",
      }}
    >
      <RevealOnScroll
        className="mx-auto flex flex-wrap items-baseline justify-between"
        style={{ maxWidth: "1120px", gap: "24px" }}
      >
        <div>
          <div
            className="font-display text-chalk"
            style={{ fontSize: "26px", letterSpacing: ".06em" }}
          >
            TURF'D
          </div>
          <p style={{ color: "rgba(245,251,247,.32)", fontSize: "13px", margin: "10px 0 0" }}>
            {TAGLINE}
          </p>
        </div>
        <div className="flex flex-wrap" style={{ gap: "8px 30px", fontSize: "13.5px" }}>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-140 hover:text-mint"
              style={{ color: "rgba(245,251,247,.4)" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </RevealOnScroll>

      {/* The ball pit — decorative, and driven entirely by the physics hook. */}
      <div
        ref={stageRef}
        data-phys-stage
        aria-hidden="true"
        className="relative mx-auto"
        style={{
          maxWidth: "1120px",
          margin: "clamp(40px,6vw,60px) auto 0",
          height: "clamp(260px,32vw,340px)",
        }}
      >
        {BALLS.map((ball) => (
          <img
            key={ball.key}
            data-phys-item={ball.key}
            src={ball.src}
            alt=""
            className="absolute top-0 left-0"
            style={{
              width: `${ball.w}px`,
              height: `${ball.h}px`,
              filter:
                ball.w >= 52
                  ? "drop-shadow(0 8px 10px rgba(0,0,0,.45))"
                  : "drop-shadow(0 6px 8px rgba(0,0,0,.45))",
            }}
          />
        ))}
      </div>

      <div
        className="mx-auto flex flex-wrap justify-between font-mono"
        style={{
          maxWidth: "1120px",
          margin: "clamp(28px,4vw,36px) auto 0",
          paddingTop: "20px",
          borderTop: "1px solid rgba(255,255,255,.05)",
          gap: "10px",
          fontSize: "10px",
          letterSpacing: ".08em",
          color: "rgba(245,251,247,.25)",
        }}
      >
        {COLOPHON.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </footer>
  );
}
