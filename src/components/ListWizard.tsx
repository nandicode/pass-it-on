"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Sheet, SheetOption } from "@/components/ui/Sheet";
import { CategoryIllustration } from "@/components/ui/PhotoPlaceholder";
import { CheckIcon, ImageIcon, ChevronDownIcon } from "@/lib/icons";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { CATEGORIES, SCHOOLS, COURSES, SEMESTERS, CONDITIONS, CONDITION_LABELS, USEFUL_FOR } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4 | "preview" | "done";

export function ListWizard({ defaultSchool, defaultCourse, defaultSemester }: { defaultSchool: string; defaultCourse: string; defaultSemester: string }) {
  const [step, setStep] = useState<Step>(1);
  const [dropdown, setDropdown] = useState<"school" | "course" | "semester" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({
    categoryKey: "notes",
    title: "",
    description: "",
    school: defaultSchool,
    course: defaultCourse,
    semester: defaultSemester,
    subjectName: "",
    subjectCode: "",
    condition: "GOOD" as (typeof CONDITIONS)[number],
    quantity: "",
    usefulFor: [] as string[],
    priceType: "FREE" as "FREE" | "PAID",
    price: "",
    pickupSpot: "",
    availability: "",
    photos: [] as string[],
  });
  const [createdId, setCreatedId] = useState<string | null>(null);

  const stepNum = typeof step === "number" ? step : step === "preview" ? 5 : 6;
  const progressPct = Math.min(100, (stepNum / 5) * 100);

  async function handlePhotoUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) setForm((f) => ({ ...f, photos: [...f.photos, data.url] }));
        else setError(data.error || "Upload failed.");
      }
    } finally {
      setUploading(false);
    }
  }

  async function publish() {
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: form.price ? Number(form.price) : 0 }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.id) {
      setCreatedId(data.id);
      setStep("done");
    } else {
      setError(data.error || "Something went wrong.");
    }
  }

  return (
    <div className="md:flex md:justify-center md:px-8 md:py-10">
    <div className="flex flex-col gap-4.5 px-4.5 py-4.5 md:p-10 w-full md:max-w-xl md:bg-pio-white md:border md:border-pio-border md:rounded-[28px] md:shadow-[0_1px_3px_rgba(28,28,26,0.06)]">
      {step !== "done" && (
        <div className="h-1.5 rounded-full bg-pio-border overflow-hidden">
          <div className="h-full bg-pio-green rounded-full transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <h2 className="m-0 text-[18px] font-extrabold text-pio-ink">What are you listing?</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Chip key={c.key} active={form.categoryKey === c.key} onClick={() => setForm((f) => ({ ...f, categoryKey: c.key }))}>
                {c.label}
              </Chip>
            ))}
          </div>
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. DBMS Sem 3 notes" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
          </Field>
          <Field label="Short description">
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What's included…" rows={3} className="rounded-xl border border-pio-border-strong px-3.5 py-3 text-[14px] outline-none resize-y" />
          </Field>
          <Button disabled={!form.title.trim()} onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3.5">
          <h2 className="m-0 text-[18px] font-extrabold text-pio-ink">Academic details</h2>
          <Dropdown label={form.school} onClick={() => setDropdown("school")} />
          <Dropdown label={form.course} onClick={() => setDropdown("course")} />
          <Dropdown label={form.semester} onClick={() => setDropdown("semester")} />
          <div className="flex gap-2.5">
            <Field label="Subject name" className="flex-1">
              <input value={form.subjectName} onChange={(e) => setForm((f) => ({ ...f, subjectName: e.target.value }))} placeholder="DBMS" className="h-11.5 rounded-xl border border-pio-border-strong px-3 text-[13.5px] outline-none" />
            </Field>
            <Field label="Code" className="flex-1">
              <input value={form.subjectCode} onChange={(e) => setForm((f) => ({ ...f, subjectCode: e.target.value }))} placeholder="CS-301" className="h-11.5 rounded-xl border border-pio-border-strong px-3 text-[13.5px] outline-none" />
            </Field>
          </div>
          <div className="flex gap-2.5">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-3.5">
          <h2 className="m-0 text-[18px] font-extrabold text-pio-ink">Photos and condition</h2>
          {error && <ErrorBanner>{error}</ErrorBanner>}
          <div className="flex gap-2.5 flex-wrap">
            {form.photos.map((url) => (
              <div key={url} className="w-18 h-18 rounded-2xl overflow-hidden" style={{ width: 72, height: 72 }}>
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <label className="pio-tap w-18 h-18 rounded-2xl border-[1.5px] border-dashed border-pio-border-strong flex flex-col items-center justify-center gap-1 cursor-pointer text-pio-faint" style={{ width: 72, height: 72 }}>
              <input type="file" accept="image/*" multiple hidden onChange={(e) => handlePhotoUpload(e.target.files)} />
              {uploading ? <span className="text-[9px] font-semibold">Uploading…</span> : <><ImageIcon size={17} /><span className="text-[9.5px] font-semibold">Add photo</span></>}
            </label>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[12px] font-bold text-pio-ink-soft">Condition</span>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <Chip key={c} active={form.condition === c} onClick={() => setForm((f) => ({ ...f, condition: c }))}>
                  {CONDITION_LABELS[c]}
                </Chip>
              ))}
            </div>
          </div>
          <Field label="Pages or quantity">
            <input value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} placeholder="e.g. 48 pages" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
          </Field>
          <div className="flex flex-col gap-2.5">
            <span className="text-[12px] font-bold text-pio-ink-soft">Useful for</span>
            <div className="flex flex-wrap gap-2">
              {USEFUL_FOR.map((u) => (
                <Chip
                  key={u}
                  active={form.usefulFor.includes(u)}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      usefulFor: f.usefulFor.includes(u) ? f.usefulFor.filter((x) => x !== u) : [...f.usefulFor, u],
                    }))
                  }
                >
                  {u}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex gap-2.5">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button className="flex-1" disabled={form.photos.length === 0} onClick={() => setStep(4)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-3.5">
          <h2 className="m-0 text-[18px] font-extrabold text-pio-ink">Price and pickup</h2>
          <div className="flex gap-2">
            <Chip active={form.priceType === "FREE"} onClick={() => setForm((f) => ({ ...f, priceType: "FREE" }))} className="flex-1 !py-3">
              Free
            </Chip>
            <Chip active={form.priceType === "PAID"} onClick={() => setForm((f) => ({ ...f, priceType: "PAID" }))} className="flex-1 !py-3">
              Set price
            </Chip>
          </div>
          {form.priceType === "PAID" && (
            <Field label="Price amount (₹)">
              <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="150" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
            </Field>
          )}
          <Field label="Pickup spot on campus">
            <input value={form.pickupSpot} onChange={(e) => setForm((f) => ({ ...f, pickupSpot: e.target.value }))} placeholder="e.g. ASET Block 1 lobby" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
          </Field>
          <Field label="Usual availability">
            <input value={form.availability} onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))} placeholder="e.g. Weekday evenings" className="h-11.5 rounded-xl border border-pio-border-strong px-3.5 text-[14px] outline-none" />
          </Field>
          <span className="text-[11px] text-pio-faint leading-relaxed">Payment is handled outside the app. Meet on campus and settle directly.</span>
          <div className="flex gap-2.5">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => setStep("preview")}>
              Preview
            </Button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="flex flex-col gap-3.5">
          <h2 className="m-0 text-[18px] font-extrabold text-pio-ink">Preview listing</h2>
          {error && <ErrorBanner>{error}</ErrorBanner>}
          <div className="border border-pio-border rounded-2xl overflow-hidden">
            <div className="h-32.5 relative" style={{ height: 130 }}>
              {form.photos[0] ? (
                <img src={form.photos[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <CategoryIllustration categoryKey={form.categoryKey} className="w-full h-full" iconSize={30} />
              )}
            </div>
            <div className="p-3.5 flex flex-col gap-1.5">
              <span className="w-fit text-[10.5px] font-bold text-pio-green bg-pio-green-tint px-2.5 py-1 rounded-full">
                {CATEGORIES.find((c) => c.key === form.categoryKey)?.label}
              </span>
              <span className="text-[15px] font-extrabold text-pio-ink">{form.title}</span>
              <span className="text-[11.5px] text-pio-muted">{[form.course, form.semester, form.subjectCode].filter(Boolean).join(" · ")}</span>
              <span className="text-[15px] font-extrabold text-pio-ink">{form.priceType === "FREE" ? "Free" : `₹${form.price || 0}`}</span>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Button variant="outline" onClick={() => setStep(4)}>
              Edit
            </Button>
            <Button className="flex-1" disabled={submitting} onClick={publish}>
              {submitting ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-3.5 py-5">
          <div className="w-13 h-13 rounded-full bg-pio-green-tint flex items-center justify-center text-pio-green" style={{ width: 52, height: 52 }}>
            <CheckIcon size={24} />
          </div>
          <span className="text-[17px] font-extrabold text-pio-ink">Your listing is live.</span>
          <div className="flex flex-col gap-2.5 w-full mt-1.5">
            <Button variant="outline" onClick={() => createdId && router.push(`/listing/${createdId}`)}>
              View listing
            </Button>
            <Button onClick={() => router.push("/my-listings")}>Go to My Listings</Button>
          </div>
        </div>
      )}

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

function Dropdown({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="pio-tap flex items-center justify-between h-11.5 rounded-xl border border-pio-border-strong px-3.5 cursor-pointer">
      <span className="text-[14px] text-pio-ink">{label}</span>
      <ChevronDownIcon size={14} className="text-pio-faint" />
    </button>
  );
}
