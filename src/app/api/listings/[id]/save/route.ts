import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const existing = await prisma.savedListing.findUnique({
    where: { userId_listingId: { userId: user.id, listingId: id } },
  });

  if (existing) {
    await prisma.savedListing.delete({ where: { id: existing.id } });
    return Response.json({ saved: false });
  }
  await prisma.savedListing.create({ data: { userId: user.id, listingId: id } });
  return Response.json({ saved: true });
}
