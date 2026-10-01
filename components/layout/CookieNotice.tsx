"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const KEY = "cookie-notice";

/**
 * Простий банер про cookie. Сайт не використовує рекламних і аналітичних
 * cookie — лише необхідне (тема оформлення, вибір цього банера), тому окрема
 * згода з перемикачами не потрібна: достатньо повідомити й дати посилання на політику.
 * Показується після завантаження сторінки, щоб не заважати першому екрану.
 */
export function CookieNotice() {
  const [state, setState] = useState<"hidden" | "shown" | "leaving">("hidden");

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === "1";
    } catch {}
    if (seen) return;
    const t = window.setTimeout(() => setState("shown"), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setState("leaving");
    window.setTimeout(() => setState("hidden"), 400);
  };

  if (state === "hidden") return null;

  return (
    <section
      aria-label="Повідомлення про cookie"
      className={cn(
        "glass fixed inset-x-3 bottom-3 z-60 mb-[env(safe-area-inset-bottom)] rounded-lg border border-line-strong p-4 shadow-[0_16px_48px_-16px_rgb(0_0_0/0.55)] sm:inset-x-auto sm:left-5 sm:bottom-5 sm:max-w-sm",
        state === "leaving" ? "animate-[cookie-out_0.35s_ease-in_both]" : "animate-[cookie-in_0.5s_var(--ease-out-expo)_both]",
      )}
    >
      <div className="flex gap-3">
        <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
          <Cookie className="size-5" strokeWidth={1.7} />
        </span>
        <p className="text-sm leading-relaxed text-muted">
          Ми використовуємо лише необхідні cookie та сховище браузера — щоб сайт працював і пам&apos;ятав ваші налаштування. Без реклами та
          стеження.{" "}
          <Link href="/privacy" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent">
            Детальніше
          </Link>
        </p>
      </div>
      <button
        type="button"
        onClick={accept}
        className="mt-3 h-10 w-full rounded-md bg-accent text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
      >
        Зрозуміло
      </button>
    </section>
  );
}
