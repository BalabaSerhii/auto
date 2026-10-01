import { ArrowRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/site";
import { primaryMessenger, telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/Motion";
import { Ph } from "@/components/ui/Typography";
import { HeroVisual } from "./HeroVisual";

const promises = [
  "Пояснюємо, що саме потрібно ремонтувати і чому.",
  "Погоджуємо вартість робіт до початку ремонту.",
  "Фото та відео стану автомобіля за потреби.",
  "Запис на зручний для вас час.",
];

export function Hero() {
  const phone = telHref();
  const messenger = primaryMessenger();

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pb-24">
      <div aria-hidden className="bg-grid mask-fade-y absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-10 lg:px-8">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-md border border-line bg-fg/3 px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-metal uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              Автосервіс <span className="text-subtle">•</span> Діагностика <span className="text-subtle">•</span> Ремонт
            </p>
          </Reveal>

          <h1 id="hero-title" className="mt-6 text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]">
            <TextReveal text="Знаємо, що потрібно вашому авто." accentWords={["авто."]} delay={0.1} />
          </h1>

          <Reveal delay={0.35}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Діагностика, технічне обслуговування та ремонт автомобілів. Пояснюємо проблему, погоджуємо роботи та повертаємо авто в дорогу.
            </p>
          </Reveal>

          <Reveal delay={0.45} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact" size="lg" className="w-full sm:w-auto">
              Записатися на сервіс
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden />
            </Button>
            {phone ? (
              <Button href={phone} variant="secondary" size="lg" className="w-full sm:w-auto">
                <Phone className="size-4" aria-hidden />
                Зателефонувати
              </Button>
            ) : messenger ? (
              <Button href={messenger.href!} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg" className="w-full sm:w-auto">
                <MessageCircle className="size-4" aria-hidden />
                Написати в месенджер
              </Button>
            ) : (
              <Button href="#estimate" variant="secondary" size="lg" className="w-full sm:w-auto">
                Дізнатися вартість
              </Button>
            )}
          </Reveal>

          <Reveal delay={0.55}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <li className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-subtle" aria-hidden />
                <Ph>{`${site.address.street}, ${site.address.city}`}</Ph>
              </li>
              <li className="inline-flex items-center gap-2">
                <Clock className="size-4 text-subtle" aria-hidden />
                {site.hours[0].days}: <Ph>{site.hours[0].time}</Ph>
              </li>
              {!phone ? (
                <li className="inline-flex items-center gap-2">
                  <Phone className="size-4 text-subtle" aria-hidden />
                  <Ph>{site.phone}</Ph>
                </li>
              ) : null}
            </ul>
          </Reveal>
        </div>

        <Reveal effect="scale" delay={0.2}>
          <HeroVisual />
        </Reveal>
      </div>

      {/* Конкретні обіцянки замість гучних слоганів */}
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:mt-24 lg:px-8">
        <ul className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((text, i) => (
            <li key={text} className="flex gap-4 border-b border-line py-5 sm:pr-6 lg:border-b-0 lg:py-7 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-6">
              <span className="font-mono text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[15px] leading-snug text-metal">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
