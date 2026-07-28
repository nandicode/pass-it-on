import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      userA: true,
      userB: true,
      listing: { include: { category: true, photos: true } },
      request: { include: { category: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!thread || (thread.userAId !== user.id && thread.userBId !== user.id)) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const other = thread.userAId === user.id ? thread.userB : thread.userA;
  const ref = thread.listing ?? thread.request;

  return Response.json({
    id: thread.id,
    person: {
      name: other.displayMode === "ANONYMOUS" ? "Anonymous student" : other.name.split(" ")[0],
      anonymous: other.displayMode === "ANONYMOUS",
      seed: other.id,
      meta: `${other.school} · ${other.course} · ${other.semester}`,
      verified: other.verified,
    },
    ref: ref
      ? {
          kindLabel: thread.refType === "LISTING" ? "Listing chat" : "Request response",
          title: ref.title,
          sub: thread.listing
            ? thread.listing.priceType === "FREE"
              ? "Free"
              : `₹${thread.listing.price}`
            : `Need by ${thread.request?.needBy}`,
          photoUrl: thread.listing?.photos[0]?.url ?? null,
          listingId: thread.listingId,
          requestId: thread.requestId,
        }
      : null,
    messages: thread.messages.map((m) => ({
      id: m.id,
      mine: m.senderId === user.id,
      text: m.text,
      time: m.createdAt,
    })),
  });
}
