import { CircleDot, Clock, Eye, FileCheck, Glasses, RefreshCw, Wrench, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { ExamBookingWidget } from "@/components/booking/ExamBookingWidget";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { faqs, lensOptions, services, type Service } from "@/content/services";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Eye tests, lenses, repairs & booking",
  description: `Comprehensive eye tests, contact lens fitting, prescription updates, progressive and blue-light lenses, insurance paperwork and repairs at ${site.name}. Book an appointment online.`,
  alternates: { canonical: "/services" },
};

const icons: Record<Service["icon"], LucideIcon> = {
  eye: Eye,
  "contact-lens": CircleDot,
  prescription: RefreshCw,
  lenses: Glasses,
  insurance: FileCheck,
  repairs: Wrench,
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything your eyes need, under one roof."
        intro={`From a thorough eye test to a same-day repair — handled by ${site.optician.name} and our fitting team.`}
      >
        <a href="#book" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
          Skip to booking ↓
        </a>
      </PageHeader>

      <Container>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <li key={s.slug} id={s.slug} className="scroll-mt-24">
                <Reveal delay={(i % 3) * 0.06} className="flex h-full flex-col rounded-3xl border border-line bg-white/40 p-6">
                  <Icon className="size-7 text-accent" strokeWidth={1.6} />
                  <h2 className="mt-4 font-display text-2xl">{s.title}</h2>
                  <p className="mt-2 text-ink-soft">{s.summary}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  {(s.duration || s.price) && (
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-4 text-sm">
                      {s.duration && (
                        <span className="flex items-center gap-1.5 text-muted">
                          <Clock className="size-4" /> {s.duration}
                        </span>
                      )}
                      {s.price && <span className="font-medium">{s.price}</span>}
                    </div>
                  )}
                  {s.bookable && (
                    <a href="#book" className="mt-4 text-sm font-medium text-accent-deep hover:underline">
                      Book this →
                    </a>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>

      {/* Lens options */}
      <Container className="mt-20 sm:mt-28">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">Choosing lenses</h2>
          <p className="mt-2 max-w-xl text-ink-soft">
            Every frame can be fitted with any of these. We&apos;ll recommend what suits your prescription and routine.
          </p>
        </Reveal>
        <Reveal delay={0.05} className="mt-6 overflow-x-auto rounded-3xl border border-line bg-white/40">
          <table className="w-full min-w-[520px] text-left">
            <thead className="text-xs tracking-[0.12em] text-muted uppercase">
              <tr className="border-b border-line">
                <th className="px-5 py-4 font-medium">Lens</th>
                <th className="px-5 py-4 font-medium">Best for</th>
                <th className="px-5 py-4 text-right font-medium">From</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {lensOptions.map((l) => (
                <tr key={l.name}>
                  <td className="px-5 py-4 font-medium">{l.name}</td>
                  <td className="px-5 py-4 text-ink-soft">{l.bestFor}</td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">{l.from}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Container>

      {/* Booking */}
      <section id="book" className="mt-20 scroll-mt-20 bg-paper-2/60 py-16 sm:mt-28 sm:py-24">
        {/* minmax(0, …) lets the horizontally scrolling day picker shrink instead of widening the page */}
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Book an appointment</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Pick a time that suits you.</h2>
            <p className="mt-4 text-ink-soft">
              Choose a slot and we&apos;ll confirm it on WhatsApp. Walk-ins are always welcome too — booking just
              means no waiting.
            </p>
            <div className="mt-8 rounded-3xl border border-line bg-paper p-5">
              <h3 className="font-medium">Please bring</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                <li>• Your current glasses or contact lenses</li>
                <li>• Any previous prescription (a photo is fine)</li>
                <li>• A list of medicines you take regularly</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ExamBookingWidget />
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <Container className="py-16 sm:py-24">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">Common questions</h2>
        </Reveal>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-2xl text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </>
  );
}
