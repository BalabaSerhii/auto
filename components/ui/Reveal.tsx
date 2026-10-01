"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Різні типи появи — щоб сторінка не була одним суцільним fade-in */
  effect?: "rise" | "clip" | "scale";
  as?: "div" | "li" | "article";
};

const effects = {
  rise: { hidden: { opacity: 0, y: 24 }, shown: { opacity: 1, y: 0 } },
  clip: { hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" }, shown: { opacity: 1, clipPath: "inset(0 0 0% 0)" } },
  scale: { hidden: { opacity: 0, scale: 0.96 }, shown: { opacity: 1, scale: 1 } },
};

export function Reveal({ children, className, delay = 0, effect = "rise", as = "div" }: RevealProps) {
  const Cmp = m[as];
  return (
    <Cmp
      className={className}
      variants={effects[effect]}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Cmp>
  );
}

/** Контейнер для послідовної (stagger) появи дочірніх <RevealItem> */
export function RevealGroup({ children, className, stagger = 0.08, as = "div" }: { children: ReactNode; className?: string; stagger?: number; as?: "div" | "ul" | "ol" }) {
  const Cmp = m[as];
  return (
    <Cmp
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Cmp>
  );
}

export function RevealItem({ children, className, effect = "rise", as = "div" }: { children: ReactNode; className?: string; effect?: RevealProps["effect"]; as?: "div" | "li" | "article" }) {
  const Cmp = m[as];
  return (
    <Cmp className={className} variants={effects[effect]} transition={{ duration: 0.7, ease: EASE }}>
      {children}
    </Cmp>
  );
}
