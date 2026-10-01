"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";
import { useBooking } from "@/components/booking/BookingProvider";
import { ServiceIcon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Інтерактивна сітка послуг.
 * Desktop: підсвічування за курсором, анімована межа.
 * Деталі («Ознаки») відкриваються лише кліком — і на mobile, і на desktop.
 */
export function ServiceGrid({ services }: { services: Service[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { open } = useBooking();

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
      {services.map((s, i) => {
        const isOpen = openId === s.id;
        const panelId = `service-${s.id}-details`;
        return (
          <RevealItem as="li" effect="scale" key={s.id} className="bg-bg">
            <article
              onPointerMove={onMove}
              data-open={isOpen}
              className="group relative flex h-full flex-col bg-surface p-6 transition-colors duration-500 hover:bg-surface-2 data-[open=true]:bg-surface-2 sm:p-8"
            >
              {/* Підсвічування за курсором */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgb(245 165 36 / 0.08), transparent 60%)" }}
              />
              {/* Анімована верхня межа */}
              <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-linear-to-r from-accent via-accent/60 to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100 group-data-[open=true]:scale-x-100" />

              <div className="relative flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-md border border-line-strong bg-fg/2 text-metal transition-[color,border-color,transform] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:border-accent/50 group-hover:text-accent group-data-[open=true]:text-accent">
                  <ServiceIcon name={s.icon} className="size-6" />
                </span>
                <span className="font-mono text-xs text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <h3 className="relative mt-8 text-xl font-semibold tracking-[-0.015em] sm:text-2xl">{s.title}</h3>
              <p className="relative mt-2 text-[15px] leading-relaxed text-muted">{s.description}</p>

              <ul className="relative mt-5 grid gap-2 text-[15px] text-metal">
                {s.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span aria-hidden className="h-px w-3 bg-line-strong transition-[width,background-color] duration-500 group-hover:w-4 group-hover:bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Додаткова інформація — лише по кліку (і на mobile, і на desktop) */}
              <div
                id={panelId}
                role="region"
                aria-label={`${s.title}: з чим звертаються`}
                inert={!isOpen}
                className="relative grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-out-expo group-data-[open=true]:grid-rows-[1fr] group-data-[open=true]:opacity-100"
              >
                <div className="overflow-hidden">
                  <div className="mt-6 rounded-md border border-line bg-bg/40 p-4">
                    <p className="font-mono text-[11px] tracking-[0.12em] text-subtle uppercase">З чим звертаються</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {s.symptoms.map((sym) => (
                        <li key={sym} className="rounded-sm border border-line px-2.5 py-1 text-[13px] text-metal">
                          {sym}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="relative mt-auto flex items-center justify-between gap-3 pt-7">
                <button
                  type="button"
                  onClick={() => open({ service: s.title, context: `Послуга: ${s.title}`, title: s.title })}
                  aria-haspopup="dialog"
                  className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-fg transition-colors hover:text-accent"
                >
                  Записатися
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : s.id)}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors",
                    isOpen ? "border-accent/50 text-fg" : "border-line text-muted hover:border-line-strong hover:text-fg",
                  )}
                >
                  {isOpen ? "Згорнути" : "Ознаки"}
                  <ChevronDown className={cn("size-4 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden />
                </button>
              </div>
            </article>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
