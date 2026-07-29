"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CategoryIllustration } from "@/components/ui/PhotoPlaceholder";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListingsIcon } from "@/lib/icons";
import { STATUS_META } from "@/lib/constants";

type Item = {
  id: string;
  title: string;
  priceLabel: string;
  interested: number;
  status: "AVAILABLE" | "RESERVED" | "PASSED";
  photoUrl: string | null;
  categoryKey: string;
};

const TABS = [
  { key: "AVAILABLE", label: "Active" },
  { key: "RESERVED", label: "Reserved" },
  { key: "PASSED", label: "Passed on" },
] as const;

function actionsFor(status: Item["status"]): { label: string; next: Item["status"] }[] {
  if (status === "AVAILABLE") return [{ label: "Mark reserved", next: "RESERVED" }, { label: "Mark passed on", next: "PASSED" }];
  if (status === "RESERVED") return [{ label: "Mark passed on", next: "PASSED" }, { label: "Back to available", next: "AVAILABLE" }];
  return [{ label: "Relist", next: "AVAILABLE" }];
}

export function MyListingsView({ items }: { items: Item[] }) {
  const [tab, setTab] = useState<Item["status"]>("AVAILABLE");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const filtered = items.filter((i) => i.status === tab);

  return (
    <div className="flex flex-col gap-3.5 p-4.5 md:p-8">
      <div className="flex gap-1.5 bg-pio-input rounded-full p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="pio-tap px-3.5 py-2 rounded-full text-[12px] font-bold cursor-pointer"
            style={{
              background: tab === t.key ? "var(--pio-white)" : "transparent",
              color: tab === t.key ? "var(--pio-green)" : "var(--pio-muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2 md:gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-pio-white border border-pio-border rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <Link href={`/listing/${item.id}`} className="w-13 h-13 rounded-xl overflow-hidden shrink-0" style={{ width: 52, height: 52 }}>
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <CategoryIllustration categoryKey={item.categoryKey} className="w-full h-full" iconSize={18} />
                )}
              </Link>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <Badge label={STATUS_META[item.status].label} color={STATUS_META[item.status].color} tint={STATUS_META[item.status].tint} />
                <Link href={`/listing/${item.id}`} className="text-[13px] font-bold text-pio-ink truncate">
                  {item.title}
                </Link>
                <span className="text-[11px] text-pio-muted">
                  {item.priceLabel} · {item.interested} interested
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {actionsFor(item.status).map((a) => (
                <button
                  key={a.label}
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await fetch(`/api/listings/${item.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: a.next }),
                      });
                      router.refresh();
                    })
                  }
                  className="pio-tap flex-1 border-[1.5px] border-pio-green text-pio-green bg-transparent px-2.5 py-2 rounded-full text-[11.5px] font-bold whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              icon={<ListingsIcon size={26} />}
              title={tab === "AVAILABLE" ? "Nothing listed yet" : tab === "RESERVED" ? "Nothing reserved right now" : "Nothing passed on yet"}
              subtitle={
                tab === "AVAILABLE"
                  ? "List your notes, books, or lab material for other students to find."
                  : "Items move here automatically as their status changes."
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
