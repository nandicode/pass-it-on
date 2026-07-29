"use client";

import { useState } from "react";
import { MoonIcon } from "@/lib/icons";

function SunIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2.5" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.5" />
      <line x1="4.6" y1="4.6" x2="6.3" y2="6.3" />
      <line x1="17.7" y1="17.7" x2="19.4" y2="19.4" />
      <line x1="2.5" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.5" y2="12" />
      <line x1="4.6" y1="19.4" x2="6.3" y2="17.7" />
      <line x1="17.7" y1="6.3" x2="19.4" y2="4.6" />
    </svg>
  );
}

export function DarkModeToggle({ initialDarkMode, loggedIn }: { initialDarkMode: boolean; loggedIn: boolean }) {
  const [dark, setDark] = useState(initialDarkMode);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    if (loggedIn) {
      fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ darkMode: next }),
      }).catch(() => {});
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="pio-tap w-9.5 h-9.5 rounded-full bg-pio-input flex items-center justify-center text-pio-ink-soft cursor-pointer shrink-0"
    >
      {dark ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </button>
  );
}
