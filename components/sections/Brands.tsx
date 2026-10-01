import { brands, brandsNote, brandsTitle } from "@/data/brands";

/** «Для яких авто»: сервіс працює з усіма марками — бігучий рядок найпоширеніших */
export function Brands() {
  return (
    <section aria-labelledby="brands-title" className="border-b border-line py-12 sm:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <div className="shrink-0">
          <h2 id="brands-title" className="text-2xl font-semibold tracking-[-0.02em]">
            {brandsTitle}
          </h2>
          <p className="mt-1 max-w-xs text-sm text-muted">{brandsNote}</p>
        </div>
        <div className="mask-fade-x relative min-w-0 flex-1 overflow-hidden">
          <ul className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((b, i) => (
              <li
                key={i}
                aria-hidden={i >= brands.length}
                className="rounded-md border border-line px-5 py-2.5 text-lg font-semibold tracking-[-0.01em] whitespace-nowrap text-metal"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
