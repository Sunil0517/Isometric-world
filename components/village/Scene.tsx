"use client";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import World from "./World";
import Player from "./Player";
import CameraControls from "./CameraControls";
import AdventureWorld from "./minigames/AdventureWorld";
import RealisticLighting from "./RealisticLighting";
import { useGame } from "@/lib/village/store";
function ContextRecovery() {
  const router = useRouter(),
    gl = useThree((s) => s.gl);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      router.push("/portfolio");
    };
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, router]);
  return null;
}
export default function Scene() {
  const quality = useGame((s) => s.quality);
  return (
    <Canvas
      orthographic
      camera={{ position: [38, 42, 38], zoom: 18, near: 0.1, far: 250 }}
      dpr={
        quality === "low"
          ? 1
          : quality === "high" || quality === "ultra"
            ? [1, 2]
            : [1, 1.5]
      }
      shadows={quality !== "low"}
      gl={{
        antialias: quality !== "low",
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        const context = gl.getContext();
        const info = context.getExtension("WEBGL_debug_renderer_info");
        const renderer = info
          ? String(context.getParameter(info.UNMASKED_RENDERER_WEBGL))
          : "";
        if (/swiftshader|llvmpipe|software/i.test(renderer))
          useGame.setState({ quality: "low" });
      }}
    >
      <ContextRecovery />
      <CameraControls />
      <Suspense fallback={null}>
        <Physics timeStep={1 / 60} gravity={[0, -18, 0]}>
          <RealisticLighting />
          <World />
          <AdventureWorld />
          <Player />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
