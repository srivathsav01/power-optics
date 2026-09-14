import { Car, Clock, Landmark, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { StoreStatus } from "@/components/store/StoreStatus";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { fullAddress, site } from "@/content/site";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact, hours & directions",
  description: `Call, WhatsApp or visit ${site.name} at ${fullAddress()}. Open ${site.hours.map((h) => `${h.days} ${h.opens}–${h.closes}`).join(", ")}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const channels = [
    {
      icon: Phone,
      label: "Call",
      value: site.phone,
      href: `tel:${site.phoneE164}`,
      external: false,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Usually replies within an hour",
      href: whatsappLink(`Hi ${site.shortName}!`),
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      external: false,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Come say hello."
        intro="Questions about a frame, your prescription or an order? Message us on WhatsApp, give us a call, or drop by the store."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ExternalButton variant="whatsapp" href={whatsappLink(`Hi ${site.shortName}!`)}>
            <MessageCircle className="size-5" /> Chat on WhatsApp
          </ExternalButton>
          <ButtonLink href="/services#book" variant="secondary">
            Book an eye test
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <Reveal>
            <ul className="divide-y divide-line rounded-3xl border border-line bg-white/40">
              {channels.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink/[0.03]"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink/5">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-muted">{label}</span>
                      <span className="block truncate font-medium">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.05} className="rounded-3xl border border-line bg-white/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <h2 className="flex items-center gap-2 font-medium whitespace-nowrap">
                <Clock className="size-5" /> Store hours
              </h2>
              <StoreStatus />
            </div>
            <dl className="mt-4 divide-y divide-line">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between py-3">
                  <dt>{h.days}</dt>
                  <dd className="text-ink-soft">
                    {h.opens} – {h.closes}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="space-y-4 rounded-3xl border border-line bg-white/40 p-5">
            <h2 className="flex items-center gap-2 font-medium">
              <MapPin className="size-5" /> Getting here
            </h2>
            <p>{fullAddress()}</p>
            <p className="flex gap-2 text-sm text-ink-soft">
              <Landmark className="size-4 shrink-0 translate-y-0.5" /> {site.landmark}
            </p>
            <p className="flex gap-2 text-sm text-ink-soft">
              <Car className="size-4 shrink-0 translate-y-0.5" /> {site.parking}
            </p>
            <ExternalButton href={site.mapsUrl} variant="secondary" className="w-full">
              Open in Google Maps
            </ExternalButton>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="min-h-[360px] overflow-hidden rounded-3xl border border-line bg-paper-2 lg:min-h-full">
          <iframe
            src={site.mapEmbedUrl}
            title={`Map showing ${site.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[360px] w-full border-0"
            allowFullScreen
          />
        </Reveal>
      </Container>
    </>
  );
}
