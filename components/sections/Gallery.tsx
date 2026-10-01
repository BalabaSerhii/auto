"use client";

import Image from "next/image";
import { AnimatePresence, animate, m, useInView, useReducedMotion } from "motion/react";
import { Camera, ChevronLeft, ChevronRight, MoveHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { beforeAfter, gallery, type BeforeAfterItem, type GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/utils";
import { useModal } from "@/lib/use-modal";
import { EASE } from "@/components/ui/Reveal";
import { Ph, SectionHeading } from "@/components/ui/Typography";

export function Gallery() {
  const photos = gallery.filter((g): g is GalleryItem & { src: string } => !!g.src);
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="gallery-title"
          index="05"
          eyebrow="Майстерня та роботи"
          title="Майстерня зсередини"
          lead="Обладнання, процес і результат — так, як це виглядає насправді."
        />
      </div>

      {/* Mobile: свайп-галерея. Desktop: masonry-колонки. */}
      <ul
        className="scrollbar-none mt-12 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-auto sm:mt-16 sm:block sm:max-w-7xl sm:columns-2 sm:gap-4 sm:overflow-visible sm:px-6 lg:columns-3 lg:px-8"
        aria-label="Фотогалерея"
      >
        {gallery.map((item, i) => {
          const photoIndex = item.src ? photos.findIndex((p) => p.src === item.src) : -1;
          return (
            <m.li
              key={i}
              initial={{ clipPath: "inset(12% 12% 12% 12%)", opacity: 0 }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: (i % 3) * 0.08 }}
              className={cn(
                "relative aspect-4/5 w-[78vw] shrink-0 snap-start overflow-hidden rounded-lg border border-line sm:mb-4 sm:w-full sm:break-inside-avoid",
                item.tall ? "sm:aspect-4/5" : "sm:aspect-4/3",
              )}
            >
              {item.src ? (
                <button type="button" onClick={() => setIndex(photoIndex)} className="group block size-full" aria-label={`Відкрити фото: ${item.caption}`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 80vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/80 to-transparent p-4 pt-12 text-left text-sm font-medium text-white">
                    {item.caption}
                    <span className="font-mono text-[10px] tracking-[0.12em] text-white/70 uppercase">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                </button>
              ) : (
                <div className="bg-dots flex size-full flex-col items-center justify-center gap-3 bg-surface p-6 text-center">
                  <Camera className="size-7 text-subtle" strokeWidth={1.4} aria-hidden />
                  <span className="text-sm">
                    <Ph>{item.caption}</Ph>
                  </span>
                </div>
              )}
            </m.li>
          );
        })}
      </ul>

      {beforeAfter.length > 0 ? (
        <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <BeforeAfterTabs items={beforeAfter} />
        </div>
      ) : null}

      <Lightbox photos={photos} index={index} onChange={setIndex} />
    </section>
  );
}

/** Вкладки з кількома парами «до/після» */
function BeforeAfterTabs({ items }: { items: BeforeAfterItem[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">До / після</h3>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Потягніть повзунок, щоб порівняти</p>
        </div>
        <div role="tablist" aria-label="Приклади робіт" className="flex gap-1 rounded-lg border border-line bg-surface p-1" onKeyDown={onKey}>
          {items.map((item, i) => (
            <button
              key={item.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${baseId}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={active === i}
              aria-controls={`${baseId}-panel`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "min-h-10 flex-1 rounded-md px-4 text-sm font-semibold transition-colors sm:flex-none",
                active === i ? "bg-accent text-accent-ink" : "text-muted hover:bg-fg/6 hover:text-fg",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
            <BeforeAfter item={items[active]} />
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Слайдер «до/після». Керування: перетягування, тап, клавіші ← →.
 * При першій появі повзунок сам «показує», як працює.
 */
function BeforeAfter({ item }: { item: BeforeAfterItem }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotion();
  const touched = useRef(false);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(50, [50, 22, 78, 50], {
      duration: 2.4,
      ease: "easeInOut",
      delay: 0.3,
      onUpdate: (v) => {
        if (!touched.current) setPos(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce]);

  return (
    <figure>
      <div ref={ref} className="relative aspect-16/10 overflow-hidden rounded-xl border border-line select-none sm:aspect-16/8">
        {/* ПІСЛЯ — фон */}
        <Panel src={item.after} alt={item.alt ? `${item.alt} — після` : ""} label="[Фото ПІСЛЯ]" tone="after" />
        {/* ДО — обрізається */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Panel src={item.before} alt={item.alt ? `${item.alt} — до` : ""} label="[Фото ДО]" tone="before" />
        </div>

        <span className="pointer-events-none absolute top-3 left-3 rounded-sm bg-black/65 px-2.5 py-1 font-mono text-[11px] tracking-[0.12em] text-white uppercase">До</span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-sm bg-accent px-2.5 py-1 font-mono text-[11px] tracking-[0.12em] text-accent-ink uppercase">Після</span>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(0_0_0/0.5)]" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-black/50 text-white backdrop-blur">
            <MoveHorizontal className="size-5" />
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => {
            touched.current = true;
            setPos(Number(e.target.value));
          }}
          onPointerDown={() => (touched.current = true)}
          aria-label={`Порівняти фото до і після: ${item.title}`}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 text-[15px] text-muted">
        <Ph>{item.title}</Ph>
      </figcaption>
    </figure>
  );
}

function Panel({ src, alt, label, tone }: { src: string | null; alt: string; label: string; tone: "before" | "after" }) {
  if (src) return <Image src={src} alt={alt} fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" draggable={false} />;
  return (
    <div className={cn("absolute inset-0 flex items-center", tone === "before" ? "justify-start bg-surface-3 pl-[8%]" : "bg-grid justify-end bg-surface pr-[8%]")}>
      <span className="text-sm">
        <Ph>{label}</Ph>
      </span>
    </div>
  );
}

function Lightbox({ photos, index, onChange }: { photos: (GalleryItem & { src: string })[]; index: number | null; onChange: (i: number | null) => void }) {
  const open = index !== null;
  const close = useCallback(() => onChange(null), [onChange]);
  const ref = useModal(open, close);
  const [touchX, setTouchX] = useState<number | null>(null);
  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onChange((index + d + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {photo ? (
        <m.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Перегляд фото"
          className="fixed inset-0 z-80 flex flex-col bg-black/92 text-white backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between p-4">
            <span className="font-mono text-xs text-white/60 tabular-nums">
              {index! + 1} / {photos.length}
            </span>
            <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Закрити">
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div
            className="relative flex-1"
            onClick={close}
            onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX === null) return;
              const dx = e.changedTouches[0].clientX - touchX;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              setTouchX(null);
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={photo.src}
                className="absolute inset-4 sm:inset-x-20"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" onClick={(e) => e.stopPropagation()} />
              </m.div>
            </AnimatePresence>
            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20"
                  aria-label="Попереднє фото"
                >
                  <ChevronLeft className="size-6" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20"
                  aria-label="Наступне фото"
                >
                  <ChevronRight className="size-6" aria-hidden />
                </button>
              </>
            ) : null}
          </div>
          <p className="p-4 text-center text-sm text-white/80">{photo.caption}</p>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
