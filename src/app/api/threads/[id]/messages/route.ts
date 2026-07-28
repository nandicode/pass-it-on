import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const thread = await prisma.thread.findUnique({ where: { id } });
  if (!thread || (thread.userAId !== user.id && thread.userBId !== user.id)) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const body = await request.json();
  const text = String(body.text || "").trim();
  if (!text) return Response.json({ error: "Message can't be empty." }, { status: 400 });

  const message = await prisma.message.create({ data: { threadId: id, senderId: user.id, text } });
  await prisma.thread.update({ where: { id }, data: { updatedAt: new Date() } });

  const otherId = thread.userAId === user.id ? thread.userBId : thread.userAId;
  await prisma.notification.create({
    data: { userId: otherId, type: "MESSAGE", text: `${user.name.split(" ")[0]} sent you a message.` },
  });

  return Response.json({ id: message.id, mine: true, text: message.text, time: message.createdAt });
}
