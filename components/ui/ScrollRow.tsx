"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Горизонтальна карусель на CSS scroll-snap: свайп на mobile, стрілки на desktop */
export function ScrollRow({ children, label, tone = "dark" }: { children: ReactNode; label: string; tone?: "dark" | "light" }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const btn = cn(
    "grid size-12 place-items-center rounded-full border transition-colors disabled:opacity-30",
    tone === "light" ? "border-ink/20 text-ink hover:bg-ink hover:text-paper" : "border-line-strong hover:bg-fg/10",
  );

  return (
    <div>
      <ul ref={ref} aria-label={label} className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:px-[max(2rem,calc((100vw_-_80rem)/2_+_2rem))] lg:scroll-px-[max(2rem,calc((100vw_-_80rem)/2_+_2rem))]">
        {children}
      </ul>
      <div className="mx-auto mt-6 hidden max-w-7xl justify-end gap-2 px-8 sm:flex">
        <button type="button" className={btn} onClick={() => scroll(-1)} disabled={edges.start} aria-label="Попередні">
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <button type="button" className={btn} onClick={() => scroll(1)} disabled={edges.end} aria-label="Наступні">
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
