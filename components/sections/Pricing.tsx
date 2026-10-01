import { Info } from "lucide-react";
import { pricing, pricingNote } from "@/data/pricing";
import { priceLabel } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Ph, SectionHeading } from "@/components/ui/Typography";
import { Calculator } from "./Calculator";

/** Ціни: популярні роботи «від» + швидкий калькулятор. Без SaaS-тарифів. */
export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative py-20 sm:py-28">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10 opacity-40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="pricing-title"
          index="04"
          eyebrow="Ціни"
          title="Вартість — до початку робіт, а не після"
          lead="Стартові ціни на популярні роботи. Для складніших випадків — швидка оцінка в калькуляторі."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <h3 className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Популярні роботи</h3>
            <RevealGroup as="ul" className="mt-5 border-t border-line" stagger={0.06}>
              {pricing.map((p) => (
                <RevealItem as="li" key={p.id} className="group flex items-end gap-3 border-b border-line py-5">
                  <span className="min-w-0">
                    <span className="block text-lg font-medium tracking-[-0.01em] transition-colors group-hover:text-fg sm:text-xl">{p.title}</span>
                    {p.note ? <span className="mt-0.5 block text-sm text-subtle">{p.note}</span> : null}
                  </span>
                  <span aria-hidden className="mb-1.5 h-px min-w-6 flex-1 border-b border-dotted border-line-strong" />
                  <span className="shrink-0 text-lg font-semibold whitespace-nowrap tabular-nums sm:text-xl">
                    <Ph>{priceLabel(p.priceFrom)}</Ph>
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal>
              <p className="mt-6 flex gap-3 text-[15px] leading-relaxed text-muted">
                <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                {pricingNote}
              </p>
            </Reveal>
          </div>

          <div id="estimate" className="scroll-mt-24">
            <h3 className="mb-5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Швидка оцінка</h3>
            <Reveal effect="scale">
              <Calculator />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
