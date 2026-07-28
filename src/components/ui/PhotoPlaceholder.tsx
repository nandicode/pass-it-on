import clsx from "clsx";
import { ImageIcon } from "@/lib/icons";

export function PhotoPlaceholder({ className, iconSize = 22 }: { className?: string; iconSize?: number }) {
  return (
    <div
      className={clsx("flex items-center justify-center bg-pio-photo-bg text-pio-photo-icon", className)}
    >
      <ImageIcon size={iconSize} />
    </div>
  );
}
