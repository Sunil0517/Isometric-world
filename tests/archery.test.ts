import { describe, expect, it } from "vitest";
import {
  calculateTrajectoryArc,
  checkArrowHit,
  ARCHERY_TARGETS,
  type ActiveTarget,
  type CritterPatrol,
} from "../lib/village/minigames/archery";

describe("archery trajectory and physics", () => {
  it("computes parabolic arc points connecting bow to target", () => {
    const points = calculateTrajectoryArc(45, 75, 50, 30, 0.85, 0, 10);
    expect(points).toHaveLength(11);
    expect(points[0].x).toBe(45);
    expect(points[10].x).toBe(50);
    expect(points[10].z).toBe(1);
    // Midpoint should have arc elevation
    expect(points[5].y).toBeLessThan(points[0].y);
  });

  it("factors wind into horizontal trajectory displacement", () => {
    const calm = calculateTrajectoryArc(45, 75, 50, 30, 0.85, 0, 10);
    const windy = calculateTrajectoryArc(45, 75, 50, 30, 0.85, 0.2, 10);
    expect(windy[10].x).toBeGreaterThan(calm[10].x);
  });
});

describe("archery target hit detection", () => {
  const targets: ActiveTarget[] = ARCHERY_TARGETS.map((t) => ({
    def: t,
    x: t.baseX,
    y: t.baseY,
    scale: 1,
    angle: 0,
    active: true,
    hitTimer: 0,
  }));

  const crystals = [{ id: "c1", x: 20, y: 50, active: true, depth: 0.5 }];
  const puzzles = [{ id: "p1", x: 80, y: 50, active: true, depth: 0.5 }];
  const critters: CritterPatrol[] = [
    {
      id: "critter-1",
      x: 15,
      y: 52,
      minX: 10,
      maxX: 20,
      speed: 5,
      dir: 1,
      hopPhase: 0,
      active: true,
      hitTimer: 0,
    },
  ];

  it("detects bullseye on Golden Sun Shrine", () => {
    const hit = checkArrowHit(50, 28, targets, crystals, puzzles, critters);
    expect(hit.hitType).toBe("bullseye");
    expect(hit.targetId).toBe("l10-shrine");
    expect(hit.points).toBe(500);
    expect(hit.message).toContain("+500");
  });

  it("detects crystal and puzzle piece hits", () => {
    const crystalHit = checkArrowHit(20, 50, targets, crystals, puzzles, critters);
    expect(crystalHit.hitType).toBe("crystal");
    expect(crystalHit.points).toBe(50);

    const puzzleHit = checkArrowHit(80, 50, targets, crystals, puzzles, critters);
    expect(puzzleHit.hitType).toBe("puzzle");
    expect(puzzleHit.points).toBe(100);
  });

  it("detects critter hits", () => {
    const critterHit = checkArrowHit(15, 52, targets, crystals, puzzles, critters);
    expect(critterHit.hitType).toBe("critter");
    expect(critterHit.points).toBe(80);
  });

  it("returns miss for shots off target", () => {
    const miss = checkArrowHit(0, 0, targets, crystals, puzzles, critters);
    expect(miss.hitType).toBe("miss");
    expect(miss.points).toBe(0);
  });
});
