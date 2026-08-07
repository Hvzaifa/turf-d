import type { ReactNode } from "react";

/**
 * The supported sports, stated once under the CTAs.
 *
 * The whole point of the row is that a scanning visitor learns Turf'd is not
 * only football without reading a word of the copy, so the drawings do the
 * work and the labels only confirm them. They are inline stroke art rather
 * than icon-font glyphs or raster sprites: six pieces of equipment at 22px
 * cost less than one more image request, and they inherit `currentColor` so
 * the row can sit at a single low opacity.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type Sport = { name: string; art: ReactNode };

const SPORTS: readonly Sport[] = [
  {
    name: "Football",
    art: (
      <>
        <circle cx="12" cy="12" r="8" {...stroke} />
        <path d="M12 7.6l3.4 2.5-1.3 4h-4.2l-1.3-4z" {...stroke} />
        <path d="M12 4v3.6M18.6 9.6l-3.5.5M16.1 14.1l1.9 3M7.9 14.1L6 17.1M5.4 9.6l3.5.5" {...stroke} />
      </>
    ),
  },
  {
    name: "Cricket",
    art: (
      <>
        <path d="M9.4 14.6l5.1-8a1.6 1.6 0 012.6 1.8l-5.5 7.7z" {...stroke} />
        <path d="M9.4 14.6l-2.7 3.9a1.1 1.1 0 001.5 1.5l3.7-2.9" {...stroke} />
        <circle cx="6.3" cy="8.4" r="2.6" {...stroke} />
      </>
    ),
  },
  {
    name: "Padel",
    art: (
      <>
        <path d="M12 3.4c3.6 0 6 2.7 6 6.1 0 3.3-2.5 5.6-6 5.6s-6-2.3-6-5.6c0-3.4 2.4-6.1 6-6.1z" {...stroke} />
        <path d="M10.8 15.1v4a1.2 1.2 0 002.4 0v-4" {...stroke} />
        <path d="M9.6 7.6v4.2M12 6.9v5.2M14.4 7.6v4.2" {...stroke} />
      </>
    ),
  },
  {
    name: "Tennis",
    art: (
      <>
        <ellipse cx="11.4" cy="8.7" rx="5" ry="6" {...stroke} />
        <path d="M11.4 14.7l2.3 4.4a1.2 1.2 0 002.1-1.1l-2-3.9" {...stroke} />
        <path d="M7.6 4.9l7.6 7.6M15.2 4.9l-7.6 7.6" {...stroke} />
      </>
    ),
  },
  {
    name: "Basketball",
    art: (
      <>
        <circle cx="12" cy="12" r="8" {...stroke} />
        <path d="M12 4v16M4 12h16" {...stroke} />
        <path d="M6.3 6.3c3 3 3 8.4 0 11.4M17.7 6.3c-3 3-3 8.4 0 11.4" {...stroke} />
      </>
    ),
  },
  {
    name: "Badminton",
    art: (
      <>
        <path d="M9.2 13.4l4.4-8.2a1.3 1.3 0 012.3 0l4.4 8.2z" {...stroke} />
        <path d="M12.1 7.8h3.4M10.6 10.6h6.4" {...stroke} />
        <path d="M9.2 13.4a3.1 3.1 0 005.5 2.9" {...stroke} />
        <path d="M9.9 16.9L5 21" {...stroke} />
      </>
    ),
  },
];

export function HeroSports({ style }: { style?: React.CSSProperties }) {
  return (
    <ul
      data-hero-sports
      className="m-0 flex list-none flex-wrap items-center p-0"
      style={{
        marginTop: "clamp(22px,3.4vh,30px)",
        // Tight enough that all six sit on one line inside the copy column at
        // desktop widths — the row only works if it reads as a single glance.
        gap: "10px 14px",
        color: "rgba(245,251,247,.9)",
        opacity: 0.42,
        ...style,
      }}
    >
      {SPORTS.map(({ name, art }) => (
        <li key={name} className="flex items-center gap-[6px]">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            {art}
          </svg>
          <span
            className="font-mono uppercase"
            style={{ fontSize: "9px", letterSpacing: ".11em", whiteSpace: "nowrap" }}
          >
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}
