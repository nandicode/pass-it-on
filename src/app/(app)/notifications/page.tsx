import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NotificationRow } from "@/components/NotificationRow";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const items = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (items.length === 0) {
    return <div className="py-16 text-center text-pio-faint text-[13px]">Nothing here yet.</div>;
  }

  return (
    <div className="flex flex-col">
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
