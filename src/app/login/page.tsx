"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/nav/AppShell";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function doLogin() {
    setPending(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setPending(false);
    if (res?.error) setError("Incorrect email or password.");
    else router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pio-page px-4">
      <div className="w-full max-w-sm bg-pio-surface rounded-3xl p-6 flex flex-col gap-4">
        <Logo />
        <h2 className="m-0 text-[19px] font-extrabold text-pio-ink">Log in</h2>
        {error && <span className="text-[12.5px] text-pio-orange">{error}</span>}
        <Field label="College email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@s.amity.edu" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
        </Field>
        <Field label="Password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
        </Field>
        <Button disabled={pending} onClick={doLogin}>
          {pending ? "Logging in…" : "Log in"}
        </Button>
        <span className="text-[12.5px] text-pio-muted text-center">
          New here?{" "}
          <Link href="/signup" className="text-pio-green font-bold no-underline">
            Create an account
          </Link>
        </span>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-bold text-pio-ink-soft">{label}</span>
      {children}
    </label>
  );
}
