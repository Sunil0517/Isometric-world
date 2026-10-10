import type { Material } from "three";

// Keep the Standard/Physical lighting pipeline (tone mapping, shadows and IBL).
// Waves perturb the normal in world space, then convert it to view space for PBR.
export function waterShader(
  shader: Parameters<Material["onBeforeCompile"]>[0],
  time: { value: number },
) {
  shader.uniforms.uWaterTime = time;
  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      "#include <common>\nvarying vec3 vWaterWorld;",
    )
    .replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvWaterWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;",
    );
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      "#include <common>\nvarying vec3 vWaterWorld; uniform float uWaterTime;",
    )
    .replace(
      "#include <normal_fragment_maps>",
      `#include <normal_fragment_maps>
      float waveA = vWaterWorld.x * 0.85 + vWaterWorld.z * 0.55 - uWaterTime * 0.7;
      float waveB = vWaterWorld.x * -1.7 + vWaterWorld.z * 2.1 + uWaterTime * 0.95;
      vec2 slope = vec2(0.85, 0.55) * cos(waveA) * 0.055
                 + vec2(-1.7, 2.1) * cos(waveB) * 0.018;
      normal = normalize(mat3(viewMatrix) * normalize(vec3(-slope.x, 1.0, -slope.y)));
    `,
    )
    .replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      float swell = sin(vWaterWorld.x * 0.85 + vWaterWorld.z * 0.55 - uWaterTime * 0.7);
      diffuseColor.rgb *= 0.96 + 0.04 * swell;
    `,
    );
}
