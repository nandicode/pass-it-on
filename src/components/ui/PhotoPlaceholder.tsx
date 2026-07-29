import clsx from "clsx";
import { ImageIcon, CATEGORY_ICONS } from "@/lib/icons";

export function PhotoPlaceholder({ className, iconSize = 22 }: { className?: string; iconSize?: number }) {
  return (
    <div
      className={clsx("flex items-center justify-center bg-pio-photo-bg text-pio-photo-icon", className)}
    >
      <ImageIcon size={iconSize} />
    </div>
  );
}

// Contextual illustration used wherever a listing has no uploaded photo yet —
// a category-appropriate icon on a soft tinted background, never a generic
// broken-image icon or an unrelated stock photo.
export function CategoryIllustration({
  categoryKey,
  className,
  iconSize = 28,
}: {
  categoryKey?: string;
  className?: string;
  iconSize?: number;
}) {
  const Icon = (categoryKey && CATEGORY_ICONS[categoryKey]) || CATEGORY_ICONS.notes;
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center overflow-hidden bg-pio-green-tint",
        className
      )}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: iconSize * 3.2,
          height: iconSize * 3.2,
          background: "rgba(47,111,94,0.08)",
        }}
      />
      <div
        className="relative rounded-full bg-pio-white flex items-center justify-center text-pio-green"
        style={{ width: iconSize * 1.9, height: iconSize * 1.9 }}
      >
        <Icon size={iconSize} />
      </div>
    </div>
  );
}
