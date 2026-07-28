import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/icons";

export function CategoryGrid() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16.5px] font-extrabold text-pio-ink m-0">Browse by category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.iconKey];
          return (
            <Link
              key={cat.key}
              href={`/browse?category=${cat.key}`}
              className="pio-tap bg-pio-green-tint rounded-[18px] p-4 flex flex-col gap-2 cursor-pointer"
            >
              <div className="w-9.5 h-9.5 rounded-full bg-pio-white flex items-center justify-center text-pio-green">
                <Icon size={20} />
              </div>
              <span className="text-[14px] font-extrabold text-pio-ink">{cat.label}</span>
              <span className="text-[10.5px] text-pio-muted hidden md:block">{cat.subtext}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
