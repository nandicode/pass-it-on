import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "outline" | "ghost" | "danger-outline";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        "pio-tap inline-flex items-center justify-center gap-2 rounded-full font-sans font-bold text-[14px] px-5 py-3.5 whitespace-nowrap transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variant === "primary" && "bg-pio-green text-white",
        variant === "outline" && "bg-transparent text-pio-green border-[1.5px] border-pio-green",
        variant === "ghost" && "bg-transparent text-pio-faint border-[1.5px] border-pio-border-strong",
        variant === "danger-outline" && "bg-transparent text-pio-orange border-[1.5px] border-pio-orange-tint",
        className
      )}
      {...props}
    />
  );
}
