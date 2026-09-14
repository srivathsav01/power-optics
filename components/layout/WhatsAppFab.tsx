"use client";

import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/format";

export function WhatsAppFab() {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={whatsappLink(`Hi ${site.shortName}! I have a question.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={reduce ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
      whileTap={{ scale: 0.92 }}
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center gap-2 rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgba(31,168,85,0.6)] sm:right-6 sm:bottom-6 sm:w-auto sm:pr-5 sm:pl-4"
    >
      <MessageCircle className="size-6" strokeWidth={2.2} />
      {/* icon-only on phones so it doesn't cover full-width buttons */}
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </motion.a>
  );
}
