import { useState } from "react";

import { useAnchorScroll } from "./lib/motion/useAnchorScroll";
import { useAnimationGating } from "./lib/motion/useAnimationGating";
import { AvailabilitySection } from "./components/availability";
import { NavDrawer, SiteNav, VideoModal } from "./components/chrome";
import { FaqSection } from "./components/faq";
import { SiteFooter } from "./components/footer";
import { Hero } from "./components/hero";
import { JoinSection } from "./components/join";
import { NetworkSection } from "./components/network";
import { ProblemSection } from "./components/problem";
import { ProcessSection } from "./components/process";

/** Sections whose looping animations should pause while off screen. */
const GATED_SECTIONS = ["#why-turf-d", "#join", "footer"];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useAnchorScroll();
  useAnimationGating(GATED_SECTIONS);

  return (
    <>
      <SiteNav onOpenMenu={() => setMenuOpen(true)} />
      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Hero onWatchFilm={() => setVideoOpen(true)} />
        <ProblemSection />
        <AvailabilitySection />
        <ProcessSection />
        <NetworkSection />
        <FaqSection />
        <JoinSection />
      </main>

      <SiteFooter />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
}
