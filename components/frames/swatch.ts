import type { FrameColor } from "@/types/frame";

/** CSS background for a colour swatch dot. */
export function swatchBackground(c: FrameColor) {
  if (c.pattern === "tortoise")
    return `radial-gradient(circle at 30% 30%, #c98a3c 0 18%, transparent 19%), radial-gradient(circle at 68% 62%, #b0702c 0 14%, transparent 15%), radial-gradient(circle at 40% 78%, #d49a4c 0 9%, transparent 10%), ${c.hex}`;
  if (c.pattern === "crystal") return `linear-gradient(135deg, ${c.hex}, #ffffff)`;
  return c.hex;
}
