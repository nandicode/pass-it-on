import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NotificationRow } from "@/components/NotificationRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { BellIcon } from "@/lib/icons";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const items = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BellIcon size={22} />}
        title="Nothing here yet"
        subtitle="You'll see updates here when someone messages you, responds to a request, or a listing status changes."
      />
    );
  }

  return (
    <div className="md:flex md:justify-center md:px-8 md:py-8">
      <div className="flex flex-col w-full md:max-w-2xl md:bg-pio-white md:border md:border-pio-border md:rounded-[24px] md:overflow-hidden md:shadow-[0_1px_3px_rgba(28,28,26,0.06)]">
        {items.map((n) => (
          <NotificationRow
            key={n.id}
            id={n.id}
            type={n.type}
            text={n.text}
            time={n.createdAt.toISOString()}
            read={n.read}
          />
        ))}
      </div>
    </div>
  );
}
