import { site } from "@/data/site";
import { Ph } from "@/components/ui/Typography";

/** Тимчасовий знак — замінити на логотип майстерні */
export function Logo({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden fill="none">
      <rect x="0.5" y="0.5" width="35" height="35" rx="9" className="fill-surface-2 stroke-line-strong" />
      <circle cx="18" cy="18" r="8.5" className="stroke-metal" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2.5" className="fill-accent" />
      <path d="M18 5.5v5M18 25.5v5M5.5 18h5M25.5 18h5" className="stroke-metal" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Назва з акцентом на другій частині: «Авто» + «Експерт» */
export function BrandName() {
  const parts = site.name.match(/^(\p{Lu}\p{Ll}+)(\p{Lu}.*)$/u);
  if (!parts) return <Ph>{site.name}</Ph>;
  return (
    <>
      {parts[1]}
      <span className="text-accent">{parts[2]}</span>
    </>
  );
}
