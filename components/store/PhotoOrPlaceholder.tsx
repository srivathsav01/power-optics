import { Glasses } from "lucide-react";
import Image from "next/image";

/** Shows a real photo when a path is configured, otherwise a tasteful placeholder panel. */
export function PhotoOrPlaceholder({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-paper-2 ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,#fffaf1,transparent_60%)] text-muted">
          <Glasses className="size-10" strokeWidth={1.2} />
          <span className="text-xs tracking-[0.2em] uppercase">{alt}</span>
        </div>
      )}
    </div>
  );
}
