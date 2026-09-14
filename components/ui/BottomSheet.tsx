"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useEffect, type ReactNode } from "react";

/** Mobile bottom sheet. Drag the handle down or tap the backdrop to close. */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 flex max-h-[85svh] flex-col rounded-t-3xl bg-paper"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) onClose();
            }}
          >
            <div className="cursor-grab touch-none pt-3" onPointerDown={(e) => drag.start(e)}>
              <div className="mx-auto h-1.5 w-10 rounded-full bg-ink/15" />
              <div className="flex items-center justify-between px-5 py-2">
                <h2 className="font-display text-xl">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex size-10 items-center justify-center rounded-full hover:bg-ink/5"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-4">{children}</div>
            {footer && <div className="border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
