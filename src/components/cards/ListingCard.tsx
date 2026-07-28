import Link from "next/link";
import { SaveButton } from "@/components/SaveButton";
import { Badge } from "@/components/ui/Badge";
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
        className="pio-tap flex items-center gap-3 bg-pio-white border border-pio-border rounded-2xl p-2.5 cursor-pointer"
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-pio-photo-bg">
          {item.photoUrl && <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="text-[12.5px] font-bold text-pio-ink truncate">{item.title}</span>
          <span className="text-[11px] text-pio-muted truncate">{item.context}</span>
        </div>
        <span className="text-[13.5px] font-extrabold text-pio-ink shrink-0">{item.priceLabel}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/listing/${item.id}`}
      className="pio-tap bg-pio-white border border-pio-border rounded-2xl overflow-hidden cursor-pointer flex flex-col"
    >
      <div className="relative h-25 bg-pio-photo-bg" style={{ height: 100 }}>
        {item.photoUrl && <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />}
        {item.showStatus && (
          <span className="absolute top-2 left-2">
            <Badge label={item.statusLabel} color={item.statusColor} tint={item.statusTint} />
          </span>
        )}
        <SaveButton listingId={item.id} initialSaved={item.saved} loggedIn={loggedIn} />
      </div>
      <div className="p-2.5 flex flex-col gap-1">
        <span className="text-[11.5px] font-bold text-pio-ink truncate">{item.title}</span>
        <span className="text-[10.5px] text-pio-muted truncate">{item.context}</span>
        <span className="text-[13px] font-extrabold text-pio-ink">{item.priceLabel}</span>
      </div>
    </Link>
  );
}
