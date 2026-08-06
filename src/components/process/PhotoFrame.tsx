import type {
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
  RefObject,
} from "react";

export type PhotoFrameProps = HTMLAttributes<HTMLDivElement> & {
  src: string;
  alt: string;
  /** Intrinsic dimensions, so the frame reserves space before the image loads. */
  width: number;
  height: number;
  /** The frame's own height — a clamp() expression in every current use. */
  frameHeight: string;
  objectPosition: string;
  /** Ambient drift duration, e.g. "19s". Omit for a still photograph. */
  driftDuration?: string;
  frameRef?: RefObject<HTMLDivElement | null>;
  imageRef?: RefObject<HTMLImageElement | null>;
  /** Extra attributes for the <img> itself, e.g. the design's data hooks. */
  imageProps?: ImgHTMLAttributes<HTMLImageElement> & {
    [dataAttribute: `data-${string}`]: string;
  };
  /** Overlay content — a label or caption positioned against the frame. */
  children?: ReactNode;
};

/**
 * A full-bleed photograph in a fixed-height frame.
 *
 * The drift starts paused: whichever beat owns this frame releases it once its
 * entrance has finished, and pauses it again when the frame leaves the viewport.
 */
export function PhotoFrame({
  src,
  alt,
  width,
  height,
  frameHeight,
  objectPosition,
  driftDuration,
  frameRef,
  imageRef,
  imageProps,
  children,
  style,
  ...frameProps
}: PhotoFrameProps) {
  return (
    <div
      ref={frameRef}
      className="relative w-full overflow-hidden"
      style={{ height: frameHeight, background: "#06140E", ...style }}
      {...frameProps}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition,
          ...(driftDuration
            ? {
                animation: `envDrift ${driftDuration} ease-in-out infinite alternate`,
                animationPlayState: "paused",
                willChange: "transform",
              }
            : null),
        }}
        {...imageProps}
      />
      {children}
    </div>
  );
}
