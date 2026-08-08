import { useRef, type PointerEvent as ReactPointerEvent } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import { AdmitOneTicket } from "../ui/admit-one-ticket";

/**
 * The hero's booking pass: one card, sitting under the copy, pickable.
 *
 * It was a fan of several. One says the same thing more plainly — a booking is
 * a thing you hold — and it leaves the tournament passes on the right of the
 * frame as the only other cards on screen, so the eye is not asked to read six
 * pieces of small print at once.
 *
 * White stock in Turf'd green: the pale card is the one that survives being
 * laid over a night photograph, and the brand green is the only other colour on
 * it, so the pass is unmistakably ours before a word of it is read.
 *
 * Dragging writes `transform` straight onto the node and never touches React
 * state, so a drag is one compositor property per frame with no re-render.
 * There is no throw, no spring and no snap-back: you put a ticket down where
 * you dropped it, the way a piece of card behaves.
 */

/** The Turf'd green, and the near-white the card is printed on. */
const TURF_GREEN = "#5bf0b7";
const CHALK = "#c3ebcc";
/** The ink: the darkest end of the same green, so nothing is off-brand. */
const INK = "#04301F";

/** Ticket width; the card's own aspect ratio gives the height. */
const TICKET_WIDTH = "clamp(212px,19.5vw,274px)";

export function HeroTickets() {
  // One GL context, and a loop that runs for as long as the card is mounted.
  // Weak devices and reduced motion get the painted still; the ticket is the
  // same shape either way.
  const { lite, reduce } = useMotionProfile();
  const shader = !lite && !reduce;
  const dragged = useRef(false);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Let the browser keep text selection, focus and scrolling everywhere
    // except on an actual ticket drag.
    const node = event.currentTarget;
    const start = { x: event.clientX, y: event.clientY };
    const base = {
      x: Number(node.dataset.x ?? 0),
      y: Number(node.dataset.y ?? 0),
    };

    node.setPointerCapture(event.pointerId);
    node.style.cursor = "grabbing";
    node.style.willChange = "transform";
    // Once it has been picked up it stays over everything around it.
    if (!dragged.current) {
      dragged.current = true;
      node.style.zIndex = "20";
    }

    const move = (moveEvent: PointerEvent) => {
      const x = base.x + (moveEvent.clientX - start.x);
      const y = base.y + (moveEvent.clientY - start.y);
      node.dataset.x = String(x);
      node.dataset.y = String(y);
      node.style.setProperty("--drag-x", `${x}px`);
      node.style.setProperty("--drag-y", `${y}px`);
    };

    const end = () => {
      node.style.cursor = "grab";
      node.style.willChange = "auto";
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", end);
      node.removeEventListener("pointercancel", end);
    };

    node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", end);
    node.addEventListener("pointercancel", end);
  };

  return (
    <div data-hero-tickets className="relative mx-auto" style={{ width: TICKET_WIDTH }}>
      <div
        onPointerDown={handlePointerDown}
        role="img"
        aria-label="Booking pass: Saturday 7 PM, 5-a-side, 10 players"
        className="w-full touch-none cursor-grab select-none"
        style={{
          // The one card keeps a slight tilt so it reads as a piece of card
          // dropped on the frame rather than a panel aligned to the layout.
          transform:
            "translate3d(var(--drag-x,0px),var(--drag-y,0px),0) rotate(-3.5deg)",
          // A ticket is a piece of card, not a pane of glass: one tight shadow
          // to lift it off the photograph, nothing wider.
          filter: "drop-shadow(0 8px 18px rgba(3,14,9,.5))",
        }}
      >
        <AdmitOneTicket
          kind="Booking Pass"
          title="Sat · 7 PM"
          detail="5-a-side · 10 players"
          stub="Admit Ten"
          serial="NO 0072"
          frame={900}
          colorBack={CHALK}
          colorHighlight={TURF_GREEN}
          ink={INK}
          shader={shader}
        >
          {/*
            Night grade. A fraction of what the dark cards took: at full
            strength the wash turns white stock grey, which is the one thing
            this card cannot afford to be.
          */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(214deg,rgba(255,250,232,.14) 0%,transparent 30%)," +
                "linear-gradient(250deg,rgba(3,14,9,.03) 0%,rgba(3,14,9,.13) 100%)",
            }}
          />
        </AdmitOneTicket>
      </div>
    </div>
  );
}
