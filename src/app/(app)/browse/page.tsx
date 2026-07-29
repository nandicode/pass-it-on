import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { listingCard } from "@/lib/dto";
import { SearchBar } from "@/components/SearchBar";
import { CategoryChips } from "@/components/CategoryChips";
import { ListingCard } from "@/components/cards/ListingCard";
import { FilterSheet } from "@/components/FilterSheet";
import { SearchIcon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();

  const where: Prisma.ListingWhereInput = { status: "AVAILABLE" };
  if (sp.category) where.category = { key: sp.category };
  if (sp.school) where.school = sp.school;
  if (sp.course) where.course = sp.course;
  if (sp.semester) where.semester = sp.semester;
  if (sp.subjectCode) where.subjectCode = { contains: sp.subjectCode, mode: "insensitive" };
  if (sp.price === "free") where.priceType = "FREE";
  if (sp.price === "paid") where.priceType = "PAID";
  if (sp.condition) where.condition = sp.condition as never;
  if (sp.q) {
    where.OR = [
      { title: { contains: sp.q, mode: "insensitive" } },
      { subjectCode: { contains: sp.q, mode: "insensitive" } },
      { description: { contains: sp.q, mode: "insensitive" } },
    ];
  }

  const listings = await prisma.listing.findMany({
    where,
    include: { photos: true, category: true },
    orderBy: sp.sort === "price_asc" ? { price: "asc" } : { createdAt: "desc" },
    take: 60,
  });

  const savedIds = user
    ? new Set(
        (
          await prisma.savedListing.findMany({
            where: { userId: user.id, listingId: { in: listings.map((l) => l.id) } },
            select: { listingId: true },
          })
        ).map((s) => s.listingId)
      )
    : new Set<string>();

  const hasActiveFilters = Boolean(
    sp.school || sp.course || sp.semester || sp.subjectCode || sp.price || sp.condition || sp.sort
  );

  return (
    <div className="flex flex-col gap-4 md:gap-5 px-4.5 py-4 md:px-8 md:py-6">
      <div className="flex flex-col gap-3">
        <SearchBar initialQuery={sp.q} />
        <CategoryChips active={sp.category} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[12.5px] md:text-[14.5px] text-pio-muted">
          {listings.length} {listings.length === 1 ? "result" : "results"}
        </span>
        <FilterSheet hasActiveFilters={hasActiveFilters} />
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {listings.map((l) => (
            <ListingCard key={l.id} item={listingCard(l, savedIds)} loggedIn={!!user} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<SearchIcon size={22} />}
          title="No one has listed this yet."
          subtitle="Be the first to know — post a request and students who have it can respond."
          action={
            <Link href="/request">
              <Button>Request material</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
