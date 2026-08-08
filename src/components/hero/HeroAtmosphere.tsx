import type { CSSProperties, ReactNode } from "react";

/**
 * Hero art, imported so Vite fingerprints and emits it.
 *
 * These are the keyed variants: the raw sources are fully opaque, so the fog
 * and leaf sheets would paint solid rectangles over the pitch instead of
 * layering on top of it.
 */
import fogUrl from "../../assets/hero/fog-keyed.webp";
import pitch1024Url from "../../assets/hero/new-hero-1024.webp";
import pitch1600Url from "../../assets/hero/new-hero-1600.webp";
import pitchUrl from "../../assets/hero/new-hero-graded.webp";

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
 * Layer 2 — the pitch itself.
 *
 * Nothing inside this cell changes while the camera dollies. That is the whole
 * point of its shape: the cell is scaled every frame of the scrub, so anything
 * animating *within* it would dirty the photograph's texture and force a
 * full-frame re-raster at the new scale — the single most expensive thing the
 * hero used to do, and the source of the flicker on large viewports. The two
 * grades that do animate now live outside it, in `PitchGradeLayers`.
 *
 * The colour grade is baked into the asset, and the sky fade and the warm
 * floodlight pool are painted as two backgrounds on one div rather than two
 * more stacked surfaces.
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
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              // Sky fade across the top 22% of the frame…
              "linear-gradient(180deg,#050c13 0%,#06141b 9.2%,rgba(8,26,28,0) 22%)," +
              // …and the warm spill under the floodlight.
              "radial-gradient(ellipse 40% 46% at 74% 66%,rgba(255,244,214,.1),transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * The two grades that cross-fade as you arrive: the scrim that holds the photo
 * back at rest, and the light the field catches once you are on it.
 *
 * They sit outside the dollying pitch cell and are never transformed, so each
 * is rastered once and the scrub only hands the compositor a new opacity.
 * They do not dolly, which is imperceptible — both are soft full-frame
 * gradients with no structure to track the camera.
 */
export function PitchGradeLayers() {
  return (
    <>
      <div
        data-pitch-scrim
        className="pointer-events-none absolute inset-0 z-3"
        style={{
          willChange: "var(--wc-opacity,auto)",
          background:
            "linear-gradient(180deg,rgba(5,12,19,.55) 0%,transparent 26%,transparent 70%,rgba(4,18,12,.55) 100%)",
        }}
      />
      <div
        data-pitch-glow
        className="pointer-events-none absolute inset-0 z-3 opacity-0"
        style={{
          willChange: "var(--wc-opacity,auto)",
          background:
            "radial-gradient(ellipse 130% 120% at 55% 56%,rgba(255,247,224,.3),rgba(255,247,224,.13) 70%,rgba(255,247,224,.05))",
        }}
      />
    </>
  );
}

/**
 * The hero's one fog layer.
 *
 * There used to be two, a slow sheet behind and a faster mirrored one in
 * front. They were the same artwork at 0.5 and 0.4 opacity, and on any frame
 * where both were on screen the second was almost entirely hidden by the first
 * — a full-viewport image composited every frame for a difference you cannot
 * point at. One sheet, drifting, is what the scene needs.
 */
export function FogLayer() {
  return (
    <CameraCell name="fog" z={2}>
      <div
        data-layer="fog"
        className="absolute"
        style={{ left: "-8%", right: "-8%", bottom: "-6%", height: "80%", opacity: 0.5 }}
      >
        <img
          src={fogUrl}
          alt=""
          decoding="async"
          style={{
            ...ambientImage,
            objectPosition: "center bottom",
            animation: "fogDrift 89s linear infinite",
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

/**
 * The vignette, which opens all the way out as you arrive.
 *
 * It used to dolly with the camera, which meant a full-viewport surface being
 * re-rastered at a new scale on every frame of the scrub. It is a soft radial
 * with no structure in it — nothing about it reads as near or far — so
 * scaling it was invisible and pinning it costs nothing. Now it only ever
 * changes opacity, which the compositor does for free.
 */
export function VignetteLayer() {
  return (
    <div
      data-layer="vignette"
      className="pointer-events-none absolute inset-0 z-4"
      style={{
        willChange: "var(--wc-opacity,auto)",
        background:
          "radial-gradient(ellipse 128% 128% at 50% 50%,transparent 52%,rgba(0,0,0,.32) 82%,rgba(0,0,0,.5) 100%)",
      }}
    />
  );
}


