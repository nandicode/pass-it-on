import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const body = await request.json();
  const listingId = body.listingId as string | undefined;
  const text: string = body.text || "Hi! Is this still available?";
  if (!listingId) return Response.json({ error: "listingId required." }, { status: 400 });

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return Response.json({ error: "Not found." }, { status: 404 });
  if (listing.ownerId === user.id) {
    return Response.json({ error: "This is your own listing." }, { status: 400 });
  }

  const userAId = [user.id, listing.ownerId].sort()[0];
  const userBId = [user.id, listing.ownerId].sort()[1];

  let thread = await prisma.thread.findFirst({ where: { listingId, userAId, userBId } });
  if (!thread) {
    thread = await prisma.thread.create({ data: { refType: "LISTING", listingId, userAId, userBId } });
  }

  await prisma.message.create({ data: { threadId: thread.id, senderId: user.id, text } });
  await prisma.notification.create({
    data: {
      userId: listing.ownerId,
      type: "MESSAGE",
      text: `${user.name.split(" ")[0]} messaged you about "${listing.title}".`,
    },
  });

  return Response.json({ threadId: thread.id });
}
