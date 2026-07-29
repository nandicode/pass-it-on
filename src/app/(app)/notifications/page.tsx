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
    <div className="flex flex-col md:max-w-2xl md:mx-auto md:px-4 md:py-2">
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
  );
}
