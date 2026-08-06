import { COPY_DELAYS } from "./heroMotion";

/** A single breathing hairline in the corner — the only prompt to keep going. */
export function ScrollCue() {
  return (
    <div
      data-layer="scroll-cue"
      aria-hidden="true"
      className="absolute z-6 flex items-center gap-[10px] opacity-0"
      style={{
        right: "clamp(20px,4vw,52px)",
        bottom: "34px",
        animation: `cueReveal 1.8s ease ${COPY_DELAYS.scrollCue}s both`,
      }}
    >
      <span
        className="block w-px"
        style={{
          height: "44px",
          background:
            "linear-gradient(180deg,transparent,rgba(245,251,247,.55) 30%,transparent)",
          transformOrigin: "top",
          animation: "cueLine 6s cubic-bezier(.45,0,.55,1) infinite",
        }}
      />
    </div>
  );
}
