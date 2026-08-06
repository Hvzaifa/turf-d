import { AvailabilitySection } from "./components/availability";
import { Hero } from "./components/hero";
import { NetworkSection } from "./components/network";
import { ProblemSection } from "./components/problem";
import { ProcessSection } from "./components/process";

export default function App() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <AvailabilitySection />
      <ProcessSection />
      <NetworkSection />
    </main>
  );
}
