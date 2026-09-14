import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FrameCard } from "@/components/frames/FrameCard";
import { FrameSilhouette } from "@/components/frames/FrameSilhouette";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { shapeLabels } from "@/lib/format";
import type { Frame } from "@/types/frame";

export function FeaturedFrames({ featured, all }: { featured: Frame[]; all: Frame[] }) {
  // one representative frame per shape for the "shop by shape" strip
  const byShape = [...new Map(all.map((f) => [f.shape, f])).values()];

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">In store now</p>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl">Frames worth a closer look</h2>
          </div>
          <Link href="/shop" className="hidden items-center gap-1.5 text-sm font-medium hover:underline sm:flex">
            View all in 3D <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {featured.map((f, i) => (
            <li key={f.slug} className={i === 4 ? "hidden lg:block" : undefined}>
              <Reveal delay={i * 0.05} className="h-full">
                <FrameCard frame={f} href={`/shop?frame=${f.slug}`} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-14">
          <h3 className="font-display text-2xl">Shop by shape</h3>
          <ul className="-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
            {byShape.map((f) => (
              <li key={f.shape} className="w-32 shrink-0 snap-start sm:w-auto">
                <Link
                  href={`/shop?shape=${f.shape}`}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-line bg-white/40 px-3 py-4 transition-colors hover:border-ink/40"
                >
                  <FrameSilhouette
                    frame={f}
                    color={{ name: "Ink", hex: "#17181b" }}
                    className="w-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="text-sm">{shapeLabels[f.shape]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
