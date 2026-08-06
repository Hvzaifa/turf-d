export const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "How it works", href: "#process" },
  { label: "Why Turf'd", href: "#why-turf-d" },
  { label: "FAQ", href: "#faq" },
  { label: "Join", href: "#join" },
];

const CONTACT = "hello@turfd.pk · Islamabad, PK";

export type NavDrawerProps = {
  open: boolean;
  onClose: () => void;
};

/** The full-height menu, and the scrim that closes it. */
export function NavDrawer({ open, onClose }: NavDrawerProps) {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0"
        style={{
          zIndex: 70,
          background: "rgba(4,48,31,.74)",
          transition: "opacity .4s ease",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
        }}
      />
      <aside
        className="fixed top-0 right-0 bottom-0 flex flex-col"
        style={{
          zIndex: 80,
          width: "100%",
          maxWidth: "440px",
          background: "#052E1E",
          borderLeft: "1px solid rgba(255,255,255,.1)",
          padding: "26px clamp(28px,5vw,44px)",
          transition: "transform .55s cubic-bezier(.16,1,.3,1)",
          transform: `translateX(${open ? "0%" : "110%"})`,
        }}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.12)",
              color: "#F5FBF7",
              fontSize: "22px",
            }}
          >
            ×
          </button>
        </div>

        <div className="flex flex-col" style={{ gap: "4px", marginTop: "36px" }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center font-display hover:text-mint"
              style={{
                gap: "16px",
                fontSize: "clamp(32px,7vw,46px)",
                color: "#F5FBF7",
                lineHeight: 1.1,
                padding: "6px 0",
              }}
            >
              <span
                className="flex-shrink-0"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: "#106043",
                }}
              />
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <p style={{ fontSize: "14px", color: "rgba(245,251,247,.6)", margin: 0 }}>{CONTACT}</p>
        </div>
      </aside>
    </>
  );
}
