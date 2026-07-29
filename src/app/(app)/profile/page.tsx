import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { ProfileControls } from "@/components/ProfileControls";
import { ListingsIcon, BookmarkIcon, RequestsIcon, BellIcon, ChevronRightIcon } from "@/lib/icons";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [listedCount, passedCount, savedCount] = await Promise.all([
    prisma.listing.count({ where: { ownerId: user.id } }),
    prisma.listing.count({ where: { ownerId: user.id, status: "PASSED" } }),
    prisma.savedListing.count({ where: { userId: user.id } }),
  ]);

  const displayName = user.displayMode === "ANONYMOUS" ? "Anonymous student" : user.name.split(" ")[0];

  const menu = [
    { href: "/my-listings", label: "My Listings", Icon: ListingsIcon },
    { href: "/saved", label: "Saved", Icon: BookmarkIcon },
    { href: "/requests", label: "Requests", Icon: RequestsIcon },
    { href: "/notifications", label: "Notifications", Icon: BellIcon },
  ];

  const infoRows = [
    { label: "Email", value: user.email },
    { label: "School", value: user.school },
    { label: "Course", value: user.course },
    { label: "Semester", value: user.semester },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6 p-4.5 md:p-8">
      <div className="bg-pio-green-tint rounded-[22px] md:rounded-[28px] p-5 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 relative overflow-hidden">
        <div className="flex items-center gap-3.5 md:gap-5 relative">
          <div className="w-15 h-15 md:w-20 md:h-20 rounded-full bg-pio-deep text-white flex items-center justify-center text-[23px] md:text-[30px] font-extrabold shrink-0">
            {user.name[0].toUpperCase()}
          </div>
          <div className="flex flex-col gap-0.5 md:gap-1 min-w-0">
            <span className="text-[18px] md:text-[24px] font-extrabold text-pio-ink truncate">{displayName}</span>
            <span className="text-[12px] md:text-[15px] text-pio-ink-soft">
              {user.course} · {user.semester}
            </span>
          </div>
        </div>
        <div className="flex gap-2.5 md:gap-4 relative md:flex-1 md:max-w-md md:ml-auto">
          {[
            { label: "Listed", value: listedCount },
            { label: "Passed on", value: passedCount },
            { label: "Saved", value: savedCount },
          ].map((s) => (
            <div key={s.label} className="flex-1 bg-pio-white border border-pio-green-border rounded-2xl py-2.5 md:py-4 px-2 flex flex-col items-center gap-0.5 md:gap-1">
              <span className="text-[19px] md:text-[26px] font-extrabold text-pio-deep leading-none">{s.value}</span>
              <span className="text-[10.5px] md:text-[12.5px] font-semibold" style={{ color: "#6B8478" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-[minmax(0,340px)_1fr] gap-4 md:gap-6 items-start">
        <div className="flex flex-col gap-2 md:gap-3 md:order-2">
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="pio-tap flex items-center gap-3 md:gap-4 px-3.5 md:px-5 py-3.5 md:py-4 bg-pio-white border border-pio-border rounded-2xl cursor-pointer"
            >
              <div className="w-8.5 h-8.5 md:w-10 md:h-10 rounded-xl bg-pio-green-tint flex items-center justify-center text-pio-green shrink-0">
                <m.Icon size={16} />
              </div>
              <span className="flex-1 text-[13.5px] md:text-[15px] font-bold text-pio-ink">{m.label}</span>
              <ChevronRightIcon size={14} className="text-pio-border-strong" />
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:gap-6 md:order-1">
          <div className="bg-pio-white border border-pio-border rounded-2xl px-4 md:px-5">
            {infoRows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 py-2.5 md:py-3.5 border-b border-pio-border">
                <span className="text-[12px] md:text-[13.5px] font-semibold text-pio-faint shrink-0">{r.label}</span>
                <span className="text-[12.5px] md:text-[14px] font-bold text-pio-ink text-right truncate">{r.value}</span>
              </div>
            ))}
            <div className="flex flex-col gap-2 md:gap-2.5 py-3 md:py-4">
              <span className="text-[12px] md:text-[13.5px] font-semibold text-pio-faint">My subjects</span>
              {user.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {user.subjects.map((s) => (
                    <span key={s.id} className="text-[11px] md:text-[12.5px] font-bold text-pio-green bg-pio-green-tint border border-pio-green-border px-2.5 py-1.5 rounded-full">
                      {s.name} · {s.code}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[12px] md:text-[13.5px] text-pio-faint">No subjects added yet.</span>
              )}
            </div>
          </div>

          <ProfileControls
            initialDisplayMode={user.displayMode}
            initialDarkMode={user.darkMode}
            initial={user.name[0].toUpperCase()}
          />
        </div>
      </div>
    </div>
  );
}
