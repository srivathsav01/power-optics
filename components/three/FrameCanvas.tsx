"use client";

import { Center, ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { buildFrame } from "@/components/three/buildFrame";
import type { Frame, FrameColor } from "@/types/frame";

/** Mutable rotation state shared with the DOM drag handlers in <FrameStage />. */
export type SpinControl = {
  rotY: number;
  tilt: number;
  velocity: number;
  dragging: boolean;
  /** performance.now() of the last user input; auto-rotate resumes a few seconds after. */
  lastInteraction: number;
};

const AUTO_SPEED = 0.45;

function Spinner({
  controlRef,
  spinKey,
  children,
}: {
  controlRef: RefObject<SpinControl>;
  spinKey: string;
  children: ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Little flourish whenever a different frame is selected
  useEffect(() => {
    controlRef.current.velocity += 7;
    groupRef.current?.scale.setScalar(0.85);
  }, [spinKey, controlRef]);

  useFrame((_, rawDt) => {
    const g = groupRef.current;
    if (!g) return;
    const dt = Math.min(rawDt, 1 / 20);
    const c = controlRef.current;
    const { damp } = THREE.MathUtils;
    if (!c.dragging) {
      const idle = performance.now() - c.lastInteraction > 3000;
      c.velocity = damp(c.velocity, idle ? AUTO_SPEED : 0, idle ? 1.5 : 2.5, dt);
      c.rotY += c.velocity * dt;
      c.tilt = damp(c.tilt, 0, 2, dt);
    }
    g.rotation.y = damp(g.rotation.y, c.rotY, 14, dt);
    g.rotation.x = damp(g.rotation.x, c.tilt, 10, dt);
    g.scale.setScalar(damp(g.scale.x, 1, 6, dt));
  });

  return <group ref={groupRef}>{children}</group>;
}

/** Keeps the whole frame in view at any rotation and aspect ratio. */
function CameraRig({ radiusRef }: { radiusRef: RefObject<number> }) {
  useFrame((state, dt) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distance = radiusRef.current / Math.sin(Math.min(vFov, hFov) / 2);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, distance, 4, Math.min(dt, 1 / 20));
    camera.position.y = camera.position.z * 0.08;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function GeneratedFrame({
  frame,
  color,
  radiusRef,
}: {
  frame: Frame;
  color: FrameColor;
  radiusRef: RefObject<number>;
}) {
  const built = useMemo(() => buildFrame(frame, color), [frame, color]);
  useEffect(() => () => built.dispose(), [built]);
  useEffect(() => {
    radiusRef.current = Math.hypot(built.size.x, built.size.z) / 2 + 0.06;
  }, [built, radiusRef]);
  return <primitive object={built.object} />;
}

function ScannedFrame({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export default function FrameCanvas({
  frame,
  color,
  controlRef,
  active,
  onReady,
}: {
  frame: Frame;
  color: FrameColor;
  controlRef: RefObject<SpinControl>;
  active: boolean;
  onReady: () => void;
}) {
  const radiusRef = useRef(0.95);

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 30, position: [0, 0.3, 4], near: 0.1, far: 20 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={onReady}
      style={{ touchAction: "pan-y" }}
    >
      {/* Studio lighting built from light panels — no HDR download needed */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 3, 2]} scale={[6, 1.5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.6} position={[-4, 0.5, 1]} scale={[2, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.6} position={[4, 0.5, 1]} scale={[2, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={1} position={[0, 0, -4]} scale={3} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#ffd9b0" position={[0, -3, 1]} scale={[6, 1, 1]} target={[0, 0, 0]} />
      </Environment>
      <ambientLight intensity={0.25} />
      <directionalLight position={[2, 4, 3]} intensity={1.1} />

      <Spinner controlRef={controlRef} spinKey={frame.slug}>
        {frame.model ? (
          <Suspense fallback={null}>
            <ScannedFrame url={frame.model} />
          </Suspense>
        ) : (
          <GeneratedFrame frame={frame} color={color} radiusRef={radiusRef} />
        )}
      </Spinner>

      <ContactShadows position={[0, -0.42, 0]} opacity={0.28} scale={3.2} blur={2.6} far={1.2} resolution={256} color="#3b2f25" />
      <CameraRig radiusRef={radiusRef} />
    </Canvas>
  );
}
