import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "whatsapp" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 h-12 text-[15px] font-medium transition-colors disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-soft",
  secondary: "border border-ink/15 bg-paper text-ink hover:border-ink/40",
  whatsapp: "bg-whatsapp text-white hover:brightness-95",
  ghost: "text-ink hover:bg-ink/5",
};

export const buttonClass = (variant: Variant = "primary", className = "") =>
  `${base} ${variants[variant]} ${className}`;

export function ButtonLink({
  variant,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

export function ExternalButton({ variant, className, ...props }: ComponentProps<"a"> & { variant?: Variant }) {
  return <a target="_blank" rel="noopener noreferrer" className={buttonClass(variant, className)} {...props} />;
}
