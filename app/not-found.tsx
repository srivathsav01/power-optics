import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60svh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl blur-[3px] select-none sm:text-9xl" aria-hidden>
        404
      </p>
      <h1 className="mt-6 font-display text-3xl">This page is a little out of focus</h1>
      <p className="mt-2 text-muted">It may have moved, or it&apos;s still being built.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/shop" variant="secondary">
          Explore frames
        </ButtonLink>
      </div>
    </Container>
  );
}
