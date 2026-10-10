import { beforeEach, describe, expect, it } from "vitest";
import {
  KILL_Y,
  MAX_HEARTS,
  PLAYER_CENTER_OFFSET,
  checkpoints,
  collectibles,
  evaluateHazards,
  footprintGap,
  gruntPosition,
  grunts,
  logPosition,
  logs,
  nearestCheckpointIndex,
  parkourStars,
  platformById,
  platforms,
  swingBall,
  swings,
  totalGems,
} from "../lib/village/minigames/course";
import { adventureRuntime, useAdventure } from "../lib/village/minigames/store";
import { MAX_ZOOM, useGame } from "../lib/village/store";

beforeEach(() => {
  useAdventure.setState({
    activeGame: null,
    phase: "idle",
    achievements: [],
    completedGames: [],
    personalBests: {},
    parkourBest: { gems: 0, stars: 0 },
  });
  useGame.setState({ panel: null });
  adventureRuntime.player.x = 0;
});

describe("jungle course layout", () => {
  it("keeps every consecutive flag platform within one jump of the route", () => {
    // Rafts, a spring and a boost pad bridge the larger gaps on purpose.
    const walkable = [
      ["I0", "B1"],
      ["B1", "I1"],
      ["I1", "s1"],
      ["s1", "s2"],
      ["s2", "s3"],
      ["s3", "I2"],
      ["t1", "t2"],
      ["t2", "t3"],
      ["t3", "t4"],
      ["t4", "I4"],
      ["I5", "B4"],
      ["B4", "I6"],
      ["I6", "B5"],
      ["I7", "u1"],
      ["u1", "u2"],
      ["u2", "u3"],
      ["u3", "u4"],
      ["u4", "I8"],
      ["I8", "v1"],
      ["v1", "v2"],
      ["v2", "I9"],
      ["I9", "B6"],
      ["B6", "I10"],
      ["I10", "w1"],
      ["w1", "w2"],
      ["w2", "w3"],
      ["w3", "I11"],
    ];
    for (const [a, b] of walkable) {
      const from = platformById(a),
        to = platformById(b);
      expect(footprintGap(from, to), `${a}→${b} gap`).toBeLessThanOrEqual(1.7);
      // Only climbs matter; a normal jump clears well over this.
      expect(to.y - from.y, `${a}→${b} climb`).toBeLessThanOrEqual(0.6);
    }
  });
  it("uses unique ids and gives each flag a platform", () => {
    expect(new Set(platforms.map((p) => p.id)).size).toBe(platforms.length);
    expect(new Set(collectibles.map((c) => c.id)).size).toBe(
      collectibles.length,
    );
    expect(checkpoints).toHaveLength(12);
    expect(totalGems).toBeGreaterThanOrEqual(40);
  });
  it("detects a flag only on top of its platform", () => {
    const c = checkpoints[2];
    expect(nearestCheckpointIndex(c.x, c.y + PLAYER_CENTER_OFFSET, c.z)).toBe(
      2,
    );
    expect(nearestCheckpointIndex(c.x, c.y + 3, c.z)).toBe(-1);
    expect(
      nearestCheckpointIndex(c.x + 9, c.y + PLAYER_CENTER_OFFSET, c.z),
    ).toBe(-1);
    expect(KILL_Y).toBeLessThan(0);
  });
});

describe("advanced jungle stages", () => {
  it("introduces narrower landings and hazards without blocking the route", () => {
    expect(platformById("v1").w).toBeLessThan(platformById("s1").w);
    expect(platformById("B6").d).toBeLessThan(platformById("B5").d);
    expect(logs.find((l) => l.id === "L4")!.period).toBeLessThan(
      logs.find((l) => l.id === "L1")!.period,
    );
    expect(swings.some((w) => w.id === "W6")).toBe(true);
    expect(checkpoints.at(-1)?.id).toBe("I11");
  });
  it("clamps manual zoom and restores it for a new run", () => {
    const s = useAdventure.getState();
    s.setTrialZoom(9);
    expect(useAdventure.getState().trialZoom).toBe(2.2);
    s.setTrialZoom(-1);
    expect(useAdventure.getState().trialZoom).toBe(0.6);
    s.start("parkour");
    s.play();
    expect(useAdventure.getState().trialZoom).toBe(1);
  });
});

describe("jungle hazards", () => {
  const nobody = new Set<string>();
  it("hurts a player standing in a rolling log's path but not one jumping over it", () => {
    const l = logs[0],
      [x, y, z] = logPosition(l, 0);
    const standing = { x, y: l.y + PLAYER_CENTER_OFFSET, z, vy: 0 };
    expect(evaluateHazards(standing, 0, nobody)).toEqual([
      expect.objectContaining({ kind: "hurt", id: l.id }),
    ]);
    const leaping = {
      ...standing,
      y: y + l.radius + 1.1 + PLAYER_CENTER_OFFSET,
    };
    expect(evaluateHazards(leaping, 0, nobody)).toEqual([]);
  });
  it("hurts on a swinging spiked ball and never when far away", () => {
    const w = swings[0],
      [x, y, z] = swingBall(w, 0);
    expect(
      evaluateHazards({ x, y, z, vy: 0 }, 0, nobody).some((e) => e.id === w.id),
    ).toBe(true);
    expect(evaluateHazards({ x: 0, y: 1, z: 0, vy: 0 }, 0, nobody)).toEqual([]);
  });
  it("lets a falling player stomp a grunt but hurts a side-on touch", () => {
    const g = grunts[0],
      [x, y, z] = gruntPosition(g, 0);
    const above = { x, z, y: y + 0.85 + PLAYER_CENTER_OFFSET, vy: -4 };
    expect(evaluateHazards(above, 0, nobody)).toEqual([
      { kind: "stomp", id: g.id },
    ]);
    const side = { x, z, y: y + PLAYER_CENTER_OFFSET, vy: 0 };
    expect(evaluateHazards(side, 0, nobody)[0]).toMatchObject({ kind: "hurt" });
    expect(evaluateHazards(side, 0, new Set([g.id]))).toEqual([]);
  });
  it("keeps patrolling grunts on their section for any time", () => {
    for (const g of grunts)
      for (let t = 0; t < 60; t += 0.7) {
        const [, , z] = gruntPosition(g, t),
          lo = Math.min(g.a[2], g.b[2]),
          hi = Math.max(g.a[2], g.b[2]);
        expect(z).toBeGreaterThanOrEqual(lo - 1e-6);
        expect(z).toBeLessThanOrEqual(hi + 1e-6);
      }
  });
});

describe("hearts, gems and stars", () => {
  it("frames the trial even when entering from first-person at minimum zoom", () => {
    useGame.setState({ view: "first-person", zoom: 0.75 });
    const s = useAdventure.getState();
    s.start("parkour");
    s.play();
    expect(useGame.getState().view).toBe("birdseye");
    expect(useGame.getState().zoom).toBe(MAX_ZOOM);
  });
  it("awards one star for finishing and more for gems and hearts", () => {
    expect(parkourStars(0, 1)).toBe(1);
    expect(parkourStars(Math.ceil(totalGems * 0.6), 1)).toBe(2);
    expect(parkourStars(totalGems, 1)).toBe(2);
    expect(parkourStars(totalGems, 3)).toBe(3);
  });
  it("ends the run when the last heart is lost and keeps best stars on a win", () => {
    const s = useAdventure.getState();
    s.start("parkour");
    s.play();
    expect(useAdventure.getState().hearts).toBe(MAX_HEARTS);
    expect(useAdventure.getState().checkpoint).toBe(0);
    for (let i = 0; i < MAX_HEARTS - 1; i++) s.hurt();
    expect(useAdventure.getState().phase).toBe("playing");
    s.hurt();
    expect(useAdventure.getState().phase).toBe("result");
    expect(useAdventure.getState().stars).toBe(0);
    expect(useAdventure.getState().completedGames).not.toContain("parkour");
    s.play();
    useAdventure.setState({ gems: totalGems });
    s.complete(80);
    expect(useAdventure.getState().stars).toBe(3);
    expect(useAdventure.getState().parkourBest).toEqual({
      gems: totalGems,
      stars: 3,
    });
    expect(useAdventure.getState().achievements).toContain("parkour");
  });
  it("restores lost hearts and banks extra lives when full", () => {
    const s = useAdventure.getState();
    s.start("parkour");
    s.play();
    s.hurt();
    s.heal();
    s.heal();
    expect(useAdventure.getState().hearts).toBe(MAX_HEARTS + 1);
    s.hurt();
    expect(useAdventure.getState().hearts).toBe(MAX_HEARTS);
    s.heal();
    s.heal();
    expect(useAdventure.getState().hearts).toBe(MAX_HEARTS + 2);
  });
  it("sends the player home only when they actually entered the arena", () => {
    const s = useAdventure.getState();
    s.start("parkour");
    adventureRuntime.respawn = null;
    s.exit();
    expect(adventureRuntime.respawn).toBeNull();
    s.start("parkour");
    adventureRuntime.player.x = 100;
    s.exit();
    expect(adventureRuntime.respawn).not.toBeNull();
  });
});
