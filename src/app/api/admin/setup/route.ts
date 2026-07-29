import { prisma } from "@/lib/prisma";
import { SCHEMA_SQL } from "@/lib/schemaSql";
import { runSeed } from "@/lib/seedData";

// One-time setup endpoint: creates the schema (idempotent) and loads demo data.
// Guarded by a hardcoded secret since this sandbox has no way to set Vercel env vars.
// DELETE THIS ROUTE after running it once.
const SETUP_SECRET = "92a3b5a631f317d6b40b16d9727ff8d3aa683981";

const IGNORABLE_CODES = new Set([
  "42P07", // duplicate_table
  "42710", // duplicate_object (type/constraint)
  "42P06", // duplicate_schema
  "42701", // duplicate_column
  "42P16", // invalid_table_definition (duplicate PK etc.)
]);

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
      const code = (err as { code?: string })?.code;
      if (code && IGNORABLE_CODES.has(code)) {
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
