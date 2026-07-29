import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { requestCard } from "@/lib/dto";
import { SearchBar } from "@/components/SearchBar";
import { CategoryChips } from "@/components/CategoryChips";
import { RequestCard } from "@/components/cards/RequestCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequestsIcon } from "@/lib/icons";
import type { Prisma } from "@prisma/client";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();

  const where: Prisma.RequestWhereInput = { open: true };
  if (sp.category) where.category = { key: sp.category };
  if (sp.q) where.title = { contains: sp.q, mode: "insensitive" };

  const requests = await prisma.request.findMany({
    where,
    include: { category: true, requester: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <div className="flex flex-col gap-3.5 md:gap-5 px-4.5 py-4 md:px-8 md:py-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <SearchBar initialQuery={sp.q} />
        </div>
        <Link href="/request" className="md:shrink-0">
          <Button className="w-full md:w-auto">Request material</Button>
        </Link>
      </div>
      <CategoryChips active={sp.category} />
      <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-4">
        {requests.map((r) => (
          <RequestCard key={r.id} req={requestCard(r)} loggedIn={!!user} />
        ))}
        {requests.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              icon={<RequestsIcon size={22} />}
              title="No requests yet."
              subtitle="Be the first to ask for something students on campus might have."
            />
          </div>
        )}
      </div>
    </div>
  );
}
