"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
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
 * Клієнтська оболонка: компактна форма запису в діалозі, доступна з будь-якого місця сторінки.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean } & OpenOptions>({ open: false });

  const open = useCallback((opts: OpenOptions = {}) => setState({ open: true, ...opts }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <BookingDialog open={state.open} onClose={close} context={state.context} service={state.service} title={state.title} />
    </Ctx.Provider>
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
