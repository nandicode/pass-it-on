"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { ProfileIcon, MoonIcon } from "@/lib/icons";

export function ProfileControls({
  initialDisplayMode,
  initialDarkMode,
  initial,
}: {
  initialDisplayMode: "FIRST_NAME" | "ANONYMOUS";
  initialDarkMode: boolean;
  initial: string;
}) {
  const [displayMode, setDisplayMode] = useState(initialDisplayMode);
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function update(patch: { displayMode?: typeof displayMode; darkMode?: boolean }) {
    startTransition(async () => {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3 p-4 bg-pio-white border border-pio-border rounded-2xl">
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-extrabold text-pio-ink">Public display</span>
          <span className="text-[11.5px] text-pio-muted leading-relaxed">
            Controls the name shown on your listings and requests. You stay a verified student either way.
          </span>
        </div>
        <div className="flex gap-1.5 bg-pio-input rounded-xl p-1">
          {(["FIRST_NAME", "ANONYMOUS"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setDisplayMode(mode);
                update({ displayMode: mode });
              }}
              className="pio-tap flex-1 text-center py-2.5 rounded-lg text-[12.5px] font-bold cursor-pointer"
              style={{
                background: displayMode === mode ? "var(--pio-white)" : "transparent",
                color: displayMode === mode ? "var(--pio-ink)" : "var(--pio-muted)",
              }}
            >
              {mode === "FIRST_NAME" ? "Show my first name" : "Show as anonymous"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5 bg-pio-green-tint rounded-xl p-3">
          <div className="w-9 h-9 rounded-full bg-pio-deep flex items-center justify-center text-white shrink-0">
            {displayMode === "ANONYMOUS" ? <ProfileIcon size={16} /> : <span className="text-[15px] font-extrabold">{initial}</span>}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10.5px] font-semibold" style={{ color: "#6B8478" }}>
              Others will see you as
            </span>
            <span className="text-[13.5px] font-extrabold text-pio-ink">
              {displayMode === "ANONYMOUS" ? "Anonymous student" : "Your first name"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 bg-pio-white border border-pio-border rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8.5 h-8.5 rounded-xl bg-pio-green-tint flex items-center justify-center text-pio-green shrink-0">
            <MoonIcon size={16} />
          </div>
          <span className="text-[13.5px] font-bold text-pio-ink">Dark mode</span>
        </div>
        <button
          onClick={() => {
            const next = !darkMode;
            setDarkMode(next);
            update({ darkMode: next });
          }}
          className="pio-tap w-11 h-6.5 rounded-full relative cursor-pointer shrink-0"
          style={{ background: darkMode ? "var(--pio-green)" : "var(--pio-border-strong)" }}
        >
          <span
            className="absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white shadow transition-all"
            style={{ left: darkMode ? 22 : 2 }}
          />
        </button>
      </div>

      <Button variant="danger-outline" onClick={() => signOut({ callbackUrl: "/" })}>
        Log out
      </Button>
    </div>
  );
}
