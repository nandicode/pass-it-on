import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 md:py-24 px-6 text-center">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-pio-green-tint flex items-center justify-center text-pio-green">
        {icon}
      </div>
      <span className="text-[16px] md:text-[19px] font-extrabold text-pio-ink">{title}</span>
      {subtitle && (
        <span className="text-[13px] md:text-[14.5px] text-pio-muted max-w-80 leading-relaxed">{subtitle}</span>
      )}
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  );
}
