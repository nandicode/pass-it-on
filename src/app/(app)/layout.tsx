import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/nav/AppShell";
import { ToastProvider } from "@/components/ui/Toast";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const unread = user
    ? await prisma.notification.count({ where: { userId: user.id, read: false } })
    : 0;

  return (
    <div data-theme={user?.darkMode ? "dark" : "light"}>
      <ToastProvider>
        <AppShell
          profileInitial={user ? user.name[0].toUpperCase() : "?"}
          hasUnreadNotif={unread > 0}
          initialDarkMode={user?.darkMode ?? false}
          loggedIn={!!user}
        >
          {children}
        </AppShell>
      </ToastProvider>
    </div>
  );
}
