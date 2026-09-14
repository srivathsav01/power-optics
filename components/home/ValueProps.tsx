import { Clock, Eye, Glasses, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

const items = [
  {
    icon: Eye,
    title: "Computerised eye tests",
    text: "Detailed refraction by a registered optometrist, in about 20 minutes.",
  },
  {
    icon: Glasses,
    title: `${site.stats.framesInStore} frames`,
    text: "From flexible TR90 and hand-polished acetate to featherweight titanium.",
  },
  {
    icon: Clock,
    title: "Lenses in 24–72 hours",
    text: "Single vision, progressive, blue-light and tinted sunglass lenses.",
  },
  {
    icon: Wrench,
    title: "Repairs & adjustments",
    text: "Loose screws, nose pads, a better fit — sorted while you wait.",
  },
];

export function ValueProps() {
  return (
    <section className="border-y border-line bg-paper-2/50 py-14 sm:py-20">
      <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.08}>
            <Icon className="size-7 text-accent" strokeWidth={1.6} />
            <h2 className="mt-4 font-display text-xl">{title}</h2>
            <p className="mt-1.5 text-ink-soft">{text}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
