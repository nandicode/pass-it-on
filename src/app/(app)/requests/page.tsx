import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { requestCard } from "@/lib/dto";
import { SearchBar } from "@/components/SearchBar";
import { CategoryChips } from "@/components/CategoryChips";
import { RequestCard } from "@/components/cards/RequestCard";
import { Button } from "@/components/ui/Button";
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
    <div className="flex flex-col gap-3.5 px-4.5 py-4 md:px-8 md:py-6">
      <SearchBar initialQuery={sp.q} />
      <Link href="/request">
        <Button className="w-full">Request material</Button>
      </Link>
      <CategoryChips active={sp.category} />
      <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2 md:gap-3">
        {requests.map((r) => (
          <RequestCard key={r.id} req={requestCard(r)} loggedIn={!!user} />
        ))}
        {requests.length === 0 && (
          <div className="col-span-full py-16 text-center text-pio-faint text-[13px]">No requests yet.</div>
        )}
      </div>
    </div>
  );
}
