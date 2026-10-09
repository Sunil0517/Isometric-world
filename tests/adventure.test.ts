import { beforeEach, describe, expect, it } from "vitest";
import { useAdventure, adventureRuntime } from "../lib/village/minigames/store";
import { useGame } from "../lib/village/store";
import {
  crystals,
  nearestActivity,
} from "../lib/village/minigames/config";

beforeEach(() => {
  useAdventure.setState({
    activeGame: null,
    phase: "idle",
    collected: [],
    achievements: [],
    completedGames: [],
    personalBests: {},
    garden: [null, null, null],
  });
  useGame.setState({ panel: null });
});
describe("adventure lifecycle and rewards", () => {
  it("keeps the shortest parkour time across rounds", () => {
    const s = useAdventure.getState();
    for (const time of [12, 10, 15]) {
      s.start("parkour");
      s.play();
      s.complete(time);
    }
    expect(useAdventure.getState().personalBests.parkour).toBe(10);
    expect(adventureRuntime.respawn).not.toBeNull();
  });
  it("collects only known crystals once and rewards the complete set", () => {
    const s = useAdventure.getState();
    s.collect("unknown");
    for (const c of crystals) {
      s.collect(c.id);
      s.collect(c.id);
    }
    expect(useAdventure.getState().collected).toHaveLength(8);
    expect(useAdventure.getState().achievements).toEqual(["crystals"]);
  });
});
describe("activity input and scoring", () => {
  it("selects an activity only within its interaction radius", () => {
    expect(nearestActivity(-7, 11.5)?.id).toBe("parkour");
    expect(nearestActivity(0, 5)).toBeNull();
  });
});
