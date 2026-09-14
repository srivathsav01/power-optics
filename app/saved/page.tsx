import type { Metadata } from "next";
import { SavedList } from "@/components/frames/SavedList";
import { Container } from "@/components/ui/Container";
import { getFrames } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Saved frames",
  robots: { index: false },
};

export default async function SavedPage() {
  const frames = await getFrames();
  return (
    <Container className="pt-8 sm:pt-12">
      <h1 className="font-display text-3xl sm:text-5xl">Saved to try in store</h1>
      <p className="mt-2 mb-8 max-w-xl text-ink-soft">
        Your shortlist is kept on this device. Send it to us on WhatsApp and we&apos;ll have them ready when you visit.
      </p>
      <SavedList frames={frames} />
    </Container>
  );
}
