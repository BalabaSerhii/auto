"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Поведінка модального вікна: фокус усередину, Tab по колу, Esc закриває,
 * прокрутка сторінки блокується, після закриття фокус повертається назад.
 */
export function useModal(open: boolean, onClose: () => void, extraSelector?: string): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const node = ref.current;
    const focusFirst = () => {
      const target = node?.querySelector<HTMLElement>("[data-autofocus]") ?? node?.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus({ preventScroll: true });
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      // Елементи поза контейнером, що мають лишатися в циклі Tab (напр. кнопка закриття меню в header)
      const extra = extraSelector ? Array.from(document.querySelectorAll<HTMLElement>(extraSelector)) : [];
      const items = [...extra, ...Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE))].filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = "";
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, extraSelector]);

  return ref;
}
