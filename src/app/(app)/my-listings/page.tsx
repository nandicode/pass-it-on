import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { MyListingsView } from "@/components/MyListingsView";

export default async function MyListingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const listings = await prisma.listing.findMany({
    where: { ownerId: user.id },
    include: { photos: true },
    orderBy: { createdAt: "desc" },
  });

  const items = listings.map((l) => ({
    id: l.id,
    title: l.title,
    priceLabel: l.priceType === "FREE" ? "Free" : `₹${l.price}`,
    interested: l.interested,
    status: l.status,
    photoUrl: l.photos[0]?.url ?? null,
  }));

  return <MyListingsView items={items} />;
}
