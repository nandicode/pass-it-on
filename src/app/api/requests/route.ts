import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { requestCard } from "@/lib/dto";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const mine = searchParams.get("mine");
  const user = await getCurrentUser();

  const where: Prisma.RequestWhereInput = { open: true };
  if (mine === "1" && user) {
    where.requesterId = user.id;
    delete where.open;
  }
  if (category) where.category = { key: category };
  if (q) where.title = { contains: q, mode: "insensitive" };

  const requests = await prisma.request.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: true, requester: true },
    take: 60,
  });

  return Response.json(requests.map(requestCard));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const body = await request.json();
  const category = await prisma.category.findUnique({ where: { key: body.categoryKey } });
  if (!category) return Response.json({ error: "Invalid category." }, { status: 400 });

  const created = await prisma.request.create({
    data: {
      requesterId: user.id,
      categoryId: category.id,
      title: String(body.title || `Looking for ${body.subjectName || category.label}`).trim(),
      school: body.school || user.school,
      course: body.course || user.course,
      semester: body.semester || user.semester,
      subjectName: body.subjectName || null,
      subjectCode: body.subjectCode || null,
      needBy: body.needBy || "Soon",
      note: body.note || null,
    },
    include: { category: true, requester: true },
  });

  return Response.json(requestCard(created));
}
