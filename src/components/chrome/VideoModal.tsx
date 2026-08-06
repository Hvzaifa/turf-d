import previewUrl from "../../assets/ui/5a-side.jpeg";

const TITLE = "Product preview";
const CAPTION = "Dropping with launch · Q4 2026";

export type VideoModalProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * The "watch the film" overlay. There is no film yet — the design ships a
 * placeholder card that says as much.
 */
export function VideoModal({ open, onClose }: VideoModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 200,
        padding: "24px",
        background: "rgba(3,12,8,.93)",
        transition: "opacity .4s ease",
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative overflow-hidden"
        style={{
          width: "min(100%,980px)",
          aspectRatio: "16/9",
          borderRadius: "18px",
          background: "linear-gradient(160deg,#0A2418,#04120C)",
          border: "1px solid rgba(255,255,255,.14)",
          boxShadow: "0 60px 140px -40px rgba(0,0,0,.9)",
          transition: "transform .55s cubic-bezier(.16,1,.3,1)",
          transform: `scale(${open ? 1 : 0.92})`,
        }}
      >
        <img
          src={previewUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.32 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 45%,rgba(4,18,12,.2),rgba(4,18,12,.75))",
          }}
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ gap: "18px", padding: "24px" }}
        >
          <span
            className="flex items-center justify-center"
            style={{
              width: "74px",
              height: "74px",
              borderRadius: "999px",
              background: "rgba(198,255,60,.14)",
              border: "1px solid rgba(198,255,60,.5)",
              animation: "glowPulse 2.8s ease-in-out infinite",
            }}
          >
            {/* A play triangle drawn with borders, as in the design. */}
            <span
              style={{
                width: 0,
                height: 0,
                borderLeft: "20px solid #C6FF3C",
                borderTop: "13px solid transparent",
                borderBottom: "13px solid transparent",
                marginLeft: "5px",
              }}
            />
          </span>
          <div
            className="font-display text-chalk uppercase"
            style={{ fontSize: "clamp(1.6rem,3.6vw,2.6rem)", letterSpacing: ".01em" }}
          >
            {TITLE}
          </div>
          <div
            className="font-mono uppercase"
            style={{ fontSize: "12px", letterSpacing: ".18em", color: "#C6FF3C" }}
          >
            {CAPTION}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute"
          style={{
            top: "16px",
            right: "16px",
            width: "42px",
            height: "42px",
            borderRadius: "999px",
            background: "rgba(4,18,12,.6)",
            border: "1px solid rgba(255,255,255,.18)",
            color: "#F5FBF7",
            fontSize: "20px",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
