import { useRef } from "react";

import { useReveal } from "../common/useReveal";
import { JOURNEY } from "./networkContent";

/**
 * The narrow-viewport stand-in for the diagram: the same six systems as a
 * numbered timeline. Swapped in by the section's media query, never both.
 */
export function NetworkList() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);

  return (
    <div
      ref={ref}
      data-wtd-list
      data-reveal
      className="relative flex-col"
      style={{
        display: "none",
        gap: 0,
        maxWidth: "420px",
        margin: "clamp(60px,9vw,90px) auto 0",
        paddingLeft: "28px",
      }}
    >
      <div
        className="absolute"
        style={{ left: "6px", top: "8px", bottom: "8px", width: "1px", background: "rgba(255,255,255,.15)" }}
      />
      {JOURNEY.map((step, i) => (
        <div
          key={step.title}
          className="relative"
          style={{ padding: i === JOURNEY.length - 1 ? 0 : "0 0 28px" }}
        >
          <span
            className="absolute flex items-center justify-center font-mono"
            style={{
              left: "-28px",
              top: "2px",
              width: "14px",
              height: "14px",
              borderRadius: "999px",
              background: "#04120C",
              border: "1px solid rgba(255,255,255,.28)",
              fontSize: "6px",
              color: "rgba(245,251,247,.55)",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3
            className="m-0 font-sans font-semibold text-chalk"
            style={{ fontSize: "15px" }}
          >
            {step.title}
          </h3>
          <p style={{ color: "#9EBDAE", fontSize: "13px", lineHeight: 1.6, margin: "4px 0 0" }}>
            {step.body}
          </p>
        </div>
      ))}
    </div>
  );
}
