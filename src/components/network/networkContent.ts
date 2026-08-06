import type { NodeId } from "./networkGeometry";

/** Copy for #why-turf-d — design/project/Turfd Landing.dc.html §345–494. */

export const EYEBROW = "Why Turf'd";
export const HEADLINE = { accent: "One tap.", rest: "An entire evening moves." };
export const LEAD =
  "A single booking sets six systems in motion at once — in the right order, without anyone touching a phone twice.";

export const CENTER = { title: "TURF'D", caption: "One tap" };

export type ChipTone = "bare" | "plain" | "mint" | "amber" | "lime";

export type Chip = {
  text: string;
  tone: ChipTone;
  /** Chips that only appear once the pulse reaches this node. */
  dot?: boolean;
};

export type CardSpec = {
  id: NodeId;
  icon: "qr" | "radar" | "lock" | "check" | "bars" | "star";
  label: string;
  /** Small meta opposite the label — a time, an amount, a live badge. */
  meta: Chip;
  title: string;
  /** The stars card animates its title rather than a footer chip. */
  titleDot?: boolean;
  titleColor?: string;
  chips: readonly Chip[];
  align: "left" | "right";
};

export const CARDS: readonly CardSpec[] = [
  {
    id: "booking-confirmed",
    icon: "qr",
    label: "Check-in",
    meta: { text: "7:00 PM", tone: "bare" },
    title: "QR verified",
    chips: [
      { text: "✓ Confirmed", tone: "mint", dot: true },
      { text: "Court B", tone: "bare" },
    ],
    align: "left",
  },
  {
    id: "live-discovery",
    icon: "radar",
    label: "Nearby",
    meta: { text: "Live", tone: "mint", dot: true },
    title: "14 courts open",
    chips: [
      { text: "Futsal", tone: "plain" },
      { text: "0.8 km", tone: "bare" },
    ],
    align: "left",
  },
  {
    id: "slot-lock",
    icon: "lock",
    label: "Slot",
    meta: { text: "00:47", tone: "bare" },
    title: "Court B · 7:00 PM",
    chips: [
      { text: "Sat, Aug 8", tone: "bare" },
      { text: "Locked", tone: "amber", dot: true },
    ],
    align: "right",
  },
  {
    id: "payment",
    icon: "check",
    label: "Payment",
    meta: { text: "Rs 2,400", tone: "bare" },
    title: "EasyPaisa",
    chips: [
      { text: "Txn #4471", tone: "bare" },
      { text: "Completed", tone: "mint", dot: true },
    ],
    align: "right",
  },
  {
    id: "owner-dashboard",
    icon: "bars",
    label: "Owner",
    meta: { text: "Today", tone: "bare" },
    title: "New booking",
    chips: [
      { text: "+Rs 4,500", tone: "lime", dot: true },
      { text: "3 today", tone: "bare" },
    ],
    align: "left",
  },
  {
    id: "game-night",
    icon: "star",
    label: "Review",
    meta: { text: "Just now", tone: "bare" },
    title: "★★★★★",
    titleDot: true,
    titleColor: "#C6FF3C",
    chips: [
      { text: "Great pitch", tone: "plain" },
      { text: "Court B", tone: "bare" },
    ],
    align: "left",
  },
];

/**
 * The mobile fallback list. Note it is deliberately ordered differently from
 * the diagram's chain — payments and the owner dashboard are numbered 03 and 04
 * here, while the pulse visits the dashboard fifth.
 */
export const JOURNEY: ReadonlyArray<{ title: string; body: string }> = [
  { title: "Live Discovery", body: "See what's open, priced and lit — live." },
  { title: "Slot Lock", body: "Tapped once, held for you while you pay." },
  { title: "Payments", body: "EasyPaisa or JazzCash clears in seconds." },
  { title: "Owner Dashboard", body: "Bookings and revenue, in one screen." },
  { title: "Booking Confirmed", body: "Everyone in the squad gets the same receipt." },
  { title: "Game Night", body: "Show up. The lights are already on." },
];
