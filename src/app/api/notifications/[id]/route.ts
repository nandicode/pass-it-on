import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const notif = await prisma.notification.findUnique({ where: { id } });
  if (!notif || notif.userId !== user.id) return Response.json({ error: "Not found." }, { status: 404 });

  await prisma.notification.update({ where: { id }, data: { read: true } });
  return Response.json({ ok: true });
}
