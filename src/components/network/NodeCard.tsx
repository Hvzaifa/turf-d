import type { CSSProperties } from "react";

import { CardIcon } from "./CardIcon";
import type { Chip, CardSpec } from "./networkContent";
import { CARD_BASE_TRANSFORM, CARD_POSITION } from "./networkGeometry";

const CHIP_SURFACE: Record<Chip["tone"], CSSProperties> = {
  bare: { color: "#9EBDAE" },
  plain: { background: "rgba(255,255,255,.06)", color: "#9EBDAE", padding: "2px 7px", borderRadius: "999px" },
  mint: { background: "rgba(52,212,152,.15)", color: "#34D498", padding: "2px 7px", borderRadius: "999px" },
  amber: { background: "rgba(255,178,122,.15)", color: "#FFB27A", padding: "2px 7px", borderRadius: "999px" },
  lime: { background: "rgba(198,255,60,.15)", color: "#C6FF3C", padding: "2px 7px", borderRadius: "999px" },
};

/** Chips that wait for the pulse fade in on a slight delay behind the node. */
const DOT_TRANSITION = "opacity .4s ease .15s";

function FooterChip({ chip }: { chip: Chip }) {
  return (
    <span
      data-wtd-dot={chip.dot ? "" : undefined}
      className="font-mono"
      style={{
        fontSize: "9.5px",
        ...CHIP_SURFACE[chip.tone],
        ...(chip.dot ? { opacity: 0, transition: DOT_TRANSITION } : null),
      }}
    >
      {chip.text}
    </span>
  );
}

/**
 * The label side of the header: glyph plus its caption. Right-aligned cards
 * mirror it, so the glyph always sits on the card's outer edge.
 */
function CardLabel({
  icon,
  label,
  align,
}: {
  icon: CardSpec["icon"];
  label: string;
  align: CardSpec["align"];
}) {
  const caption = (
    <span
      className="font-mono uppercase"
      style={{ fontSize: "9px", letterSpacing: ".16em", color: "rgba(245,251,247,.42)" }}
    >
      {label}
    </span>
  );

  return (
    <div className="flex items-center" style={{ gap: "5px" }}>
      {align === "right" ? (
        <>
          {caption}
          <CardIcon icon={icon} />
        </>
      ) : (
        <>
          <CardIcon icon={icon} />
          {caption}
        </>
      )}
    </div>
  );
}

function CardMeta({ meta }: { meta: Chip }) {
  if (meta.tone === "bare") {
    return (
      <span className="font-mono" style={{ fontSize: "9px", color: "rgba(245,251,247,.35)" }}>
        {meta.text}
      </span>
    );
  }
  return (
    <span
      data-wtd-dot={meta.dot ? "" : undefined}
      className="font-mono"
      style={{
        fontSize: "9px",
        ...CHIP_SURFACE[meta.tone],
        // The header badge is a touch tighter than the footer chips.
        padding: "1px 6px",
        ...(meta.dot ? { opacity: 0, transition: DOT_TRANSITION } : null),
      }}
    >
      {meta.text}
    </span>
  );
}

/**
 * One of the six cards ringing the diagram. It renders dimmed and offset; the
 * chain animation lifts it as the pulse reaches its node.
 */
export function NodeCard({ spec }: { spec: CardSpec }) {
  const { id, icon, label, meta, title, titleDot, titleColor, chips, align } = spec;
  const right = align === "right";
  const base = CARD_BASE_TRANSFORM[id];

  return (
    <div
      data-wtd-card={id}
      className="absolute cursor-pointer"
      style={{
        ...CARD_POSITION[id],
        transform: `${base ? `${base} ` : ""}translateY(12px)`,
        opacity: 0,
        transition:
          "opacity .5s cubic-bezier(.22,1,.36,1), transform .56s cubic-bezier(.3,1.4,.4,1)",
        width: "clamp(154px,20vw,184px)",
        background: "#06180F",
        border: "1px solid rgba(255,255,255,.09)",
        borderRadius: "10px",
        padding: "10px 12px",
        boxShadow: "0 10px 24px -14px rgba(0,0,0,.45)",
        textAlign: align,
        zIndex: 1,
      }}
    >
      {/* Right-aligned cards mirror the header: meta first, then the label. */}
      <div className="flex items-center justify-between" style={{ gap: "8px" }}>
        {right ? (
          <>
            <CardMeta meta={meta} />
            <CardLabel icon={icon} label={label} align={align} />
          </>
        ) : (
          <>
            <CardLabel icon={icon} label={label} align={align} />
            <CardMeta meta={meta} />
          </>
        )}
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,.08)", margin: "8px 0" }} />

      <div
        data-wtd-dot={titleDot ? "" : undefined}
        className="font-sans font-semibold"
        style={{
          fontSize: "13.5px",
          color: titleColor ?? "#F5FBF7",
          ...(titleDot
            ? { letterSpacing: ".05em", opacity: 0, transition: DOT_TRANSITION }
            : null),
        }}
      >
        {title}
      </div>

      <div
        className={`flex items-center ${right ? "justify-end" : ""}`}
        style={{ gap: "6px", marginTop: "6px" }}
      >
        {chips.map((chip) => (
          <FooterChip key={chip.text} chip={chip} />
        ))}
      </div>
    </div>
  );
}
