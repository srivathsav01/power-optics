export type FrameShape =
  | "round"
  | "oval"
  | "rectangle"
  | "square"
  | "cat-eye"
  | "aviator"
  | "wayfarer"
  | "hexagon";

export type FrameMaterial = "acetate" | "tr90" | "metal" | "titanium";

export type Gender = "men" | "women" | "unisex" | "kids";

export type FrameKind = "eyeglasses" | "sunglasses";

export type FrameColor = {
  name: string;
  /** Main frame colour. For tortoise this is the dark base tone. */
  hex: string;
  pattern?: "solid" | "tortoise" | "crystal";
  finish?: "gloss" | "matte";
};

/** All measurements in millimetres, as printed on the inside of the temple: 52□18-140 */
export type FrameMeasurements = {
  lensWidth: number;
  lensHeight: number;
  bridge: number;
  templeLength: number;
};

export type Frame = {
  slug: string;
  name: string;
  brand: string;
  kind: FrameKind;
  shape: FrameShape;
  material: FrameMaterial;
  gender: Gender;
  rim: "full" | "half";
  /** In-store price (MRP) in rupees. Display only — no online sales. */
  priceINR: number;
  colors: FrameColor[];
  /** Tint for sunglasses lenses. Clear optical lenses when omitted. */
  lensTint?: string;
  measurements: FrameMeasurements;
  description: string;
  featured?: boolean;
  /** Optional product photos in /public. Cards fall back to a generated silhouette. */
  images?: string[];
  /** Optional path to a real .glb scan in /public/models. Viewer falls back to a generated model. */
  model?: string;
};
