import { Cog, Disc3, Droplets, ScanLine, Snowflake, Zap, type LucideProps } from "lucide-react";
import type { ServiceIcon as ServiceIconName } from "@/data/services";

const map = {
  scan: ScanLine,
  oil: Droplets,
  chassis: Disc3,
  engine: Cog,
  electric: Zap,
  ac: Snowflake,
} satisfies Record<ServiceIconName, unknown>;

export function ServiceIcon({ name, ...props }: { name: ServiceIconName } & LucideProps) {
  const Cmp = map[name];
  return <Cmp aria-hidden strokeWidth={1.5} {...props} />;
}

/** Brand-іконки прибрані з lucide, тому — компактні власні SVG */
export function MessengerIcon({ id, className }: { id: string; className?: string }) {
  const common = { className, "aria-hidden": true, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "telegram":
      return (
        <svg {...common}>
          <path d="M21 4 3 11.2l6.2 2.1L18 7.5l-7 7 .3 5.5 3.1-3.6 3.9 2.9L21 4Z" />
        </svg>
      );
    case "viber":
      return (
        <svg {...common}>
          <path d="M12 3c5 0 8 2.2 8 7.5S17 18 12 18c-.8 0-1.6 0-2.3-.2L7 20.5V17C5 15.8 4 13.6 4 10.5 4 5.2 7 3 12 3Z" />
          <path d="M10 8.5c0 2.8 2.2 5 5 5l.8-1.2-1.6-.9-.7.6c-.9-.4-1.6-1.1-2-2l.6-.7-.9-1.6L10 8.5Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M4 20l1.3-3.8A8 8 0 1 1 8 19l-4 1Z" />
          <path d="M9 9.2c0 3 2.8 5.8 5.8 5.8l1-1.4-1.8-1-.8.7a4.6 4.6 0 0 1-2.4-2.4l.7-.8-1-1.8L9 9.2Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
