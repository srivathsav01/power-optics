import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  edgeX,
  frameDepth,
  isMetal,
  lensOutline,
  offsetOutline,
  rimThickness,
  upperArc,
  type Pt,
} from "@/lib/frame-geometry";
import type { Frame, FrameColor } from "@/types/frame";

/** Geometry is built in millimetres, then scaled to scene units (1 unit = 100 mm). */
const MM = 0.01;
const WRAP = THREE.MathUtils.degToRad(6);

const v2 = ([x, y]: Pt) => new THREE.Vector2(x, y);

// ---------- materials ----------

const tortoiseCache = new Map<string, THREE.CanvasTexture>();

function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Procedural, seamlessly tiling tortoiseshell texture derived from the base colour. */
function tortoiseTexture(base: string) {
  const cached = tortoiseCache.get(base);
  if (cached) return cached;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  const amber = `#${new THREE.Color(base).lerp(new THREE.Color("#d8933f"), 0.8).getHexString()}`;
  const dark = `#${new THREE.Color(base).multiplyScalar(0.45).getHexString()}`;
  const rand = seededRandom([...base].reduce((h, ch) => h * 31 + ch.charCodeAt(0), 7));

  for (let i = 0; i < 110; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 5 + rand() * 30;
    const alpha = Math.round((0.25 + rand() * 0.55) * 255)
      .toString(16)
      .padStart(2, "0");
    const tone = rand() > 0.4 ? amber : dark;
    for (const ox of [-size, 0, size]) {
      for (const oy of [-size, 0, size]) {
        const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
        g.addColorStop(0, `${tone}${alpha}`);
        g.addColorStop(1, `${tone}00`);
        ctx.fillStyle = g;
        ctx.fillRect(x + ox - r, y + oy - r, r * 2, r * 2);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tortoiseCache.set(base, tex);
  return tex;
}

function frameMaterial(frame: Frame, color: FrameColor, repeat: [number, number]) {
  const matte = color.finish === "matte";
  if (isMetal(frame.material)) {
    return new THREE.MeshStandardMaterial({ color: color.hex, metalness: 1, roughness: matte ? 0.5 : 0.22 });
  }
  const mat = new THREE.MeshPhysicalMaterial({
    color: color.hex,
    roughness: matte ? 0.55 : 0.2,
    clearcoat: matte ? 0 : 1,
    clearcoatRoughness: 0.08,
  });
  if (color.pattern === "tortoise") {
    const map = tortoiseTexture(color.hex).clone();
    map.repeat.set(...repeat);
    map.needsUpdate = true;
    mat.map = map;
    mat.color.set("#ffffff");
  }
  if (color.pattern === "crystal") {
    mat.transparent = true;
    mat.opacity = 0.6;
    mat.roughness = 0.05;
  }
  return mat;
}

// ---------- model ----------

export type BuiltFrame = {
  object: THREE.Group;
  /** Bounding size in scene units, for camera framing. */
  size: THREE.Vector3;
  dispose: () => void;
};

/**
 * Builds a 3D pair of glasses from catalog data: lens shape + real measurements drive
 * rims, bridge, end pieces and temples. No 3D assets required.
 */
export function buildFrame(frame: Frame, color: FrameColor): BuiltFrame {
  const m = frame.measurements;
  const metal = isMetal(frame.material);
  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(x: T) => {
    disposables.push(x);
    return x;
  };

  const rimMat = track(frameMaterial(frame, color, [1 / 40, 1 / 40]));
  const tubeMat = track(frameMaterial(frame, color, [4, 1]));
  const lensMat = track(
    new THREE.MeshPhysicalMaterial({
      color: frame.lensTint ?? "#e6eef2",
      transparent: true,
      opacity: frame.lensTint ? 0.86 : 0.16,
      roughness: 0.04,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.6,
      depthWrite: false,
    }),
  );
  const tipMat = track(new THREE.MeshPhysicalMaterial({ color: "#1c1c1e", roughness: 0.35, clearcoat: 0.5 }));
  const padMat = track(
    new THREE.MeshPhysicalMaterial({ color: "#f4f1ea", roughness: 0.3, transparent: true, opacity: 0.6 }),
  );

  const a = m.lensWidth / 2;
  const b = m.lensHeight / 2;
  const rimT = rimThickness(frame.material);
  const depth = frameDepth(frame.material);
  const outline = lensOutline(frame.shape, m.lensWidth, m.lensHeight);

  // Rim: a wire tube for metal, a bevelled extruded band for plastics
  let rimGeo: THREE.BufferGeometry;
  if (metal) {
    const half = frame.rim === "half";
    const pts = (half ? upperArc(outline) : outline).map(([x, y]) => new THREE.Vector3(x, y, 0));
    rimGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, !half, "centripetal"), 220, rimT, 8, !half);
  } else {
    const shape = new THREE.Shape(offsetOutline(outline, rimT).map(v2));
    shape.holes.push(new THREE.Path(outline.map(v2)));
    const bevel = 0.6;
    rimGeo = new THREE.ExtrudeGeometry(shape, {
      depth: depth - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel * 0.8,
      bevelSegments: 3,
    });
    rimGeo.translate(0, 0, -(depth - bevel * 2) / 2);
  }
  track(rimGeo);

  // Lens: thin solid sitting in the rim groove
  const lensGeo = track(
    new THREE.ExtrudeGeometry(new THREE.Shape((metal ? outline : offsetOutline(outline, 0.8)).map(v2)), {
      depth: 1.2,
      bevelEnabled: false,
    }),
  );
  lensGeo.translate(0, 0, -0.6);

  // End piece + temple (built for the right-hand side, mirrored for the left)
  const hingeY = b * 0.42;
  const outerX = edgeX(outline, hingeY, 1) + rimT * (metal ? 0.6 : 0.9);
  const endGeo = track(metal ? new RoundedBoxGeometry(5, 3, 2.6, 2, 0.8) : new RoundedBoxGeometry(6, 8, depth, 2, 1.4));

  const L = m.templeLength;
  const splay = L * Math.sin(WRAP) + 7;
  const templeRadius = metal ? 0.85 : 1.9;
  const flatten = metal ? 1 : 0.55; // plastic temples are taller than they are thick
  const templeCurve = new THREE.CatmullRomCurve3(
    (
      [
        [0, 0, 0],
        [splay * 0.3, 0.6, -L * 0.3],
        [splay * 0.7, 0.2, -L * 0.66],
        [splay * 0.88, -3.5, -L * 0.84],
        [splay * 0.96, -13, -L * 0.95],
        [splay, -24, -L],
      ] as const
    ).map(([x, y, z]) => new THREE.Vector3(x / flatten, y, z)),
    false,
    "centripetal",
  );
  const templeOrigin = new THREE.Vector3(outerX + 3.2, hingeY, -depth / 2);
  const templeGeo = track(new THREE.TubeGeometry(templeCurve, 80, templeRadius, 10, false));
  templeGeo.scale(flatten, 1, 1);
  templeGeo.translate(templeOrigin.x, templeOrigin.y, templeOrigin.z);

  const capGeo = track(new THREE.SphereGeometry(metal ? 1.35 : templeRadius, 12, 8));
  capGeo.scale(flatten, 1, 1);
  const templeEnd = templeCurve.getPoint(1);
  capGeo.translate(templeOrigin.x + templeEnd.x * flatten, templeOrigin.y + templeEnd.y, templeOrigin.z + templeEnd.z);

  let tipGeo: THREE.TubeGeometry | null = null;
  if (metal) {
    const tipPts = Array.from({ length: 24 }, (_, i) => templeCurve.getPoint(0.62 + (0.38 * i) / 23));
    tipGeo = track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tipPts), 40, 1.35, 10, false));
    tipGeo.translate(templeOrigin.x, templeOrigin.y, templeOrigin.z);
  }

  // Nose pads on metal frames
  let padGeo: THREE.BufferGeometry | null = null;
  let padArmGeo: THREE.BufferGeometry | null = null;
  const padEdge = edgeX(outline, -b * 0.15, -1);
  const padPos = new THREE.Vector3(padEdge + 4, -b * 0.28, -6);
  if (metal) {
    padGeo = track(new THREE.SphereGeometry(1, 16, 12));
    padGeo.scale(2.2, 4, 1);
    padArmGeo = track(
      new THREE.TubeGeometry(
        new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(padEdge + 0.5, -b * 0.05, -0.5),
          new THREE.Vector3(padPos.x - 1.5, -b * 0.05, -4),
          new THREE.Vector3(padPos.x, padPos.y + 2, padPos.z + 0.5),
        ),
        12,
        0.45,
        6,
        false,
      ),
    );
  }

  const root = new THREE.Group();
  const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, renderOrder = 0) => {
    const obj = new THREE.Mesh(geo, mat);
    obj.renderOrder = renderOrder;
    return obj;
  };

  for (const side of [1, -1] as const) {
    const pivot = new THREE.Group();
    pivot.position.x = side * (m.bridge / 2 + a);
    pivot.rotation.y = side * WRAP; // face-form wrap: outer edges sweep back
    const local = new THREE.Group();
    local.scale.x = side;

    local.add(mesh(rimGeo, rimMat), mesh(lensGeo, lensMat, 2));
    const end = mesh(endGeo, metal ? tubeMat : rimMat);
    end.position.set(outerX + 1.5, hingeY, metal ? -0.8 : 0);
    local.add(end, mesh(templeGeo, tubeMat), mesh(capGeo, metal ? tipMat : tubeMat));
    if (tipGeo) local.add(mesh(tipGeo, tipMat));
    if (padGeo && padArmGeo) {
      const pad = mesh(padGeo, padMat, 1);
      pad.position.copy(padPos);
      pad.rotation.y = -0.5;
      local.add(pad, mesh(padArmGeo, tubeMat));
    }

    pivot.add(local);
    root.add(pivot);
  }

  // Bridge connects the two nasal edges (world space)
  const bridgeY = b * (metal ? 0.3 : 0.25);
  const reach = -edgeX(outline, bridgeY, -1) + (metal ? 0 : rimT * 0.5);
  const lensCentre = m.bridge / 2 + a;
  const bx = lensCentre - reach * Math.cos(WRAP);
  const bz = reach * Math.sin(WRAP);
  const bridgeGeo = track(
    new THREE.TubeGeometry(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(bx, bridgeY, bz),
        new THREE.Vector3(0, bridgeY + (metal ? 4 : 3.5), bz + 2),
        new THREE.Vector3(-bx, bridgeY, bz),
      ),
      32,
      metal ? 0.9 : 2.2,
      10,
      false,
    ),
  );
  root.add(mesh(bridgeGeo, tubeMat));

  if (frame.shape === "aviator") {
    const topReach = a * 0.55;
    const tx = lensCentre - topReach * Math.cos(WRAP);
    const topBar = track(
      new THREE.TubeGeometry(
        new THREE.LineCurve3(
          new THREE.Vector3(tx, b * 0.96, topReach * Math.sin(WRAP)),
          new THREE.Vector3(-tx, b * 0.96, topReach * Math.sin(WRAP)),
        ),
        8,
        0.8,
        8,
        false,
      ),
    );
    root.add(mesh(topBar, tubeMat));
  }

  root.scale.setScalar(MM);
  const object = new THREE.Group();
  object.add(root);
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  root.position.sub(box.getCenter(new THREE.Vector3()));

  return {
    object,
    size: box.getSize(new THREE.Vector3()),
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}
