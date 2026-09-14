import { create } from "zustand";
import { persist } from "zustand/middleware";

type SavedState = {
  slugs: string[];
  toggle: (slug: string) => void;
  clear: () => void;
};

/**
 * "Saved frames to try in store" — kept in localStorage, no account needed.
 * skipHydration avoids a server/client mismatch; <SavedHydrator /> rehydrates after mount.
 */
export const useSaved = create<SavedState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) =>
        set((s) => ({
          slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug],
        })),
      clear: () => set({ slugs: [] }),
    }),
    { name: "power-eyes-saved", skipHydration: true },
  ),
);
