// Archery engine types, physics trajectory solver, target definitions and animation math

export type TargetKind =
  | "shrine"
  | "swing"
  | "windmill"
  | "post"
  | "critter"
  | "crystal"
  | "puzzle";

export interface TargetDef {
  id: string;
  kind: TargetKind;
  name: string;
  baseX: number; // 0 to 100 (% of arena width)
  baseY: number; // 0 to 100 (% of arena height)
  depth: number; // 0.2 (near) to 1.0 (far)
  radius: number; // visual hit radius in %
  pointsBullseye: number;
  pointsRing: number;
  swingSpeed?: number;
  swingAmpX?: number;
  swingAmpY?: number;
  rotSpeed?: number;
  rotRadius?: number;
}

export interface ActiveTarget {
  def: TargetDef;
  x: number;
  y: number;
  scale: number;
  angle: number;
  active: boolean;
  hitTimer: number; // time since hit for recoil/wobble
  starsAngle?: number; // for shrine orbiting stars
}

export interface ArrowFlight {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  currentZ: number; // 0 (near) to 1 (target depth)
  progress: number; // 0 to 1
  flightDuration: number;
  elapsed: number;
  power: number;
  angle: number;
  windEffect: number;
  landed: boolean;
  hitTargetId?: string;
  hitType?: "bullseye" | "ring" | "critter" | "crystal" | "puzzle" | "miss";
  pointsAwarded: number;
  trail: { x: number; y: number; z: number; alpha: number }[];
  isFireArrow?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape: "star" | "spark" | "splash" | "petal" | "feather" | "ring";
  rotation: number;
  rotSpeed: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  scale: number;
  alpha: number;
  life: number;
  maxLife: number;
  vy: number;
}

export interface CritterPatrol {
  id: string;
  x: number;
  y: number;
  minX: number;
  maxX: number;
  speed: number;
  dir: number;
  hopPhase: number;
  active: boolean;
  hitTimer: number;
}

export const ARCHERY_TARGETS: TargetDef[] = [
  // Level 1: Very easy, large stationary target
  {
    id: "l1-post",
    kind: "post",
    name: "Range Target 1",
    baseX: 50,
    baseY: 45,
    depth: 0.3,
    radius: 12,
    pointsBullseye: 100,
    pointsRing: 50,
  },
  // Level 2: Slightly further
  {
    id: "l2-post",
    kind: "post",
    name: "Range Target 2",
    baseX: 30,
    baseY: 42,
    depth: 0.5,
    radius: 9,
    pointsBullseye: 100,
    pointsRing: 50,
  },
  // Level 3: Moving swing target
  {
    id: "l3-swing",
    kind: "swing",
    name: "Hanging Vine",
    baseX: 70,
    baseY: 35,
    depth: 0.6,
    radius: 8,
    pointsBullseye: 150,
    pointsRing: 70,
    swingSpeed: 1.0,
    swingAmpX: 5,
    swingAmpY: 1,
  },
  // Level 4: Far away post
  {
    id: "l4-post",
    kind: "post",
    name: "Distant Target",
    baseX: 85,
    baseY: 38,
    depth: 0.8,
    radius: 6,
    pointsBullseye: 150,
    pointsRing: 70,
  },
  // Level 5: Windmill
  {
    id: "l5-windmill",
    kind: "windmill",
    name: "Spinning Arm",
    baseX: 50,
    baseY: 40,
    depth: 0.7,
    radius: 6,
    pointsBullseye: 200,
    pointsRing: 80,
    rotSpeed: 0.8,
    rotRadius: 5,
  },
  // Level 6: Fast swing
  {
    id: "l6-swing",
    kind: "swing",
    name: "Fast Vine",
    baseX: 20,
    baseY: 30,
    depth: 0.75,
    radius: 5,
    pointsBullseye: 200,
    pointsRing: 100,
    swingSpeed: 2.0,
    swingAmpX: 8,
    swingAmpY: 2,
  },
  // Level 7: Fast windmill
  {
    id: "l7-windmill",
    kind: "windmill",
    name: "Crazy Spinner",
    baseX: 80,
    baseY: 45,
    depth: 0.8,
    radius: 5,
    pointsBullseye: 250,
    pointsRing: 100,
    rotSpeed: 1.5,
    rotRadius: 8,
  },
  // Level 8: Very distant post
  {
    id: "l8-post",
    kind: "post",
    name: "Sniper Target",
    baseX: 10,
    baseY: 35,
    depth: 0.9,
    radius: 4,
    pointsBullseye: 300,
    pointsRing: 150,
  },
  // Level 9: Fast erratic swing
  {
    id: "l9-swing",
    kind: "swing",
    name: "Wild Vine",
    baseX: 90,
    baseY: 25,
    depth: 0.95,
    radius: 4,
    pointsBullseye: 350,
    pointsRing: 150,
    swingSpeed: 2.5,
    swingAmpX: 10,
    swingAmpY: 3,
  },
  // Level 10: Golden Shrine
  {
    id: "l10-shrine",
    kind: "shrine",
    name: "Golden Sun Shrine",
    baseX: 50,
    baseY: 28,
    depth: 1.0,
    radius: 8,
    pointsBullseye: 500,
    pointsRing: 200,
    rotSpeed: 0.5,
  },
];

export const ARCHERY_CRYSTALS: { id: string; x: number; y: number; depth: number }[] = [
  { id: "c1", x: 7, y: 50, depth: 0.45 },
  { id: "c2", x: 27, y: 51, depth: 0.55 },
  { id: "c3", x: 49, y: 50, depth: 0.65 },
  { id: "c4", x: 67, y: 55, depth: 0.6 },
  { id: "c5", x: 87, y: 58, depth: 0.5 },
  { id: "c6", x: 80, y: 52, depth: 0.6 },
];

export const ARCHERY_PUZZLES: { id: string; x: number; y: number; depth: number }[] = [
  { id: "p1", x: 21, y: 51, depth: 0.5 },
  { id: "p2", x: 28, y: 51, depth: 0.5 },
  { id: "p3", x: 78, y: 57, depth: 0.52 },
  { id: "p4", x: 92, y: 66, depth: 0.42 },
];

export const INITIAL_CRITTERS: CritterPatrol[] = [
  {
    id: "critter-1",
    x: 12,
    y: 52,
    minX: 10,
    maxX: 18,
    speed: 6,
    dir: 1,
    hopPhase: 0,
    active: true,
    hitTimer: 0,
  },
  {
    id: "critter-2",
    x: 82,
    y: 61,
    minX: 74,
    maxX: 84,
    speed: 7,
    dir: -1,
    hopPhase: Math.PI / 2,
    active: true,
    hitTimer: 0,
  },
];

/**
 * Calculates parabolic flight trajectory points for trajectory arc preview and physics flight.
 */
export function calculateTrajectoryArc(
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  power: number,
  wind: number,
  steps = 24,
): { x: number; y: number; z: number; alpha: number }[] {
  const points: { x: number; y: number; z: number; alpha: number }[] = [];
  const arcHeight = Math.max(8, 26 * (1.1 - power * 0.4)); // higher arc with lower power / longer distance

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Parabolic arc formula
    const x = startX + (targetX - startX) * t + wind * t * t * 15;
    const y = startY + (targetY - startY) * t - Math.sin(t * Math.PI) * arcHeight;
    const z = t; // 0 to 1 depth
    const alpha = 0.3 + (1 - t) * 0.7;
    points.push({ x, y, z, alpha });
  }

  return points;
}

/**
 * Check collision between an arrow at landing point and active targets / collectibles.
 */
export function checkArrowHit(
  arrowX: number,
  arrowY: number,
  targets: ActiveTarget[],
  crystals: { id: string; x: number; y: number; active: boolean }[],
  puzzles: { id: string; x: number; y: number; active: boolean }[],
  critters: CritterPatrol[],
): {
  hitType: "bullseye" | "ring" | "critter" | "crystal" | "puzzle" | "miss";
  targetId?: string;
  points: number;
  message: string;
  hitX: number;
  hitY: number;
} {
  // Check Golden Sun Shrine and Targets first
  for (const target of targets) {
    if (!target.active) continue;
    const dist = Math.hypot(arrowX - target.x, arrowY - target.y);
    const r = target.def.radius;

    if (dist <= r * 0.35) {
      // Bullseye!
      return {
        hitType: "bullseye",
        targetId: target.def.id,
        points: target.def.pointsBullseye,
        message:
          target.def.kind === "shrine"
            ? `🌟 SUN SHRINE BULLSEYE! +${target.def.pointsBullseye}`
            : `🎯 BULLSEYE! +${target.def.pointsBullseye}`,
        hitX: target.x,
        hitY: target.y,
      };
    } else if (dist <= r * 0.95) {
      // Outer Ring
      return {
        hitType: "ring",
        targetId: target.def.id,
        points: target.def.pointsRing,
        message: `✦ Ring Shot! +${target.def.pointsRing}`,
        hitX: arrowX,
        hitY: arrowY,
      };
    }
  }

  // Check Crystals
  for (const c of crystals) {
    if (!c.active) continue;
    const dist = Math.hypot(arrowX - c.x, arrowY - c.y);
    if (dist <= 3.2) {
      return {
        hitType: "crystal",
        targetId: c.id,
        points: 50,
        message: "💎 Rainbow Crystal! +50",
        hitX: c.x,
        hitY: c.y,
      };
    }
  }

  // Check Puzzles
  for (const p of puzzles) {
    if (!p.active) continue;
    const dist = Math.hypot(arrowX - p.x, arrowY - p.y);
    if (dist <= 3.4) {
      return {
        hitType: "puzzle",
        targetId: p.id,
        points: 100,
        message: "🧩 Puzzle Shard Found! +100",
        hitX: p.x,
        hitY: p.y,
      };
    }
  }

  // Check Marshmallow Critters
  for (const critter of critters) {
    if (!critter.active) continue;
    const dist = Math.hypot(arrowX - critter.x, arrowY - critter.y);
    if (dist <= 4.0) {
      return {
        hitType: "critter",
        targetId: critter.id,
        points: 80,
        message: "🍬 Marshmallow Critter! +80",
        hitX: critter.x,
        hitY: critter.y,
      };
    }
  }

  return {
    hitType: "miss",
    points: 0,
    message: "Miss · Try adjusting your aim arc!",
    hitX: arrowX,
    hitY: arrowY,
  };
}
