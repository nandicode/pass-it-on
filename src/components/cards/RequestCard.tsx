import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { IHaveThisButton } from "@/components/IHaveThisButton";
import type { requestCard } from "@/lib/dto";

type Card = ReturnType<typeof requestCard>;
const CAT_COLOR = { color: "#2F6F5E", tint: "#EAF1EC" };

export function RequestCard({
  req,
  loggedIn,
  showRequester = true,
}: {
  req: Card;
  loggedIn: boolean;
  showRequester?: boolean;
}) {
  return (
    <div className="bg-pio-white border border-pio-border rounded-2xl p-3.5 md:p-5 flex flex-col gap-2 md:gap-2.5">
      <Badge label={req.category} {...CAT_COLOR} />
      <span className="text-[13.5px] md:text-[16px] font-bold text-pio-ink">{req.title}</span>
      {showRequester && (
        <div className="flex items-center gap-2 py-0.5">
          <Avatar name={req.by.name} anonymous={req.by.anonymous} seed={req.id} size={26} />
          <span className="text-[11.5px] md:text-[13px] font-bold text-pio-ink">{req.by.name}</span>
          <span className="text-[10.5px] md:text-[12px] text-pio-faint">· {req.by.meta}</span>
        </div>
      )}
      <span className="text-[11px] md:text-[12.5px] text-pio-faint font-semibold">Need by {req.needBy}</span>
      <div>
        <IHaveThisButton requestId={req.id} loggedIn={loggedIn} />
      </div>
    </div>
  );
}
