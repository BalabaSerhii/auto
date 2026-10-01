"use client";

import { animate, m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE } from "./Reveal";

/**
 * Поява заголовка по словах: кожне слово «виїжджає» з-під маски.
 * Для скрінрідерів — цілий рядок без розбиття.
 */
export function TextReveal({ text, className, delay = 0, accentWords = [] }: { text: string; className?: string; delay?: number; accentWords?: string[] }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <m.span
              className={accentWords.includes(word) ? "inline-block text-accent" : "inline-block"}
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.06 }}
            >
              {word}
            </m.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Лічильник, що «докручується» до значення, коли потрапляє у viewport */
export function NumberTicker({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const fmt = new Intl.NumberFormat("uk-UA");

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduce) {
      node.textContent = fmt.format(value) + suffix;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = fmt.format(Math.round(v)) + suffix;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, suffix, reduce]);

  return (
    <span ref={ref} className={className} aria-label={`${fmt.format(value)}${suffix}`}>
      0{suffix}
    </span>
  );
}
