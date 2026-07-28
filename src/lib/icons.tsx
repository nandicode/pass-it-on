import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size = 18) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

export function NotesIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M6 3h9l5 5v13H6z" />
      <path d="M15 3v5h5" />
      <line x1="9" y1="12" x2="16" y2="12" />
      <line x1="9" y1="16" x2="16" y2="16" />
    </svg>
  );
}

export function BookIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export function LabIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M9 2v6.5L4 18a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9.5V2" />
      <line x1="8" y1="2" x2="16" y2="2" />
      <line x1="8.5" y1="13" x2="15.5" y2="13" />
    </svg>
  );
}

export function ToolsIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 21l7-7" />
      <path d="M14.5 3.5a3.5 3.5 0 1 1 4.95 4.95L12 16 8 20l-4-4 4-4 8.45-8.45z" />
    </svg>
  );
}

export function StationeryIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="8.6" width="18" height="7.6" rx="1.2" transform="rotate(-8 12 12)" />
      <line x1="7.3" y1="9.4" x2="7.9" y2="12.6" transform="rotate(-8 12 12)" />
      <line x1="11.4" y1="8.9" x2="12.4" y2="13.6" transform="rotate(-8 12 12)" />
      <line x1="15.6" y1="8.4" x2="16.4" y2="12.3" transform="rotate(-8 12 12)" />
    </svg>
  );
}

export function MessagesIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function HomeIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

export function SearchIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function RequestsIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

export function PlusIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.6} {...p}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function ImageIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="8.5" cy="8.5" r="1.6" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export function SendIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function ProfileIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function BookmarkIcon({ size, filled, ...p }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size)} fill={filled ? "currentColor" : "none"} {...p}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function ListingsIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

export function BellIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function ChevronRightIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.3} {...p}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ChevronDownIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.3} {...p}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function BackIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.3} {...p}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function CheckIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.4} {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function VerifiedIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.4} {...p}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function CloseIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function FilterIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

export function MoonIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export const CATEGORY_ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  notes: NotesIcon,
  book: BookIcon,
  lab: LabIcon,
  tools: ToolsIcon,
  stationery: StationeryIcon,
};
