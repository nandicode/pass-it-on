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

const GREEN_DARK = "#1E4B3D";
const GREEN = "#2F6F5E";
const GREEN_MID = "#4E8E7C";
const GREEN_SOFT = "#8FBBAC";
const GREEN_TINT = "#DCEAE4";
const PAPER = "#FAF8F4";

function NotesScene() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="100" height="100" fill={GREEN_TINT} />
      <g transform="rotate(-4 50 50)">
        <rect x="20" y="12" width="60" height="76" rx="4" fill={PAPER} stroke={GREEN_SOFT} strokeWidth="1.5" />
        <line x1="29" y1="30" x2="71" y2="30" stroke={GREEN_TINT} strokeWidth="3" />
        <line x1="29" y1="40" x2="71" y2="40" stroke={GREEN_TINT} strokeWidth="3" />
        <line x1="29" y1="50" x2="71" y2="50" stroke={GREEN_TINT} strokeWidth="3" />
        <line x1="29" y1="60" x2="58" y2="60" stroke={GREEN_TINT} strokeWidth="3" />
        <path d="M29 22 Q37 17 45 22 T61 22 T71 22" stroke={GREEN} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(66 66) rotate(35)">
        <rect x="-3" y="-16" width="6" height="26" rx="2" fill={GREEN} />
        <path d="M-3 10 L3 10 L0 18 Z" fill={GREEN_DARK} />
      </g>
    </svg>
  );
}

function BooksScene() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="100" height="100" fill={GREEN_TINT} />
      <rect x="14" y="66" width="72" height="8" rx="2" fill={GREEN_DARK} />
      <g transform="translate(0 -4)">
        <rect x="18" y="34" width="20" height="34" rx="2" fill={GREEN} />
        <rect x="18" y="34" width="20" height="6" fill={GREEN_DARK} opacity="0.35" />
        <rect x="41" y="24" width="20" height="44" rx="2" fill={GREEN_MID} />
        <rect x="41" y="24" width="20" height="6" fill={GREEN_DARK} opacity="0.3" />
        <rect x="64" y="30" width="18" height="38" rx="2" fill={GREEN_SOFT} />
        <rect x="64" y="30" width="18" height="6" fill={GREEN_DARK} opacity="0.25" />
      </g>
      <rect x="46" y="14" width="10" height="16" rx="1.5" fill={GREEN_DARK} />
    </svg>
  );
}

function LabScene() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="100" height="100" fill={GREEN_TINT} />
      <path d="M42 18 H58 V38 L74 76 A6 6 0 0 1 68 84 H32 A6 6 0 0 1 26 76 L42 38 Z" fill={PAPER} stroke={GREEN} strokeWidth="2.5" />
      <path d="M31 60 L69 60 L68 76 A6 6 0 0 1 62.5 80 H37.5 A6 6 0 0 1 32 76 Z" fill={GREEN} />
      <path d="M31 60 L69 60 L68 76 A6 6 0 0 1 62.5 80 H37.5 A6 6 0 0 1 32 76 Z" fill={GREEN_MID} opacity="0.6" />
      <circle cx="46" cy="68" r="2.4" fill={PAPER} opacity="0.8" />
      <circle cx="56" cy="72" r="1.6" fill={PAPER} opacity="0.8" />
      <circle cx="50" cy="64" r="1.4" fill={PAPER} opacity="0.8" />
      <line x1="38" y1="18" x2="62" y2="18" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ToolsScene() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="100" height="100" fill={GREEN_TINT} />
      <rect x="28" y="16" width="44" height="68" rx="6" fill={GREEN_DARK} />
      <rect x="34" y="24" width="32" height="14" rx="2" fill={GREEN_SOFT} />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={34 + col * 11.3}
            y={44 + row * 9.5}
            width="8.5"
            height="7"
            rx="1.5"
            fill={row === 3 && col === 1 ? GREEN_SOFT : GREEN_MID}
          />
        ))
      )}
    </svg>
  );
}

function StationeryScene() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="100" height="100" fill={GREEN_TINT} />
      <rect x="26" y="30" width="30" height="40" rx="2" fill={PAPER} stroke={GREEN_SOFT} strokeWidth="1.5" transform="rotate(-6 41 50)" />
      <rect x="34" y="26" width="30" height="40" rx="2" fill={PAPER} stroke={GREEN_SOFT} strokeWidth="1.5" transform="rotate(4 49 46)" />
      <path d="M20 40 H80 L86 78 A6 6 0 0 1 80 84 H20 A6 6 0 0 1 14 78 Z" fill={GREEN} />
      <path d="M20 40 H45 L50 34 H30 Z" fill={GREEN} />
      <rect x="20" y="40" width="60" height="6" fill={GREEN_DARK} opacity="0.25" />
    </svg>
  );
}

const SCENES: Record<string, () => React.JSX.Element> = {
  notes: NotesScene,
  books: BooksScene,
  lab: LabScene,
  tools: ToolsScene,
  stationery: StationeryScene,
};

// Contextual illustration used wherever a listing has no uploaded photo yet —
// a full-bleed category-appropriate scene, never a generic broken-image icon
// or an unrelated stock photo.
export function CategoryIllustration({
  categoryKey,
  className,
}: {
  categoryKey?: string;
  className?: string;
  iconSize?: number;
}) {
  const Scene = (categoryKey && SCENES[categoryKey]) || SCENES.notes;
  return (
    <div className={clsx("overflow-hidden", className)}>
      <Scene />
    </div>
  );
}
