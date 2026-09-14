import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { policies } from "@/content/policies";

export function generateStaticParams() {
  return policies.map((p) => ({ policy: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[policy]">): Promise<Metadata> {
  const { policy } = await params;
  const p = policies.find((x) => x.slug === policy);
  return p ? { title: p.title, description: p.intro, alternates: { canonical: `/policies/${p.slug}` } } : {};
}

export default async function PolicyPage({ params }: PageProps<"/policies/[policy]">) {
  const { policy } = await params;
  const p = policies.find((x) => x.slug === policy);
  if (!p) notFound();

  return (
    <Container className="grid gap-10 pt-10 sm:pt-16 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Policies" className="order-last lg:order-first">
        <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-muted uppercase">Policies</p>
        <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {policies.map((x) => (
            <li key={x.slug}>
              <Link
                href={`/policies/${x.slug}`}
                aria-current={x.slug === p.slug ? "page" : undefined}
                className={`block rounded-full px-3.5 py-2 text-sm lg:rounded-xl ${
                  x.slug === p.slug ? "bg-ink text-paper" : "bg-ink/5 hover:bg-ink/10 lg:bg-transparent"
                }`}
              >
                {x.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <article className="max-w-3xl">
        <h1 className="font-display text-4xl sm:text-5xl">{p.title}</h1>
        <p className="mt-2 text-sm text-muted">
          Last updated {new Date(p.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="mt-6 text-lg text-ink-soft">{p.intro}</p>
        <div className="mt-10 space-y-10">
          {p.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl">{s.heading}</h2>
              <div className="mt-3 space-y-3 text-ink-soft">
                {s.body.map((para) => (
                  <p key={para.slice(0, 32)}>{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </Container>
  );
}
