import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { listingCard, requestCard } from "@/lib/dto";
import { SearchBar } from "@/components/SearchBar";
import { CategoryChips } from "@/components/CategoryChips";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ListingCard } from "@/components/cards/ListingCard";
import { RequestCard } from "@/components/cards/RequestCard";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const user = await getCurrentUser();

  const [availableListings, homeRequests] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "AVAILABLE" },
      include: { photos: true, category: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.request.findMany({
      where: { open: true },
      include: { category: true, requester: true },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
  ]);

  const savedIds = user
    ? new Set(
        (
          await prisma.savedListing.findMany({
            where: { userId: user.id, listingId: { in: availableListings.map((l) => l.id) } },
            select: { listingId: true },
          })
        ).map((s) => s.listingId)
      )
    : new Set<string>();

  const hasSubjects = (user?.subjects.length ?? 0) > 0;

  let recommended = availableListings;
  if (user) {
    const codes = new Set(user.subjects.map((s) => s.code));
    recommended = [...availableListings].sort((a, b) => {
      const score = (l: (typeof availableListings)[number]) =>
        (l.subjectCode && codes.has(l.subjectCode) ? 3 : 0) +
        (l.course === user.course ? 2 : 0) +
        (l.semester === user.semester ? 1 : 0) +
        (l.school === user.school ? 1 : 0);
      return score(b) - score(a);
    });
  }

  const recent = availableListings.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 md:gap-10 px-4.5 py-4.5 md:px-8 md:py-8">
      <div className="flex flex-col gap-3 md:hidden">
        <SearchBar />
        <CategoryChips />
      </div>

      <div className="flex flex-col gap-3.5 md:gap-4">
        <div className="flex flex-col gap-0.5 md:gap-1">
          <span className="text-[23px] md:text-[30px] font-extrabold text-pio-ink tracking-tight">
            Hi, {user ? user.name.split(" ")[0] : "there"}
          </span>
          <span className="text-[12.5px] md:text-[15px] font-semibold text-pio-muted">
            {user ? `${user.course} · ${user.semester}` : "Browse academic material from Amity Noida students."}
          </span>
        </div>
        <div
          className="rounded-[22px] md:rounded-[28px] p-5 md:p-10 flex flex-col gap-2.5 md:gap-4 relative overflow-hidden"
          style={{ background: "linear-gradient(140deg, var(--pio-hero-from) 0%, var(--pio-hero-to) 100%)" }}
        >
          <div className="absolute -top-10 -right-8 md:-top-20 md:-right-16 w-35 h-35 md:w-70 md:h-70 rounded-full bg-white/6" />
          <h1 className="m-0 text-[20px] md:text-[34px] leading-tight font-extrabold text-white relative tracking-tight max-w-lg">
            Notes, books &amp; files from Amity Noida students.
          </h1>
          <p className="m-0 text-[12.5px] md:text-[16px] leading-relaxed relative max-w-md" style={{ color: "var(--pio-hero-sub)" }}>
            Browse what&apos;s listed, or pass on what you no longer need.
          </p>
          <div className="flex gap-2 md:gap-3 mt-1 md:mt-2 relative">
            <Link href="/browse">
              <span className="pio-tap bg-white text-[#1B4234] font-extrabold text-[12.5px] md:text-[15px] px-4.5 md:px-6 py-2.5 md:py-3.5 rounded-full whitespace-nowrap inline-block cursor-pointer">
                Browse
              </span>
            </Link>
            <Link href="/list">
              <span className="pio-tap bg-white/12 text-white border-[1.5px] border-white/35 font-bold text-[12.5px] md:text-[15px] px-4.5 md:px-6 py-2.5 md:py-3.5 rounded-full whitespace-nowrap inline-block cursor-pointer">
                List material
              </span>
            </Link>
          </div>
        </div>
      </div>

      <CategoryGrid />

      {user && !hasSubjects && (
        <div className="bg-pio-white border border-dashed border-pio-border-strong rounded-2xl p-3.5 md:p-5 flex flex-col md:flex-row md:items-center gap-2.5 md:gap-4">
          <span className="text-[13px] md:text-[15px] font-semibold text-pio-ink-soft flex-1">
            Add your subjects for better recommendations.
          </span>
          <div className="flex gap-2">
            <Link href="/profile">
              <Button className="!py-2 !px-3.5 !text-[12px] md:!py-2.5 md:!px-4.5 md:!text-[13.5px]">Add subjects</Button>
            </Link>
          </div>
        </div>
      )}

      <Section
        heading={user ? "Recommended for you" : "In demand at Amity Noida"}
        subtext={
          user
            ? `Based on ${user.course} · ${user.semester}`
            : "Trending among students on campus right now."
        }
        seeAllHref="/browse"
      >
        <div className="pio-scroller flex gap-3 md:gap-4 overflow-x-auto -mx-4.5 px-4.5 md:mx-0 md:px-0 md:grid md:grid-cols-4">
          {recommended.slice(0, 8).map((l) => (
            <div key={l.id} className="w-37.5 shrink-0 md:w-auto" style={{ width: 150 }}>
              <ListingCard item={listingCard(l, savedIds)} loggedIn={!!user} />
            </div>
          ))}
        </div>
      </Section>

      <Section heading="Recently listed" seeAllHref="/browse">
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-4">
          {recent.map((l) => (
            <ListingCard key={l.id} item={listingCard(l, savedIds)} loggedIn={!!user} variant="row" />
          ))}
        </div>
      </Section>

      <Section heading="Requests near you" seeAllHref="/requests">
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2 md:gap-4">
          {homeRequests.map((r) => (
            <RequestCard key={r.id} req={requestCard(r)} loggedIn={!!user} showRequester={false} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  heading,
  subtext,
  seeAllHref,
  children,
}: {
  heading: string;
  subtext?: string;
  seeAllHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 md:gap-1">
          <h2 className="m-0 text-[16.5px] md:text-[22px] font-extrabold text-pio-ink">{heading}</h2>
          {subtext && <span className="text-[11.5px] md:text-[13.5px] font-semibold text-pio-muted">{subtext}</span>}
        </div>
        <Link href={seeAllHref} className="text-[12.5px] md:text-[14px] font-bold text-pio-green whitespace-nowrap pt-0.5">
          See all
        </Link>
      </div>
      {children}
    </div>
  );
}
