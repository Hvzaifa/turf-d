import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { preloadHeroImage } from "./components/hero/preloadHeroImage";
import "./index.css";

// Before the first render: the hero photograph is the largest contentful paint.
preloadHeroImage();

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
