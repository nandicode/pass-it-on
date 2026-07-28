import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

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
    return <div className="py-16 text-center text-pio-faint text-[13px]">No messages yet.</div>;
  }

  return (
    <div className="flex flex-col md:px-4 md:py-2">
      {threads.map((t) => {
        const other = t.userAId === user.id ? t.userB : t.userA;
        const last = t.messages[0];
        const ref = t.listing ?? t.request;
        return (
          <Link
            key={t.id}
            href={`/messages/${t.id}`}
            className="pio-tap flex items-start gap-3 px-4.5 py-3.5 border-b border-pio-border cursor-pointer md:rounded-2xl md:hover:bg-pio-white"
          >
            <Avatar name={other.name} anonymous={other.displayMode === "ANONYMOUS"} seed={other.id} size={46} />
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13.5px] font-extrabold text-pio-ink truncate">
                  {other.displayMode === "ANONYMOUS" ? "Anonymous student" : other.name.split(" ")[0]}
                </span>
                <span className="text-[10px] text-pio-faint shrink-0">
                  {last ? new Date(last.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <Badge label={t.refType === "LISTING" ? "Listing chat" : "Request response"} color="#2F6F5E" tint="#EAF1EC" />
                <span className="text-[11px] text-pio-muted truncate">{ref?.title}</span>
              </div>
              <span className="text-[11.5px] text-pio-faint truncate">{last?.text}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
