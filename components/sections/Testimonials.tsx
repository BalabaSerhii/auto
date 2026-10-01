import Image from "next/image";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { Ph, SectionHeading } from "@/components/ui/Typography";

export function Testimonials() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden bg-paper py-20 text-ink sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="reviews-title"
          tone="light"
          index="06"
          eyebrow="Відгуки"
          title="Що кажуть наші клієнти"
          lead="Відгуки людей, які вже довірили нам свої автомобілі."
        />
      </div>

      <div className="mt-12 sm:mt-16">
        <ScrollRow label="Відгуки клієнтів" tone="light">
          {testimonials.map((t, i) => (
            <li key={i} className="w-[85vw] max-w-[26rem] shrink-0 snap-start sm:w-[24rem]">
              <figure
                className={cn(
                  "flex h-full flex-col justify-between gap-10 rounded-xl border p-6 sm:p-8",
                  t.placeholder ? "border-dashed border-ink/25 bg-paper-2/60" : "border-ink-line bg-paper-card",
                )}
              >
                <div>
                  <svg aria-hidden viewBox="0 0 32 24" className="h-6 w-8 text-accent" fill="currentColor">
                    <path d="M0 24V14C0 6 4.5 1.3 12 0l1.4 3.2C9 4.7 7 7.6 6.8 11H12v13H0Zm19 0V14c0-8 4.5-12.7 12-14l1 3.2C27.6 4.7 25.6 7.6 25.4 11H31v13H19Z" />
                  </svg>
                  <blockquote className="mt-6 text-[17px] leading-relaxed font-medium tracking-[-0.01em]">
                    <Ph tone="light">{t.text}</Ph>
                  </blockquote>
                </div>
                <figcaption className="flex items-center gap-4 border-t border-ink-line pt-5">
                  {t.photo ? (
                    <Image src={t.photo} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full object-cover ring-2 ring-accent/40" />
                  ) : (
                    <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-ink/10 font-semibold">
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">
                      <Ph tone="light">{t.name}</Ph>
                    </span>
                    {t.car ? (
                      <span className="mt-0.5 block truncate text-sm text-ink-muted">
                        <Ph tone="light">{t.car}</Ph>
                      </span>
                    ) : null}
                  </span>
                  {t.date ? (
                    <span className="shrink-0 self-start font-mono text-xs text-ink-muted">
                      <Ph tone="light">{t.date}</Ph>
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ScrollRow>
      </div>
    </section>
  );
}
