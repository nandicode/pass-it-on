import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { ChatView } from "@/components/ChatView";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      userA: true,
      userB: true,
      listing: { include: { photos: true } },
      request: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!thread || (thread.userAId !== user.id && thread.userBId !== user.id)) notFound();

  const other = thread.userAId === user.id ? thread.userB : thread.userA;
  const ref = thread.listing ?? thread.request;

  return (
    <ChatView
      threadId={thread.id}
      person={{
        name: other.displayMode === "ANONYMOUS" ? "Anonymous student" : other.name.split(" ")[0],
        anonymous: other.displayMode === "ANONYMOUS",
        seed: other.id,
        meta: `${other.school} · ${other.course} · ${other.semester}`,
        verified: other.verified,
      }}
      refItem={
        ref
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
          : null
      }
      initialMessages={thread.messages.map((m) => ({
        id: m.id,
        mine: m.senderId === user.id,
        text: m.text,
        time: m.createdAt.toISOString(),
      }))}
    />
  );
}
