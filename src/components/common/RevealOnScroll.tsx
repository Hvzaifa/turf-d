import { useEffect, useRef, type ElementType, type ReactNode } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";

const TRANSITION =
  "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)";

export type RevealOnScrollProps = {
  children: ReactNode;
  /** Element to render. Defaults to a plain div. */
  as?: ElementType;
  className?: string;
};

/**
 * The page-wide entrance: content rises 44px into place the first time it
 * enters the viewport, then stops being observed.
 *
 * Reduced motion opts out entirely — the content simply starts visible, which
 * is why the initial hidden state is applied from script rather than CSS.
 */
export function RevealOnScroll({
  children,
  as: Tag = "div",
  className,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const { reduce } = useMotionProfile();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(44px)";
    el.style.transition = TRANSITION;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.style.opacity = "1";
          target.style.transform = "none";
          observer.unobserve(target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [reduce]);

  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
}
