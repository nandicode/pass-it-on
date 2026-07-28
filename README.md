# Pass It On!

A student-to-student academic material marketplace for Amity University Noida — students browse,
list, request, message, and manage academic material (notes, books, lab material, tools, stationery).

Implemented from the Claude Design handoff in the repo root (`README.md`, `chats/`,
`project/Pass It On - Mobile.dc.html`) as a production Next.js app, mobile-first and responsive
on desktop.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) — frontend + API routes in one deployable project, first-class Vercel support.
- **Tailwind CSS v4** — one responsive codebase for mobile and desktop.
- **Prisma + PostgreSQL** — data model for users, listings, requests, threads/messages, notifications, saved items.
- **Auth.js (NextAuth v5)** — credentials auth restricted to the college email domain.
- **Vercel Blob** — listing photo uploads.

## Local setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, AUTH_SECRET, etc.
npx prisma db push     # create tables from prisma/schema.prisma
npm run db:seed        # seed realistic demo data (students, listings, requests, threads)
npm run dev
```

Demo login after seeding: `nandini.rao@s.amity.edu` / `passiton123` (all seeded students share
this password).

### Environment variables

See `.env.example`:

- `DATABASE_URL` — Postgres connection string.
- `AUTH_SECRET` — random secret for Auth.js session signing (`npx auth secret` to generate one).
- `NEXTAUTH_URL` — your app's base URL (e.g. `http://localhost:3000` locally).
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token, for listing photo uploads. Without it, photo
  upload returns a clear error but the rest of the app still works (seeded data ships with
  placeholder photos).
- `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN` — email domain accepted at signup/login (defaults to
  `s.amity.edu`).

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel (root directory: `web/`, if deploying from
   the monorepo root — otherwise deploy `web/` as its own repo).
2. Provision a Postgres database. **Vercel Postgres** (Neon-backed) is the simplest — add it from
   the Vercel dashboard's Storage tab and it wires `DATABASE_URL` in automatically. Neon or
   Supabase Postgres also work.
3. Add a **Vercel Blob** store (Storage tab) — wires `BLOB_READ_WRITE_TOKEN` automatically.
4. Set `AUTH_SECRET` (generate with `npx auth secret`) and `NEXTAUTH_URL` (your production URL)
   in Vercel's Environment Variables.
5. Deploy. The `build` script runs `prisma generate` automatically; `postinstall` does too, so
   Vercel's build always has a fresh Prisma Client.
6. After the first deploy, run migrations against the production database once:
   ```bash
   DATABASE_URL="<production-url>" npx prisma db push
   DATABASE_URL="<production-url>" npm run db:seed   # optional demo data
   ```
   (Or wire `prisma migrate deploy` into a release step if you prefer tracked migrations over
   `db push` — the schema has no migrations checked in yet since this was bootstrapped with
   `db push`; run `npx prisma migrate dev --name init` locally against a real Postgres to create
   one if you want migration history.)

## Project structure

```
prisma/schema.prisma        Data model
prisma/seed.ts              Demo data (ported from the design prototype's dummy data)
src/auth.ts                 Auth.js config (credentials provider, email-domain restriction)
src/lib/                    Prisma client, session helpers, constants, icons, DTOs
src/components/             Shared UI (Button, Chip, Sheet, Avatar, ConditionBar…) + feature components
src/app/(app)/               Main app shell: Home, Browse, Listing detail, Requests, Messages, Chat,
                             Profile, Notifications, Saved, My Listings, List/Request flows
src/app/login, src/app/signup   Standalone auth pages
src/app/api/                 Route handlers backing all mutations + some reads
```

## Notes on scope

- Mobile is pixel-faithful to the design's mobile prototype (`project/Pass It On - Mobile.dc.html`);
  desktop is a responsive companion layout (top nav instead of bottom tabs, wider grids) informed
  by `project/Pass It On - Desktop.dc.html`, not a separate pixel-for-pixel build.
- Listing photos are required to publish (matches the design decision that empty photo states
  should never appear on real listings) and are stored via Vercel Blob.
- Reserved/passed-on listings are hidden from Browse/Home/Saved/Recommended, and only visible to
  their owner in My Listings — matching the design's correction that dead listings shouldn't be
  publicly browsable.
