import basketUrl from "../../assets/footer/basket-footer.png";
import cricketUrl from "../../assets/footer/cricket-ball-footer.png";
import fifaUrl from "../../assets/footer/fifa-footer.png";
import tennisUrl from "../../assets/footer/tennisball-footer.png";

/**
 * The footer's ball pit — design/project/Turfd Landing.dc.html
 * `initFooterPhysics`.
 *
 * Each object's physical profile must match its rendered CSS size, or the
 * simulated body and the sprite drift apart. Densities differ by ball: a
 * cricket ball is heavy and settles fast, a tennis ball is light and lively.
 */
export type BallProfile = {
  key: string;
  src: string;
  w: number;
  h: number;
  density: number;
  friction: number;
  frictionAir: number;
  restitution: number;
  /**
   * Fraction of the half-extent at which cursor force is applied. Away from
   * the centre, the push induces torque as well as translation.
   */
  offset: number;
};

const fifa = (key: string, w: number, h: number): BallProfile => ({
  key, src: fifaUrl, w, h,
  density: 0.0016, friction: 0.35, frictionAir: 0.028, restitution: 0.05, offset: 0.15,
});

const basket = (key: string, w: number, h: number): BallProfile => ({
  key, src: basketUrl, w, h,
  density: 0.0017, friction: 0.35, frictionAir: 0.028, restitution: 0.05, offset: 0.15,
});

const cricket = (key: string, w: number, h: number): BallProfile => ({
  key, src: cricketUrl, w, h,
  density: 0.0024, friction: 0.3, frictionAir: 0.03, restitution: 0.04, offset: 0.15,
});

const tennis = (key: string, w: number, h: number): BallProfile => ({
  key, src: tennisUrl, w, h,
  density: 0.001, friction: 0.4, frictionAir: 0.022, restitution: 0.06, offset: 0.15,
});

export const BALLS: readonly BallProfile[] = [
  fifa("fifa1", 98, 65.33),
  fifa("fifa2", 82, 54.67),
  fifa("fifa3", 70, 46.67),
  fifa("fifa4", 60, 40),
  fifa("fifa5", 52, 34.67),
  basket("basketball", 92, 61.33),
  basket("basketball2", 68, 45.33),
  cricket("cricketball1", 48, 32),
  cricket("cricketball2", 48, 32),
  cricket("cricketball3", 40, 26.67),
  cricket("cricketball4", 44, 29.33),
  cricket("cricketball5", 36, 24),
  tennis("tennisball1", 48, 32),
  tennis("tennisball2", 48, 32),
  tennis("tennisball3", 40, 26.67),
  tennis("tennisball4", 36, 24),
  tennis("tennisball5", 44, 29.33),
];

/** Simulation constants. */
export const PHYSICS = {
  gravityY: 0.55,
  wallThickness: 60,
  wall: { isStatic: true, restitution: 0.04, friction: 0.7 },
  /** Cursor repulsion radius, in px. */
  cursorRadius: 170,
  cursorForce: 0.0075,
  /** Chance per frame that a body gets a faint random nudge. */
  idleDriftChance: 0.012,
  idleDriftX: 0.00035,
  idleDriftY: 0.00015,
  /** Bodies are circles at this fraction of their smaller dimension. */
  radiusFactor: 0.42,
  stepMs: 1000 / 60,
} as const;

/** Reduced motion lays the objects out in a static grid instead. */
export const STATIC_GRID = { columnWidth: 130, gap: 14, inset: 8 } as const;
