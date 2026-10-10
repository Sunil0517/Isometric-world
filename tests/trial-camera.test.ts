import { describe, expect, it } from "vitest";
import { OrthographicCamera, Vector3 } from "three";
import { trialFraming } from "../lib/village/minigames/camera";
import {
  checkpoints,
  PLAYER_CENTER_OFFSET,
} from "../lib/village/minigames/course";

describe("mobile trial framing", () => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [760, 430],
  ]) {
    it(`keeps every stage's current and next flags in view at ${width}x${height}`, () => {
      for (let i = 0; i < checkpoints.length; i++) {
        const current = checkpoints[i],
          next = checkpoints[Math.min(i + 1, checkpoints.length - 1)];
        const framing = trialFraming(current, i, width, height);
        const camera = new OrthographicCamera(
          -width / 2,
          width / 2,
          height / 2,
          -height / 2,
          0.1,
          250,
        );
        camera.zoom = framing.zoom;
        const target = new Vector3(
          framing.x,
          current.y + PLAYER_CENTER_OFFSET,
          framing.z,
        );
        camera.position.copy(target).add(new Vector3(38, 42, 38));
        camera.lookAt(target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        for (const flag of [current, next]) {
          const projected = new Vector3(
            flag.x,
            flag.y + PLAYER_CENTER_OFFSET,
            flag.z,
          ).project(camera);
          expect(Math.abs(projected.x), `flag ${flag.id}`).toBeLessThan(0.9);
          const screenY = ((1 - projected.y) * height) / 2;
          expect(screenY, `flag ${flag.id} clears the HUD`).toBeGreaterThan(
            height < 500 ? 100 : 168,
          );
          expect(screenY, `flag ${flag.id} clears touch controls`).toBeLessThan(
            height - (height < 500 ? 88 : 116),
          );
        }
      }
    });
  }
});
