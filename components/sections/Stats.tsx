import { stats } from "@/data/stats";
import { NumberTicker } from "@/components/ui/Motion";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Показники. Лише реальні числа — до заповнення показуються плейсхолдери. */
export function Stats() {
  return (
    <section aria-label="Показники автосервісу" className="relative border-y border-line bg-surface">
      <div aria-hidden className="bg-dots absolute inset-0 opacity-50 mask-fade-x" />
      <RevealGroup as="ul" className="relative mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4" stagger={0.1}>
        {stats.map((s, i) => (
          <RevealItem
            as="li"
            key={s.label}
            className={`flex flex-col gap-2 px-4 py-10 sm:px-8 sm:py-14 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <span className="text-5xl font-semibold tracking-[-0.04em] tabular-nums sm:text-6xl lg:text-7xl">
              {s.value !== null ? (
                <NumberTicker value={s.value} suffix={s.suffix} />
              ) : (
                <span className="placeholder-data decoration-2 underline-offset-8">
                  {s.placeholder}
                  {s.suffix}
                </span>
              )}
            </span>
            <span className="text-sm text-muted sm:text-base">{s.label}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
