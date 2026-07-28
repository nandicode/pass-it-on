export function Badge({
  label,
  color,
  tint,
}: {
  label: string;
  color: string;
  tint: string;
}) {
  return (
    <span
      className="inline-block w-fit text-[10.5px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color, background: tint }}
    >
      {label}
    </span>
  );
}
