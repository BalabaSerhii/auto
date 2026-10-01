import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Технічна мітка: моноширинний шрифт, верхній регістр */
export function Badge({ children, className, tone = "dark" }: { children: ReactNode; className?: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] uppercase",
        tone === "dark" ? "text-muted" : "text-ink-muted",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

/**
 * Рендерить текст, підсвічуючи плейсхолдери «[...]», щоб власник одразу бачив,
 * що ще треба заповнити.
 */
export function Ph({ children, className, tone = "dark" }: { children: string; className?: string; tone?: "dark" | "light" }) {
  const parts = children.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <span key={i} className={cn(tone === "dark" ? "placeholder-data" : "placeholder-data-light", className)}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

type HeadingProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
  id?: string;
  align?: "left" | "split";
};

/**
 * Заголовок секції з технічним індексом (01, 02 …). Індекс — ненав'язливий
 * «креслярський» маркер, що пов'язує секції в одну систему.
 */
export function SectionHeading({ index, eyebrow, title, lead, tone = "dark", className, id, align = "split" }: HeadingProps) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "grid gap-6",
        align === "split" && "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16",
        className,
      )}
    >
      <div>
        <div className={cn("mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] uppercase", light ? "text-ink-muted" : "text-muted")}>
          <span className={light ? "text-ink" : "text-accent"}>{index}</span>
          <span aria-hidden className={cn("h-px w-8", light ? "bg-ink/25" : "bg-line-strong")} />
          <span>{eyebrow}</span>
        </div>
        <h2 id={id} className={cn("text-[2rem] leading-[1.05] font-semibold sm:text-5xl lg:text-[3.5rem]", light ? "text-ink" : "text-fg")}>
          {title}
        </h2>
      </div>
      {lead ? <p className={cn("max-w-md text-base leading-relaxed sm:text-lg", light ? "text-ink-muted" : "text-muted")}>{lead}</p> : null}
    </div>
  );
}
