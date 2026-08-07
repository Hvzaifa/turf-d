import pitchThumbUrl from "../../assets/hero/new-hero-1024.webp";

/**
 * The product itself, standing in the scene on the right of the frame.
 *
 * It answers "what is this?" before the copy is read, so it shows one real
 * booking rather than a marketing render: a court, a time, a state, an action.
 * The venue on screen is a crop of the same photograph it is standing in —
 * the asset is already decoded for the pitch layer, so it costs no request.
 *
 * It is deliberately small and graded down: the photograph stays dominant.
 * Everything here is static paint. The only motion is the scroll scrub in
 * `useHeroCamera`, which writes `transform` on `[data-hero-device]` and on the
 * slot card, and nothing else.
 */
export function HeroDevice() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-5 hidden lg:block"
      style={{
        left: "50%",
        top: "50%",
        /**
         * Capped against the viewport's *height* as well as its width. The
         * phone stands dead centre of the frame, and a width-only size runs it
         * under the navigation on a short laptop screen — the `40svh` cap and
         * the -44% vertical offset together keep its top edge clear of the
         * nav bar (~84px) at every viewport this renders on.
         */
        width: "min(clamp(260px,24vw,340px),40svh)",
        // Static placement only. Everything that moves lives on the child.
        transform: "translate3d(-50%,-44%,0)",
      }}
    >
      <div
        data-hero-device
        className="relative opacity-0"
        style={{
          transformOrigin: "50% 50%",
          willChange: "var(--wc,auto)",
        }}
      >
      {/* Contact shadow — a painted pool of dark, not a box-shadow, so the
          device reads as sitting in the frame rather than hovering over it.
          It is thrown down and to the left, away from the floodlight burning
          in the upper right of the photograph. */}
      <div
        className="absolute"
        style={{
          left: "-30%",
          right: "-22%",
          top: "8%",
          bottom: "-14%",
          background:
            "radial-gradient(ellipse 50% 54% at 46% 64%,rgba(2,7,5,.7),transparent 72%)",
        }}
      />

      {/* The screen's own light, spilling onto the ground it stands on. This
          is the thing that stops a rectangle from looking pasted over a
          photograph: the scene has to react to it. */}
      <div
        className="absolute"
        style={{
          left: "-34%",
          right: "-34%",
          top: "24%",
          bottom: "-18%",
          background:
            "radial-gradient(ellipse 44% 46% at 50% 58%,rgba(52,212,152,.13),transparent 70%)",
        }}
      />

      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "9 / 19",
          borderRadius: "clamp(26px,2.4vw,32px)",
          padding: "5px",
          background: "linear-gradient(158deg,#1B2521 0%,#080D0B 42%,#141c19 100%)",
          border: "1px solid rgba(245,251,247,.1)",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            borderRadius: "clamp(22px,2vw,27px)",
            background: "linear-gradient(180deg,#071A12 0%,#04140E 100%)",
          }}
        >
          <BookingScreen />

          {/* The slot card, parked below the screen until the scrub reveals it. */}
          <SlotCard />

          {/* Screen glass: one static sheen, seating the display in the night. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(148deg,rgba(245,251,247,.09) 0%,transparent 34%,transparent 74%,rgba(2,8,5,.28) 100%)",
            }}
          />
        </div>

        {/* Speaker slot, in place of a notch. */}
        <div
          className="absolute left-1/2 h-[3px] w-[38px] -translate-x-1/2 rounded-full"
          style={{ top: "11px", background: "rgba(245,251,247,.18)" }}
        />

        {/* Rim light: the floodlight burning in the upper right of the
            photograph catching the top edge of the case. Without it the phone
            is lit by nothing in the scene, which is what makes a mockup look
            dropped on rather than photographed. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: "clamp(26px,2.4vw,32px)",
            background:
              "linear-gradient(214deg,rgba(255,250,232,.3) 0%,rgba(255,250,232,.06) 9%,transparent 22%)",
          }}
        />
      </div>

      {/* Night grade, keyed to the same light: the side facing the floodlight
          stays open, the side facing away falls into the dark of the frame. */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: "clamp(26px,2.4vw,32px)",
          background:
            "linear-gradient(250deg,rgba(4,20,13,.06) 0%,rgba(4,20,13,.2) 46%,rgba(3,10,7,.46) 100%)",
        }}
      />
      </div>
    </div>
  );
}

/** The booking screen: nearby courts, one slot, one action. */
function BookingScreen() {
  return (
    <div className="flex h-full flex-col" style={{ padding: "26px 13px 13px" }}>
      <div
        className="flex items-baseline justify-between"
        style={{ color: "rgba(245,251,247,.5)" }}
      >
        <span className="font-mono" style={{ fontSize: "8px", letterSpacing: ".12em" }}>
          7:04
        </span>
        <span className="font-mono" style={{ fontSize: "8px", letterSpacing: ".12em" }}>
          F-11 · 1.2 KM
        </span>
      </div>

      <div
        className="font-mono uppercase"
        style={{
          marginTop: "16px",
          fontSize: "8.5px",
          letterSpacing: ".2em",
          color: "rgba(245,251,247,.44)",
        }}
      >
        Nearby Courts
      </div>

      <div
        className="overflow-hidden"
        style={{
          marginTop: "10px",
          borderRadius: "12px",
          background: "rgba(245,251,247,.05)",
          border: "1px solid rgba(245,251,247,.08)",
        }}
      >
        {/* The venue on screen is the venue behind it. */}
        <div className="relative" style={{ height: "58px" }}>
          <img
            src={pitchThumbUrl}
            alt=""
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 58%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(4,20,13,.15),rgba(4,20,13,.72))",
            }}
          />
        </div>

        <div style={{ padding: "9px 10px 11px" }}>
          <div
            className="font-semibold text-chalk"
            style={{ fontSize: "11.5px", lineHeight: 1.2 }}
          >
            Futsal Arena
          </div>
          <div className="mt-[7px] flex items-center justify-between">
            <span
              className="font-mono"
              style={{ fontSize: "10px", color: "rgba(245,251,247,.66)" }}
            >
              7:00 PM
            </span>
            <span className="flex items-center gap-[5px]">
              <span
                className="block h-[4px] w-[4px] rounded-full"
                style={{ background: "#34D498" }}
              />
              <span
                className="font-mono uppercase"
                style={{ fontSize: "8px", letterSpacing: ".14em", color: "#34D498" }}
              >
                Available
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* The list carries on past the one court that matters, dimmed. It is
          the same six sports the row under the CTAs names, said a second way:
          by the time the phone is centred and the copy is gone, this list is
          the only thing explaining that Turf'd is not a football app. */}
      <div style={{ marginTop: "9px" }}>
        <GhostRow time="8:00 PM" name="Green Park Cricket" />
        <GhostRow time="8:30 PM" name="Sector Padel Club" />
        <GhostRow time="9:00 PM" name="Margalla Tennis" />
        <GhostRow time="9:00 PM" name="Blue Area Hoops" />
        <GhostRow time="10:00 PM" name="Shalimar Badminton" />
      </div>

      {/* What is under the fold of the list. It says the thing the hero copy
          cannot say without boasting: there is real inventory behind this. */}
      <div
        className="font-mono"
        style={{
          marginTop: "11px",
          fontSize: "8.5px",
          letterSpacing: ".08em",
          color: "rgba(245,251,247,.26)",
        }}
      >
        +12 more within 3 km
      </div>

      <div
        className="mt-auto flex items-center justify-center font-semibold"
        style={{
          height: "31px",
          borderRadius: "9px",
          background: "#34D498",
          color: "#04301F",
          fontSize: "11px",
          letterSpacing: ".01em",
        }}
      >
        Book Now
      </div>
    </div>
  );
}

function GhostRow({ time, name }: { time: string; name: string }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "8px 10px",
        marginTop: "6px",
        borderRadius: "10px",
        background: "rgba(245,251,247,.03)",
        color: "rgba(245,251,247,.34)",
      }}
    >
      <span style={{ fontSize: "10px" }}>{name}</span>
      <span className="font-mono" style={{ fontSize: "9px" }}>
        {time}
      </span>
    </div>
  );
}

/**
 * Slot locked. Rendered offscreen inside the phone and raised once, by the
 * scroll scrub — never on a loop.
 */
function SlotCard() {
  return (
    <div
      data-device-card
      className="absolute right-0 bottom-0 left-0"
      style={{
        margin: "8px",
        padding: "11px 12px 12px",
        borderRadius: "13px",
        background: "linear-gradient(180deg,#0C3625 0%,#072418 100%)",
        border: "1px solid rgba(52,212,152,.28)",
        transform: "translate3d(0,120%,0)",
        willChange: "transform",
      }}
    >
      <div className="flex items-center gap-[6px]">
        <span
          className="block h-[5px] w-[5px] rounded-full"
          style={{ background: "#D3D089" }}
        />
        <span
          className="font-mono uppercase text-chalk"
          style={{ fontSize: "9px", letterSpacing: ".18em" }}
        >
          Slot Locked
        </span>
      </div>
      <div
        className="font-display text-chalk"
        style={{ marginTop: "7px", fontSize: "20px", lineHeight: 1 }}
      >
        7:00 PM
      </div>
      <div
        className="font-mono"
        style={{ marginTop: "6px", fontSize: "9px", color: "rgba(211,208,137,.82)" }}
      >
        60s remaining
      </div>
    </div>
  );
}
