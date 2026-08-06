import { useRef } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import { useSmoothScroll } from "../../lib/motion/useSmoothScroll";
import {
  FogBackLayer,
  FogFrontLayer,
  GrainLayer,
  LeavesLayer,
  MistLayer,
  ParticlesLayer,
  PitchLayer,
  RaysLayer,
  TextAirLayer,
  VignetteLayer,
} from "./HeroAtmosphere";
import { HeroContent, type HeroContentProps } from "./HeroContent";
import { HERO_TRACK_HEIGHT } from "./heroMotion";
import { IntroVeil } from "./IntroVeil";
import { ScrollCue } from "./ScrollCue";
import { useHeroAmbientGating } from "./useHeroAmbientGating";
import { useHeroCamera } from "./useHeroCamera";
import { useHeroPointerParallax } from "./useHeroPointerParallax";

export type HeroProps = HeroContentProps;

/**
 * The hero, and the scroll track it is scrubbed across.
 *
 * The track is taller than the viewport; the section inside it is
 * `position: sticky`, so the browser does the pinning and ScrollTrigger is left
 * to do nothing but scrub — it never mutates the DOM React owns.
 *
 * Layer order (z): pitch and background atmosphere (2) → midground grade (4) →
 * canopy and particles (5) → copy (6) → grain (7) → intro veil (8).
 */
export function Hero({ onSubmit, onWatchFilm }: HeroProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const profile = useMotionProfile();

  useSmoothScroll(profile);
  useHeroAmbientGating({ heroRef, profile });
  useHeroCamera({ trackRef, heroRef, profile });
  useHeroPointerParallax({ heroRef, profile });

  return (
    <div
      ref={trackRef}
      data-hero-track
      className="relative z-1"
      style={{ height: HERO_TRACK_HEIGHT }}
    >
      <section
        ref={heroRef}
        id="hero"
        className="sticky top-0 flex overflow-hidden"
        style={{
          height: "100svh",
          background:
            "linear-gradient(180deg,#050c13 0%,#081a1c 46%,#0a1f18 100%)",
        }}
      >
        {/* Layer 1 (sky) is folded into the section background above: it was a
            fully occluded surface under the opaque pitch photo. */}
        <PitchLayer />
        <FogBackLayer />
        <RaysLayer />
        <MistLayer />
        <VignetteLayer />
        <FogFrontLayer />
        <LeavesLayer />
        <ParticlesLayer />

        <HeroContent onSubmit={onSubmit} onWatchFilm={onWatchFilm} />

        <TextAirLayer />
        <ScrollCue />
        <GrainLayer />
        <IntroVeil reduce={profile.reduce} />
      </section>
    </div>
  );
}
