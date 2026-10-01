"use client";

import { m, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { processSteps } from "@/data/process";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/Typography";

/**
 * «Як ми працюємо» — scroll-driven timeline.
 * Desktop: горизонтальна шкала. Mobile: вертикальний stepper.
 * Лінія прогресу заповнюється під час прокрутки, кроки активуються по черзі.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [active, setActive] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
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

        <div ref={ref} className="relative mt-14 sm:mt-20">
          {/* Лінія прогресу: вертикальна (mobile) */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-line lg:hidden">
            <m.div className="h-full w-full origin-top bg-accent" style={{ scaleY: progress }} />
          </div>
          {/* Лінія прогресу: горизонтальна (desktop) */}
          <div aria-hidden className="absolute top-[19px] right-0 left-0 hidden h-px bg-line lg:block">
            <m.div className="h-full w-full origin-left bg-accent" style={{ scaleX: progress }} />
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
                  <div className={cn("transition-[opacity,transform] duration-700 ease-out-expo", isActive ? "opacity-100" : "opacity-45 lg:translate-y-1")}>
                    <h3 className="text-xl font-semibold tracking-[-0.015em] sm:text-2xl">{step.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted lg:pr-4">{step.text}</p>
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
