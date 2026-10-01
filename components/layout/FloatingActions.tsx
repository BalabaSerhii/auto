"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp, CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { EASE } from "@/components/ui/Reveal";
import { cn, primaryMessenger, telHref } from "@/lib/utils";
import { smoothScrollTo } from "@/lib/smooth-scroll";

/**
 * Мобільний: нижня панель «Подзвонити | Написати | Записатися».
 * Desktop: плаваюча кнопка «Записатися».
 * Обидві з'являються після першого екрана й ховаються, коли на екрані форма запису.
 * Кнопка «Нагору» — плавна прокрутка до header.
 */
export function FloatingActions() {
  const { open } = useBooking();
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const phone = telHref();
  const messenger = primaryMessenger();

  useMotionValueEvent(scrollY, "change", (y) => {
    setPastHero(y > window.innerHeight * 0.6);
    setShowTop(y > window.innerHeight * 1.2);
  });

  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setContactVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const visible = pastHero && !contactVisible;

  const toTop = () => {
    smoothScrollTo(0);
    history.replaceState(null, "", window.location.pathname);
  };

  return (
    <>
      <AnimatePresence>
        {showTop ? (
          <m.button
            key="top"
            type="button"
            onClick={toTop}
            aria-label="Нагору"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={cn(
              "group glass fixed right-4 z-40 grid size-12 place-items-center rounded-full border border-line-strong text-fg shadow-[0_8px_32px_-12px_rgb(0_0_0/0.5)] transition-[bottom,border-color] duration-500 ease-out-expo hover:border-accent/60 sm:right-6",
              // над мобільною панеллю / над desktop-кнопкою «Записатися»
              visible ? "bottom-[calc(5.75rem+env(safe-area-inset-bottom))] sm:bottom-24" : "bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6",
            )}
          >
            <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
          </m.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {visible ? (
          <>
            {/* Mobile bar */}
            <m.div
              key="bar"
              initial={{ y: "120%" }}
              animate={{ y: 0 }}
              exit={{ y: "120%" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden"
            >
              <nav aria-label="Швидкі дії" className="glass grid grid-cols-3 gap-1 rounded-lg border border-line-strong p-1.5 shadow-[0_-8px_40px_-12px_rgb(0_0_0/0.5)]">
                <a href={phone ?? "#contact"} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium text-metal active:bg-fg/6">
                  <Phone className="size-5" aria-hidden strokeWidth={1.6} />
                  Подзвонити
                </a>
                <a
                  href={messenger?.href ?? "#contact"}
                  {...(messenger ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium text-metal active:bg-fg/6"
                >
                  <MessageCircle className="size-5" aria-hidden strokeWidth={1.6} />
                  Написати
                </a>
                <button
                  type="button"
                  onClick={() => open()}
                  aria-haspopup="dialog"
                  className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md bg-accent text-xs font-semibold text-accent-ink active:bg-accent-hover"
                >
                  <CalendarCheck className="size-5" aria-hidden strokeWidth={1.8} />
                  Записатися
                </button>
              </nav>
            </m.div>

            {/* Desktop floating CTA */}
            <m.button
              key="fab"
              type="button"
              onClick={() => open()}
              aria-haspopup="dialog"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.94 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="group fixed right-6 bottom-6 z-40 hidden h-14 items-center gap-3 rounded-lg border border-accent/40 bg-accent pr-6 pl-2 font-semibold text-accent-ink shadow-glow transition-colors hover:bg-accent-hover sm:inline-flex"
            >
              <span className="grid size-10 place-items-center rounded-md bg-accent-ink/10">
                <CalendarCheck className="size-5" aria-hidden />
              </span>
              Записатися
            </m.button>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
