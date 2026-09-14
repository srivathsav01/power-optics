"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FrameCard } from "@/components/frames/FrameCard";
import { FrameDetails } from "@/components/frames/FrameDetails";
import { FilterPanel, buildFilterOptions, filterGroupLabels, type FilterOptions } from "@/components/shop/FilterPanel";
import { FrameStage } from "@/components/three/FrameStage";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  activeFilterCount,
  applyFilters,
  emptyFilters,
  parseFilters,
  sortFrames,
  toggleFilter,
  writeFilters,
  type FilterKey,
  type Filters,
  type SortId,
} from "@/lib/filters";
import type { Frame } from "@/types/frame";

const sortOptions: { id: SortId; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

/** Drops URL values that don't exist in the catalog. */
function sanitize(filters: Filters, options: FilterOptions): Filters {
  const out = { ...filters };
  for (const key of Object.keys(options) as FilterKey[]) {
    const allowed = new Set(options[key].map((o) => o.value));
    (out[key] as string[]) = (filters[key] as string[]).filter((v) => allowed.has(v));
  }
  return out;
}

/** Reads the initial state from the URL. Must sit inside <Suspense>. */
export function ShopFromParams({ frames }: { frames: Frame[] }) {
  const params = useSearchParams();
  return <ShopExperience frames={frames} initialQuery={params.toString()} />;
}

export function ShopExperience({ frames, initialQuery }: { frames: Frame[]; initialQuery: string }) {
  const reduce = useReducedMotion();
  const options = useMemo(() => buildFilterOptions(frames), [frames]);
  const [initial] = useState(() => {
    const p = new URLSearchParams(initialQuery);
    const sort = sortOptions.find((s) => s.id === p.get("sort"))?.id ?? "featured";
    const filters = sanitize(parseFilters(p), options);
    const matches = sortFrames(applyFilters(frames, filters), sort);
    const pool = matches.length ? matches : frames;
    const slug = pool.find((f) => f.slug === p.get("frame"))?.slug ?? pool[0].slug;
    return { filters, sort, slug };
  });

  const [filters, setFilters] = useState(initial.filters);
  const [sort, setSort] = useState<SortId>(initial.sort);
  const [selectedSlug, setSelectedSlug] = useState(initial.slug);
  const [colorIndex, setColorIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const stageRef = useRef<HTMLElement>(null);

  const visible = useMemo(() => sortFrames(applyFilters(frames, filters), sort), [frames, filters, sort]);
  const selected = frames.find((f) => f.slug === selectedSlug) ?? frames[0];
  const color = selected.colors[colorIndex] ?? selected.colors[0];
  const count = activeFilterCount(filters);

  // Keep the URL shareable (e.g. send a frame to someone on WhatsApp)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    writeFilters(p, filters);
    if (sort === "featured") p.delete("sort");
    else p.set("sort", sort);
    p.set("frame", selectedSlug);
    const next = `${window.location.pathname}?${p.toString()}`;
    if (next !== window.location.pathname + window.location.search) window.history.replaceState(null, "", next);
  }, [filters, sort, selectedSlug]);

  const select = (slug: string) => {
    setSelectedSlug(slug);
    setColorIndex(0);
    const top = stageRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.5) {
      stageRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  /** Apply filters; if the frame on the stage gets filtered out, show the first match instead. */
  const updateFilters = (next: Filters) => {
    setFilters(next);
    const matches = sortFrames(applyFilters(frames, next), sort);
    if (matches.length && !matches.some((f) => f.slug === selectedSlug)) {
      setSelectedSlug(matches[0].slug);
      setColorIndex(0);
    }
  };

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const activeChips = (Object.keys(options) as FilterKey[]).flatMap((key) =>
    (filters[key] as string[]).map((value) => ({
      key,
      value,
      label: options[key].find((o) => o.value === value)?.label ?? value,
    })),
  );

  return (
    <>
      <section ref={stageRef} className="scroll-mt-16">
        <Container className="pt-5 lg:pt-10">
          <div className="mb-5 lg:mb-8">
            <h1 className="font-display text-3xl sm:text-5xl">Frames in 360°</h1>
            <p className="mt-1.5 max-w-xl text-ink-soft">
              Every frame here is waiting in our store. Pick one, give it a spin, then come try it on.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <FrameStage frame={selected} color={color} />
            <FrameDetails frame={selected} colorIndex={colorIndex} onColorChange={setColorIndex} />
          </div>
        </Container>
      </section>

      <section className="mt-14 lg:mt-20" aria-labelledby="collection-heading">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
            <div>
              <h2 id="collection-heading" className="font-display text-2xl sm:text-3xl">
                Explore the collection
              </h2>
              <p className="text-sm text-muted" aria-live="polite">
                {visible.length} of {frames.length} frames · tap one to view it in 3D
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className={buttonClass("secondary", "h-10 px-4 text-sm lg:hidden")}
              >
                <SlidersHorizontal className="size-4" /> Filters{count ? ` (${count})` : ""}
              </button>
              <label className="sr-only" htmlFor="sort">
                Sort frames
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                className="h-10 rounded-full border border-ink/15 bg-paper px-4 text-sm"
              >
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="hidden lg:block" aria-label="Filters">
              <div className="sticky top-24">
                <FilterPanel filters={filters} options={options} onChange={updateFilters} />
                {count > 0 && (
                  <button type="button" onClick={() => updateFilters(emptyFilters)} className="mt-6 text-sm underline underline-offset-4">
                    Clear all filters
                  </button>
                )}
              </div>
            </aside>

            <div>
              {activeChips.length > 0 && (
                <ul className="mb-4 flex flex-wrap gap-2">
                  {activeChips.map((c) => (
                    <li key={`${c.key}-${c.value}`}>
                      <button
                        type="button"
                        onClick={() => updateFilters(toggleFilter(filters, c.key, c.value))}
                        className="flex h-8 items-center gap-1.5 rounded-full bg-ink/5 pr-2 pl-3 text-xs hover:bg-ink/10"
                        aria-label={`Remove ${filterGroupLabels[c.key]} filter: ${c.label}`}
                      >
                        {c.label} <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {visible.length > 0 ? (
                <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {visible.map((f) => (
                      <motion.li
                        key={f.slug}
                        layout={!reduce}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25 }}
                      >
                        <FrameCard frame={f} selected={f.slug === selectedSlug} onSelect={() => select(f.slug)} />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className="rounded-3xl border border-dashed border-line py-16 text-center">
                  <p className="font-display text-2xl">No frames match those filters</p>
                  <p className="mt-1 text-muted">We have many more in store — or try removing a filter.</p>
                  <button type="button" onClick={() => updateFilters(emptyFilters)} className={buttonClass("secondary", "mt-6")}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <BottomSheet
        open={sheetOpen}
        onClose={closeSheet}
        title="Filters"
        footer={
          <div className="flex gap-3">
            <button type="button" onClick={() => updateFilters(emptyFilters)} className={buttonClass("ghost", "flex-1")}>
              Clear
            </button>
            <button type="button" onClick={closeSheet} className={buttonClass("primary", "flex-[2]")}>
              Show {visible.length} frames
            </button>
          </div>
        }
      >
        <FilterPanel filters={filters} options={options} onChange={updateFilters} />
      </BottomSheet>
    </>
  );
}
