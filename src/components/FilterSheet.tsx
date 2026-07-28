"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetOption } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { FilterIcon, ChevronDownIcon } from "@/lib/icons";
import { SCHOOLS, COURSES, SEMESTERS, CONDITIONS, CONDITION_LABELS } from "@/lib/constants";

const PRICE_OPTIONS = [
  { value: "", label: "Any" },
  { value: "free", label: "Free only" },
  { value: "paid", label: "Paid" },
];
const SORT_OPTIONS = [
  { value: "", label: "Most recent" },
  { value: "price_asc", label: "Price: low to high" },
];

type Field = "school" | "course" | "semester" | "price" | "condition" | "sort";

export function FilterSheet({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  const [open, setOpen] = useState(false);
  const [subField, setSubField] = useState<Field | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [draft, setDraft] = useState({
    school: searchParams.get("school") || "",
    course: searchParams.get("course") || "",
    semester: searchParams.get("semester") || "",
    subjectCode: searchParams.get("subjectCode") || "",
    price: searchParams.get("price") || "",
    condition: searchParams.get("condition") || "",
    sort: searchParams.get("sort") || "",
  });

  function apply() {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(draft)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    router.push(`/browse?${params.toString()}`);
    setOpen(false);
  }

  function reset() {
    setDraft({ school: "", course: "", semester: "", subjectCode: "", price: "", condition: "", sort: "" });
    const params = new URLSearchParams(searchParams.toString());
    ["school", "course", "semester", "subjectCode", "price", "condition", "sort"].forEach((k) => params.delete(k));
    router.push(`/browse?${params.toString()}`);
  }

  const optionsFor = (field: Field): { value: string; label: string }[] => {
    switch (field) {
      case "school":
        return [{ value: "", label: "Any school" }, ...SCHOOLS.map((s) => ({ value: s, label: s }))];
      case "course":
        return [{ value: "", label: "Any course" }, ...COURSES.map((c) => ({ value: c, label: c }))];
      case "semester":
        return [{ value: "", label: "Any semester" }, ...SEMESTERS.map((s) => ({ value: s, label: s }))];
      case "condition":
        return [
          { value: "", label: "Any condition" },
          ...CONDITIONS.map((c) => ({ value: c, label: CONDITION_LABELS[c] })),
        ];
      case "price":
        return PRICE_OPTIONS;
      case "sort":
        return SORT_OPTIONS;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="pio-tap flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-pio-white border border-pio-border-strong cursor-pointer"
      >
        <FilterIcon size={14} />
        <span className="text-[12.5px] font-bold text-pio-ink-soft">Filters</span>
        {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-pio-green" />}
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Filters">
        <div className="flex flex-col gap-4">
          <FieldRow label="School / department" value={draft.school || "Any school"} onClick={() => setSubField("school")} />
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Course" value={draft.course || "Any course"} onClick={() => setSubField("course")} />
            <FieldRow label="Semester" value={draft.semester || "Any semester"} onClick={() => setSubField("semester")} />
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-bold text-pio-faint uppercase tracking-wide">Subject code</span>
            <input
              value={draft.subjectCode}
              onChange={(e) => setDraft((d) => ({ ...d, subjectCode: e.target.value }))}
              placeholder="e.g. CS-301"
              className="h-12 rounded-xl border-[1.5px] border-pio-border-strong bg-pio-surface px-3.5 text-[14px] outline-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Price" value={draft.price ? PRICE_OPTIONS.find((o) => o.value === draft.price)!.label : "Any"} onClick={() => setSubField("price")} />
            <FieldRow label="Condition" value={draft.condition ? CONDITION_LABELS[draft.condition] : "Any condition"} onClick={() => setSubField("condition")} />
          </div>
          <FieldRow label="Sort by" value={draft.sort ? "Price: low to high" : "Most recent"} onClick={() => setSubField("sort")} />
          <div className="flex gap-2.5 pt-1">
            <Button variant="ghost" onClick={reset} className="!text-pio-ink-soft">
              Reset
            </Button>
            <Button className="flex-1" onClick={apply}>
              Show results
            </Button>
          </div>
        </div>
      </Sheet>

      {subField && (
        <Sheet open onClose={() => setSubField(null)} title={fieldLabel(subField)}>
          <div className="flex flex-col">
            {optionsFor(subField).map((o) => (
              <SheetOption
                key={o.value}
                label={o.label}
                active={draft[subField] === o.value}
                onClick={() => {
                  setDraft((d) => ({ ...d, [subField]: o.value }));
                  setSubField(null);
                }}
              />
            ))}
          </div>
        </Sheet>
      )}
    </>
  );
}

function fieldLabel(f: Field) {
  return { school: "School", course: "Course", semester: "Semester", price: "Price", condition: "Condition", sort: "Sort by" }[f];
}

function FieldRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-bold text-pio-faint uppercase tracking-wide">{label}</span>
      <button
        onClick={onClick}
        className="pio-tap flex items-center justify-between h-12 rounded-xl border-[1.5px] border-pio-border-strong bg-pio-surface px-3.5 cursor-pointer"
      >
        <span className="text-[13.5px] font-semibold text-pio-ink truncate">{value}</span>
        <ChevronDownIcon size={15} className="text-pio-muted shrink-0" />
      </button>
    </div>
  );
}
