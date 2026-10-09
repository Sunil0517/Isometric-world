import { locations, type VillageLocation } from "./data";
export function cameraMovement(x: number, forward: number) {
  const length = Math.hypot(x, forward);
  if (!length) return { x: 0, z: 0 };
  const scale = 1 / Math.max(1, length) / Math.SQRT2;
  return { x: (x - forward) * scale, z: (-x - forward) * scale };
}
export function nearestLocation(
  x: number,
  z: number,
  candidates: VillageLocation[] = locations,
) {
  let result: VillageLocation | null = null,
    distance = Infinity;
  for (const location of candidates) {
    // The interaction point sits just outside each building's entrance.
    const d = Math.hypot(
      x - location.position[0],
      z - (location.position[2] + 3),
    );
    if (d <= location.radius && d < distance) {
      result = location;
      distance = d;
    }
  }
  return result;
}
export function canJump(
  grounded: boolean,
  sinceGround: number,
  sincePress: number,
  coyote = 0.1,
  buffer = 0.15,
) {
  return (grounded || sinceGround < coyote) && sincePress < buffer;
}
export function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
