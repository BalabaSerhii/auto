"use client";

import { animate, type AnimationPlaybackControls } from "motion/react";

/** Відступ під фіксований header */
const HEADER_OFFSET = 88;

let current: AnimationPlaybackControls | null = null;

/**
 * Плавна прокрутка з власною кривою (однакова в усіх браузерах).
 * Переривається, якщо користувач сам почав крутити колесо чи свайпати.
 */
export function smoothScrollTo(top: number) {
  current?.stop();
  const html = document.documentElement;
  const from = window.scrollY;
  const target = Math.max(0, Math.min(top, html.scrollHeight - window.innerHeight));
  const distance = Math.abs(target - from);
  if (distance < 2) return;

  // Вимикаємо CSS smooth на час анімації, щоб не було «подвійного» згладжування
  html.style.scrollBehavior = "auto";
  const cancel = () => current?.stop();
  const cleanup = () => {
    html.style.scrollBehavior = "";
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("keydown", cancel);
  };
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("keydown", cancel);

  current = animate(from, target, {
    duration: Math.min(1.5, 0.55 + distance / 5000),
    ease: [0.65, 0, 0.35, 1],
    onUpdate: (y) => window.scrollTo(0, y),
    onComplete: cleanup,
    onStop: cleanup,
  });
}

/** Прокрутка до секції за id ("top" або "" — на початок сторінки) */
export function scrollToId(id: string) {
  const el = id && id !== "top" ? document.getElementById(id) : null;
  if (id && id !== "top" && !el) return false;
  const y = el ? el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET : 0;
  // Кадр затримки — щоб встигли закритися меню/діалоги і розблокувався скрол
  requestAnimationFrame(() => smoothScrollTo(y));
  history.replaceState(null, "", el ? `#${id}` : window.location.pathname);
  return true;
}
