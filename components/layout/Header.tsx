"use client";

import { Heart, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/content/site";
import { useSaved } from "@/lib/store/saved";
import { Container } from "@/components/ui/Container";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const savedCount = useSaved((s) => s.slugs.length);

  // Saved frames live in localStorage; load them only after hydration.
  useEffect(() => {
    useSaved.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight" onClick={() => setOpen(false)}>
          {site.shortName}
          <span className="ml-1.5 text-xs font-sans font-medium tracking-[0.2em] text-muted uppercase">Opticals</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${active ? "text-ink" : "text-ink-soft hover:text-ink"}`}
              >
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-ink/6" />
                )}
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/saved"
            className="relative flex size-11 items-center justify-center rounded-full hover:bg-ink/5"
            aria-label={`Saved frames (${savedCount})`}
            onClick={() => setOpen(false)}
          >
            <Heart className="size-5" />
            {savedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4.5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                {savedCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full hover:bg-ink/5 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 bottom-0 bg-paper md:hidden"
          >
            <Container className="flex flex-col py-6">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-4 font-display text-3xl"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <a href={`tel:${site.phoneE164}`} className="mt-8 text-muted">
                Call {site.phone}
              </a>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
