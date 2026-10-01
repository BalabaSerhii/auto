"use client";

import { useEffect } from "react";

/**
 * Один IntersectionObserver на всю сторінку: додає .is-in елементам з
 * [data-reveal], коли вони наближаються до екрана. У групах
 * ([data-reveal-group]) кожен наступний елемент отримує затримку.
 */
export function RevealObserver() {
  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
      const stagger = Number(group.dataset.revealGroup) || 0.08;
      group.querySelectorAll<HTMLElement>(":scope > [data-reveal]").forEach((el, i) => {
        el.style.setProperty("--reveal-delay", `${i * stagger}s`);
      });
    });

    const items = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
