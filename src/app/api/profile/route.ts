import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  const body = await request.json();
  const data: {
    displayMode?: "FIRST_NAME" | "ANONYMOUS";
    darkMode?: boolean;
    school?: string;
    course?: string;
    semester?: string;
  } = {};
  if (body.displayMode === "FIRST_NAME" || body.displayMode === "ANONYMOUS") {
    data.displayMode = body.displayMode;
  }
  if (typeof body.darkMode === "boolean") data.darkMode = body.darkMode;
  if (body.school) data.school = body.school;
  if (body.course) data.course = body.course;
  if (body.semester) data.semester = body.semester;

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return Response.json({ id: updated.id, displayMode: updated.displayMode, darkMode: updated.darkMode });
}
