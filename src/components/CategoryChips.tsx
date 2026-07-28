import Link from "next/link";
import clsx from "clsx";
import { CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/icons";

export function CategoryChips({ active }: { active?: string }) {
  return (
    <div className="pio-scroller flex gap-2 overflow-x-auto pb-1">
      {CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.iconKey];
        const isActive = active === cat.key;
        return (
          <Link
            key={cat.key}
            href={isActive ? "/browse" : `/browse?category=${cat.key}`}
            className={clsx(
              "pio-tap pio-chip flex items-center gap-1.5 px-3.5 py-2 rounded-full border-[1.5px] whitespace-nowrap shrink-0 cursor-pointer",
              isActive
                ? "bg-pio-green-tint border-pio-green text-pio-green"
                : "bg-pio-white border-pio-border-strong text-pio-ink-soft"
            )}
          >
            <Icon size={14} />
            <span className="text-[12px] font-bold">{cat.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
