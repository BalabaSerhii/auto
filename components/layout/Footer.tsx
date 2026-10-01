import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { legalLinks, nav, site } from "@/data/site";
import { activeMessengers, cn, telHref } from "@/lib/utils";
import { MessengerIcon } from "@/components/ui/Icon";
import { Ph } from "@/components/ui/Typography";
import { BrandName, Logo } from "./Logo";

export function Footer() {
  const phone = telHref();
  const messengers = activeMessengers();

  return (
    <footer className="relative border-t border-line bg-bg pb-28 sm:pb-10">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-lg font-bold tracking-[-0.02em]">
              <BrandName />
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{site.description}</p>
        </div>

        <div>
          <h2 className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">Контакти</h2>
          <ul className="mt-5 grid gap-3 text-sm">
            <li>
              {phone ? (
                <a href={phone} className="text-fg hover:text-accent">
                  {site.phone}
                </a>
              ) : (
                <Ph>{site.phone}</Ph>
              )}
            </li>
            <li>
              {site.email.includes("[") ? <Ph>{site.email}</Ph> : <a href={`mailto:${site.email}`} className="text-fg hover:text-accent">{site.email}</a>}
            </li>
            <li className="text-muted">
              <Ph>{`${site.address.street}, ${site.address.city}`}</Ph>
            </li>
            {site.hours.map((h) => (
              <li key={h.days} className="text-muted">
                {h.days}: {h.time}
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Навігація у футері">
          <h2 className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">Навігація</h2>
          <ul className="mt-5 grid gap-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-muted transition-colors hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">Месенджери</h2>
          {messengers.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {messengers.map((msg) => (
                <li key={msg.id}>
                  <a
                    href={msg.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-line px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <MessengerIcon id={msg.id} className="size-4" />
                    {msg.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm">
              <Ph>[Посилання на Telegram / Viber / WhatsApp / Instagram — лише реальні]</Ph>
            </p>
          )}
        </div>
      </div>

      <FooterBottom className="mt-14" />
    </footer>
  );
}

/** Нижній рядок: копірайт, юридичні посилання, розробник. Також на юридичних сторінках. */
export function FooterBottom({ className }: { className?: string }) {
  const year = new Date().getFullYear();
  return (
    <div className={cn("mx-auto grid max-w-7xl gap-4 border-t border-line px-4 pt-6 text-xs text-subtle sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8 lg:px-8", className)}>
      <p>
        © {year} <Ph>{site.name}</Ph>. Усі права захищено.
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-center">
        {legalLinks.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <a
        href={site.developer.url}
        target="_blank"
        rel="noopener"
        className="group inline-flex items-center gap-1.5 transition-colors hover:text-fg"
      >
        Розроблено в <span className="font-semibold text-metal transition-colors group-hover:text-accent">{site.developer.name}</span>
        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </a>
    </div>
  );
}
