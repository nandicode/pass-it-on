import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function Chip({
  active,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={clsx(
        "pio-tap pio-chip whitespace-nowrap shrink-0 rounded-full text-[12px] font-bold px-3.5 py-2 border-[1.5px] cursor-pointer transition-colors",
        active
          ? "bg-pio-green-tint border-pio-green text-pio-green"
          : "bg-pio-white border-pio-border-strong text-pio-ink-soft",
        className
      )}
      {...props}
    />
  );
}
