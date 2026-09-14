"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FrameSilhouette } from "@/components/frames/FrameSilhouette";
import { SaveButton } from "@/components/frames/SaveButton";
import { swatchBackground } from "@/components/frames/swatch";
import { formatINR, shapeLabels } from "@/lib/format";
import type { Frame } from "@/types/frame";

type Props = { frame: Frame; selected?: boolean } & ({ href: string; onSelect?: never } | { onSelect: () => void; href?: never });

export function FrameCard({ frame, selected = false, href, onSelect }: Props) {
  const body: ReactNode = (
    <>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-paper-2/70">
        {frame.images?.[0] ? (
          <Image
            src={frame.images[0]}
            alt={`${frame.brand} ${frame.name}`}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 50vw"
            className="object-contain p-3"
          />
        ) : (
          <FrameSilhouette frame={frame} className="w-[84%] transition-transform duration-500 group-hover:scale-105" />
        )}
        {selected && (
          <span className="absolute top-2 left-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-paper">
            Viewing in 3D
          </span>
        )}
      </div>
      <p className="mt-3 truncate text-[11px] tracking-wider text-muted uppercase">{frame.brand}</p>
      <p className="truncate font-medium">
        {frame.name} <span className="font-normal text-muted">· {shapeLabels[frame.shape]}</span>
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-sm">{formatINR(frame.priceINR)}</span>
        <span className="flex -space-x-1">
          {frame.colors.map((c) => (
            <span
              key={c.name}
              className="size-3.5 rounded-full ring-2 ring-paper"
              style={{ background: swatchBackground(c) }}
            />
          ))}
        </span>
      </div>
    </>
  );

  const inner = "block w-full p-2.5 text-left sm:p-3";

  return (
    <article
      className={`group relative h-full rounded-2xl border bg-white/50 transition-[border-color,box-shadow] ${
        selected ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-ink/30"
      }`}
    >
      {href ? (
        <Link href={href} className={inner}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={onSelect} aria-pressed={selected} className={inner}>
          {body}
        </button>
      )}
      <SaveButton slug={frame.slug} name={frame.name} className="absolute top-4 right-4 sm:top-5 sm:right-5" />
    </article>
  );
}
