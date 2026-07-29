import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessagesIcon } from "@/lib/icons";

export default async function MessagesPage() {
  const user = await requireUser().catch(() => null);
  if (!user) redirect("/login");

  const threads = await prisma.thread.findMany({
    where: { OR: [{ userAId: user.id }, { userBId: user.id }] },
    include: {
      userA: true,
      userB: true,
      listing: true,
      request: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (threads.length === 0) {
    return (
      <EmptyState
        icon={<MessagesIcon size={22} />}
        title="No messages yet"
        subtitle="Message a student about a listing, or respond to a request, and the conversation shows up here."
      />
    );
  }

  return (
    <div className="md:flex md:justify-center md:px-8 md:py-8">
      <div className="flex flex-col w-full md:max-w-2xl md:bg-pio-white md:border md:border-pio-border md:rounded-[24px] md:overflow-hidden md:shadow-[0_1px_3px_rgba(28,28,26,0.06)]">
        {threads.map((t) => {
          const other = t.userAId === user.id ? t.userB : t.userA;
          const last = t.messages[0];
          const ref = t.listing ?? t.request;
          return (
            <Link
              key={t.id}
              href={`/messages/${t.id}`}
              className="pio-tap flex items-start gap-3 md:gap-4 px-4.5 md:px-5 py-3.5 md:py-4 border-b border-pio-border last:border-b-0 cursor-pointer md:hover:bg-pio-surface"
            >
              <Avatar name={other.name} anonymous={other.displayMode === "ANONYMOUS"} seed={other.id} size={46} />
              <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13.5px] md:text-[15px] font-extrabold text-pio-ink truncate">
                    {other.displayMode === "ANONYMOUS" ? "Anonymous student" : other.name.split(" ")[0]}
                  </span>
                  <span className="text-[10px] md:text-[11.5px] text-pio-faint shrink-0">
                    {last ? new Date(last.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Badge label={t.refType === "LISTING" ? "Listing chat" : "Request response"} color="#2F6F5E" tint="#EAF1EC" />
                  <span className="text-[11px] md:text-[12.5px] text-pio-muted truncate">{ref?.title}</span>
                </div>
                <span className="text-[11.5px] md:text-[13px] text-pio-faint truncate">{last?.text}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
