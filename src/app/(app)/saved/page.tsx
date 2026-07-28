import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { listingCard } from "@/lib/dto";
import { ListingCard } from "@/components/cards/ListingCard";

export default async function SavedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const saved = await prisma.savedListing.findMany({
    where: { userId: user.id },
    include: { listing: { include: { photos: true, category: true } } },
    orderBy: { createdAt: "desc" },
  });
  const visible = saved.filter((s) => s.listing.status === "AVAILABLE");
  const savedIds = new Set(visible.map((s) => s.listingId));

  if (visible.length === 0) {
    return (
      <div className="py-16 text-center text-pio-faint text-[13px] px-6">
        Nothing saved yet. Tap the bookmark on any listing.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4.5 md:p-8">
      {visible.map((s) => (
        <ListingCard key={s.listingId} item={listingCard(s.listing, savedIds)} loggedIn />
      ))}
    </div>
  );
}
