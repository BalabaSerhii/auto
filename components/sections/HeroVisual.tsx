import Image from "next/image";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const labels = [
  { x: "6%", y: "15%", title: "Двигун", value: "Діагностика", className: "" },
  { x: "60%", y: "9%", title: "Електроніка", value: "OBD-II", className: "hidden sm:flex" },
  { x: "13%", y: "79%", title: "Ходова", value: "Перевірка", className: "" },
  { x: "66%", y: "79%", title: "Гальма", value: "Знос колодок", className: "hidden sm:flex" },
];

/**
 * Технічна ілюстрація першого екрана: креслення автомобіля, сітка, координатні
 * мітки та скан-лінія. Чистий SVG + CSS — без WebGL і важких зображень.
 * Якщо в data/site.ts вказано heroImage — під кресленням з'являється фото.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <div className={cn("relative isolate aspect-4/3 w-full overflow-hidden rounded-xl border border-line bg-surface sm:aspect-16/11", className)}>
      {site.heroImage ? (
        <>
          <Image src={site.heroImage.src} alt={site.heroImage.alt} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="-z-10 object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-bg via-bg/40 to-bg/10" />
        </>
      ) : null}

      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_40%,transparent_100%)]" />
      <div aria-hidden className="absolute -bottom-1/3 left-1/2 -z-10 h-2/3 w-3/4 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      {/* Креслення */}
      <svg viewBox="0 0 800 400" className="absolute inset-x-[4%] top-[18%] w-[92%]" fill="none" aria-hidden role="presentation">
        <defs>
          <linearGradient id="body-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="currentColor" stopOpacity="0.95" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Лінія землі та розмірна лінія */}
        <line x1="20" y1="300" x2="780" y2="300" stroke="currentColor" strokeOpacity="0.12" />
        <g stroke="currentColor" strokeOpacity="0.22" strokeWidth="1">
          <line x1="52" y1="336" x2="756" y2="336" strokeDasharray="4 6" />
          <line x1="52" y1="326" x2="52" y2="346" />
          <line x1="756" y1="326" x2="756" y2="346" />
          <line x1="180" y1="306" x2="180" y2="322" />
          <line x1="620" y1="306" x2="620" y2="322" />
        </g>

        {/* Кузов */}
        <path
          d="M52 240 L48 214 Q50 196 72 190 L250 168 Q292 162 320 148 L382 102 Q396 92 420 91 L590 91 Q622 92 642 106 L712 160 Q748 168 752 190 L756 236 Q756 244 748 244 L678 244 A58 58 0 0 0 562 244 L238 244 A58 58 0 0 0 122 244 L60 244 Q52 244 52 240 Z"
          stroke="url(#body-stroke)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Скління */}
        <path d="M334 160 L388 112 Q398 104 420 104 L498 104 L498 160 Z" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
        <path d="M512 160 L512 104 L586 104 Q610 105 626 116 L680 160 Z" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
        {/* Лінії кузова */}
        <path d="M80 200 L740 196" stroke="currentColor" strokeOpacity="0.16" />
        <path d="M505 104 L505 240" stroke="currentColor" strokeOpacity="0.16" />
        <path d="M330 162 L330 240" stroke="currentColor" strokeOpacity="0.16" />
        {/* Фари */}
        <path d="M56 204 Q60 196 74 194 L104 192" stroke="#f5a524" strokeWidth="2" strokeLinecap="round" />
        <path d="M744 176 L752 196" stroke="#f87171" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />

        {/* Колеса */}
        {[180, 620].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="244" r="50" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
            <circle cx={cx} cy="244" r="32" stroke="currentColor" strokeOpacity="0.25" />
            <circle cx={cx} cy="244" r="6" fill="currentColor" fillOpacity="0.5" />
            <circle cx={cx} cy="244" r="40" stroke="#f5a524" strokeOpacity="0.5" strokeDasharray="3 9" />
          </g>
        ))}

        {/* Вузли-точки діагностики */}
        <g fill="#f5a524">
          <circle cx="150" cy="206" r="3.5" />
          <circle cx="430" cy="98" r="3.5" />
          <circle cx="180" cy="244" r="3.5" />
          <circle cx="620" cy="244" r="3.5" />
        </g>
        <g stroke="#f5a524" strokeOpacity="0.45" strokeDasharray="2 4">
          <path d="M150 206 L150 140 L104 140" />
          <path d="M430 98 L430 40 L500 40" />
          <path d="M180 244 L180 330" />
          <path d="M620 244 L620 330" />
        </g>
      </svg>

      {/* Скан-лінія */}
      <div aria-hidden className="motion-safe-only pointer-events-none absolute inset-0 animate-scan">
        <div className="absolute inset-y-[12%] left-0 w-px bg-linear-to-b from-transparent via-accent to-transparent" />
        <div className="absolute inset-y-[12%] left-0 w-24 -translate-x-full bg-linear-to-r from-transparent to-accent/10" />
      </div>

      {/* Плаваючі мітки */}
      {labels.map((l, i) => (
        <div
          key={l.title}
          aria-hidden
          style={{ left: l.x, top: l.y }}
          className={cn("glass absolute flex items-center gap-2.5 rounded-md border border-line-strong px-2.5 py-1.5", l.className)}
        >
          <span className="relative grid size-2 place-items-center">
            <span className="absolute size-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: `${i * 0.6}s` }} />
            <span className="size-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[10px] leading-tight tracking-[0.08em] uppercase sm:text-[11px]">
            <span className="block text-fg">{l.title}</span>
            <span className="block text-subtle">{l.value}</span>
          </span>
        </div>
      ))}

      {/* Кутові мітки та координати */}
      <div aria-hidden className="pointer-events-none absolute inset-3 font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">
        <span className="absolute top-0 left-0 size-3 border-t border-l border-line-strong" />
        <span className="absolute top-0 right-0 size-3 border-t border-r border-line-strong" />
        <span className="absolute bottom-0 left-0 size-3 border-b border-l border-line-strong" />
        <span className="absolute right-0 bottom-0 size-3 border-r border-b border-line-strong" />
        <span className="absolute top-1 left-5">SYS.SCAN / 04</span>
        <span className="absolute right-5 bottom-1 hidden sm:block">X 052 · Y 240</span>
      </div>
    </div>
  );
}
