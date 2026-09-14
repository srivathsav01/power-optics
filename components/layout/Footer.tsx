import { Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { policyHighlights } from "@/content/policies";
import { fullAddress, navLinks, site } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink pb-24 text-paper/80 sm:pb-10">
      <div className="border-b border-paper/10">
        <Container className="grid gap-4 py-6 sm:grid-cols-3">
          {policyHighlights.map((p) => (
            <div key={p.title} className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
              <div>
                <p className="font-medium text-paper">{p.title}</p>
                <p className="text-sm">{p.detail}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-paper">{site.name}</p>
          <p className="mt-2 text-sm">{site.tagline}</p>
          {/* <p className="mt-4 text-sm">
            {site.optician.name} · {site.optician.credentials}
          </p> */}
        </div>

        <div className="space-y-3 text-sm">
          <p className="flex gap-2">
            <MapPin className="size-4 shrink-0 translate-y-0.5" />
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
              {fullAddress()}
            </a>
          </p>
          <p className="flex gap-2">
            <Phone className="size-4 shrink-0 translate-y-0.5" />
            <a href={`tel:${site.phone}`} className="hover:text-paper">
              {site.phone}
            </a>
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 flex items-center gap-2 font-medium text-paper">
            <Clock className="size-4" /> Store hours
          </p>
          {site.hours.map((h) => (
            <p key={h.days} className="flex justify-between gap-4 py-0.5">
              <span>{h.days}</span>
              <span>
                {h.opens} – {h.closes}
              </span>
            </p>
          ))}
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-paper">
              {l.label}
            </Link>
          ))}
          <Link href="/policies/returns" className="hover:text-paper">
            Returns &amp; exchange
          </Link>
          <Link href="/policies/warranty" className="hover:text-paper">
            Warranty
          </Link>
          <Link href="/policies/privacy" className="hover:text-paper">
            Privacy
          </Link>
        </nav>
      </Container>

      <Container className="border-t border-paper/10 pt-6 text-xs text-paper/50">
        © {new Date().getFullYear()} {site.name}. Frames shown online are available to try and buy in store.
      </Container>
    </footer>
  );
}
