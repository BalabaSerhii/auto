import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { legalLinks, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { FooterBottom } from "./Footer";
import { BrandName, Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Абзаци після списку */
  after?: string[];
};

/** Шаблон юридичної сторінки */
export function LegalPage({ title, intro, sections, current }: { title: string; intro?: string; sections: LegalSection[]; current: string }) {
  return (
    <>
      <header className="px-3 pt-3 sm:px-5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 rounded-lg border border-line px-3 sm:px-4">
          <Link href="/" className="flex min-h-11 items-center gap-3">
            <Logo />
            <span className="text-[17px] font-bold tracking-[-0.02em]">
              <BrandName />
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-md border border-line-strong px-3 text-sm font-medium transition-colors hover:border-accent/60">
              <ArrowLeft className="size-4" aria-hidden />
              <span className="hidden sm:inline">На головну</span>
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16 lg:px-8">
        <nav aria-label="Юридичні документи" className="lg:sticky lg:top-8 lg:self-start">
          <p className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">Документи</p>
          <ul className="mt-4 grid gap-1">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={l.href === current ? "page" : undefined}
                  className={cn(
                    "block rounded-md border-l-2 px-3 py-2 text-sm transition-colors",
                    l.href === current ? "border-accent bg-accent-soft font-semibold text-fg" : "border-transparent text-muted hover:text-fg",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 font-mono text-xs tracking-[0.08em] text-subtle uppercase">Редакція від {site.legalUpdated}</p>
          {intro ? <p className="mt-8 text-lg leading-relaxed text-metal">{intro}</p> : null}

          <ol className="mt-12 grid gap-10">
            {sections.map((s, i) => (
              <li key={s.heading}>
                <h2 className="flex gap-3 text-xl font-semibold tracking-[-0.015em] sm:text-2xl">
                  <span className="mt-1.5 font-mono text-xs font-normal text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {s.heading}
                </h2>
                <div className="mt-4 grid gap-3 pl-8 text-[15px] leading-relaxed text-muted">
                  {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {s.list ? (
                    <ul className="grid gap-2">
                      {s.list.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {s.after?.map((p) => <p key={p}>{p}</p>)}
                </div>
              </li>
            ))}
          </ol>
        </article>
      </main>

      <footer className="pb-10">
        <FooterBottom />
      </footer>
    </>
  );
}
