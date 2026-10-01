"use client";

import { useRef, useState } from "react";
import { useScrollY } from "@/lib/motion-lite";
import { processSteps } from "@/data/process";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/Typography";

/**
 * «Як ми працюємо» — scroll-driven timeline.
 * Desktop: горизонтальна шкала. Mobile: вертикальний stepper.
 * Лінія прогресу заповнюється під час прокрутки (CSS-змінна --p + плавний перехід),
 * кроки активуються по черзі.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  // 0 — верх блоку на 80% висоти екрана, 1 — низ блоку на 55%
  useScrollY(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const v = Math.min(1, Math.max(0, (0.8 * vh - r.top) / (0.25 * vh + r.height)));
    el.style.setProperty("--p", String(v));
    setActive(v <= 0 ? -1 : Math.min(processSteps.length - 1, Math.floor(v * processSteps.length)));
  });

  return (
    <section id="process" aria-labelledby="process-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="process-title"
          index="03"
          eyebrow="Як ми працюємо"
          title="П'ять кроків від заявки до ключів"
          lead="Кожен крок прозорий: ви знаєте, що відбувається з автомобілем і скільки це коштуватиме."
        />

        <div ref={ref} className="relative mt-14 [--p:0] sm:mt-20">
          {/* Лінія прогресу: вертикальна (mobile) */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-line lg:hidden">
            <div className="h-full w-full origin-top scale-y-(--p) bg-accent transition-transform duration-300 ease-out" />
          </div>
          {/* Лінія прогресу: горизонтальна (desktop) */}
          <div aria-hidden className="absolute top-[19px] right-0 left-0 hidden h-px bg-line lg:block">
            <div className="h-full w-full origin-left scale-x-(--p) bg-accent transition-transform duration-300 ease-out" />
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((step, i) => {
              const isActive = i <= active;
              return (
                <li key={step.title} className="grid grid-cols-[40px_1fr] gap-5 lg:grid-cols-1 lg:gap-8">
                  <span
                    className={cn(
                      "relative z-10 grid size-10 place-items-center rounded-full border font-mono text-xs tabular-nums transition-[background-color,border-color,color,box-shadow] duration-500",
                      isActive ? "border-accent bg-accent text-accent-ink shadow-glow" : "border-line-strong bg-bg text-muted",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* Неактивні кроки приглушені кольором, а не прозорістю — контраст тексту ≥ 4.5:1 (WCAG AA) */}
                  <div className={cn("transition-transform duration-700 ease-out-expo", !isActive && "lg:translate-y-1")}>
                    <h3 className={cn("text-xl font-semibold tracking-[-0.015em] transition-colors duration-700 sm:text-2xl", isActive ? "text-fg" : "text-muted")}>{step.title}</h3>
                    <p className={cn("mt-2 text-[15px] leading-relaxed transition-colors duration-700 lg:pr-4", isActive ? "text-muted" : "text-subtle")}>{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
