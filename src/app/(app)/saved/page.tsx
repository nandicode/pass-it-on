import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { listingCard } from "@/lib/dto";
import { ListingCard } from "@/components/cards/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookmarkIcon } from "@/lib/icons";

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
      <EmptyState
        icon={<BookmarkIcon size={22} />}
        title="Nothing saved yet"
        subtitle="Tap the bookmark icon on any listing to keep track of it here."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4.5 md:p-8 md:max-w-[1200px] md:mx-auto">
      {visible.map((s) => (
        <ListingCard key={s.listingId} item={listingCard(s.listing, savedIds)} loggedIn />
      ))}
    </div>
  );
}
