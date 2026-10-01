import { benefits } from "@/data/benefits";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Ph, SectionHeading } from "@/components/ui/Typography";

/**
 * «Чому обирають нас» — на світлій поверхні: змінює ритм сторінки
 * і візуально відділяє «довіру» від «послуг».
 */
export function Benefits() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="relative bg-paper py-20 text-ink sm:py-28">
      <div aria-hidden className="bg-grid-ink mask-fade-y absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="why-title"
          tone="light"
          index="02"
          eyebrow="Чому обирають нас"
          title={
            <>
              Пояснюємо до того,
              <br className="hidden sm:block" /> як ремонтуємо
            </>
          }
          lead="Жодних абстрактних «найкращих у місті». Лише те, як ми працюємо щодня."
        />

        <RevealGroup as="ol" className="mt-14 grid gap-px overflow-hidden border-y border-ink-line bg-ink-line md:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {benefits.map((b, i) => (
            <RevealItem
              as="li"
              effect="clip"
              key={b.title}
              className="group relative bg-paper py-8 md:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-ink-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden className="h-px w-10 origin-right scale-x-50 bg-ink/30 transition-transform duration-700 ease-out-expo group-hover:scale-x-100 group-hover:bg-accent" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">{b.title}</h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-muted">
                <Ph tone="light">{b.text}</Ph>
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 flex flex-col items-start justify-between gap-6 rounded-xl bg-ink p-6 text-paper sm:flex-row sm:items-center sm:p-8">
          <p className="max-w-xl text-lg leading-snug font-medium">Не впевнені, що з авто? Почніть з діагностики — після неї буде зрозуміло, що робити далі і скільки це коштує.</p>
          <a
            href="#contact"
            className="inline-flex h-12 shrink-0 items-center rounded-md bg-accent px-6 font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          >
            Записатися на діагностику
          </a>
        </Reveal>
      </div>
    </section>
  );
}
