"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookmarkIcon } from "@/lib/icons";
import { useToast } from "@/components/ui/Toast";

export function SaveButton({
  listingId,
  initialSaved,
  loggedIn,
  size = 24,
  overlay = true,
}: {
  listingId: string;
  initialSaved: boolean;
  loggedIn: boolean;
  size?: number;
  overlay?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!loggedIn) {
          router.push("/login");
          return;
        }
        const next = !saved;
        setSaved(next);
        startTransition(async () => {
          await fetch(`/api/listings/${listingId}/save`, { method: "POST" });
          toast(next ? "Saved" : "Removed from saved");
          router.refresh();
        });
      }}
      className={
        overlay
          ? "pio-tap absolute top-2 right-2 rounded-full bg-white/85 flex items-center justify-center cursor-pointer"
          : "pio-tap w-full h-full flex items-center justify-center cursor-pointer text-pio-ink"
      }
      style={overlay ? { width: size, height: size } : undefined}
    >
      <BookmarkIcon size={size * 0.5} filled={saved} className={saved ? "text-pio-ink" : "text-pio-ink"} />
    </button>
  );
}
