import { CalendarCheck, MapPin, Phone } from "lucide-react";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { StoreStatus } from "@/components/store/StoreStatus";
import { fullAddress, site } from "@/content/site";

export function VisitStore() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal className="grid gap-10 rounded-[2rem] border border-line bg-paper-2/60 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:p-14">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Visit us</p>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl">Try them on. See clearly.</h2>
            <p className="mt-4 max-w-lg text-ink-soft">
              Everything you see online is waiting in our store. Walk in for a free frame fitting, or book an eye
              test with Registered Optometrist.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/services#book">
                <CalendarCheck className="size-4" /> Book an eye test
              </ButtonLink>
              <a href={`tel:${site.phone}`} className={buttonClass("secondary")}>
                <Phone className="size-4" /> {site.phone}
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-accent" />
              <div>
                <p className="font-medium">{fullAddress()}</p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm underline underline-offset-4"
                >
                  Get directions
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-paper">
              <div className="border-b border-line px-5 py-3.5">
                <StoreStatus />
              </div>
              <dl className="divide-y divide-line">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex justify-between px-5 py-3.5">
                    <dt>{h.days}</dt>
                    <dd className="text-ink-soft">
                      {h.opens} – {h.closes}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
