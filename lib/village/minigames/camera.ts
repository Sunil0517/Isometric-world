import { checkpoints } from "./course";

export function trialFraming(
  player: { x: number; z: number },
  checkpoint: number,
  width: number,
  height: number,
  zoomRatio = 1,
) {
  const next =
    checkpoints[Math.min(Math.max(0, checkpoint + 1), checkpoints.length - 1)];
  return {
    x: player.x + (next.x - player.x) * 0.5,
    z: player.z + (next.z - player.z) * 0.5,
    zoom:
      Math.min(
        width / 22,
        Math.max(120, height - (height < 500 ? 180 : 260)) / 18,
      ) * zoomRatio,
  };
}
