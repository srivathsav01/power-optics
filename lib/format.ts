import { site } from "@/content/site";
import type { Frame, FrameMaterial, FrameShape, Gender } from "@/types/frame";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatINR = (value: number) => inr.format(value);

export const shapeLabels: Record<FrameShape, string> = {
  round: "Round",
  oval: "Oval",
  rectangle: "Rectangle",
  square: "Square",
  "cat-eye": "Cat-eye",
  aviator: "Aviator",
  wayfarer: "Wayfarer",
  hexagon: "Hexagon",
};

export const materialLabels: Record<FrameMaterial, string> = {
  acetate: "Acetate",
  tr90: "TR90",
  metal: "Metal",
  titanium: "Titanium",
};

export const genderLabels: Record<Gender, string> = {
  men: "Men",
  women: "Women",
  unisex: "Unisex",
  kids: "Kids",
};

/** Size string as printed on the temple, e.g. 52□18-140 */
export const sizeCode = (f: Frame) =>
  `${f.measurements.lensWidth}□${f.measurements.bridge}-${f.measurements.templeLength}`;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const frameEnquiry = (f: Frame, colorName?: string) =>
  `Hi ${site.shortName}! Is the ${f.brand} ${f.name} (${shapeLabels[f.shape]}, ${sizeCode(f)}${
    colorName ? `, ${colorName}` : ""
  }) available in store?`;
