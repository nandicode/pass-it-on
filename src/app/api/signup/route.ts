import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");
  const name = String(body.name || "").trim();
  const school = String(body.school || "");
  const course = String(body.course || "");
  const semester = String(body.semester || "");
  const displayMode = body.displayMode === "ANONYMOUS" ? "ANONYMOUS" : "FIRST_NAME";
  const subjects: { name: string; code: string }[] = Array.isArray(body.subjects)
    ? body.subjects
    : [];

  if (!email.endsWith(`@${ALLOWED_EMAIL_DOMAIN}`)) {
    return Response.json(
      { error: `Only @${ALLOWED_EMAIL_DOMAIN} college emails are accepted.` },
      { status: 400 }
    );
  }
  if (!name || password.length < 6) {
    return Response.json(
      { error: "Name is required and password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      school,
      course,
      semester,
      displayMode,
      subjects: { create: subjects.filter((s) => s.name).map((s) => ({ name: s.name, code: s.code })) },
    },
  });

  return Response.json({ id: user.id, email: user.email });
}
