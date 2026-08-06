import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

import { useReveal } from "./useReveal";

export type RevealOnScrollProps = {
  children: ReactNode;
  /** Element to render. Defaults to a plain div. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/**
 * Wrapper form of {@link useReveal}, for content that needs a container anyway.
 * When the element to reveal already exists and carries its own layout, call
 * the hook on it instead of wrapping it.
 */
export function RevealOnScroll({
  children,
  as: Tag = "div",
  className,
  style,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <Tag ref={ref} data-reveal className={className} style={style}>
      {children}
    </Tag>
  );
}
