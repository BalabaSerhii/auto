"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Ph } from "./Typography";

type Item = { q: string; a: string };

/**
 * Доступний акордеон (WAI-ARIA pattern): кнопка в заголовку, aria-expanded,
 * aria-controls, регіон з aria-labelledby. Відкритий лише один пункт —
 * відкриття нового згортає попередній. Плавна висота — CSS grid-rows;
 * відповіді завжди є в HTML (добре для SEO), згорнуті — inert.
 */
export function Accordion({ items, className }: { items: Item[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left text-lg font-semibold tracking-[-0.01em] transition-colors hover:text-accent sm:text-xl"
              >
                <span className="flex gap-4">
                  <span aria-hidden className="mt-1.5 font-mono text-xs font-normal text-subtle tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item.q}</span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line-strong transition-[transform,background-color,border-color,color] duration-500 ease-out-expo",
                    isOpen ? "rotate-45 border-accent bg-accent text-accent-ink" : "group-hover:border-accent/60",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 pl-9 text-base leading-relaxed text-muted sm:pl-10">
                  <Ph>{item.a}</Ph>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
