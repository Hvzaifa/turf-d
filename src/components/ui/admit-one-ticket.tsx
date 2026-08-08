import type { CSSProperties, ReactNode } from "react";
import { Water } from "@paper-design/shaders-react";

/**
 * An admit-one ticket: a torn-stub card with a caustic water field behind it.
 *
 * Adapted from the 21st.dev `admit-one-ticket` component, which inlines a copy
 * of `@paper-design/shaders`. We depend on the published package instead of
 * vendoring the bundle — same shaders, but it stays patchable and it does not
 * duplicate ~40kB of WebGL plumbing into our source tree.
 *
 * The field is `Water` rather than `Dithering`: the card should look like light
 * moving under a surface, not like a printed gradient. It runs slowly and
 * forever — a non-zero `speed` holds a `requestAnimationFrame` open for as long
 * as the mount lives, which is the price of the loop, so `shader={false}` (weak
 * devices, reduced motion) gets a painted still instead.
 *
 * The paper and the printing live together here. They were split into a
 * separate `TicketStock` when the hero fanned three sport-specific passes and
 * the stock had to stay identical across them; the hero shows one card now, so
 * the split was two files and a duplicated prop list to give one component one
 * caller. What the split allowed for and nothing used — a tear across the card
 * instead of down it, a full-face or absent wash — went with it.
 */

export type AdmitOneTicketProps = {
  /** Small mono line above the title — what kind of ticket this is. */
  kind: string;
  /** The headline on the ticket face. */
  title: string;
  /** The line under the title: time, venue, whatever the ticket is for. */
  detail: string;
  /** Printed down the torn stub. */
  stub: string;
  /** Serial in the bottom corner, mono. */
  serial: string;
  /** Offsets the shader so a stack of tickets is never in phase. */
  frame?: number;
  /** The card stock: the flat colour the caustics move over. */
  colorBack?: string;
  /** The light in the water — the caustic highlight picked out over the stock. */
  colorHighlight?: string;
  /**
   * The printing on the card. Must be a 6-digit hex: the type, the tear and
   * the stub are all set from it at fixed opacities, appended as an alpha
   * pair. Pale cards pass the dark ink; dark cards keep the default.
   */
  ink?: string;
  /** Set false to skip WebGL entirely and paint the field in CSS. */
  shader?: boolean;
  /** Rendered over the shader, under the text — used for the hero's grade. */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Where the stub is torn off, as a fraction of the ticket's width. */
const TEAR = 0.7;
/** The punched notches sit this far in from the tear line's ends. */
const NOTCH = "9px";

/**
 * Two circular bites out of the card at the tear line. A mask is the only way
 * to get real holes: the ticket sits over a photograph, so a notch painted in
 * a background colour would read as a coloured dot.
 *
 * Constant, because the tear is: it does not depend on a prop, so it is built
 * once at module load rather than memoised per mount.
 */
const NOTCH_MASK =
  `radial-gradient(circle ${NOTCH} at ${TEAR * 100}% 0%,transparent 97%,#000 100%),` +
  `radial-gradient(circle ${NOTCH} at ${TEAR * 100}% 100%,transparent 97%,#000 100%)`;

/**
 * WebGL2 is required by paper-shaders and is not universal (older iOS, some
 * locked-down desktop configs, and any browser with hardware acceleration
 * switched off). Probed once per session rather than per ticket.
 */
let webgl2Supported: boolean | null = null;
function supportsWebGL2(): boolean {
  if (webgl2Supported !== null) return webgl2Supported;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    webgl2Supported = Boolean(canvas.getContext("webgl2"));
  } catch {
    webgl2Supported = false;
  }
  return webgl2Supported;
}

export function AdmitOneTicket({
  kind,
  title,
  detail,
  stub,
  serial,
  frame = 0,
  colorBack = "#0A2418",
  colorHighlight = "#34D498",
  ink = "#F5FBF7",
  shader = true,
  children,
  className,
  style,
}: AdmitOneTicketProps) {
  const shaded = shader && supportsWebGL2();

  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: "1.72 / 1",
        borderRadius: "10px",
        overflow: "hidden",
        background: colorBack,
        maskImage: NOTCH_MASK,
        WebkitMaskImage: NOTCH_MASK,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
        ...style,
      }}
    >
      {shaded ? (
        <Water
          // Slow enough that the card reads as still until you look at it.
          speed={0.28}
          frame={frame}
          fit="cover"
          scale={1.1}
          size={0.62}
          caustic={0.42}
          waves={0.55}
          layering={0.35}
          edges={0.5}
          highlights={0.32}
          colorBack={colorBack}
          colorHighlight={colorHighlight}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      ) : (
        // No WebGL2: a painted approximation, so the ticket still reads as a
        // printed card rather than a flat rectangle.
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              `radial-gradient(ellipse 90% 120% at 18% 8%,${colorHighlight}55,transparent 62%),` +
              `radial-gradient(ellipse 70% 90% at 88% 96%,${colorHighlight}33,transparent 58%),` +
              colorBack,
          }}
        />
      )}

      {/*
        The caustics move, and type over a moving field is type you have to
        read twice. The stock is laid back over the top and bottom bands where
        the printing sits, and the middle of the card — where there is nothing
        to read — is left clear so the water still shows.
      */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            `linear-gradient(180deg,${colorBack}b3 0%,${colorBack}00 30%,` +
            `${colorBack}00 52%,${colorBack}e0 100%)`,
        }}
      />

      {children}

      {/* The tear: a dashed rule between the two notches. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: NOTCH,
          bottom: NOTCH,
          left: `${TEAR * 100}%`,
          width: "1px",
          backgroundImage:
            `repeating-linear-gradient(180deg,${ink}80 0 4px,transparent 4px 9px)`,
        }}
      />

      {/* Face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          right: `${(1 - TEAR) * 100}%`,
          display: "flex",
          flexDirection: "column",
          padding: "13px 14px",
        }}
      >
        <div
          className="font-mono uppercase"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            fontSize: "8px",
            letterSpacing: ".22em",
            color: `${ink}d9`,
          }}
        >
          <span>{kind}</span>
          <span style={{ letterSpacing: ".16em", color: `${ink}99` }}>
            {serial}
          </span>
        </div>

        <div
          className="font-display uppercase"
          style={{
            marginTop: "auto",
            fontSize: "clamp(17px,1.75vw,22px)",
            lineHeight: 0.94,
            letterSpacing: "-.01em",
            color: ink,
          }}
        >
          {title}
        </div>

        <div
          className="font-mono uppercase"
          style={{
            marginTop: "6px",
            fontSize: "8.5px",
            letterSpacing: ".14em",
            color: `${ink}e6`,
          }}
        >
          {detail}
        </div>
      </div>

      {/* Stub */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: `${(1 - TEAR) * 100}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(90deg,${colorBack}00,${colorBack}cc 38%)`,
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            transform: "rotate(90deg)",
            whiteSpace: "nowrap",
            fontSize: "8px",
            letterSpacing: ".3em",
            color: `${ink}e6`,
          }}
        >
          {stub}
        </span>
      </div>
    </div>
  );
}
