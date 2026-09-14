import { Award, BadgeCheck, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { PhotoOrPlaceholder } from "@/components/store/PhotoOrPlaceholder";
import { StoreStatus } from "@/components/store/StoreStatus";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { about } from "@/content/about";
import { fullAddress, site, yearsInBusiness } from "@/content/site";

export const metadata: Metadata = {
  title: "About our store & optometrist",
  description: `Meet a Registered Optometrist and the team at ${site.name} in ${site.address.locality}, ${site.address.city} — serving since ${site.foundedYear}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const stats = [
    { value: `${yearsInBusiness()}+`, label: "Years in business" },
    { value: site.stats.customers, label: "Customers served" },
    { value: `${site.stats.googleRating}★`, label: "Google rating" },
  ];

  return (
    <>
      <PageHeader eyebrow={`Since ${site.foundedYear}`} title={about.headline} />

      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <PhotoOrPlaceholder src={about.photos.storefront} alt="Our storefront" className="aspect-[4/3]" />
        </Reveal>
        <Reveal delay={0.1} className="space-y-5 text-lg text-ink-soft">
          {about.story.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-3xl text-ink sm:text-4xl">{s.value}</dd>
                <dt className="mt-1 text-sm text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>

      {/* Optician credentials */}
      {/* <section className="mt-20 bg-ink py-16 text-paper sm:mt-28 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <Reveal>
            <PhotoOrPlaceholder
              src={about.photos.optician}
              alt={site.optician.name}
              className="aspect-square max-w-md bg-paper/10"
              sizes="(min-width: 1024px) 28rem, 100vw"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Your optometrist</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">{site.optician.name}</h2>
            <ul className="mt-6 space-y-3 text-paper/80">
              <li className="flex gap-3">
                <BadgeCheck className="size-5 shrink-0 text-accent" /> {site.optician.credentials}
              </li>
              <li className="flex gap-3">
                <Award className="size-5 shrink-0 text-accent" /> {site.optician.registration}
              </li>
              <li className="flex gap-3">
                <Award className="size-5 shrink-0 text-accent" /> {site.optician.experienceYears} years of clinical
                experience
              </li>
            </ul>
            <p className="mt-6 max-w-lg text-paper/70">
              Every eye test at {site.shortName} is done personally by a qualified optometrist — never handed off to
              a machine alone.
            </p>
            <ButtonLink href="/services#book" variant="secondary" className="mt-8 border-paper/20 bg-transparent text-paper hover:border-paper/60">
              Book an eye test
            </ButtonLink>
          </Reveal>
        </Container>
      </section> */}

      <Container className="py-16 sm:py-24">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">What we stand for</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {about.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="rounded-3xl border border-line bg-white/40 p-6">
              <p className="font-display text-5xl text-accent/40">0{i + 1}</p>
              <h3 className="mt-3 font-display text-2xl">{v.title}</h3>
              <p className="mt-2 text-ink-soft">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-line bg-paper-2/60 p-6 sm:flex-row sm:items-center sm:p-10">
          <div>
            <StoreStatus />
            <p className="mt-3 flex gap-2 text-lg">
              <MapPin className="mt-1 size-5 shrink-0 text-accent" />
              {fullAddress()}
            </p>
          </div>
          <ButtonLink href="/contact">Hours & directions</ButtonLink>
        </Reveal>
      </Container>
    </>
  );
}
