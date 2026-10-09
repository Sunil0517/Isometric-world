"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { Box, Cylinder, Rock } from "../Primitives";
import { useGame } from "@/lib/village/store";
import { activities, crystals } from "@/lib/village/minigames/config";
import { useAdventure } from "@/lib/village/minigames/store";
import { playCue } from "@/lib/village/minigames/audio";
import JungleCourse from "./JungleCourse";
function Crystal({
  position,
  id,
}: {
  position: [number, number, number];
  id: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current && !useGame.getState().reduced)
      ref.current.rotation.y += delta * 0.7;
  });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.32]} />
        <meshStandardMaterial
          color="#a9f3e6"
          emissive="#47c6b0"
          emissiveIntensity={1.4}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
        <ringGeometry args={[0.35, 0.52, 20]} />
        <meshBasicMaterial color="#9ef5da" transparent opacity={0.35} />
      </mesh>
      <Html center position={[0, 0.6, 0]} zIndexRange={[2, 0]}>
        <span className="crystal-label" aria-hidden="true">
          ✦
        </span>
      </Html>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          sensor
          args={[0.7, 1, 0.7]}
          onIntersectionEnter={({ other }) => {
            if (
              other.rigidBodyObject?.name !== "village-player" ||
              !useGame.getState().started ||
              useGame.getState().panel ||
              useAdventure.getState().activeGame
            )
              return;
            useAdventure.getState().collect(id);
            playCue("crystal");
          }}
        />
      </RigidBody>
    </group>
  );
}
export default function AdventureWorld() {
  const started = useGame((s) => s.started);
  const collected = useAdventure((s) => s.collected),
    active = useAdventure((s) => s.activeGame);
  const burst = useRef<THREE.Group>(null),
    burstUntil = useRef(0),
    lastCount = useRef(collected.length);
  useFrame(({ clock }, delta) => {
    if (!burst.current) return;
    if (lastCount.current !== collected.length) {
      lastCount.current = collected.length;
      burstUntil.current = clock.elapsedTime + 0.7;
      const c = crystals.find((c) => c.id === collected[collected.length - 1]);
      if (c) burst.current.position.set(...c.position);
      burst.current.children.forEach((p) => p.position.set(0, 0, 0));
    }
    burst.current.visible = clock.elapsedTime < burstUntil.current;
    burst.current.children.forEach((p, i) => {
      p.position.x += Math.sin(i * 2.4) * delta;
      p.position.z += Math.cos(i * 2.4) * delta;
      p.position.y += delta;
    });
  });
  return (
    <>
      {crystals
        .filter((c) => !collected.includes(c.id))
        .map((c) => (
          <Crystal key={c.id} {...c} />
        ))}
      <group ref={burst} visible={false}>
        {Array.from({ length: 10 }, (_, i) => (
          <Rock key={i} color="#a9f3e6" scale={0.055} />
        ))}
      </group>
      {active === "parkour" && <JungleCourse />}
      {activities.map((a) => (
        <group key={a.id} position={a.position}>
          {a.id === "parkour" && (
            <>
              {[-1, 1].map((side) => (
                <Cylinder
                  key={side}
                  color="#6e4a2e"
                  position={[side * 1.1, 0.95, 0]}
                  scale={[0.16, 1.9, 0.16]}
                />
              ))}
              <Box
                color="#8a5f3a"
                position={[0, 1.95, 0]}
                scale={[2.6, 0.22, 0.24]}
              />
              {[-0.8, -0.2, 0.5].map((x, i) => (
                <Rock
                  key={x}
                  color={i % 2 ? "#4fae48" : "#3f9c43"}
                  position={[x, 1.78, 0.04]}
                  scale={[0.22, 0.34, 0.1]}
                />
              ))}
              <Rock
                color="#ec5f86"
                position={[0.9, 0.2, 0.7]}
                scale={[0.4, 0.16, 0.4]}
              />
            </>
          )}
          <Html center position={[0, 2.1, 0]} zIndexRange={[4, 0]}>
            <button
              className="activity-label"
              disabled={!!active || !started}
              onClick={() => useAdventure.getState().start(a.id)}
            >
              ⚑ {a.prompt}
            </button>
          </Html>
        </group>
      ))}
    </>
  );
}
