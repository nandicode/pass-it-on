"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/nav/AppShell";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetOption } from "@/components/ui/Sheet";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { CloseIcon, ChevronDownIcon } from "@/lib/icons";
import { SCHOOLS, COURSES, SEMESTERS, ALLOWED_EMAIL_DOMAIN } from "@/lib/constants";

type Stage = 1 | 2 | 3 | 4;

export default function SignupPage() {
  const [stage, setStage] = useState<Stage>(1);
  const [dropdown, setDropdown] = useState<"school" | "course" | "semester" | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const [signup, setSignup] = useState({
    email: "",
    name: "",
    password: "",
    school: SCHOOLS[0],
    course: COURSES[0],
    semester: SEMESTERS[0],
    displayMode: "FIRST_NAME" as "FIRST_NAME" | "ANONYMOUS",
  });
  const [subjects, setSubjects] = useState<{ name: string; code: string }[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  function tryContinueStage1() {
    setError("");
    if (!signup.email.trim() || !signup.email.endsWith(`@${ALLOWED_EMAIL_DOMAIN}`)) {
      setError(`Only @${ALLOWED_EMAIL_DOMAIN} college emails are accepted.`);
      return;
    }
    if (!signup.name.trim()) {
      setError("Enter your full name to continue.");
      return;
    }
    if (signup.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStage(2);
  }

  async function finish() {
    setPending(true);
    setError("");
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...signup, subjects }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPending(false);
      setError(data.error || "Something went wrong.");
      return;
    }
    const signInRes = await signIn("credentials", { email: signup.email, password: signup.password, redirect: false });
    setPending(false);
    if (signInRes?.error) setError("Account created — please log in.");
    else router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pio-page px-4 py-8">
      <div className="w-full max-w-sm bg-pio-surface rounded-3xl p-6 flex flex-col gap-4">
        <Logo />
        {error && <ErrorBanner>{error}</ErrorBanner>}

        {stage === 1 && (
          <>
            <h2 className="m-0 text-[19px] font-extrabold text-pio-ink">Create your account</h2>
            <p className="m-0 text-[12px] text-pio-muted">Only Amity Noida college emails are accepted.</p>
            <Field label="College email">
              <input value={signup.email} onChange={(e) => setSignup((s) => ({ ...s, email: e.target.value }))} placeholder={`yourname@${ALLOWED_EMAIL_DOMAIN}`} className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
            </Field>
            <Field label="Name">
              <input value={signup.name} onChange={(e) => setSignup((s) => ({ ...s, name: e.target.value }))} placeholder="Your full name" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
            </Field>
            <Field label="Password">
              <input type="password" value={signup.password} onChange={(e) => setSignup((s) => ({ ...s, password: e.target.value }))} placeholder="Create a password" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
            </Field>
            <Button onClick={tryContinueStage1}>Continue</Button>
            <span className="text-[12.5px] text-pio-muted text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-pio-green font-bold no-underline">
                Log in
              </Link>
            </span>
          </>
        )}

        {stage === 2 && (
          <>
            <h2 className="m-0 text-[19px] font-extrabold text-pio-ink">Profile setup</h2>
            <Dropdown label={signup.school} onClick={() => setDropdown("school")} />
            <Dropdown label={signup.course} onClick={() => setDropdown("course")} />
            <Dropdown label={signup.semester} onClick={() => setDropdown("semester")} />
            <Button onClick={() => setStage(3)}>Continue</Button>
          </>
        )}

        {stage === 3 && (
          <>
            <h2 className="m-0 text-[19px] font-extrabold text-pio-ink">How should others see you?</h2>
            <div className="flex flex-col gap-2.5">
              {(["FIRST_NAME", "ANONYMOUS"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSignup((s) => ({ ...s, displayMode: mode }))}
                  className="pio-tap flex items-center gap-3 px-3.5 py-3.5 rounded-2xl border-[1.5px] cursor-pointer"
                  style={{
                    borderColor: signup.displayMode === mode ? "var(--pio-green)" : "var(--pio-border-strong)",
                    background: signup.displayMode === mode ? "var(--pio-green-tint)" : "var(--pio-white)",
                  }}
                >
                  <span
                    className="w-4.5 h-4.5 rounded-full border-2 shrink-0"
                    style={{
                      borderColor: signup.displayMode === mode ? "var(--pio-green)" : "var(--pio-border-strong)",
                      background: signup.displayMode === mode ? "var(--pio-green)" : "transparent",
                    }}
                  />
                  <span className="text-[13px] font-bold text-pio-ink">
                    {mode === "FIRST_NAME" ? "Show my first name" : "Show as anonymous"}
                  </span>
                </button>
              ))}
            </div>
            <div className="bg-pio-input rounded-xl px-3.5 py-3">
              <span className="text-[11.5px] font-semibold text-pio-muted">Preview: </span>
              <span className="text-[12.5px] font-bold text-pio-ink">
                {signup.displayMode === "FIRST_NAME" ? signup.name.split(" ")[0] || "Your name" : "Anonymous student"}
              </span>
            </div>
            <Button onClick={() => setStage(4)}>Continue</Button>
          </>
        )}

        {stage === 4 && (
          <>
            <h2 className="m-0 text-[19px] font-extrabold text-pio-ink">Add your subjects</h2>
            <p className="m-0 text-[12px] text-pio-muted">Optional — helps with recommendations.</p>
            {subjects.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="flex-1 text-[13px] font-semibold text-pio-ink bg-pio-input px-3.5 py-2.5 rounded-xl">
                  {s.name} · {s.code}
                </span>
                <button onClick={() => setSubjects((subs) => subs.filter((_, idx) => idx !== i))} className="pio-tap text-pio-faint cursor-pointer">
                  <CloseIcon size={16} />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Subject name" className="flex-1 h-11 rounded-xl border border-pio-border-strong px-3 text-[13px] outline-none" />
              <input value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="Code" className="w-22 h-11 rounded-xl border border-pio-border-strong px-3 text-[13px] outline-none" />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (!subjectName.trim()) return;
                setSubjects((s) => [...s, { name: subjectName, code: subjectCode }]);
                setSubjectName("");
                setSubjectCode("");
              }}
            >
              Add another subject
            </Button>
            <div className="flex gap-2.5 mt-1">
              <Button variant="ghost" disabled={pending} onClick={finish} className="flex-1">
                Skip
              </Button>
              <Button disabled={pending} onClick={finish} className="flex-1">
                {pending ? "Finishing…" : "Finish"}
              </Button>
            </div>
          </>
        )}

        <Sheet open={dropdown === "school"} onClose={() => setDropdown(null)} title="School / department">
          {SCHOOLS.map((s) => (
            <SheetOption key={s} label={s} active={signup.school === s} onClick={() => { setSignup((v) => ({ ...v, school: s })); setDropdown(null); }} />
          ))}
        </Sheet>
        <Sheet open={dropdown === "course"} onClose={() => setDropdown(null)} title="Course">
          {COURSES.map((c) => (
            <SheetOption key={c} label={c} active={signup.course === c} onClick={() => { setSignup((v) => ({ ...v, course: c })); setDropdown(null); }} />
          ))}
        </Sheet>
        <Sheet open={dropdown === "semester"} onClose={() => setDropdown(null)} title="Semester">
          {SEMESTERS.map((s) => (
            <SheetOption key={s} label={s} active={signup.semester === s} onClick={() => { setSignup((v) => ({ ...v, semester: s })); setDropdown(null); }} />
          ))}
        </Sheet>
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

function Dropdown({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="pio-tap flex items-center justify-between h-11.5 rounded-xl border border-pio-border-strong px-3.5 cursor-pointer">
      <span className="text-[14px] text-pio-ink">{label}</span>
      <ChevronDownIcon size={14} className="text-pio-faint" />
    </button>
  );
}
