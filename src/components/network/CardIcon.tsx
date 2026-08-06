import type { CardSpec } from "./networkContent";

/** The hairline glyphs on each card header, at their design dimensions. */
const PATHS: Record<CardSpec["icon"], { strokeWidth: number; body: React.ReactNode }> = {
  qr: {
    strokeWidth: 1.4,
    body: (
      <>
        <rect x="3.5" y="3.5" width="3" height="3" />
        <rect x="9.5" y="3.5" width="3" height="3" />
        <rect x="3.5" y="9.5" width="3" height="3" />
        <rect x="9.5" y="9.5" width="3" height="3" />
      </>
    ),
  },
  radar: {
    strokeWidth: 1.4,
    body: (
      <>
        <circle cx="8" cy="8" r="5.2" />
        <circle cx="8" cy="8" r="1.3" fill="rgba(245,251,247,.45)" stroke="none" />
      </>
    ),
  },
  lock: {
    strokeWidth: 1.4,
    body: (
      <>
        <rect x="4" y="7" width="8" height="6" rx="1" />
        <path d="M6,7 V5 a2,2 0 0 1 4,0 V7" />
      </>
    ),
  },
  check: {
    strokeWidth: 1.4,
    body: (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M5.5,8.2 L7.2,10 L10.5,6" />
      </>
    ),
  },
  bars: {
    strokeWidth: 1.4,
    body: (
      <>
        <rect x="3" y="9" width="2.5" height="4" />
        <rect x="6.8" y="6" width="2.5" height="7" />
        <rect x="10.6" y="3" width="2.5" height="10" />
      </>
    ),
  },
  star: {
    strokeWidth: 1.2,
    body: <path d="M8,2 L9.8,6.2 L14,6.6 L10.8,9.6 L11.8,14 L8,11.6 L4.2,14 L5.2,9.6 L2,6.6 L6.2,6.2 Z" />,
  },
};

export function CardIcon({ icon }: { icon: CardSpec["icon"] }) {
  const { strokeWidth, body } = PATHS[icon];
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      fill="none"
      stroke="rgba(245,251,247,.45)"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      {body}
    </svg>
  );
}
