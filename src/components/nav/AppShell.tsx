"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import {
  HomeIcon,
  SearchIcon,
  RequestsIcon,
  MessagesIcon,
  PlusIcon,
  ProfileIcon,
  BellIcon,
  BackIcon,
} from "@/lib/icons";
import clsx from "clsx";

const TABS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/browse", label: "Browse", Icon: SearchIcon },
];
const TABS_RIGHT = [
  { href: "/requests", label: "Requests", Icon: RequestsIcon },
  { href: "/messages", label: "Messages", Icon: MessagesIcon },
];
const DESKTOP_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/requests", label: "Requests" },
  { href: "/messages", label: "Messages" },
  { href: "/my-listings", label: "My Listings" },
];

const TOP_LEVEL = new Set(["/", "/browse", "/requests", "/messages", "/profile"]);

export function Logo({ size = 19 }: { size?: number }) {
  return (
    <span className="inline-flex items-baseline gap-px">
      <span className="font-extrabold text-pio-ink" style={{ fontSize: size }}>
        Pass It On
      </span>
      <span
        className="font-extrabold text-pio-green inline-block"
        style={{ fontSize: size, transform: "rotate(12deg)", marginLeft: 2 }}
      >
        !
      </span>
    </span>
  );
}

function backTitleFor(pathname: string) {
  if (pathname.startsWith("/listing/")) return "Listing";
  if (pathname.startsWith("/messages/")) return "Chat";
  if (pathname.startsWith("/list")) return "List material";
  if (pathname.startsWith("/request")) return "Request material";
  if (pathname.startsWith("/signup")) return "Create account";
  if (pathname.startsWith("/login")) return "Log in";
  if (pathname.startsWith("/saved")) return "Saved";
  if (pathname.startsWith("/my-listings")) return "My Listings";
  if (pathname.startsWith("/notifications")) return "Notifications";
  return "Pass It On";
}

export function AppShell({
  children,
  profileInitial,
  hasUnreadNotif,
}: {
  children: React.ReactNode;
  profileInitial: string;
  hasUnreadNotif: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isTopLevel = TOP_LEVEL.has(pathname);
  const backTitle = backTitleFor(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-pio-surface">
      <header className="shrink-0 bg-pio-white sticky top-0 z-30 border-b border-pio-border md:border-b-0 md:shadow-[0_1px_0_var(--pio-border)]">
        {isTopLevel ? (
          <div className="flex items-center justify-between px-4.5 py-3 md:px-8 md:py-4 md:max-w-[1200px] md:mx-auto">
            <Link href="/" className="cursor-pointer shrink-0">
              <Logo size={20} />
            </Link>
            <nav className="hidden md:flex items-center gap-7 text-[14px] font-bold text-pio-ink-soft mx-8">
              {DESKTOP_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={clsx(
                    "hover:text-pio-green transition-colors",
                    pathname === l.href && "text-pio-green"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="hidden md:block flex-1 max-w-md">
              <SearchBar />
            </div>
            <div className="flex items-center gap-2.5 shrink-0 md:ml-6">
              <Link
                href="/notifications"
                className="pio-tap relative w-9.5 h-9.5 rounded-full bg-pio-input flex items-center justify-center text-pio-ink-soft"
              >
                <BellIcon size={17} />
                {hasUnreadNotif && (
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-pio-orange border-[1.5px] border-pio-input" />
                )}
              </Link>
              <Link
                href="/profile"
                className="pio-tap w-9.5 h-9.5 rounded-full bg-pio-deep text-white flex items-center justify-center text-[14.5px] font-extrabold"
              >
                {profileInitial}
              </Link>
              <Link href="/list" className="hidden md:inline-flex">
                <span className="pio-tap bg-pio-green text-white text-[12.5px] font-bold px-4 py-2.5 rounded-full whitespace-nowrap">
                  + List material
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4.5 py-4 md:px-8 md:max-w-[1200px] md:mx-auto border-b border-pio-border md:border-b-0">
            <button
              onClick={() => router.back()}
              className="pio-tap w-8.5 h-8.5 rounded-full bg-pio-input flex items-center justify-center shrink-0 cursor-pointer"
            >
              <BackIcon size={16} />
            </button>
            <span className="text-[16.5px] font-extrabold text-pio-ink flex-1 truncate">{backTitle}</span>
          </div>
        )}
      </header>

      <main className="flex-1 pb-20 md:pb-10">
        <div className="md:max-w-[1200px] md:mx-auto">{children}</div>
      </main>

      <nav className="md:hidden shrink-0 flex items-center justify-around px-2 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] bg-pio-white border-t border-pio-border fixed bottom-0 left-0 right-0 z-30">
        {TABS.map((t) => (
          <TabLink key={t.href} {...t} active={pathname === t.href} />
        ))}
        <Link href="/list" className="pio-tap flex flex-col items-center gap-1 px-2.5">
          <span
            className="w-12 h-12 rounded-2xl bg-pio-deep text-white flex items-center justify-center shrink-0"
            style={{ boxShadow: "0 6px 16px rgba(30,75,61,0.4)", border: "3px solid var(--pio-white)", marginTop: -16 }}
          >
            <PlusIcon size={22} />
          </span>
          <span className="text-[10px] font-bold text-pio-deep -mt-0.5">List</span>
        </Link>
        {TABS_RIGHT.map((t) => (
          <TabLink key={t.href} {...t} active={pathname === t.href} />
        ))}
      </nav>
    </div>
  );
}

function TabLink({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: typeof HomeIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="pio-tap flex flex-col items-center gap-0.5 px-2.5 py-1"
      style={{ color: active ? "var(--pio-green)" : "var(--pio-faint)" }}
    >
      <Icon size={22} />
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
}

export { ProfileIcon };
