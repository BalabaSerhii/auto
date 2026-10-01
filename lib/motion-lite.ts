"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Мінімальні замінники Motion: анімації сайту зроблені на CSS-переходах,
 * а тут — лише керування станом. Бібліотека анімацій не потрапляє в бандл.
 */

/** Користувач просить менше анімацій */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Монтує елемент для анімації появи та залишає змонтованим на час анімації зникнення.
 * state: "closed" → (кадр) → "open" при відкритті; "closed" → демонтаж через `duration` мс при закритті.
 */
export function usePresence(open: boolean, duration = 350) {
  // Монтуємо одразу в тому ж рендері, що й open=true — щоб ref'и та фокус були доступні в ефектах
  const [closing, setClosing] = useState(false);
  const [state, setState] = useState<"open" | "closed">("closed");
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      setClosing(false);
      // Два кадри: спершу малюємо початковий стан, потім вмикаємо перехід
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setState("open"));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setState("closed");
    if (!wasOpen.current) return;
    wasOpen.current = false;
    setClosing(true);
    const t = window.setTimeout(() => setClosing(false), prefersReducedMotion() ? 0 : duration);
    return () => window.clearTimeout(t);
  }, [open, duration]);

  return { mounted: open || closing, state };
}

/** true, коли елемент уперше потрапив у viewport */
export function useInViewOnce(ref: RefObject<Element | null>, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, inView]);
  return inView;
}

/** Обробник прокрутки, згладжений через requestAnimationFrame */
export function useScrollY(onScroll: (y: number, prev: number) => void) {
  const cb = useRef(onScroll);
  cb.current = onScroll;
  useEffect(() => {
    let prev = window.scrollY;
    let raf = 0;
    const handler = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        cb.current(y, prev);
        prev = y;
      });
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      cancelAnimationFrame(raf);
    };
  }, []);
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Анімація числа через ключові кадри. Повертає функцію зупинки. */
export function tween(
  keyframes: number[],
  { duration, delay = 0, ease = "out" }: { duration: number; delay?: number; ease?: "out" | "inOut" },
  onUpdate: (v: number) => void,
): () => void {
  const fn = ease === "out" ? easeOutExpo : easeInOut;
  const segments = keyframes.length - 1;
  let raf = 0;
  let start = 0;
  const timer = window.setTimeout(() => {
    const frame = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / (duration * 1000));
      const pos = t * segments;
      const i = Math.min(segments - 1, Math.floor(pos));
      const local = segments === 1 ? fn(t) : easeInOut(pos - i);
      onUpdate(keyframes[i] + (keyframes[i + 1] - keyframes[i]) * local);
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }, delay * 1000);
  return () => {
    window.clearTimeout(timer);
    cancelAnimationFrame(raf);
  };
}
