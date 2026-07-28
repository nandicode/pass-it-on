import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: "Photo storage isn't configured yet (BLOB_READ_WRITE_TOKEN missing)." },
      { status: 501 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file provided." }, { status: 400 });

  const blob = await put(`listings/${user.id}-${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return Response.json({ url: blob.url });
}
