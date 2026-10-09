import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";
const box = new THREE.BoxGeometry(1, 1, 1);
const sphere = new THREE.IcosahedronGeometry(1, 1);
const cone = new THREE.ConeGeometry(1, 1, 7);
const cylinder = new THREE.CylinderGeometry(1, 1, 1, 8);
let realistic = false;
const mats = new Map<string, THREE.MeshStandardMaterial>();
export function material(color: string, glow = false) {
  const key = color + glow;
  if (!mats.has(key)) {
    mats.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.95,
        flatShading: true,
        emissive: glow ? color : "#000",
        emissiveIntensity: glow ? 0.65 : 0,
      }),
    );
    configureMaterial(mats.get(key)!);
  }
  return mats.get(key)!;
}
type Props = Omit<ThreeElements["mesh"], "geometry" | "material"> & {
  color: string;
  glow?: boolean;
};
export function Box({ color, glow, ...props }: Props) {
  return (
    <mesh
      geometry={box}
      material={material(color, glow)}
      castShadow
      receiveShadow
      dispose={null}
      {...props}
    />
  );
}
export function Rock({ color, ...props }: Props) {
  return (
    <mesh
      geometry={sphere}
      material={material(color)}
      castShadow
      receiveShadow
      dispose={null}
      {...props}
    />
  );
}
export function Cone({ color, ...props }: Props) {
  return (
    <mesh
      geometry={cone}
      material={material(color)}
      castShadow
      receiveShadow
      dispose={null}
      {...props}
    />
  );
}
export function Cylinder({ color, ...props }: Props) {
  return (
    <mesh
      geometry={cylinder}
      material={material(color)}
      castShadow
      receiveShadow
      dispose={null}
      {...props}
    />
  );
}
export const geometries = { box, sphere, cone, cylinder };

function configureMaterial(mat: THREE.MeshStandardMaterial) {
  mat.roughness = realistic ? 0.78 : 0.95;
  mat.onBeforeCompile = realistic
    ? (shader) => {
        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <common>",
            "#include <common>\nvarying vec3 vSurfacePosition;",
          )
          .replace(
            "#include <begin_vertex>",
            "#include <begin_vertex>\nvSurfacePosition = position;",
          );
        shader.fragmentShader = shader.fragmentShader
          .replace(
            "#include <common>",
            "#include <common>\nvarying vec3 vSurfacePosition;",
          )
          .replace(
            "#include <color_fragment>",
            `#include <color_fragment>
      float grain = fract(sin(dot(floor(vSurfacePosition * 95.0), vec3(12.9898, 78.233, 39.425))) * 43758.5453);
      float strata = sin(vSurfacePosition.y * 65.0 + sin(vSurfacePosition.x * 9.0) * 2.0);
      diffuseColor.rgb *= 0.91 + grain * 0.1 + strata * 0.035;
    `,
          );
      }
    : THREE.Material.prototype.onBeforeCompile;
  mat.customProgramCacheKey = realistic ? () => "forest-realistic-v1" : THREE.Material.prototype.customProgramCacheKey;
  mat.needsUpdate = true;
}
export function setRealisticMaterials(enabled: boolean) {
  realistic = enabled;
  mats.forEach(configureMaterial);
}
