import Link from "next/link";
import { SaveButton } from "@/components/SaveButton";
import { Badge } from "@/components/ui/Badge";
import { CategoryIllustration } from "@/components/ui/PhotoPlaceholder";
import type { listingCard } from "@/lib/dto";

type Card = ReturnType<typeof listingCard>;

export function ListingCard({
  item,
  loggedIn,
  variant = "grid",
}: {
  item: Card;
  loggedIn: boolean;
  variant?: "grid" | "row" | "carousel";
}) {
  if (variant === "row") {
    return (
      <Link
        href={`/listing/${item.id}`}
        className="pio-tap flex items-center gap-3 md:gap-4 bg-pio-white border border-pio-border rounded-2xl p-2.5 md:p-3.5 cursor-pointer"
      >
        <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0">
          {item.photoUrl ? (
            <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <CategoryIllustration categoryKey={item.categoryKey} className="w-full h-full" iconSize={18} />
          )}
        </div>
        <div className="flex flex-col gap-0.5 md:gap-1 flex-1 min-w-0">
          <span className="text-[12.5px] md:text-[15px] font-bold text-pio-ink truncate">{item.title}</span>
          <span className="text-[11px] md:text-[13px] text-pio-muted truncate">{item.context}</span>
        </div>
        <span className="text-[13.5px] md:text-[16px] font-extrabold text-pio-ink shrink-0">{item.priceLabel}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/listing/${item.id}`}
      className="pio-tap bg-pio-white border border-pio-border rounded-2xl overflow-hidden cursor-pointer flex flex-col"
    >
      <div className="relative h-25 md:h-44">
        {item.photoUrl ? (
          <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <CategoryIllustration categoryKey={item.categoryKey} className="w-full h-full" iconSize={26} />
        )}
        {item.showStatus && (
          <span className="absolute top-2 left-2">
            <Badge label={item.statusLabel} color={item.statusColor} tint={item.statusTint} />
          </span>
        )}
        <SaveButton listingId={item.id} initialSaved={item.saved} loggedIn={loggedIn} />
      </div>
      <div className="p-2.5 md:p-4 flex flex-col gap-1 md:gap-1.5">
        <span className="text-[11.5px] md:text-[14.5px] font-bold text-pio-ink truncate">{item.title}</span>
        <span className="text-[10.5px] md:text-[12.5px] text-pio-muted truncate">{item.context}</span>
        <span className="text-[13px] md:text-[16px] font-extrabold text-pio-ink">{item.priceLabel}</span>
      </div>
    </Link>
  );
}
