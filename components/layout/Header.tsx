"use client";

import { ArrowRight, Phone, X } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { nav, site } from "@/data/site";
import { cn, telHref } from "@/lib/utils";
import { useModal } from "@/lib/use-modal";
import { usePresence, useScrollY } from "@/lib/motion-lite";
import { buttonClass } from "@/components/ui/Button";
import { Ph } from "@/components/ui/Typography";
import { BrandName, Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const phone = telHref();

  useScrollY((y, prev) => {
    setScrolled(y > 24);
    // Ховаємо при прокрутці вниз, показуємо при прокрутці вгору
    if (y > 320 && y > prev + 4) setHidden(true);
    else if (y < prev - 4 || y < 320) setHidden(false);
  });

  // Підсвічування активного розділу в навігації
  useEffect(() => {
    const ids = ["top", ...nav.map((n) => n.href.slice(1))];
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "top" ? null : e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-out-expo sm:px-5",
          hidden ? "-translate-y-[110%]" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 rounded-lg border px-3 transition-[background-color,border-color,box-shadow] duration-500 sm:px-4",
            scrolled ? "glass border-line shadow-[0_8px_32px_-12px_rgb(0_0_0/0.35)]" : "border-transparent bg-transparent",
          )}
        >
          <a href="#top" className="flex min-h-11 min-w-0 items-center gap-3 rounded-md pr-2" aria-label={`${site.name} — на початок сторінки`}>
            <Logo />
            <span className="truncate text-[17px] font-bold tracking-[-0.02em]">
              <BrandName />
            </span>
          </a>

          <nav aria-label="Основна навігація" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const isActive = active === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative inline-flex h-10 items-center rounded-md px-3 text-sm transition-colors",
                        isActive ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {item.label}
                      <span aria-hidden className={cn("absolute inset-x-3 -bottom-px h-px origin-left bg-accent transition-transform duration-500 ease-out-expo", isActive ? "scale-x-100" : "scale-x-0")} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {phone ? (
              <a href={phone} className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-metal transition-colors hover:text-fg 2xl:inline-flex">
                <Phone className="size-4" aria-hidden />
                {site.phone}
              </a>
            ) : null}
            <ThemeToggle />
            <a href="#contact" className={buttonClass("primary", "md", "hidden h-10 sm:inline-flex")}>
              <span className="relative z-10">Записатися</span>
            </a>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-md border border-line-strong text-fg transition-colors hover:bg-fg/6 xl:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Відкрити меню"
              onClick={() => setMenuOpen(true)}
            >
              <span aria-hidden className="relative block h-3 w-5">
                <span className="absolute top-0 left-0 h-[1.5px] w-5 rounded bg-current" />
                <span className="absolute top-3 left-0 h-[1.5px] w-3.5 rounded bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} phone={phone} />
    </>
  );
}

/**
 * Мобільне меню: повністю перекриває сторінку (непрозорий фон, над усіма
 * плаваючими елементами) і вміщується в один екран — розміри пунктів
 * масштабуються від висоти екрана (dvh), прокрутки немає.
 */
function MobileMenu({ open, onClose, phone }: { open: boolean; onClose: () => void; phone: string | null }) {
  const ref = useModal(open, onClose);
  const { mounted, state } = usePresence(open, 550);
  if (!mounted) return null;

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Меню"
      data-state={state}
      className="fixed inset-0 z-90 flex h-dvh flex-col overflow-hidden bg-bg transition-[clip-path] duration-500 ease-out-expo [clip-path:inset(0_0_100%_0)] data-[state=open]:[clip-path:inset(0_0_0%_0)] xl:hidden"
    >
      <div aria-hidden className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-60" />

      {/* Верхня панель меню */}
      <div className="relative px-3 pt-3 sm:px-5">
        <div className="flex h-16 items-center justify-between gap-3 rounded-lg border border-line px-3 sm:px-4">
          <a href="#top" onClick={onClose} className="flex min-h-11 min-w-0 items-center gap-3">
            <Logo />
            <span className="truncate text-[17px] font-bold tracking-[-0.02em]">
              <BrandName />
            </span>
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              aria-label="Закрити меню"
              className="grid size-10 place-items-center rounded-md border border-line-strong transition-colors hover:bg-fg/6"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <nav aria-label="Мобільна навігація" className="relative flex min-h-0 flex-1 flex-col justify-center px-5 sm:px-8">
        <ul className="grid">
          {nav.map((item, i) => (
            <li key={item.href} className="anim-fade-up border-b border-line" style={{ animationDelay: `${0.12 + i * 0.04}s` } as CSSProperties}>
              <a
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-4 py-[clamp(0.35rem,1.25dvh,1rem)] text-[clamp(1.2rem,3.6dvh,2rem)] leading-tight font-semibold tracking-[-0.02em] transition-colors hover:text-accent"
              >
                <span className="font-mono text-xs font-normal text-subtle">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="anim-fade-up relative grid gap-2 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8" style={{ animationDelay: "0.38s" }}>
        <a href="#contact" onClick={onClose} className={buttonClass("primary", "lg", "w-full")}>
          <span className="relative z-10 inline-flex items-center gap-2">
            Записатися на сервіс <ArrowRight className="size-4" aria-hidden />
          </span>
        </a>
        {phone ? (
          <a href={phone} className={buttonClass("secondary", "lg", "w-full")}>
            <span className="relative z-10 inline-flex items-center gap-2">
              <Phone className="size-4" aria-hidden /> {site.phone}
            </span>
          </a>
        ) : (
          <p className="text-center text-sm text-subtle">
            Телефон: <Ph>{site.phone}</Ph>
          </p>
        )}
      </div>
    </div>
  );
}
