import type { CSSProperties, ReactNode } from "react";

type Effect = "rise" | "clip" | "scale" | "inset";
type Tag = "div" | "li" | "article" | "ul" | "ol";

/**
 * Поява блоків при прокрутці — на CSS (див. [data-reveal] у globals.css).
 * Серверний компонент: без JS-бібліотек, контент є в HTML одразу,
 * а клас .is-in додає один спільний IntersectionObserver (RevealObserver).
 * Без JavaScript усе просто видно.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  effect = "rise",
  as: Cmp = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  effect?: Effect;
  as?: Tag;
}) {
  return (
    <Cmp data-reveal={effect} className={className} style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}>
      {children}
    </Cmp>
  );
}

/** Контейнер для послідовної появи дочірніх <RevealItem> (затримка = індекс × stagger) */
export function RevealGroup({ children, className, stagger = 0.08, as: Cmp = "div" }: { children: ReactNode; className?: string; stagger?: number; as?: Tag }) {
  return (
    <Cmp data-reveal-group={stagger} className={className}>
      {children}
    </Cmp>
  );
}

export function RevealItem({ children, className, effect = "rise", as: Cmp = "div" }: { children: ReactNode; className?: string; effect?: Effect; as?: Tag }) {
  return (
    <Cmp data-reveal={effect} className={className}>
      {children}
    </Cmp>
  );
}
