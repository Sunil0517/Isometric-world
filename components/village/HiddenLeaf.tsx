"use client";
import { Html } from "@/components/village/SceneHtml";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Box, Cylinder } from "./Primitives";
import LeafEmblem from "./LeafEmblem";

function VillageGate() {
  return (
    <group position={[0, 0, 21]}>
      <RigidBody type="fixed" colliders={false}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 3, 0, 0]}>
            <Box
              color="#70694c"
              position={[0, 0.35, 0]}
              scale={[0.9, 0.7, 0.9]}
            />
            <Cylinder
              color="#ac4837"
              position={[0, 2.5, 0]}
              scale={[0.3, 5, 0.3]}
            />
            <Box
              color="#374b3d"
              position={[0, 4.6, 0]}
              scale={[0.7, 0.22, 0.75]}
            />
            <CuboidCollider args={[0.45, 2.5, 0.45]} position={[0, 2.5, 0]} />
          </group>
        ))}
        <Box color="#ad4937" position={[0, 5.05, 0]} scale={[7.2, 0.4, 0.6]} />
        <Box color="#374b3d" position={[0, 5.36, 0]} scale={[7.8, 0.2, 0.9]} />
        <Box color="#344e43" position={[0, 4.5, 0.1]} scale={[1.2, 1.2, 0.2]} />
        <Html
          transform
          center
          position={[0, 4.5, 0.25]}
          distanceFactor={5}
          zIndexRange={[2, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="building-seal">
            <LeafEmblem size={40} />
          </div>
        </Html>
      </RigidBody>
    </group>
  );
}
export default function HiddenLeaf() {
  return (
    <>
      <VillageGate />
    </>
  );
}
