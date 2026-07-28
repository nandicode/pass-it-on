import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { listingDetail } from "@/lib/dto";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { photos: true, category: true, owner: true },
  });
  if (!listing) return Response.json({ error: "Not found." }, { status: 404 });

  const saved = user
    ? Boolean(await prisma.savedListing.findUnique({ where: { userId_listingId: { userId: user.id, listingId: id } } }))
    : false;

  return Response.json(listingDetail(listing, saved));
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return Response.json({ error: "Not found." }, { status: 404 });
  if (listing.ownerId !== user.id) return Response.json({ error: "Forbidden." }, { status: 403 });

  const body = await request.json();
  const allowedStatuses = ["AVAILABLE", "RESERVED", "PASSED"];
  const data: { status?: "AVAILABLE" | "RESERVED" | "PASSED" } = {};
  if (body.status && allowedStatuses.includes(body.status)) data.status = body.status;

  const updated = await prisma.listing.update({
    where: { id },
    data,
    include: { photos: true, category: true },
  });

  return Response.json({ id: updated.id, status: updated.status });
}
