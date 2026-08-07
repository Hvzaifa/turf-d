import { useRef, type PointerEvent as ReactPointerEvent } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import { AdmitOneTicket } from "../ui/admit-one-ticket";

/**
 * The hero's ticket stack: three admit-one cards, fanned and pickable.
 *
 * This is what the hero leads with now — a booking is a thing you hold, and
 * three of them say what the product does without a line of copy: you lock a
 * slot, you get a pass, the venue is a real place.
 *
 * Dragging writes `transform` straight onto the node and never touches React
 * state, so a drag is one compositor property per frame with no re-render.
 * There is no throw, no spring and no snap-back: you put a ticket down where
 * you dropped it, the way a piece of card behaves.
 */

type TicketSpec = {
  kind: string;
  title: string;
  detail: string;
  stub: string;
  serial: string;
  /** Resting place in the fan: px offsets from the stack's centre, and tilt. */
  x: number;
  y: number;
  rotate: number;
  frame: number;
  /** The card stock, the light moving over it, and the ink it is printed in. */
  colorBack: string;
  colorHighlight: string;
  ink: string;
  /**
   * How hard the night grade lands on this card, 0–1. The pale ticket takes a
   * fraction of it: at full strength the wash turns the paper grey and the
   * three cards collapse back into one colour.
   */
  grade: number;
};

const TICKETS: readonly TicketSpec[] = [
  {
    kind: "Venue Card",
    title: "Futsal Arena",
    detail: "F-11 · 12 courts",
    stub: "Turf'd",
    serial: "NO 0031",
    x: -158,
    y: 20,
    rotate: -10,
    frame: 2400,
    colorBack: "#EDE9D6",
    colorHighlight: "#5FADA2",
    ink: "#04301F",
    grade: 0.3,
  },
  {
    kind: "Booking Pass",
    title: "Sat · 7 PM",
    detail: "5-a-side · 10 players",
    stub: "Admit Ten",
    serial: "NO 0072",
    x: 0,
    y: 0,
    rotate: 4,
    frame: 900,
    colorBack: "#072D1E",
    colorHighlight: "#34D498",
    ink: "#F5FBF7",
    grade: 1,
  },
  {
    kind: "Slot Lock",
    title: "7:00 PM",
    detail: "Held · 60s remaining",
    stub: "Locked",
    serial: "NO 0108",
    x: 158,
    y: 26,
    rotate: 12,
    frame: 5200,
    colorBack: "#08262B",
    colorHighlight: "#B6D2C4",
    ink: "#EDE9D6",
    grade: 1,
  },
];

/** Ticket width; the card's own aspect ratio gives the height. */
const TICKET_WIDTH = "clamp(188px,17.5vw,244px)";

export function HeroTickets() {
  const topZ = useRef(TICKETS.length);
  // Three GL contexts, and now three live animation loops rather than three
  // one-off draws. Weak devices and reduced motion get the painted still
  // instead; the tickets look the same shape either way.
  const { lite, reduce } = useMotionProfile();
  const shader = !lite && !reduce;

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
    // The one you touched comes to the top of the pile and stays there.
    node.style.zIndex = String(++topZ.current);

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
    <div
      data-hero-tickets
      className="relative mx-auto"
      style={{
        width: TICKET_WIDTH,
        /**
         * The box is one ticket wide; the fan spills out of it on every side.
         * The extra height is the deepest `y` offset plus what the tilt adds
         * at the corners — without it the fan lands on the waitlist field.
         */
        height: `calc(${TICKET_WIDTH} / 1.72 + 74px)`,
      }}
    >
      {TICKETS.map((ticket, index) => (
        <div
          key={ticket.kind}
          onPointerDown={handlePointerDown}
          role="img"
          aria-label={`${ticket.kind}: ${ticket.title}, ${ticket.detail}`}
          // Width only: the height has to come from the ticket's own aspect
          // ratio, and `inset-0` would stretch it to the taller stack box.
          className="absolute top-0 left-0 w-full touch-none cursor-grab select-none"
          style={{
            zIndex: index + 1,
            transform:
              `translate3d(calc(${ticket.x}px + var(--drag-x,0px)),` +
              `calc(${ticket.y}px + var(--drag-y,0px)),0) rotate(${ticket.rotate}deg)`,
            // A ticket is a piece of card, not a pane of glass: one tight
            // shadow to lift it off the one beneath, nothing wider.
            filter: "drop-shadow(0 6px 14px rgba(245,251,247,.22))",
          }}
        >
          <AdmitOneTicket
            kind={ticket.kind}
            title={ticket.title}
            detail={ticket.detail}
            stub={ticket.stub}
            serial={ticket.serial}
            frame={ticket.frame}
            colorBack={ticket.colorBack}
            colorHighlight={ticket.colorHighlight}
            ink={ticket.ink}
            shader={shader}
          >
            {/* Night grade, so the tickets sit in the photograph rather than
                glowing on top of it. */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  `linear-gradient(214deg,rgba(255,250,232,${0.16 * ticket.grade}) 0%,transparent 26%),` +
                  `linear-gradient(250deg,rgba(3,14,9,${0.1 * ticket.grade}) 0%,` +
                  `rgba(3,14,9,${0.44 * ticket.grade}) 100%)`,
              }}
            />
          </AdmitOneTicket>
        </div>
      ))}
    </div>
  );
}
