import { useEffect, type RefObject } from "react";

import type { MotionProfile } from "../../lib/motion/motionProfile";
import { BALLS, PHYSICS, STATIC_GRID } from "./ballPitProfiles";

type Options = {
  stageRef: RefObject<HTMLDivElement | null>;
  profile: MotionProfile;
};

/**
 * A pile of sports balls resting at the bottom of the footer, scattering away
 * from the cursor.
 *
 * Matter.js is loaded on demand: it is ~90KB and only this one decoration
 * needs it, so it should never be in the critical path.
 *
 * Visibility is driven by the stage's own rect each frame rather than an
 * IntersectionObserver. IO delivery rides the paint pipeline and can silently
 * never fire in some render contexts, which would leave the whole simulation
 * inert; a rect check inside the loop cannot get stuck that way.
 */
export function useBallPit({ stageRef, profile }: Options) {
  const { reduce } = profile;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const items = BALLS.map((ball) => ({
      ball,
      el: stage.querySelector<HTMLImageElement>(`[data-phys-item="${ball.key}"]`),
    })).filter((entry): entry is { ball: (typeof BALLS)[number]; el: HTMLImageElement } =>
      Boolean(entry.el),
    );
    if (!items.length) return;

    if (reduce) {
      const width = stage.clientWidth || 900;
      const columns = Math.max(1, Math.floor(width / STATIC_GRID.columnWidth));
      items.forEach(({ ball, el }, i) => {
        const column = i % columns;
        const row = Math.floor(i / columns);
        const x = column * (width / columns) + STATIC_GRID.inset;
        const y = row * (ball.h + STATIC_GRID.gap) + STATIC_GRID.inset;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const Matter = await import("matter-js");
      if (disposed) return;

      const { Engine, World, Bodies, Body, Events } = Matter;
      const engine = Engine.create();
      engine.gravity.y = PHYSICS.gravityY;
      const world = engine.world;

      const width = stage.clientWidth || 900;
      const height = stage.clientHeight || 240;
      const t = PHYSICS.wallThickness;
      const walls = [
        Bodies.rectangle(width / 2, -t / 2, width + t * 2, t, PHYSICS.wall),
        Bodies.rectangle(width / 2, height + t / 2, width + t * 2, t, PHYSICS.wall),
        Bodies.rectangle(-t / 2, height / 2, t, height + t * 2, PHYSICS.wall),
        Bodies.rectangle(width + t / 2, height / 2, t, height + t * 2, PHYSICS.wall),
      ];

      const bodies = items.map(({ ball, el }) => {
        const x = 20 + Math.random() * Math.max(40, width - 40);
        const y = 4 + Math.random() * 40;
        const body = Bodies.circle(x, y, Math.min(ball.w, ball.h) * PHYSICS.radiusFactor, {
          restitution: ball.restitution,
          friction: ball.friction,
          frictionAir: ball.frictionAir,
          density: ball.density,
          angle: (Math.random() * 2 - 1) * Math.PI,
        });
        const direction = Math.random() < 0.5 ? 1 : -1;
        Body.setVelocity(body, { x: (Math.random() * 2 - 1) * 1.4, y: Math.random() * 0.6 });
        Body.setAngularVelocity(body, (Math.random() * 2 - 1) * 0.05);
        return {
          body,
          el,
          w: ball.w,
          h: ball.h,
          offsetX: direction * ball.offset * ball.w * 0.4,
          offsetY: direction * ball.offset * ball.h * 0.15,
        };
      });

      World.add(world, [...walls, ...bodies.map((b) => b.body)]);

      let cursor: { x: number; y: number } | null = null;
      const onMove = (event: PointerEvent) => {
        const rect = stage.getBoundingClientRect();
        cursor = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      };
      const onLeave = () => {
        cursor = null;
      };
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);

      const beforeUpdate = () => {
        for (const { body, offsetX, offsetY } of bodies) {
          // A faint random nudge so the pile never fully freezes — random
          // rather than patterned, and small enough to stay believable.
          if (Math.random() < PHYSICS.idleDriftChance) {
            Body.applyForce(body, body.position, {
              x: (Math.random() * 2 - 1) * PHYSICS.idleDriftX,
              y: -Math.random() * PHYSICS.idleDriftY,
            });
          }
          if (!cursor) continue;

          const dx = body.position.x - cursor.x;
          const dy = body.position.y - cursor.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (distance >= PHYSICS.cursorRadius) continue;

          // Full push directly away from the cursor — strong enough to briefly
          // beat gravity, so objects scatter rather than sliding along the floor.
          const falloff = 1 - distance / PHYSICS.cursorRadius;
          const force = falloff * falloff * PHYSICS.cursorForce;
          Body.applyForce(
            body,
            { x: body.position.x + offsetX, y: body.position.y + offsetY },
            { x: (dx / distance) * force, y: (dy / distance) * force },
          );
        }
      };
      Events.on(engine, "beforeUpdate", beforeUpdate);

      let looping = true;
      const loop = () => {
        if (!looping) return;
        const rect = stage.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          Engine.update(engine, PHYSICS.stepMs);
          for (const { body, el, w, h } of bodies) {
            el.style.transform = `translate(${body.position.x - w / 2}px,${
              body.position.y - h / 2
            }px) rotate(${body.angle}rad)`;
          }
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);

      cleanup = () => {
        looping = false;
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
        Events.off(engine, "beforeUpdate", beforeUpdate);
        World.clear(world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [stageRef, reduce]);
}
