"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Sheet, SheetOption } from "@/components/ui/Sheet";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { CheckIcon, ChevronDownIcon } from "@/lib/icons";
import { CATEGORIES, SCHOOLS, COURSES, SEMESTERS } from "@/lib/constants";

export function RequestWizard({ defaultSchool, defaultCourse, defaultSemester }: { defaultSchool: string; defaultCourse: string; defaultSemester: string }) {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dropdown, setDropdown] = useState<"school" | "course" | "semester" | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    categoryKey: "notes",
    subjectName: "",
    subjectCode: "",
    school: defaultSchool,
    course: defaultCourse,
    semester: defaultSemester,
    needBy: "",
    note: "",
  });

  const disabled = !form.subjectName.trim() && !form.subjectCode.trim();

  async function submit() {
    setSubmitting(true);
    setError("");
    const title = form.subjectName ? `Looking for ${form.subjectName}` : `Looking for ${CATEGORIES.find((c) => c.key === form.categoryKey)?.label}`;
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, title }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.id) setDone(true);
    else setError(data.error || "Something went wrong.");
  }

  if (done) {
    return (
      <div className="md:flex md:justify-center md:px-8 md:py-10">
      <div className="flex flex-col items-center gap-3.5 px-4.5 py-8 md:p-12 w-full md:max-w-xl md:bg-pio-white md:border md:border-pio-border md:rounded-[28px] md:shadow-[0_1px_3px_rgba(28,28,26,0.06)]">
        <div className="w-13 h-13 rounded-full bg-pio-green-tint flex items-center justify-center text-pio-green" style={{ width: 52, height: 52 }}>
          <CheckIcon size={24} />
        </div>
        <span className="text-[17px] font-extrabold text-pio-ink">Your request is live.</span>
        <Button onClick={() => router.push("/requests")} className="mt-1.5">
          Go to Requests
        </Button>
      </div>
      </div>
    );
  }

  return (
    <div className="md:flex md:justify-center md:px-8 md:py-10">
    <div className="flex flex-col gap-3.5 px-4.5 py-4.5 md:p-10 w-full md:max-w-xl md:bg-pio-white md:border md:border-pio-border md:rounded-[28px] md:shadow-[0_1px_3px_rgba(28,28,26,0.06)]">
      <h2 className="m-0 text-[18px] font-extrabold text-pio-ink">Request material</h2>
      {error && <ErrorBanner>{error}</ErrorBanner>}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Chip key={c.key} active={form.categoryKey === c.key} onClick={() => setForm((f) => ({ ...f, categoryKey: c.key }))}>
            {c.label}
          </Chip>
        ))}
      </div>
      <div className="flex gap-2.5">
        <Field label="Subject name" className="flex-1">
          <input value={form.subjectName} onChange={(e) => setForm((f) => ({ ...f, subjectName: e.target.value }))} placeholder="DBMS" className="h-11.5 rounded-xl border border-pio-border-strong px-3 text-[13.5px] outline-none" />
        </Field>
        <Field label="Code" className="flex-1">
          <input value={form.subjectCode} onChange={(e) => setForm((f) => ({ ...f, subjectCode: e.target.value }))} placeholder="CS-302" className="h-11.5 rounded-xl border border-pio-border-strong px-3 text-[13.5px] outline-none" />
        </Field>
      </div>
      <Dropdown label={form.school} onClick={() => setDropdown("school")} />
      <div className="flex gap-2.5">
        <Dropdown label={form.course} onClick={() => setDropdown("course")} className="flex-1" />
        <Dropdown label={form.semester} onClick={() => setDropdown("semester")} className="flex-1" />
      </div>
      <Field label="Need by">
        <input value={form.needBy} onChange={(e) => setForm((f) => ({ ...f, needBy: e.target.value }))} placeholder="e.g. Friday" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
      </Field>
      <Field label="Short note">
        <textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Any extra detail…" rows={3} className="rounded-xl border border-pio-border-strong px-3.5 py-3 text-[14px] outline-none resize-y" />
      </Field>
      <Button disabled={disabled || submitting} onClick={submit}>
        {submitting ? "Posting…" : "Post request"}
      </Button>

      <Sheet open={dropdown === "school"} onClose={() => setDropdown(null)} title="School / department">
        {SCHOOLS.map((s) => (
          <SheetOption key={s} label={s} active={form.school === s} onClick={() => { setForm((f) => ({ ...f, school: s })); setDropdown(null); }} />
        ))}
      </Sheet>
      <Sheet open={dropdown === "course"} onClose={() => setDropdown(null)} title="Course">
        {COURSES.map((c) => (
          <SheetOption key={c} label={c} active={form.course === c} onClick={() => { setForm((f) => ({ ...f, course: c })); setDropdown(null); }} />
        ))}
      </Sheet>
      <Sheet open={dropdown === "semester"} onClose={() => setDropdown(null)} title="Semester">
        {SEMESTERS.map((s) => (
          <SheetOption key={s} label={s} active={form.semester === s} onClick={() => { setForm((f) => ({ ...f, semester: s })); setDropdown(null); }} />
        ))}
      </Sheet>
    </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-[12px] font-bold text-pio-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function Dropdown({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`pio-tap flex items-center justify-between h-11.5 rounded-xl border border-pio-border-strong px-3.5 cursor-pointer ${className ?? ""}`}>
      <span className="text-[13px] text-pio-ink truncate">{label}</span>
      <ChevronDownIcon size={14} className="text-pio-faint shrink-0" />
    </button>
  );
}
