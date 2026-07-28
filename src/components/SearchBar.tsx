"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/lib/icons";

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/browse?q=${encodeURIComponent(q)}`);
      }}
      className="relative"
    >
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pio-faint">
        <SearchIcon size={16} />
      </span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="text"
        placeholder="Search notes, books, subject code…"
        className="w-full h-10.5 rounded-full border border-pio-border-strong bg-pio-input pl-10 pr-4 text-[13px] outline-none"
      />
    </form>
  );
}
