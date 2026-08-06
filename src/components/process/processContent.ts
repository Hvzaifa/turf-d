/** Copy for the empty-hours beat — design/project/Turfd Landing.dc.html §305–343. */

export const EMPTY_HOURS = {
  label: "Empty Hours",
  alt: "An empty floodlit five-a-side pitch behind a chain-link fence at dusk, no players on the field",
} as const;

export const HEADLINE = "Every empty hour costs more than electricity.";

export const OWNER = {
  eyebrow: "For Owners",
  headline: "Empty evenings don’t have to stay empty.",
  alt: "A pitch owner standing at the gate of his lit five-a-side pitch at dusk, looking out past the empty field",
  /** Two dim lines, then the turn — set in full chalk. */
  body: [
    { text: "People are already looking for somewhere to play.", tone: "muted" },
    { text: "They just don’t know you’re available.", tone: "muted" },
    { text: "Turf’d connects those two moments.", tone: "bright" },
  ],
} as const;

export const ARRIVAL = {
  caption: "Tonight looks different.",
  alt: "A group of players walking through the gate onto a floodlit five-a-side pitch where a match is underway",
  metrics: [
    "+4 bookings",
    "2 empty hours filled",
    "One less WhatsApp conversation",
  ],
} as const;
