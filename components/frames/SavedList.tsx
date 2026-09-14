"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useSyncExternalStore } from "react";
import { FrameCard } from "@/components/frames/FrameCard";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { site } from "@/content/site";
import { sizeCode, whatsappLink } from "@/lib/format";
import { useSaved } from "@/lib/store/saved";
import type { Frame } from "@/types/frame";

// `persist` is only attached in the browser (no localStorage during prerender)
const subscribeHydration = (cb: () => void) => useSaved.persist.onFinishHydration(cb);

export function SavedList({ frames }: { frames: Frame[] }) {
  const slugs = useSaved((s) => s.slugs);
  const hydrated = useSyncExternalStore(subscribeHydration, () => useSaved.persist.hasHydrated(), () => false);
  const saved = frames.filter((f) => slugs.includes(f.slug));

  if (!hydrated) return <div className="h-64" />;

  if (!saved.length) {
    return (
      <div className="rounded-3xl border border-dashed border-line py-20 text-center">
        <Heart className="mx-auto size-8 text-muted" />
        <p className="mt-4 font-display text-2xl">No saved frames yet</p>
        <p className="mt-1 text-muted">Tap the heart on any frame to keep a shortlist for your store visit.</p>
        <ButtonLink href="/shop" className="mt-6">
          Explore frames
        </ButtonLink>
      </div>
    );
  }

  const message = `Hi ${site.shortName}! I'd like to try these frames in store:\n${saved
    .map((f) => `• ${f.brand} ${f.name} (${sizeCode(f)})`)
    .join("\n")}`;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted">
          {saved.length} frame{saved.length > 1 ? "s" : ""} on your shortlist
        </p>
        <ExternalButton variant="whatsapp" href={whatsappLink(message)}>
          <MessageCircle className="size-5" /> Send list to the store
        </ExternalButton>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {saved.map((f) => (
          <li key={f.slug}>
            <FrameCard frame={f} href={`/shop?frame=${f.slug}`} />
          </li>
        ))}
      </ul>
    </>
  );
}
