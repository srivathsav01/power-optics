import type { Frame, FrameMaterial, FrameShape, Gender } from "@/types/frame";

export const priceBuckets = [
  { id: "under-1500", label: "Under ₹1,500", min: 0, max: 1499 },
  { id: "1500-3000", label: "₹1,500 – ₹3,000", min: 1500, max: 3000 },
  { id: "3000-5000", label: "₹3,000 – ₹5,000", min: 3001, max: 5000 },
  { id: "above-5000", label: "Above ₹5,000", min: 5001, max: Infinity },
] as const;

export type PriceBucketId = (typeof priceBuckets)[number]["id"];

export type Filters = {
  shape: FrameShape[];
  material: FrameMaterial[];
  gender: Gender[];
  brand: string[];
  price: PriceBucketId[];
};

export type FilterKey = keyof Filters;

export type SortId = "featured" | "price-asc" | "price-desc";

export const emptyFilters: Filters = { shape: [], material: [], gender: [], brand: [], price: [] };

const filterKeys: FilterKey[] = ["shape", "material", "gender", "brand", "price"];

/** Filters live in the URL as comma lists (?shape=round,oval&gender=women) so they can be shared. */
export function parseFilters(params: URLSearchParams): Filters {
  const out = { ...emptyFilters };
  for (const key of filterKeys) {
    const value = params.get(key);
    (out[key] as string[]) = value ? value.split(",").filter(Boolean) : [];
  }
  return out;
}

export function writeFilters(params: URLSearchParams, filters: Filters) {
  for (const key of filterKeys) {
    if (filters[key].length) params.set(key, filters[key].join(","));
    else params.delete(key);
  }
}

export function toggleFilter(f: Filters, key: FilterKey, value: string): Filters {
  const list = f[key] as string[];
  return { ...f, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
}

export const activeFilterCount = (f: Filters) => filterKeys.reduce((n, k) => n + f[k].length, 0);

export function applyFilters(frames: Frame[], f: Filters): Frame[] {
  return frames.filter((frame) => {
    if (f.shape.length && !f.shape.includes(frame.shape)) return false;
    if (f.material.length && !f.material.includes(frame.material)) return false;
    // unisex frames show up under both Men and Women
    if (
      f.gender.length &&
      !f.gender.includes(frame.gender) &&
      !(frame.gender === "unisex" && (f.gender.includes("men") || f.gender.includes("women")))
    )
      return false;
    if (f.brand.length && !f.brand.includes(frame.brand)) return false;
    if (
      f.price.length &&
      !priceBuckets.some((b) => f.price.includes(b.id) && frame.priceINR >= b.min && frame.priceINR <= b.max)
    )
      return false;
    return true;
  });
}

export function sortFrames(frames: Frame[], sort: SortId): Frame[] {
  if (sort === "price-asc") return [...frames].sort((a, b) => a.priceINR - b.priceINR);
  if (sort === "price-desc") return [...frames].sort((a, b) => b.priceINR - a.priceINR);
  return [...frames].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
}
