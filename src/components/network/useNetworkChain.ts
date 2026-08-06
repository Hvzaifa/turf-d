import { useEffect, type RefObject } from "react";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import {
  ADJACENCY,
  CARD_BASE_TRANSFORM,
  CHAIN,
  PATH_ENDPOINTS,
  type ChainStep,
  type NodeId,
} from "./networkGeometry";
import {
  ARRIVAL_SLACK_MS,
  FINAL_SETTLE_MS,
  NODE_FLASH_MS,
  NODE_STATE,
  PATH_HOVER,
  PATH_TRAVELLED,
  RING,
  START_DELAY_MS,
  STEP_DURATION_MS,
  STEP_GAP_MS,
  VISIBILITY_RATIO,
} from "./networkMotion";

type Options = {
  rootRef: RefObject<HTMLDivElement | null>;
  profile: MotionProfile;
};

/**
 * Runs one booking around the ring: a pulse leaves the centre, travels each
 * edge in turn, and lights the node and card it arrives at before moving on.
 *
 * The whole thing plays once, the first time the diagram is 30% on screen.
 * Hovering any node or card then highlights that node's direct connections and
 * dims everything else.
 */
export function useNetworkChain({ rootRef, profile }: Options) {
  const { reduce } = profile;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const center = root.querySelector<HTMLElement>("[data-wtd-center]");
    if (!center) return;

    const particle = root.querySelector<SVGCircleElement>("[data-wtd-particle]");
    const ring = root.querySelector<SVGCircleElement>("[data-wtd-pulse-ring]");
    const nodes = Array.from(root.querySelectorAll<SVGCircleElement>("[data-wtd-node]"));
    const paths = Array.from(root.querySelectorAll<SVGPathElement>("[data-wtd-path]"));
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-wtd-card]"));

    const nodeById = (id: NodeId) =>
      root.querySelector<SVGCircleElement>(`[data-wtd-node="${id}"]`);
    const cardById = (id: NodeId) =>
      root.querySelector<HTMLElement>(`[data-wtd-card="${id}"]`);

    // Reduced motion: land everything in its finished state, no chain.
    if (reduce) {
      center.style.opacity = "1";
      center.style.transform = "translate(-50%,-50%) scale(1)";
      for (const path of paths) {
        path.style.strokeDashoffset = "0";
        path.style.stroke = "rgba(245,251,247,.22)";
      }
      for (const node of nodes) {
        node.setAttribute("opacity", NODE_STATE.visited.opacity);
        node.setAttribute("fill", NODE_STATE.visited.fill);
        node.style.transform = NODE_STATE.visited.scale;
        node.dataset.activated = "1";
      }
      for (const card of cards) {
        card.style.opacity = "1";
        card.style.transform = "none";
      }
      for (const dot of root.querySelectorAll<HTMLElement>("[data-wtd-dot]")) {
        dot.style.opacity = "1";
      }
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const frames: number[] = [];
    const wait = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    const frame = (fn: () => void) => frames.push(requestAnimationFrame(fn));

    let activeCard: HTMLElement | null = null;
    let activeCardBase = "";

    const activate = (step: ChainStep, onDone: () => void) => {
      const path = root.querySelector<SVGPathElement>(`[data-wtd-path="${step.path}"]`);
      const node = step.node ? nodeById(step.node) : null;
      const card = step.card ? cardById(step.card) : null;
      const dots = card ? Array.from(card.querySelectorAll<HTMLElement>("[data-wtd-dot]")) : [];
      const base = (step.card && CARD_BASE_TRANSFORM[step.card]) || "";

      if (path) path.style.transition = `stroke-dashoffset ${STEP_DURATION_MS}ms linear`;

      if (particle) {
        // Jump the pulse to the start with no transition, force a reflow so the
        // move isn't coalesced, then let it travel.
        particle.style.transition = "none";
        particle.setAttribute("cx", String(step.from.x));
        particle.setAttribute("cy", String(step.from.y));
        particle.style.opacity = "1";
        void particle.getBoundingClientRect();
        particle.style.transition = `cx ${STEP_DURATION_MS}ms linear, cy ${STEP_DURATION_MS}ms linear`;
      }

      const depart = () => {
        if (path) path.style.strokeDashoffset = "0";
        if (particle) {
          particle.setAttribute("cx", String(step.to.x));
          particle.setAttribute("cy", String(step.to.y));
        }
      };
      frame(depart);
      // Belt and braces: a dropped frame on mount would otherwise strand the
      // pulse at its origin for the whole step.
      wait(depart, 20);

      wait(() => {
        if (node) {
          node.setAttribute("opacity", NODE_STATE.active.opacity);
          node.setAttribute("fill", NODE_STATE.active.fill);
          node.dataset.activated = "1";
          node.style.transform = NODE_STATE.active.scale;
        }
        if (path) path.style.stroke = PATH_TRAVELLED;
        if (particle) particle.style.opacity = "0";

        if (ring) {
          ring.setAttribute("cx", String(step.to.x));
          ring.setAttribute("cy", String(step.to.y));
          ring.style.transition = "none";
          ring.setAttribute("r", String(RING.from));
          ring.style.opacity = RING.fromOpacity;
          void ring.getBoundingClientRect();
          ring.style.transition = RING.transition;
          frame(() => {
            ring.setAttribute("r", String(RING.to));
            ring.style.opacity = "0";
          });
        }

        if (activeCard && activeCard !== card) {
          activeCard.style.transform = `${activeCardBase ? `${activeCardBase} ` : ""}scale(1)`;
          activeCard.style.opacity = "0.55";
        }
        if (card) {
          card.style.opacity = "1";
          card.style.transform = `${base ? `${base} ` : ""}scale(1.03)`;
        }
        for (const dot of dots) dot.style.opacity = "1";
        activeCard = card;
        activeCardBase = base;

        if (step.closeLoop) {
          const loopNode = nodeById("live-discovery");
          if (loopNode) {
            loopNode.style.transform = NODE_STATE.loopBack.scale;
            loopNode.setAttribute("opacity", NODE_STATE.loopBack.opacity);
            loopNode.setAttribute("fill", NODE_STATE.loopBack.fill);
            wait(() => {
              loopNode.style.transform = NODE_STATE.visited.scale;
              loopNode.setAttribute("opacity", NODE_STATE.visited.opacity);
              loopNode.setAttribute("fill", NODE_STATE.visited.fill);
            }, NODE_FLASH_MS);
          }
        }

        wait(() => {
          if (node) {
            node.style.transform = NODE_STATE.visited.scale;
            node.setAttribute("opacity", NODE_STATE.visited.opacity);
            node.setAttribute("fill", NODE_STATE.visited.fill);
          }
        }, NODE_FLASH_MS);

        onDone();
      }, STEP_DURATION_MS + ARRIVAL_SLACK_MS);
    };

    const run = () => {
      center.style.opacity = "1";
      center.style.transform = "translate(-50%,-50%) scale(1)";
      wait(() => {
        const next = (i: number) => {
          if (i >= CHAIN.length) {
            if (activeCard) {
              const card = activeCard;
              const base = activeCardBase;
              wait(() => {
                card.style.transform = `${base ? `${base} ` : ""}scale(1)`;
              }, FINAL_SETTLE_MS);
            }
            return;
          }
          activate(CHAIN[i], () => wait(() => next(i + 1), STEP_GAP_MS));
        };
        next(0);
      }, START_DELAY_MS);
    };

    // Fire on the first frame where enough of the diagram is actually visible.
    // A plain IntersectionObserver threshold is not enough on its own: the
    // diagram can be taller than the viewport, in which case it never reaches
    // 30% intersection of its own box.
    let fired = false;
    let observer: IntersectionObserver | undefined;
    const checkVisible = () => {
      if (fired) return;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (rect.height > 0 && visible / rect.height >= VISIBILITY_RATIO) {
        fired = true;
        window.removeEventListener("scroll", checkVisible);
        window.removeEventListener("resize", checkVisible);
        observer?.disconnect();
        run();
      }
    };
    window.addEventListener("scroll", checkVisible, { passive: true });
    window.addEventListener("resize", checkVisible, { passive: true });
    checkVisible();
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) checkVisible();
      },
      { threshold: VISIBILITY_RATIO },
    );
    observer.observe(root);

    // Hover: light a node's direct connections, dim everything else.
    const highlight = (nodeId: NodeId) => {
      const lit = ADJACENCY[nodeId] ?? [];
      const neighbours = new Set<string>([nodeId]);
      for (const pathId of lit) {
        for (const end of PATH_ENDPOINTS[pathId] ?? []) neighbours.add(end);
      }
      for (const node of nodes) {
        node.setAttribute(
          "opacity",
          neighbours.has(node.getAttribute("data-wtd-node") ?? "")
            ? NODE_STATE.highlighted
            : NODE_STATE.dimmed,
        );
      }
      for (const path of paths) {
        path.style.opacity = lit.includes(path.getAttribute("data-wtd-path") ?? "")
          ? PATH_HOVER.active
          : PATH_HOVER.dimmed;
      }
    };
    const resetHighlight = () => {
      for (const node of nodes) {
        node.setAttribute(
          "opacity",
          node.dataset.activated === "1" ? NODE_STATE.visited.opacity : NODE_STATE.idle.opacity,
        );
      }
      for (const path of paths) path.style.opacity = "";
    };

    const bindings: Array<[Element, () => void]> = [];
    const bind = (el: Element, id: NodeId) => {
      const enter = () => highlight(id);
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", resetHighlight);
      bindings.push([el, enter]);
    };
    for (const node of nodes) bind(node, node.getAttribute("data-wtd-node") as NodeId);
    for (const card of cards) bind(card, card.getAttribute("data-wtd-card") as NodeId);

    return () => {
      for (const timer of timers) clearTimeout(timer);
      for (const id of frames) cancelAnimationFrame(id);
      window.removeEventListener("scroll", checkVisible);
      window.removeEventListener("resize", checkVisible);
      observer?.disconnect();
      for (const [el, enter] of bindings) {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", resetHighlight);
      }
    };
  }, [rootRef, reduce]);
}
