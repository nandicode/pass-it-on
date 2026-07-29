import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { listingDetail } from "@/lib/dto";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ConditionBar } from "@/components/ui/ConditionBar";
import { CategoryIllustration } from "@/components/ui/PhotoPlaceholder";
import { SaveButton } from "@/components/SaveButton";
import { MessageStudentButton } from "@/components/MessageStudentButton";
import { VerifiedIcon } from "@/lib/icons";
import Link from "next/link";

const CAT_COLOR = { color: "#2F6F5E", tint: "#EAF1EC" };

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { photos: true, category: true, owner: true },
  });
  if (!listing) notFound();

  const saved = user
    ? Boolean(
        await prisma.savedListing.findUnique({
          where: { userId_listingId: { userId: user.id, listingId: id } },
        })
      )
    : false;

  const dl = listingDetail(listing, saved);
  const isOwner = user?.id === dl.ownerId;

  return (
    <div className="flex flex-col md:flex-row md:gap-10 md:px-8 md:py-8 md:max-w-[1200px] md:mx-auto">
      <div className="flex-1 flex flex-col gap-4 md:gap-5 px-4.5 py-4 md:px-0 md:py-0 md:max-w-2xl">
        <div className="h-55 md:h-96 rounded-[18px] md:rounded-[22px] overflow-hidden relative shrink-0" style={{ height: 220 }}>
          {dl.photos[0] ? (
            <img src={dl.photos[0]} alt={dl.title} className="w-full h-full object-cover" />
          ) : (
            <CategoryIllustration categoryKey={dl.categoryKey} className="w-full h-full" iconSize={44} />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge label={dl.category} {...CAT_COLOR} />
          {dl.showStatus && <Badge label={dl.statusLabel} color={dl.statusColor} tint={dl.statusTint} />}
        </div>
        <h1 className="m-0 text-[19px] md:text-[27px] font-extrabold text-pio-ink tracking-tight">{dl.title}</h1>
        <span className="text-[12.5px] md:text-[14.5px] text-pio-muted -mt-2.5 md:-mt-3.5">{dl.context}</span>
        <span className="text-[22px] md:text-[28px] font-extrabold text-pio-ink">{dl.priceLabel}</span>

        {dl.isPassed && (
          <div className="bg-pio-input rounded-2xl p-4 flex flex-col gap-2.5">
            <span className="text-[13px] font-bold text-pio-ink-soft">This material has been passed on.</span>
            <Link href={`/browse?category=${dl.categoryKey}`}>
              <span className="pio-tap bg-pio-green text-white font-bold text-[12.5px] px-4 py-2.5 rounded-full inline-block cursor-pointer">
                Browse similar
              </span>
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-2 md:gap-3 py-3.5 md:py-5 border-t border-b border-pio-border">
          <ConditionBar condition={dl.conditionKey} />
          <Row label="Pickup location" value={dl.pickupSpot} />
          <Row label="Available" value={dl.availability} />
        </div>

        <div className="flex flex-col gap-1.5 md:gap-2">
          <span className="text-[12.5px] md:text-[15px] font-bold text-pio-ink">Description</span>
          <p className="m-0 text-[12.5px] md:text-[14.5px] leading-relaxed text-pio-ink-soft">{dl.description}</p>
        </div>

        {dl.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dl.tags.map((t) => (
              <span key={t} className="text-[11px] md:text-[12.5px] font-semibold text-pio-ink-soft bg-pio-input border border-pio-border px-2.5 py-1.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2.5 md:gap-3 p-3.5 md:p-4.5 bg-pio-input rounded-2xl">
          <Avatar name={dl.owner.name} anonymous={dl.owner.anonymous} seed={dl.ownerId} size={38} />
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="text-[13px] md:text-[15px] font-extrabold text-pio-ink">{dl.owner.name}</span>
            <span className="text-[11px] md:text-[12.5px] text-pio-muted">{dl.owner.meta}</span>
          </div>
          {dl.owner.verified && (
            <span className="flex items-center gap-1 text-[10.5px] md:text-[12px] font-bold text-pio-green bg-pio-green-tint px-2.5 py-1.5 rounded-full shrink-0">
              <VerifiedIcon size={12} />
              Verified
            </span>
          )}
        </div>
      </div>

      {!isOwner && (
        <div className="flex gap-2.5 p-3.5 md:p-0 border-t md:border-t-0 border-pio-border bg-pio-white md:bg-transparent shrink-0 md:w-72 md:self-start md:sticky md:top-6">
          <SaveButtonBar listingId={dl.id} saved={dl.saved} loggedIn={!!user} />
          <MessageStudentButton
            listingId={dl.id}
            loggedIn={!!user}
            defaultText={`Hi! Is "${dl.title}" still available?`}
          />
        </div>
      )}
    </div>
  );
}

function SaveButtonBar({ listingId, saved, loggedIn }: { listingId: string; saved: boolean; loggedIn: boolean }) {
  return (
    <div className="relative w-12 h-12 rounded-2xl border-[1.5px] border-pio-border-strong bg-pio-white shrink-0">
      <SaveButton listingId={listingId} initialSaved={saved} loggedIn={loggedIn} size={18} overlay={false} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-[12px] text-pio-faint font-semibold">{label}</span>
      <span className="text-[12.5px] text-pio-ink font-bold">{value}</span>
    </div>
  );
}
