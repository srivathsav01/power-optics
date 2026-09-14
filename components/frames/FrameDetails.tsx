"use client";

import { MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FrameMeasurements } from "@/components/frames/FrameMeasurements";
import { SaveButton } from "@/components/frames/SaveButton";
import { swatchBackground } from "@/components/frames/swatch";
import { ExternalButton } from "@/components/ui/Button";
import { policyHighlights } from "@/content/policies";
import { site } from "@/content/site";
import { formatINR, frameEnquiry, genderLabels, materialLabels, shapeLabels, whatsappLink } from "@/lib/format";
import type { Frame } from "@/types/frame";

export function FrameDetails({
  frame,
  colorIndex,
  onColorChange,
}: {
  frame: Frame;
  colorIndex: number;
  onColorChange: (index: number) => void;
}) {
  const color = frame.colors[colorIndex] ?? frame.colors[0];
  const tags = [
    frame.kind === "sunglasses" ? "Sunglasses" : "Eyeglasses",
    shapeLabels[frame.shape],
    materialLabels[frame.material],
    genderLabels[frame.gender],
    ...(frame.rim === "half" ? ["Half-rim"] : []),
  ];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={frame.slug}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-5"
      >
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">{frame.brand}</p>
          <h2 className="mt-1 font-display text-4xl sm:text-5xl">{frame.name}</h2>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-semibold">{formatINR(frame.priceINR)}</span>
            <span className="text-sm text-muted">in-store price</span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <li key={t} className="rounded-full bg-ink/5 px-2.5 py-1 text-xs">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-ink-soft">{frame.description}</p>

        <div>
          <p className="text-sm">
            <span className="text-muted">Colour:</span> {color.name}
          </p>
          <div className="mt-2 flex gap-2.5">
            {frame.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => onColorChange(i)}
                aria-label={c.name}
                aria-pressed={i === colorIndex}
                className={`size-9 rounded-full p-0.5 ring-offset-2 ring-offset-paper transition ${
                  i === colorIndex ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink/40"
                }`}
              >
                <span className="block size-full rounded-full" style={{ background: swatchBackground(c) }} />
              </button>
            ))}
          </div>
        </div>

        <FrameMeasurements frame={frame} />

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <ExternalButton variant="whatsapp" href={whatsappLink(frameEnquiry(frame, color.name))} className="flex-1">
            <MessageCircle className="size-5" /> Ask if it&apos;s in stock
          </ExternalButton>
          <SaveButton slug={frame.slug} name={frame.name} variant="full" className="flex-1" />
        </div>

        <div className="space-y-2 text-sm text-muted">
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span>
              Try it on at our {site.address.locality} store ·{" "}
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">
                Directions
              </a>
            </span>
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0" />
            {policyHighlights.map((p) => p.title).join(" · ")}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
