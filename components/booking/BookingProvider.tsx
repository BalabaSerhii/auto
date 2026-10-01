"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { BookingDialog } from "./BookingDialog";

type OpenOptions = {
  /** Підсумок, який додасться до заявки (напр. з калькулятора) */
  context?: string;
  service?: string;
  title?: string;
};

type BookingCtx = {
  open: (opts?: OpenOptions) => void;
};

const Ctx = createContext<BookingCtx | null>(null);

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

/**
 * Клієнтська оболонка: Motion (LazyMotion — лише потрібні фічі, менший бандл),
 * повага до prefers-reduced-motion та компактна форма запису у діалозі.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean } & OpenOptions>({ open: false });

  const open = useCallback((opts: OpenOptions = {}) => setState({ open: true, ...opts }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Ctx.Provider value={value}>
          {children}
          <BookingDialog open={state.open} onClose={close} context={state.context} service={state.service} title={state.title} />
        </Ctx.Provider>
      </MotionConfig>
    </LazyMotion>
  );
}

/** Кнопка, що відкриває компактну форму. Для використання в серверних компонентах. */
export function BookingTrigger({
  children,
  className,
  context,
  service,
}: {
  children: ReactNode;
  className?: string;
} & OpenOptions) {
  const { open } = useBooking();
  return (
    <button type="button" className={className} onClick={() => open({ context, service })} aria-haspopup="dialog">
      {children}
    </button>
  );
}
