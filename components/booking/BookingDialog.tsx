"use client";

import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";
import { useId } from "react";
import { useModal } from "@/lib/use-modal";
import { EASE } from "@/components/ui/Reveal";
import { BookingForm } from "./BookingForm";

/** Компактна форма запису: bottom sheet на мобільному, модальне вікно на desktop */
export function BookingDialog({
  open,
  onClose,
  context,
  service,
  title,
}: {
  open: boolean;
  onClose: () => void;
  context?: string;
  service?: string;
  title?: string;
}) {
  const ref = useModal(open, onClose);
  const titleId = useId();

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-70 flex items-end justify-center sm:items-center sm:p-6">
          <m.div
            aria-hidden
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-xl border border-line-strong bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-xl sm:p-8"
          >
            <div aria-hidden className="mx-auto mb-5 h-1 w-10 rounded-full bg-fg/15 sm:hidden" />
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Швидкий запис</p>
                <h2 id={titleId} className="text-2xl font-semibold">
                  {title ?? "Залиште номер — ми передзвонимо"}
                </h2>
                <p className="mt-2 text-sm text-muted">Уточнимо деталі й погодимо зручний час.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="-mt-1 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-fg/6 hover:text-fg"
                aria-label="Закрити"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <BookingForm variant="compact" context={context} defaultService={service} onDone={onClose} />
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
