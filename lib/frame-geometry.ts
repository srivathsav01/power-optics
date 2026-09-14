import type { FrameMaterial, FrameShape } from "@/types/frame";

/**
 * Pure 2D maths for frame outlines, in millimetres (y up, lens centred at origin,
 * +x towards the temple). Shared by the 3D model and the SVG card silhouettes so
 * both always match the catalog's shape and measurements.
 */
export type Pt = [number, number];

const TAU = Math.PI * 2;

const superellipse = (t: number, n: number): Pt => {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [Math.sign(c) * Math.abs(c) ** (2 / n), Math.sign(s) * Math.abs(s) ** (2 / n)];
};

/** Unit-ish outline for a shape (x, y roughly in [-1, 1]); normalised afterwards. */
function rawPoint(shape: FrameShape, t: number): Pt {
  switch (shape) {
    case "round":
      return superellipse(t, 2);
    case "oval":
      return superellipse(t, 2.2);
    case "rectangle":
      return superellipse(t, 4.5);
    case "square":
      return superellipse(t, 3.6);
    case "wayfarer": {
      const [x, y] = superellipse(t, 3.4);
      // wider across the top, outer top corner lifted
      return [x * (1 + 0.1 * y), y + (y > 0 ? 0.14 * Math.max(0, x) * y : 0)];
    }
    case "cat-eye": {
      const [x, y] = superellipse(t, 2.8);
      const outer = Math.max(0, x);
      // outer top corner sweeps up; bottom edge rises towards the temple
      if (y > 0) return [x, y + 0.75 * outer ** 3 * y];
      return [x, y * (1 - 0.35 * outer)];
    }
    case "aviator": {
      // flat top, teardrop droop towards the nose
      const [x, yTop] = superellipse(t, 3.6);
      const [, yBottom] = superellipse(t, 2.2);
      if (Math.sin(t) >= 0) return [x, yTop];
      return [x, yBottom * (0.72 + 0.42 * ((1 - x) / 2))];
    }
    case "hexagon": {
      const seg = Math.PI / 3;
      const hex = Math.cos(seg / 2) / Math.cos((((t % seg) + seg) % seg) - seg / 2);
      const r = 0.82 * hex + 0.18;
      return [r * Math.cos(t), r * Math.sin(t)];
    }
  }
}

/** Closed, counter-clockwise lens outline scaled to exactly width × height. */
export function lensOutline(shape: FrameShape, width: number, height: number, segments = 128): Pt[] {
  const raw: Pt[] = [];
  for (let i = 0; i < segments; i++) raw.push(rawPoint(shape, (i / segments) * TAU));

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of raw) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const sx = width / (maxX - minX);
  const sy = height / (maxY - minY);
  return raw.map(([x, y]) => [(x - cx) * sx, (y - cy) * sy]);
}

/** Moves each point along its outward normal. Positive = grow. */
export function offsetOutline(pts: Pt[], distance: number): Pt[] {
  const n = pts.length;
  return pts.map(([x, y], i) => {
    const [px, py] = pts[(i - 1 + n) % n];
    const [nx, ny] = pts[(i + 1) % n];
    const tx = nx - px;
    const ty = ny - py;
    const len = Math.hypot(tx, ty) || 1;
    return [x + (ty / len) * distance, y + (-tx / len) * distance];
  });
}

/** Open arc over the top of the lens, used for half-rim (browline) frames. */
export function upperArc(pts: Pt[]): Pt[] {
  const n = pts.length;
  const start = Math.round(n * 0.97);
  const end = Math.round(n * 0.53);
  const arc: Pt[] = [];
  for (let i = start; i !== end; i = (i + 1) % n) arc.push(pts[i]);
  return arc;
}

/** x of the outline's nasal (negative-x) edge at height y. */
export const nasalEdgeX = (pts: Pt[], y: number) => edgeX(pts, y, -1);

/** x of the outline edge at height y, on the temple (1) or nasal (-1) side. */
export function edgeX(pts: Pt[], y: number, side: 1 | -1): number {
  let best = pts[0];
  let bestDist = Infinity;
  for (const p of pts) {
    if (p[0] * side < 0) continue;
    const d = Math.abs(p[1] - y);
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  return best[0];
}

export const isMetal = (m: FrameMaterial) => m === "metal" || m === "titanium";

/** Visual rim thickness in mm (tube radius for metal, band width for plastics). */
export const rimThickness = (m: FrameMaterial) =>
  ({ acetate: 3.8, tr90: 3.2, metal: 1.05, titanium: 0.9 })[m];

export const frameDepth = (m: FrameMaterial) => ({ acetate: 4.4, tr90: 3.8, metal: 2.1, titanium: 1.8 })[m];

export const toSvgPath = (pts: Pt[], closed = true) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${(-y).toFixed(2)}`).join("") + (closed ? "Z" : "");
