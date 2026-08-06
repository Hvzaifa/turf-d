import { AvailabilitySection } from "./components/availability";
import { Hero } from "./components/hero";
import { ProblemSection } from "./components/problem";

export default function App() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <AvailabilitySection />
    </main>
  );
}
