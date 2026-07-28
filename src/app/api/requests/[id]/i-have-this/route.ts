import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const req = await prisma.request.findUnique({ where: { id } });
  if (!req) return Response.json({ error: "Not found." }, { status: 404 });
  if (req.requesterId === user.id) {
    return Response.json({ error: "This is your own request." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const text: string = body.text || "Hi! I have this — still looking for it?";

  const userAId = [user.id, req.requesterId].sort()[0];
  const userBId = [user.id, req.requesterId].sort()[1];

  let thread = await prisma.thread.findFirst({
    where: { requestId: id, userAId, userBId },
  });
  if (!thread) {
    thread = await prisma.thread.create({
      data: { refType: "REQUEST", requestId: id, userAId, userBId },
    });
  }

  await prisma.message.create({ data: { threadId: thread.id, senderId: user.id, text } });
  await prisma.notification.create({
    data: {
      userId: req.requesterId,
      type: "REQUEST",
      text: `${user.name.split(" ")[0]} responded to your request "${req.title}".`,
    },
  });

  return Response.json({ threadId: thread.id });
}
