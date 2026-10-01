"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_COLORS, THEME_KEY } from "@/lib/theme";

function applyTheme(next: "light" | "dark") {
  const html = document.documentElement;
  if (next === "light") html.dataset.theme = "light";
  else delete html.dataset.theme;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[next]);
}

/**
 * РџРµСЂРµРјРёРєР°С‡ СЃРІС–С‚Р»РѕС—/С‚РµРјРЅРѕС— С‚РµРјРё. Р†РєРѕРЅРєР° РѕР±РёСЂР°С”С‚СЊСЃСЏ С‡РµСЂРµР· CSS (РІР°СЂС–Р°РЅС‚ light:),
 * С‚РѕРјСѓ РЅРµРјР°С” СЂРѕР·Р±С–Р¶РЅРѕСЃС‚РµР№ РјС–Р¶ СЃРµСЂРІРµСЂРѕРј С– РєР»С–С”РЅС‚РѕРј.
 * Р—РјС–РЅР° С‚РµРјРё вЂ” РєСЂСѓРіРѕРІРёРј СЂРѕР·РєСЂРёС‚С‚СЏРј РІС–Рґ РєРЅРѕРїРєРё (View Transitions), СЏРєС‰Рѕ Р±СЂР°СѓР·РµСЂ РїС–РґС‚СЂРёРјСѓС”.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      applyTheme(next);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => applyTheme(next)).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "group relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border border-line-strong text-metal transition-colors hover:border-accent/60 hover:text-fg",
        className,
      )}
    >
      <span className="sr-only light:hidden">РЈРІС–РјРєРЅСѓС‚Рё СЃРІС–С‚Р»Сѓ С‚РµРјСѓ</span>
      <span className="sr-only hidden light:inline">РЈРІС–РјРєРЅСѓС‚Рё С‚РµРјРЅСѓ С‚РµРјСѓ</span>
      <Sun aria-hidden className="size-[18px] transition-transform duration-500 ease-out-expo group-hover:rotate-45 light:hidden" />
      <Moon aria-hidden className="hidden size-[18px] transition-transform duration-500 ease-out-expo group-hover:-rotate-12 light:block" />
    </button>
  );
}
