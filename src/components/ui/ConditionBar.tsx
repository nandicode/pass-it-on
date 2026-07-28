import { CONDITIONS, CONDITION_LABELS } from "@/lib/constants";

export function ConditionBar({ condition }: { condition: string }) {
  const index = Math.max(0, CONDITIONS.indexOf(condition as (typeof CONDITIONS)[number]));
  // CONDITIONS is ordered best -> worst; worse condition fills fewer segments.
  const filledCount = CONDITIONS.length - index;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-[12px] text-pio-faint font-semibold">Condition</span>
        <span className="text-[12.5px] text-pio-ink font-bold">{CONDITION_LABELS[condition]}</span>
      </div>
      <div className="flex gap-1.5">
        {CONDITIONS.map((c, i) => (
          <div
            key={c}
            className="flex-1 h-1.5 rounded-full"
            style={{ background: i < filledCount ? "#2F6F5E" : "var(--pio-border)" }}
          />
        ))}
      </div>
    </div>
  );
}
