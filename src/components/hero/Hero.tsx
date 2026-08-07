import { useRef } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";
import { useSmoothScroll } from "../../lib/motion/useSmoothScroll";
import {
  FogLayer,
  LeavesLayer,
  MistLayer,
  PitchGradeLayers,
  PitchLayer,
  VignetteLayer,
} from "./HeroAtmosphere";
import { HeroContent, type HeroContentProps } from "./HeroContent";
import { HeroDevice } from "./HeroDevice";
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
 * Layer order (z): pitch and fog (2) → the two cross-fading grades (3) →
 * midground grade (4) → canopy and device (5) → copy (6) → intro veil (8).
 *
 * The design's rays, particles, film grain and text-air layers are gone: each
 * changed the frame by only 1-3/255 with no structure, while every
 * full-viewport layer costs the same to composite. Since then the second fog
 * sheet and the standalone vignette have gone the same way — see
 * `HeroAtmosphere` for what each removal bought.
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
        <PitchGradeLayers />
        <FogLayer />
        <MistLayer />
        <VignetteLayer />
        <LeavesLayer />
        <HeroDevice />

        <HeroContent onSubmit={onSubmit} onWatchFilm={onWatchFilm} />

        <ScrollCue />
        <IntroVeil reduce={profile.reduce} />
      </section>
    </div>
  );
}
