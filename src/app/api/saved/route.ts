import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { listingCard } from "@/lib/dto";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const saved = await prisma.savedListing.findMany({
    where: { userId: user.id },
    include: { listing: { include: { photos: true, category: true } } },
    orderBy: { createdAt: "desc" },
  });

  const visible = saved.filter((s) => s.listing.status === "AVAILABLE");
  const savedIds = new Set(visible.map((s) => s.listingId));

  return Response.json(visible.map((s) => listingCard(s.listing, savedIds)));
}
