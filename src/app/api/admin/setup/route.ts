import { prisma } from "@/lib/prisma";
import { SCHEMA_SQL } from "@/lib/schemaSql";
import { runSeed } from "@/lib/seedData";

// One-time setup/reseed endpoint. Guarded by a hardcoded secret since this
// sandbox has no way to set Vercel env vars. DELETE THIS ROUTE after running it.
const SETUP_SECRET = "61709a53b1fa11d266a2b5444aa1d86d3e7cebd4b17b8269";

// Prisma wraps raw-query failures in PrismaClientKnownRequestError with its
// own `.code` (e.g. "P2010"); the real Postgres SQLSTATE only shows up in the
// message text, so match on that instead of relying on `.code`.
function isAlreadyExistsError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  return /already exists/i.test(message);
}

export async function POST(request: Request) {
  return handle(request);
}

// GET too: this sandbox can only reach the deployed app through a fetch tool
// that issues GET requests, not POST.
export async function GET(request: Request) {
  return handle(request);
}

async function handle(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("key") !== SETUP_SECRET) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs: string[] = [];
  const log = (m: string) => logs.push(m);

  const statements = SCHEMA_SQL.split(";\n").map((s) => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt + ";");
    } catch (err) {
      if (isAlreadyExistsError(err)) {
        log(`skip (already exists): ${stmt.slice(0, 60)}...`);
        continue;
      }
      return Response.json({ error: String(err), logs, failedStatement: stmt }, { status: 500 });
    }
  }
  log(`Schema applied: ${statements.length} statements.`);

  try {
    await runSeed(prisma, log);
  } catch (err) {
    return Response.json({ error: String(err), logs }, { status: 500 });
  }

  return Response.json({ ok: true, logs });
}
