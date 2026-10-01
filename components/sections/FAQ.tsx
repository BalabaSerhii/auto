import { faq } from "@/data/faq";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/Typography";

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="faq-title" index="07" eyebrow="FAQ" title="Часті питання" align="left" />
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
            Не знайшли відповідь?{" "}
            <a href="#contact" className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent">
              Запитайте нас напряму
            </a>
            .
          </p>
        </div>
        <Accordion items={faq} />
      </div>
    </section>
  );
}
