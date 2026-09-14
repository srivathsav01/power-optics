import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <Container className="pt-10 pb-10 sm:pt-16 sm:pb-14">
      <Reveal>
        <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl leading-[1.05] sm:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-ink-soft">{intro}</p>}
        {children}
      </Reveal>
    </Container>
  );
}
