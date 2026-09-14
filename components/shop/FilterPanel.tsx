"use client";

import { genderLabels, materialLabels, shapeLabels } from "@/lib/format";
import { priceBuckets, toggleFilter, type FilterKey, type Filters } from "@/lib/filters";
import type { Frame, Gender } from "@/types/frame";

type Option = { value: string; label: string };
export type FilterOptions = Record<FilterKey, Option[]>;

export const filterGroupLabels: Record<FilterKey, string> = {
  shape: "Frame shape",
  material: "Material",
  gender: "Gender",
  brand: "Brand",
  price: "Price",
};

/** Only offer options that exist in the current catalog. */
export function buildFilterOptions(frames: Frame[]): FilterOptions {
  const uniq = <T extends string>(values: T[]) => [...new Set(values)];
  return {
    shape: uniq(frames.map((f) => f.shape)).map((v) => ({ value: v, label: shapeLabels[v] })),
    material: uniq(frames.map((f) => f.material)).map((v) => ({ value: v, label: materialLabels[v] })),
    gender: (["men", "women", "kids", "unisex"] as Gender[])
      .filter((g) => frames.some((f) => f.gender === g))
      .map((v) => ({ value: v, label: genderLabels[v] })),
    brand: uniq(frames.map((f) => f.brand))
      .sort()
      .map((v) => ({ value: v, label: v })),
    price: priceBuckets.map((b) => ({ value: b.id, label: b.label })),
  };
}

export function FilterPanel({
  filters,
  options,
  onChange,
}: {
  filters: Filters;
  options: FilterOptions;
  onChange: (filters: Filters) => void;
}) {
  return (
    <div className="space-y-7">
      {(Object.keys(options) as FilterKey[]).map((key) => (
        <fieldset key={key}>
          <legend className="mb-3 text-xs font-semibold tracking-[0.15em] text-muted uppercase">
            {filterGroupLabels[key]}
          </legend>
          <div className="flex flex-wrap gap-2">
            {options[key].map((o) => {
              const on = (filters[key] as string[]).includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onChange(toggleFilter(filters, key, o.value))}
                  className={`h-9 rounded-full border px-3.5 text-sm transition-colors ${
                    on ? "border-ink bg-ink text-paper" : "border-line bg-white/50 hover:border-ink/40"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
