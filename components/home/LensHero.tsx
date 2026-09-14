"use client";

import { ArrowRight, Star } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonClass } from "@/components/ui/Button";
import { site, yearsInBusiness } from "@/content/site";

const MAGNIFY = 1.14;
const CHART = ["E", "FP", "TOZ", "LPED", "PECFD"];

/** The shop name. Rendered twice (blurred + sharp) so both layers lay out identically. */
function Wordmark() {
  return (
    <>
      <span className="block font-display text-[23vw] leading-[0.82] font-semibold tracking-[-0.045em] uppercase md:text-[min(12.8vw,15rem)]">
        <span className="block md:inline">Power</span>
        <span className="block md:ml-[0.2em] md:inline">Eyes</span>
      </span>
      <span className="mt-[0.35em] block pl-[0.42em] text-[8.4vw] font-semibold tracking-[0.42em] uppercase md:mt-[0.25em] md:text-[min(4.2vw,5rem)]">
        Opticals
      </span>
    </>
  );
}

/** A Snellen eye-chart row under the name, also revealed by the lens. */
function ChartLine() {
  return (
    <span aria-hidden className="mt-[5vw] flex items-end justify-center gap-[4vw] font-bold md:mt-10 md:gap-10">
      {CHART.map((letters, i) => (
        <span
          key={letters}
          className="tracking-[0.3em]"
          style={{ fontSize: `clamp(9px, ${3.6 - i * 0.65}vw, ${46 - i * 8}px)` }}
        >
          {letters}
        </span>
      ))}
    </span>
  );
}

export function LensHero() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef(-Infinity);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const radius = useMotionValue(0);
  const follow = { stiffness: 320, damping: 32, mass: 0.6 };
  const sx = useSpring(x, follow);
  const sy = useSpring(y, follow);
  const sr = useSpring(radius, { stiffness: 180, damping: 20 });

  // The sharp layer is scaled around the lens centre, so its mask radius is pre-divided.
  const maskRadius = useTransform(sr, (r) => r / MAGNIFY);
  const mask = useMotionTemplate`radial-gradient(circle ${maskRadius}px at ${sx}px ${sy}px, #000 calc(100% - 1.5px), transparent 100%)`;
  const origin = useMotionTemplate`${sx}px ${sy}px`;
  const ringX = useTransform(() => sx.get() - sr.get());
  const ringY = useTransform(() => sy.get() - sr.get());
  const ringSize = useTransform(sr, (r) => r * 2);

  const lensRadius = (el: HTMLElement) => Math.min(140, Math.max(72, el.clientWidth * 0.11));

  const focusAt = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set(clientX - rect.left);
    y.set(clientY - rect.top);
    radius.set(lensRadius(el));
    lastActive.current = performance.now();
  };

  // When nobody is pointing (touch devices, or the mouse left), the lens drifts across the name.
  useEffect(() => {
    const el = stageRef.current;
    if (reduce || !el) return;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      raf = requestAnimationFrame(tick);
      if (!visible || now - lastActive.current < 2200) return;
      const t = (now - start) / 1000;
      x.set(el.clientWidth * (0.5 + 0.36 * Math.sin(t * 0.45)));
      y.set(el.clientHeight * (0.42 + 0.26 * Math.sin(t * 0.95 + 0.6)));
      radius.set(lensRadius(el));
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce, x, y, radius]);

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,#fffaf1_0%,transparent_65%)]"
      />
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[110rem] flex-col px-4 pt-5 pb-24 sm:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between text-[11px] tracking-[0.2em] text-muted uppercase"
        >
          <span>
            Est. {site.foundedYear} · {site.address.city}
          </span>
          {!reduce && (
            <span>
              <span className="hidden pointer-fine:inline">Move to focus</span>
              <span className="pointer-fine:hidden">Tap to focus</span>
            </span>
          )}
        </motion.div>

        <div className="flex flex-1 items-center">
          <motion.div
            ref={stageRef}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            onPointerMove={(e) => focusAt(e.clientX, e.clientY)}
            onPointerDown={(e) => focusAt(e.clientX, e.clientY)}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") lastActive.current = performance.now() - 1600;
            }}
            className="relative w-full py-[8vw] text-center select-none pointer-fine:cursor-none md:py-14"
          >
            <div className={reduce ? "" : "text-ink/70 [filter:blur(clamp(5px,1.15vw,16px))]"}>
              <h1>
                <Wordmark />
              </h1>
              <ChartLine />
            </div>

            {!reduce && (
              <>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 py-[8vw] md:py-14"
                  style={{ maskImage: mask, WebkitMaskImage: mask, transformOrigin: origin, scale: MAGNIFY }}
                >
                  <Wordmark />
                  <ChartLine />
                </motion.div>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-0 rounded-full"
                  style={{ x: ringX, y: ringY, width: ringSize, height: ringSize }}
                >
                  <div className="absolute inset-0 rounded-full border border-ink/25 shadow-[inset_0_0_0_5px_rgba(255,255,255,0.35),inset_0_-12px_30px_rgba(176,85,42,0.14),0_30px_60px_-25px_rgba(23,24,27,0.55)]" />
                  <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.5),transparent_42%)]" />
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <p className="max-w-md text-lg text-ink-soft sm:text-xl">
              Eye tests by a registered optometrist and {site.stats.framesInStore} frames to try on, in the heart of{" "}
              {site.address.locality}.
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <Star className="size-4 fill-accent text-accent" />
              {site.stats.googleRating} on Google · {yearsInBusiness()}+ years of care
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className={buttonClass("primary")}>
              Explore frames in 3D <ArrowRight className="size-4" />
            </Link>
            <Link href="/services#book" className={buttonClass("secondary")}>
              Book an eye test
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
