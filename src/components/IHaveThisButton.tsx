"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function IHaveThisButton({ requestId, loggedIn }: { requestId: string; loggedIn: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!loggedIn) {
          router.push("/login");
          return;
        }
        startTransition(async () => {
          const res = await fetch(`/api/requests/${requestId}/i-have-this`, { method: "POST" });
          const data = await res.json();
          if (data.threadId) {
            toast("Message sent");
            router.push(`/messages/${data.threadId}`);
          } else {
            toast(data.error || "Something went wrong");
          }
        });
      }}
      className="!py-2 !px-3.5 !text-[12px]"
    >
      I have this
    </Button>
  );
}
