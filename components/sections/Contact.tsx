import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { site } from "@/data/site";
import { activeMessengers, routeHref, telHref } from "@/lib/utils";
import { BookingForm } from "@/components/booking/BookingForm";
import { MessengerIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { LocationMap } from "./LocationMap";
import { Ph, SectionHeading } from "@/components/ui/Typography";

export function Contact() {
  const phone = telHref();
  const route = routeHref();
  const messengers = activeMessengers();

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="contact-title"
          index="08"
          eyebrow="Запис і контакти"
          title="Запишіться на зручний час"
          lead="Залиште заявку — ми зателефонуємо, уточнимо деталі та погодимо час візиту."
        />

        <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          {/* Форма */}
          <Reveal className="rounded-xl border border-line-strong bg-surface p-5 shadow-card sm:p-8">
            <h3 className="mb-6 text-xl font-semibold">Заявка на обслуговування</h3>
            <BookingForm variant="full" />
          </Reveal>

          {/* Швидкі контакти + карта */}
          <div className="grid content-start gap-6">
            <Reveal delay={0.1} className="rounded-xl border border-line bg-surface p-5 sm:p-8">
              <h3 className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Швидкий зв&apos;язок</h3>
              <ul className="mt-5 grid gap-2">
                <li>
                  {phone ? (
                    <a href={phone} className="group flex min-h-14 items-center gap-4 rounded-md border border-line px-4 transition-colors hover:border-accent/50 hover:bg-accent-soft">
                      <Phone className="size-5 text-accent" aria-hidden />
                      <span>
                        <span className="block text-xs text-muted">Телефон</span>
                        <span className="block text-lg font-semibold">{site.phone}</span>
                      </span>
                    </a>
                  ) : (
                    <div className="flex min-h-14 items-center gap-4 rounded-md border border-dashed border-line-strong px-4">
                      <Phone className="size-5 text-subtle" aria-hidden />
                      <span>
                        <span className="block text-xs text-muted">Телефон</span>
                        <Ph>{site.phone}</Ph>
                      </span>
                    </div>
                  )}
                </li>
                {messengers.length > 0 ? (
                  <li className="grid grid-cols-2 gap-2">
                    {messengers.map((msg) => (
                      <a
                        key={msg.id}
                        href={msg.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-12 items-center gap-3 rounded-md border border-line px-4 text-[15px] font-medium transition-colors hover:border-line-strong hover:bg-fg/4"
                      >
                        <MessengerIcon id={msg.id} className="size-5 text-metal" />
                        {msg.label}
                      </a>
                    ))}
                  </li>
                ) : (
                  <li className="rounded-md border border-dashed border-line-strong px-4 py-3 text-sm">
                    <span className="block text-xs text-muted">Viber · Telegram · WhatsApp</span>
                    <Ph>[Посилання — лише на реально існуючі канали]</Ph>
                  </li>
                )}
                {site.email.includes("[") ? null : (
                  <li>
                    <a href={`mailto:${site.email}`} className="flex min-h-12 items-center gap-4 rounded-md px-4 text-muted transition-colors hover:text-fg">
                      <Mail className="size-5" aria-hidden />
                      {site.email}
                    </a>
                  </li>
                )}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="overflow-hidden rounded-xl border border-line bg-surface">
              <LocationMap className="aspect-4/3 border-b border-line sm:aspect-16/10" />
              <div className="grid gap-5 p-5 sm:p-8">
                <div className="flex gap-4">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                  <address className="not-italic">
                    <span className="block font-semibold">
                      <Ph>{site.address.street}</Ph>
                    </span>
                    <span className="block text-muted">
                      {site.address.postalCode}, {site.address.city}
                    </span>
                  </address>
                </div>
                <div className="flex gap-4">
                  <Clock className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                  <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[15px]">
                    {site.hours.map((h) => (
                      <div key={h.days} className="contents">
                        <dt className="text-muted">{h.days}</dt>
                        <dd>
                          <Ph>{h.time}</Ph>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <span className="h-fit shrink-0 rounded-sm bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">{site.hoursNote}</span>
                </div>
                {route ? (
                  <a
                    href={route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line-strong font-semibold transition-colors hover:border-accent/60 hover:bg-accent-soft"
                  >
                    <Navigation className="size-4" aria-hidden />
                    Побудувати маршрут
                  </a>
                ) : (
                  <p className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-dashed border-line-strong text-sm text-muted">
                    <Navigation className="size-4" aria-hidden />
                    Побудувати маршрут — з&apos;явиться після заповнення адреси
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

