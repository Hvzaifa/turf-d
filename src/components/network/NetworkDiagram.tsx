import type { RefObject } from "react";

import { useReveal } from "../common/useReveal";

import { CARDS, CENTER } from "./networkContent";
import { NODE_POSITION, NODE_RADIUS, PATHS, type NodeId } from "./networkGeometry";
import { NodeCard } from "./NodeCard";

/**
 * The ring: six nodes, seven edges and a centre badge, with a card pinned
 * outside each node.
 *
 * Paths are drawn with `pathLength="1"` so a single dash of length 1 can be
 * offset by 1 to hide them, then animated to 0 to draw them — independent of
 * how long each curve actually is.
 */
export function NetworkDiagram({ rootRef }: { rootRef: RefObject<HTMLDivElement | null> }) {
  useReveal(rootRef);

  return (
    <div
      ref={rootRef}
      data-wtd-diagram
      data-reveal
      className="relative"
      style={{
        width: "65%",
        minWidth: "560px",
        maxWidth: "760px",
        aspectRatio: 1,
        margin: "clamp(84px,11vw,140px) auto 0",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <marker
            id="wtdArrow"
            viewBox="0 0 10 10"
            refX="7.5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="rgba(245,251,247,.4)" />
          </marker>
        </defs>

        {PATHS.map((path) => (
          <path
            key={path.id}
            data-wtd-path={path.id}
            d={path.d}
            fill="none"
            stroke={path.stroke}
            strokeWidth={path.strokeWidth}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
            markerEnd={path.arrow ? "url(#wtdArrow)" : undefined}
          />
        ))}

        {(Object.keys(NODE_POSITION) as NodeId[]).map((id) => {
          const { cx, cy } = NODE_POSITION[id];
          return (
            <circle
              key={id}
              data-wtd-node={id}
              cx={cx}
              cy={cy}
              r={NODE_RADIUS}
              fill="#F5FBF7"
              stroke="rgba(255,255,255,.22)"
              strokeWidth={0.15}
              opacity={0.38}
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                transform: "scale(.92)",
                transition:
                  "opacity .4s ease, transform .5s cubic-bezier(.22,1,.36,1), fill .4s ease",
                cursor: "pointer",
              }}
            />
          );
        })}

        {/* The travelling pulse, and the ring it leaves on arrival. */}
        <circle data-wtd-particle r={1.2} fill="#C6FF3C" opacity={0} />
        <circle data-wtd-pulse-ring r={1.4} fill="none" stroke="#7DEDBF" strokeWidth={0.28} opacity={0} />
      </svg>

      <div
        data-wtd-center
        className="absolute flex flex-col items-center justify-center text-center"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%) scale(.94)",
          opacity: 0,
          transition:
            "opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)",
          width: "clamp(98px,13.3vw,136px)",
          height: "clamp(98px,13.3vw,136px)",
          borderRadius: "999px",
          background: "radial-gradient(circle at 40% 32%,#0E7A4E,#04301F)",
          border: "1px solid rgba(198,255,60,.25)",
          boxShadow: "0 18px 40px -18px rgba(0,0,0,.6)",
          zIndex: 2,
        }}
      >
        {/* A span, not a heading — it inherits weight 400, unlike the h2s. */}
        <span
          className="font-display text-chalk"
          style={{ fontSize: "clamp(18px,3vw,28px)", letterSpacing: ".04em", lineHeight: 1 }}
        >
          {CENTER.title}
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: "9px",
            letterSpacing: ".22em",
            color: "#C6FF3C",
            marginTop: "5px",
          }}
        >
          {CENTER.caption}
        </span>
      </div>

      {CARDS.map((spec) => (
        <NodeCard key={spec.id} spec={spec} />
      ))}
    </div>
  );
}
