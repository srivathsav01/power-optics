import { Star } from "lucide-react";

export function StarRating({ rating, className = "size-4" }: { rating: number; className?: string }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${className} ${i <= Math.round(rating) ? "fill-accent text-accent" : "text-ink/20"}`}
        />
      ))}
    </span>
  );
}
