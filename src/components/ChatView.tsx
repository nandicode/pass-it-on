"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { CategoryIllustration } from "@/components/ui/PhotoPlaceholder";
import { SendIcon, VerifiedIcon } from "@/lib/icons";

type Message = { id: string; mine: boolean; text: string; time: string };

const QUICK_REPLIES = ["Still available?", "Can we meet today?", "Is the price negotiable?", "Thanks!"];

export function ChatView({
  threadId,
  person,
  refItem,
  initialMessages,
}: {
  threadId: string;
  person: { name: string; anonymous: boolean; seed: string; meta: string; verified: boolean };
  refItem: { kindLabel: string; title: string; sub: string; photoUrl: string | null; categoryKey: string; listingId: string | null; requestId: string | null } | null;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setDraft("");
    startTransition(async () => {
      const res = await fetch(`/api/threads/${threadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });
      const data = await res.json();
      if (data.id) setMessages((prev) => [...prev, data]);
    });
  }

  return (
    <div className="md:px-8 md:py-8">
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[78vh] w-full md:bg-pio-white md:border md:border-pio-border md:rounded-[24px] md:overflow-hidden md:shadow-[0_1px_3px_rgba(28,28,26,0.06)]">
      <div className="flex items-center gap-2.5 md:gap-3 px-4.5 md:px-5 py-3 md:py-4 border-b border-pio-border bg-pio-white shrink-0">
        <Avatar name={person.name} anonymous={person.anonymous} seed={person.seed} size={40} />
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="text-[14px] md:text-[15.5px] font-extrabold text-pio-ink truncate">{person.name}</span>
          <span className="flex items-center gap-1.5 text-[10.5px] md:text-[12px] text-pio-muted">
            {person.meta}
            {person.verified && (
              <span className="inline-flex items-center gap-0.5 text-pio-green font-bold">
                <VerifiedIcon size={10} />
                Verified
              </span>
            )}
          </span>
        </div>
      </div>

      {refItem && (
        <div className="px-3.5 md:px-4 pt-3 bg-pio-page shrink-0">
          <Link
            href={refItem.listingId ? `/listing/${refItem.listingId}` : "/requests"}
            className="pio-tap flex items-center gap-2.5 p-2.5 bg-pio-white border border-pio-border rounded-2xl cursor-pointer"
          >
            <div className="w-10.5 h-10.5 rounded-xl overflow-hidden shrink-0">
              {refItem.photoUrl ? (
                <img src={refItem.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <CategoryIllustration categoryKey={refItem.categoryKey} className="w-full h-full" iconSize={16} />
              )}
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <Badge label={refItem.kindLabel} color="#2F6F5E" tint="#EAF1EC" />
              <span className="text-[12px] font-bold text-pio-ink truncate">{refItem.title}</span>
              <span className="text-[10.5px] text-pio-muted">{refItem.sub}</span>
            </div>
            <span className="text-[11px] font-bold text-pio-green shrink-0">View</span>
          </Link>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3.5 md:p-5 flex flex-col gap-1 bg-pio-page">
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const grouped = prev && prev.mine === m.mine;
          return (
            <div key={m.id} className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`} style={{ marginBottom: grouped ? 2 : 10 }}>
              <div
                className={`max-w-[78%] md:max-w-md px-3.5 py-2.5 text-[13px] md:text-[14px] leading-snug break-words ${m.mine ? "pio-bubble-out" : "pio-bubble-in"}`}
                style={{
                  borderRadius: m.mine
                    ? grouped
                      ? "16px 4px 4px 16px"
                      : "16px 16px 4px 16px"
                    : grouped
                    ? "4px 16px 16px 4px"
                    : "16px 16px 16px 4px",
                }}
              >
                {m.text}
              </div>
              <span className="text-[9.5px] text-pio-faint mt-1 px-1.5">
                {new Date(m.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 bg-pio-white border-t border-pio-border px-3 md:px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] md:pb-3.5 flex flex-col gap-2.5 shrink-0">
        <div className="pio-scroller flex gap-1.5 overflow-x-auto">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="pio-tap px-3 py-1.5 rounded-full bg-pio-input border border-pio-border-strong text-[11.5px] font-semibold text-pio-ink-soft whitespace-nowrap shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(draft)}
            placeholder="Message…"
            className="flex-1 h-10.5 md:h-11.5 rounded-full border border-pio-border-strong bg-pio-input px-4 text-[13px] md:text-[14px] outline-none"
          />
          <button
            onClick={() => send(draft)}
            disabled={pending || !draft.trim()}
            className="pio-tap w-10.5 h-10.5 md:w-11.5 md:h-11.5 rounded-full bg-pio-green flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
          >
            <SendIcon size={17} className="text-white" />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
