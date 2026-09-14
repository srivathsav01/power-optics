import { StarRating } from "@/components/reviews/StarRating";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { reviews } from "@/content/reviews";
import { site, yearsInBusiness } from "@/content/site";

export function TrustAndReviews() {
  const stats = [
    { value: `${yearsInBusiness()}+`, label: "Years in business" },
    { value: site.stats.customers, label: "Happy customers" },
    { value: `${site.stats.googleRating}★`, label: `${site.stats.googleReviewCount} Google reviews` },
    { value: site.stats.framesInStore, label: "Frames to try on" },
  ];

  return (
    <section className="bg-ink py-16 text-paper sm:py-24">
      <Container>
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <dd className="font-display text-4xl sm:text-6xl">{s.value}</dd>
              <dt className="mt-1 text-sm text-paper/60">{s.label}</dt>
            </Reveal>
          ))}
        </dl>

        <Reveal className="mt-16 flex flex-wrap items-end justify-between gap-4 border-t border-paper/10 pt-12">
          <h2 className="font-display text-3xl sm:text-4xl">What our customers say</h2>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-paper/70 underline-offset-4 hover:text-paper hover:underline"
          >
            Read all reviews on Google
          </a>
        </Reveal>

        <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:px-0 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <li key={r.name} className="w-[82%] shrink-0 snap-center md:w-auto">
              <Reveal delay={i * 0.06} className="flex h-full flex-col rounded-3xl bg-paper/5 p-6">
                <StarRating rating={r.rating} />
                <blockquote className="mt-4 flex-1 text-paper/85">“{r.text}”</blockquote>
                <p className="mt-5 text-sm">
                  {r.name} <span className="text-paper/50">· {r.area}</span>
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
