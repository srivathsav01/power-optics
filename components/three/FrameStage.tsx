"use client";

import { Rotate3d } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { FrameSilhouette } from "@/components/frames/FrameSilhouette";
import type { SpinControl } from "@/components/three/FrameCanvas";
import type { Frame, FrameColor } from "@/types/frame";

// three.js only loads in the browser, and only when the stage is on screen
const FrameCanvas = dynamic(() => import("@/components/three/FrameCanvas"), { ssr: false });

const TAU = Math.PI * 2;

const views = [
  { label: "Front", angle: 0 },
  { label: "¾", angle: -Math.PI / 4 },
  { label: "Side", angle: -Math.PI / 2 },
] as const;

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * 360° viewer. Horizontal drag spins the frame; vertical swipes still scroll the page on
 * phones (touch-action: pan-y). Mouse users can also tilt. Falls back to an SVG front view.
 */
export function FrameStage({ frame, color }: { frame: Frame; color: FrameColor }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const control = useRef<SpinControl>({ rotY: 0, tilt: 0, velocity: 0, dragging: false, lastInteraction: -Infinity });
  const last = useRef({ x: 0, y: 0, t: 0 });
  const [state, setState] = useState({ inView: false, webgl: null as boolean | null });
  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let webgl: boolean | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        webgl ??= hasWebGL();
        setState({ inView: entry.isIntersecting, webgl });
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const touch = () => {
    control.current.lastInteraction = performance.now();
    if (!interacted) setInteracted(true);
  };

  /** Snap to a preset angle and hold it a little longer before auto-rotate resumes. */
  const setView = (angle: number, eventTime: number) => {
    const c = control.current;
    c.rotY = Math.round(c.rotY / TAU) * TAU + angle;
    c.velocity = 0;
    c.tilt = 0;
    // event.timeStamp shares performance.now()'s time origin
    c.lastInteraction = eventTime + 4000;
  };

  const show3d = state.webgl && (state.inView || ready);

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        tabIndex={0}
        role="img"
        aria-label={`3D view of ${frame.brand} ${frame.name} in ${color.name}. Drag or use arrow keys to rotate.`}
        className="relative aspect-[5/4] w-full cursor-grab touch-pan-y overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_40%,#fffdf8_0%,var(--color-paper-2)_75%)] select-none active:cursor-grabbing sm:aspect-[16/11]"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          control.current.dragging = true;
          control.current.velocity = 0;
          last.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
          touch();
        }}
        onPointerMove={(e) => {
          const c = control.current;
          if (!c.dragging) return;
          const dx = e.clientX - last.current.x;
          const dy = e.clientY - last.current.y;
          const dt = Math.max(1, e.timeStamp - last.current.t) / 1000;
          const k = (TAU / Math.max(e.currentTarget.clientWidth, 320)) * 1.2; // one full-width drag ≈ 1.2 turns
          c.rotY += dx * k;
          c.velocity = c.velocity * 0.5 + ((dx * k) / dt) * 0.5;
          if (e.pointerType === "mouse") c.tilt = Math.max(-0.45, Math.min(0.45, c.tilt + dy * 0.006));
          last.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
          c.lastInteraction = performance.now();
        }}
        onPointerUp={(e) => {
          const c = control.current;
          c.dragging = false;
          if (e.timeStamp - last.current.t > 80) c.velocity = 0; // held still before releasing
          c.lastInteraction = performance.now();
        }}
        onPointerCancel={() => {
          control.current.dragging = false;
        }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();
          control.current.rotY += e.key === "ArrowLeft" ? -0.35 : 0.35;
          touch();
        }}
      >
        <AnimatePresence>
          {!ready && (
            <motion.div
              key="fallback"
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-[12%]"
            >
              <FrameSilhouette frame={frame} color={color} className="w-full max-w-md" />
            </motion.div>
          )}
        </AnimatePresence>

        {show3d && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
            <FrameCanvas
              frame={frame}
              color={color}
              controlRef={control}
              active={state.inView}
              onReady={() => setReady(true)}
            />
          </div>
        )}

        <AnimatePresence>
          {ready && !interacted && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/80 px-3.5 py-2 text-xs whitespace-nowrap text-paper backdrop-blur"
            >
              <Rotate3d className="size-4" /> Drag to rotate 360°
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {state.webgl && (
        <div className="absolute top-3 right-3 flex gap-1 rounded-full bg-paper/80 p-1 backdrop-blur" role="group" aria-label="Preset views">
          {views.map((v) => (
            <button
              key={v.label}
              type="button"
              onClick={(e) => setView(v.angle, e.timeStamp)}
              className="h-8 min-w-10 rounded-full px-2.5 text-xs font-medium hover:bg-ink/5"
            >
              {v.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
