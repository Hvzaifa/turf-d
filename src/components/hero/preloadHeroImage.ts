import pitch1024Url from "../../assets/hero/new-hero-1024.webp";
import pitch1600Url from "../../assets/hero/new-hero-1600.webp";
import pitchUrl from "../../assets/hero/new-hero-graded.webp";

/**
 * Starts the hero photograph downloading as soon as the entry module is
 * evaluated, rather than when React first paints the `<img>`.
 *
 * It cannot live in `index.html`: the filenames are content-hashed at build
 * time, so the URLs only exist once Vite has resolved these imports. The
 * candidate set matches `PitchLayer` exactly — a mismatch in `imageSrcset` or
 * `imageSizes` makes the browser pick a different candidate and download the
 * photograph twice.
 */
export function preloadHeroImage() {
  if (typeof document === "undefined") return;
  if (document.querySelector("link[data-hero-preload]")) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.type = "image/webp";
  link.setAttribute("data-hero-preload", "");
  link.setAttribute("fetchpriority", "high");
  link.imageSrcset = `${pitch1024Url} 1024w, ${pitch1600Url} 1600w, ${pitchUrl} 2752w`;
  link.imageSizes = "100vw";
  link.href = pitch1600Url;
  document.head.appendChild(link);
}
