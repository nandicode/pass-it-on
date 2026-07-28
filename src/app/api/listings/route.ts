import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { listingCard } from "@/lib/dto";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const school = searchParams.get("school");
  const course = searchParams.get("course");
  const semester = searchParams.get("semester");
  const subjectCode = searchParams.get("subjectCode");
  const price = searchParams.get("price"); // free | paid
  const condition = searchParams.get("condition");
  const sort = searchParams.get("sort"); // recent | price_asc
  const q = searchParams.get("q");
  const mine = searchParams.get("mine");

  const user = await getCurrentUser();

  const where: Prisma.ListingWhereInput = {};
  if (mine === "1" && user) {
    where.ownerId = user.id;
  } else {
    where.status = "AVAILABLE";
  }
  if (category) where.category = { key: category };
  if (school) where.school = school;
  if (course) where.course = course;
  if (semester) where.semester = semester;
  if (subjectCode) where.subjectCode = { contains: subjectCode, mode: "insensitive" };
  if (price === "free") where.priceType = "FREE";
  if (price === "paid") where.priceType = "PAID";
  if (condition) where.condition = condition as Prisma.EnumConditionFilter["equals"];
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { subjectCode: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" } : { createdAt: "desc" };

  const listings = await prisma.listing.findMany({
    where,
    orderBy,
    include: { photos: true, category: true },
    take: 60,
  });

  const savedIds = user
    ? new Set(
        (
          await prisma.savedListing.findMany({
            where: { userId: user.id, listingId: { in: listings.map((l) => l.id) } },
            select: { listingId: true },
          })
        ).map((s) => s.listingId)
      )
    : new Set<string>();

  return Response.json(listings.map((l) => listingCard(l, savedIds)));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const body = await request.json();
  const category = await prisma.category.findUnique({ where: { key: body.categoryKey } });
  if (!category) return Response.json({ error: "Invalid category." }, { status: 400 });

  if (!Array.isArray(body.photos) || body.photos.length === 0) {
    return Response.json({ error: "At least one photo is required." }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      ownerId: user.id,
      categoryId: category.id,
      title: String(body.title || "").trim(),
      description: String(body.description || "").trim(),
      school: body.school || user.school,
      course: body.course || user.course,
      semester: body.semester || user.semester,
      subjectName: body.subjectName || null,
      subjectCode: body.subjectCode || null,
      condition: body.condition,
      quantity: body.quantity || null,
      usefulFor: Array.isArray(body.usefulFor) ? body.usefulFor : [],
      priceType: body.priceType === "PAID" ? "PAID" : "FREE",
      price: body.priceType === "PAID" ? Number(body.price) || 0 : 0,
      pickupSpot: body.pickupSpot || "",
      availability: body.availability || "",
      photos: { create: body.photos.map((url: string, i: number) => ({ url, position: i })) },
    },
    include: { photos: true, category: true },
  });

  return Response.json(listingCard(listing));
}
