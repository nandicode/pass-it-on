import { ProfileIcon } from "@/lib/icons";

const PALETTE = ["#2F6F5E", "#35507A", "#B5542F", "#6B4E82", "#8A6D1E", "#1E4B3D"];

export function avatarColorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function Avatar({
  name,
  anonymous,
  size = 40,
  seed,
}: {
  name: string;
  anonymous?: boolean;
  size?: number;
  seed?: string;
}) {
  const bg = anonymous ? "#6B6659" : avatarColorFor(seed || name);
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-extrabold shrink-0"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}
    >
      {anonymous ? <ProfileIcon size={size * 0.42} /> : (name[0] || "?").toUpperCase()}
    </div>
  );
}
