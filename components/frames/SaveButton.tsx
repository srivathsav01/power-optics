"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { buttonClass } from "@/components/ui/Button";
import { useSaved } from "@/lib/store/saved";

export function SaveButton({
  slug,
  name,
  variant = "icon",
  className = "",
}: {
  slug: string;
  name: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const saved = useSaved((s) => s.slugs.includes(slug));
  const toggle = useSaved((s) => s.toggle);
  const icon = <Heart className={`size-[18px] transition-colors ${saved ? "fill-accent text-accent" : ""}`} />;

  if (variant === "full") {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        aria-pressed={saved}
        onClick={() => toggle(slug)}
        className={buttonClass("secondary", className)}
      >
        {icon} {saved ? "Saved to try in store" : "Save to try in store"}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved frames` : `Save ${name}`}
      onClick={() => toggle(slug)}
      className={`flex size-10 items-center justify-center rounded-full bg-paper/90 shadow-sm backdrop-blur hover:bg-paper ${className}`}
    >
      {icon}
    </motion.button>
  );
}
