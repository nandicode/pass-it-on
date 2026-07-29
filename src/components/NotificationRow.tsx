"use client";

import { useRouter } from "next/navigation";
import { MessagesIcon, RequestsIcon, BellIcon } from "@/lib/icons";

const ICONS = { MESSAGE: MessagesIcon, REQUEST: RequestsIcon, LISTING: RequestsIcon, SYSTEM: BellIcon };
const COLORS: Record<string, string> = { MESSAGE: "#2F6F5E", REQUEST: "#8A6D1E", LISTING: "#35507A", SYSTEM: "#6B4E82" };

export function NotificationRow({
  id,
  type,
  text,
  time,
  read,
}: {
  id: string;
  type: keyof typeof ICONS;
  text: string;
  time: string;
  read: boolean;
}) {
  const router = useRouter();
  const Icon = ICONS[type] ?? BellIcon;

  return (
    <div
      onClick={() => {
        if (!read) fetch(`/api/notifications/${id}`, { method: "PATCH" }).then(() => router.refresh());
      }}
      className="pio-tap flex items-start gap-3 md:gap-4 px-4.5 md:px-5 py-3.5 md:py-4 border-b border-pio-border last:border-b-0 cursor-pointer"
      style={{ background: read ? "transparent" : "var(--pio-green-tint)" }}
    >
      <div
        className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white shrink-0"
        style={{ background: COLORS[type] ?? "#6B6659" }}
      >
        <Icon size={16} />
      </div>
      <div className="flex flex-col gap-0.5 md:gap-1 flex-1 min-w-0">
        <span className="text-[12.5px] md:text-[14.5px] font-bold text-pio-ink leading-snug">{text}</span>
        <span className="text-[10.5px] md:text-[12px] text-pio-faint">{new Date(time).toLocaleString()}</span>
      </div>
      {!read && <span className="w-1.5 h-1.5 rounded-full bg-pio-green shrink-0 mt-1" />}
    </div>
  );
}
