"use client";

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 pio-scrim" onClick={onClose} />
      <div className="relative w-full md:max-w-md bg-pio-surface rounded-t-[22px] md:rounded-[22px] pt-2.5 pb-[max(18px,env(safe-area-inset-bottom))] px-5 max-h-[86%] overflow-y-auto flex flex-col gap-4 pio-sheet">
        <div className="w-9 h-1 rounded-full bg-pio-border-strong mx-auto mt-1.5 md:hidden" />
        {title && <span className="text-[17px] font-extrabold text-pio-ink">{title}</span>}
        {children}
      </div>
    </div>
  );
}

export function SheetOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="pio-tap px-5 py-3.5 text-[14.5px] cursor-pointer hover:bg-pio-input rounded-lg"
      style={{ fontWeight: active ? 800 : 500, color: active ? "var(--pio-green)" : "var(--pio-ink)" }}
    >
      {label}
    </div>
  );
}
