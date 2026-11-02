import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "ghost-danger" | "danger" | "accent" | "outline-light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong disabled:bg-brand/60",
  secondary: "border border-line bg-surface text-ink hover:bg-canvas disabled:text-subtle",
  ghost: "text-muted hover:bg-brand-soft hover:text-brand disabled:text-subtle",
  "ghost-danger": "text-danger hover:bg-danger-soft disabled:text-subtle",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/60",
  // For dark backgrounds
  accent: "bg-accent-strong text-white hover:bg-accent disabled:bg-accent-strong/60",
  "outline-light": "border border-white/25 text-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "btn-sheen inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({ variant, size, loading, disabled, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
