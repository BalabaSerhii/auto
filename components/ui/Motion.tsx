"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, tween, useInViewOnce } from "@/lib/motion-lite";

/** Лічильник, що «докручується» до значення, коли потрапляє у viewport */
export function NumberTicker({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(ref, "0px 0px -15% 0px");

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    const fmt = new Intl.NumberFormat("uk-UA");
    if (prefersReducedMotion()) {
      node.textContent = fmt.format(value) + suffix;
      return;
    }
    return tween([0, value], { duration: 1.8 }, (v) => {
      node.textContent = fmt.format(Math.round(v)) + suffix;
    });
  }, [inView, value, suffix]);

  return (
    <span ref={ref} className={className} aria-label={`${new Intl.NumberFormat("uk-UA").format(value)}${suffix}`}>
      0{suffix}
    </span>
  );
}
