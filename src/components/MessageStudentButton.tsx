"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function MessageStudentButton({
  listingId,
  loggedIn,
  defaultText,
}: {
  listingId: string;
  loggedIn: boolean;
  defaultText: string;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(defaultText);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <>
      <Button
        className="flex-1"
        onClick={() => (loggedIn ? setOpen(true) : router.push("/login"))}
      >
        Message student
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Send a message">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="rounded-xl border border-pio-border-strong px-3.5 py-3 text-[14px] outline-none resize-y"
        />
        <div className="flex gap-2.5">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await fetch("/api/threads/start", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ listingId, text }),
                });
                const data = await res.json();
                if (data.threadId) {
                  toast("Message sent");
                  router.push(`/messages/${data.threadId}`);
                } else {
                  toast(data.error || "Something went wrong");
                }
              })
            }
          >
            Send message
          </Button>
        </div>
      </Sheet>
    </>
  );
}
