/** Copy for the recognition beat — design/project/Turfd Landing.dc.html §229–267. */

export const EYEBROW = "Every game starts the same way";

export const HEADLINE = ["Same game.", "Same routine."] as const;

export const LEAD = [
  "Every football game starts long before kickoff.",
  "Someone calls the owner.",
  "Someone checks the group chat.",
  "Someone hears the pitch is already taken.",
] as const;

/**
 * The conversation, as an editorial interpretation of a group chat rather than
 * a literal one. `them` sits left, `us` right; the closing line is the payoff
 * and is set at display size.
 */
export type ChatMessage = {
  text: string;
  side: "them" | "us";
  /** The opening line sits in a slightly roomier bubble than the replies. */
  opener?: boolean;
  /** The last message: larger, heavier, and pushed down the column. */
  payoff?: boolean;
};

export const CONVERSATION: readonly ChatMessage[] = [
  { text: "who’s sorting tonight?", side: "them", opener: true },
  { text: "checking F10", side: "us" },
  { text: "busy", side: "them" },
  { text: "try E11", side: "us" },
  { text: "owner isn’t answering", side: "them" },
  { text: "already booked", side: "us", payoff: true },
];

export const BRIDGE_LINE = "It doesn’t have to start this way";
