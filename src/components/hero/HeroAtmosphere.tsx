import type { CSSProperties, ReactNode } from "react";

/**
 * Hero art, imported so Vite fingerprints and emits it.
 *
 * These are the keyed/graded/resized variants the design composites with — the
 * raw sources in `src/assets/actual` are fully opaque, so the fog, rays, leaves
 * and particle sheets would paint solid rectangles over the pitch instead of
 * layering on top of it. `grain` is the 256px tile the layer repeats, not the
 * 2048px source.
 */
import fogBackUrl from "../../assets/hero/fog-back-keyed.png";
import fogFrontUrl from "../../assets/hero/fog-front-keyed.png";
import grainUrl from "../../assets/hero/grain.png";
import leavesUrl from "../../assets/hero/leaves-1400.webp";
import lightRaysUrl from "../../assets/hero/light-rays-keyed.png";
import pitch1024Url from "../../assets/hero/new-hero-1024.webp";
import pitch1600Url from "../../assets/hero/new-hero-1600.webp";
import pitchUrl from "../../assets/hero/new-hero-graded.webp";
import particlesUrl from "../../assets/hero/particles-keyed.png";

/**
 * A dolly cell: an independently transformed camera layer. Each one owns its
 * own promoted texture — there is deliberately no shared parent transform, so
 * moving one layer never re-rasterizes another.
 */
function CameraCell({
  name,
  z,
  children,
}: {
  name: string;
  z: number;
  children: ReactNode;
}) {
  return (
    <div
      data-cam={name}
      className="pointer-events-none absolute inset-0"
      style={{
        zIndex: z,
        transformOrigin: "50% 62%",
        willChange: "var(--wc,auto)",
      }}
    >
      {children}
    </div>
  );
}

/** Shared by every ambient <img>: promoted, mirrored where the art needs it. */
const ambientImage: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  willChange: "var(--wc,auto)",
  backfaceVisibility: "hidden",
};

/**
 * Layer 2 — the pitch itself. The colour grade is baked into the asset and the
 * sky fade is painted, so no mask has to be composited under a transform.
 */
export function PitchLayer() {
  return (
    <div
      data-cam="pitch"
      className="absolute inset-0 z-2"
      style={{ transformOrigin: "50% 62%", willChange: "var(--wc,auto)" }}
    >
      <div data-layer="pitch" className="absolute inset-0">
        <img
          src={pitchUrl}
          srcSet={`${pitch1024Url} 1024w, ${pitch1600Url} 1600w, ${pitchUrl} 2752w`}
          sizes="100vw"
          alt="Floodlit football facility at night"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 42%" }}
        />
        <div
          data-pitch-scrim
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(5,12,19,.55) 0%,transparent 26%,transparent 70%,rgba(4,18,12,.55) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 46% at 74% 66%,rgba(255,244,214,.1),transparent 60%)",
          }}
        />
        <div
          data-pitch-glow
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 130% 120% at 55% 56%,rgba(255,247,224,.3),rgba(255,247,224,.13) 70%,rgba(255,247,224,.05))",
          }}
        />
        {/* Painted sky gradient in place of an animated mask-image. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: "22%",
            background:
              "linear-gradient(180deg,#050c13 0%,#06141b 42%,rgba(8,26,28,0) 100%)",
          }}
        />
      </div>
    </div>
  );
}

/** Background fog — the slow one, sitting behind everything. */
export function FogBackLayer() {
  return (
    <CameraCell name="fog-bg" z={2}>
      <div
        data-layer="fog-bg"
        className="absolute"
        style={{ left: "-8%", right: "-8%", bottom: "-6%", height: "80%", opacity: 0.5 }}
      >
        <img
          src={fogBackUrl}
          alt=""
          decoding="async"
          style={{
            ...ambientImage,
            objectPosition: "center bottom",
            animation: "fogBg 89s linear infinite",
          }}
        />
      </div>
    </CameraCell>
  );
}

/** Floodlight rays raking in from the right. */
export function RaysLayer() {
  return (
    <CameraCell name="rays" z={2}>
      <div
        data-layer="rays"
        className="absolute"
        style={{
          top: "-10%",
          right: "-8%",
          width: "82%",
          height: "100%",
          opacity: 0.55,
          transform: "scaleX(-1)",
        }}
      >
        <img
          src={lightRaysUrl}
          alt=""
          decoding="async"
          className="h-full w-full"
          style={{
            objectFit: "contain",
            objectPosition: "top center",
            animation: "rayPulse 83s linear -34s infinite",
          }}
        />
      </div>
    </CameraCell>
  );
}

/** Midground grade: text scrim, horizon haze, edge falloff. */
export function MistLayer() {
  return (
    <div
      data-layer="mist"
      className="pointer-events-none absolute inset-0 z-4"
      style={{
        transformOrigin: "50% 62%",
        willChange: "var(--wc,auto)",
        background:
          "radial-gradient(ellipse 80% 118% at 5% 60%,rgba(4,18,12,.95) 0%,rgba(4,18,12,.62) 30%,rgba(4,18,12,.22) 52%,transparent 71%)," +
          "radial-gradient(ellipse 44% 58% at 28% 20%,rgba(4,18,12,.5),transparent 58%)," +
          "radial-gradient(ellipse 40% 44% at 18% 92%,rgba(3,12,8,.55),transparent 60%)," +
          "radial-gradient(ellipse 82% 42% at 52% 56%,rgba(150,190,160,.12),transparent 62%)," +
          "linear-gradient(180deg,rgba(5,13,20,.42) 0%,transparent 22%,transparent 62%,#04301F 100%)",
      }}
    />
  );
}

export function VignetteLayer() {
  return (
    <div
      data-layer="vignette"
      className="pointer-events-none absolute inset-0 z-4"
      style={{
        transformOrigin: "50% 62%",
        willChange: "var(--wc,auto)",
        background:
          "radial-gradient(ellipse 128% 128% at 50% 50%,transparent 52%,rgba(0,0,0,.32) 82%,rgba(0,0,0,.5) 100%)",
      }}
    />
  );
}

/** Foreground fog — faster, mirrored, drifting across the lower frame. */
export function FogFrontLayer() {
  return (
    <CameraCell name="fog-fg" z={4}>
      <div
        data-layer="fog-fg"
        className="absolute"
        style={{
          left: "-12%",
          right: "-12%",
          bottom: "-10%",
          height: "56%",
          opacity: 0.4,
          transform: "scaleX(-1)",
        }}
      >
        <img
          src={fogFrontUrl}
          alt=""
          decoding="async"
          style={{
            ...ambientImage,
            objectPosition: "center bottom",
            animation: "fogFg 107s linear -26s infinite",
          }}
        />
      </div>
    </CameraCell>
  );
}

/** Layer 5 — the canopy, bleeding past the viewport on every side. */
export function LeavesLayer() {
  return (
    <div
      data-layer="leaves"
      className="pointer-events-none absolute z-5"
      style={{
        top: "-12%",
        left: "-10%",
        right: "-10%",
        height: "66%",
        opacity: 0.94,
        transformOrigin: "50% 62%",
        willChange: "var(--wc,auto)",
      }}
    >
      <img
        src={leavesUrl}
        alt=""
        decoding="async"
        style={{
          ...ambientImage,
          objectPosition: "top center",
          transformOrigin: "top center",
          animation: "leafSway 67s linear -16s infinite",
        }}
      />
    </div>
  );
}

/** Two offset passes of the same sheet, so the drift never visibly repeats. */
export function ParticlesLayer() {
  return (
    <CameraCell name="particles" z={5}>
      <div data-layer="particles" className="absolute" style={{ inset: "-6%", opacity: 0.66 }}>
        <img
          src={particlesUrl}
          alt=""
          decoding="async"
          className="absolute inset-0"
          style={{ ...ambientImage, animation: "driftUpA 47s ease-in-out infinite" }}
        />
        <img
          src={particlesUrl}
          alt=""
          decoding="async"
          className="absolute inset-0"
          style={{
            ...ambientImage,
            objectPosition: "right top",
            animation: "driftUpB 59s ease-in-out -22s infinite",
          }}
        />
      </div>
    </CameraCell>
  );
}

/** Light and mist grazing the copy — immersion, not a container. */
export function TextAirLayer() {
  return (
    <div
      data-layer="text-air"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-6"
      style={{ opacity: 0.6 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 58% 78% at 64% 32%,rgba(240,238,214,.05),transparent 60%)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "-6%",
          right: "38%",
          bottom: 0,
          height: "36%",
          background:
            "radial-gradient(ellipse 80% 100% at 28% 100%,rgba(182,206,192,.05),transparent 68%)",
        }}
      />
    </div>
  );
}

/** Fine film grain, almost imperceptible. */
export function GrainLayer() {
  return (
    <div
      data-layer="grain"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-7"
      style={{
        opacity: 0.035,
        backgroundImage: `url(${grainUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}
