import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const threads = await prisma.thread.findMany({
    where: { OR: [{ userAId: user.id }, { userBId: user.id }] },
    include: {
      userA: true,
      userB: true,
      listing: { include: { category: true } },
      request: { include: { category: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  const result = threads.map((t) => {
    const other = t.userAId === user.id ? t.userB : t.userA;
    const last = t.messages[0];
    const ref = t.listing ?? t.request;
    return {
      id: t.id,
      personName: other.displayMode === "ANONYMOUS" ? "Anonymous student" : other.name.split(" ")[0],
      anonymous: other.displayMode === "ANONYMOUS",
      seed: other.id,
      kindLabel: t.refType === "LISTING" ? "Listing chat" : "Request response",
      refTitle: ref?.title ?? "",
      snippet: last?.text ?? "",
      lastTime: last?.createdAt ?? t.createdAt,
    };
  });

  return Response.json(result);
}
