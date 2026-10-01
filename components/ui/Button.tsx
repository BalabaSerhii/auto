import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "ink";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-md font-semibold tracking-[-0.01em] whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-hover hover:shadow-glow before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:skew-x-[-20deg] before:bg-white/35 before:opacity-0 before:transition-[left,opacity] before:duration-700 hover:before:left-[130%] hover:before:opacity-100",
  secondary: "border border-line-strong bg-fg/3 text-fg hover:border-fg/30 hover:bg-fg/7",
  ghost: "text-fg hover:bg-fg/6",
  ink: "bg-ink text-paper hover:bg-ink/85",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className">;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className">;

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const cls = buttonClass(variant, size, className);
  const content = <span className="relative z-10 inline-flex items-center gap-2">{children}</span>;

  if (rest.href !== undefined) {
    const { href, ...anchor } = rest as ButtonAsLink;
    // Внутрішні сторінки — через next/link, якорі та tel:/https — звичайне посилання
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={cls} {...anchor}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={cls} {...anchor}>
        {content}
      </a>
    );
  }

  const { type = "button", ...button } = rest as ButtonAsButton;
  return (
    <button type={type} className={cls} {...button}>
      {content}
    </button>
  );
}
