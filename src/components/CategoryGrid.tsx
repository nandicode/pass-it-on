import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/icons";

export function CategoryGrid() {
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <h2 className="text-[16.5px] md:text-[22px] font-extrabold text-pio-ink m-0">Browse by category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.iconKey];
          return (
            <Link
              key={cat.key}
              href={`/browse?category=${cat.key}`}
              className="pio-tap bg-pio-green-tint rounded-[18px] md:rounded-[22px] p-4 md:p-6 flex flex-col gap-2 md:gap-3 cursor-pointer"
            >
              <div className="w-9.5 h-9.5 md:w-13 md:h-13 rounded-full bg-pio-white flex items-center justify-center text-pio-green">
                <Icon size={20} className="md:hidden" />
                <Icon size={26} className="hidden md:block" />
              </div>
              <span className="text-[14px] md:text-[17px] font-extrabold text-pio-ink">{cat.label}</span>
              <span className="text-[10.5px] md:text-[13px] text-pio-muted hidden md:block">{cat.subtext}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
