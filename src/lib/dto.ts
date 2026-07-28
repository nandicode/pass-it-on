import type { Listing, ListingPhoto, Category, Request } from "@prisma/client";
import { STATUS_META, CONDITION_LABELS } from "@/lib/constants";

type ListingWithRelations = Listing & { photos: ListingPhoto[]; category: Category };

export function listingCard(l: ListingWithRelations, savedIds: Set<string> = new Set()) {
  const status = STATUS_META[l.status];
  return {
    id: l.id,
    title: l.title,
    category: l.category.label,
    categoryKey: l.category.key,
    context: [l.course, l.semester, l.subjectCode].filter(Boolean).join(" · "),
    priceLabel: l.priceType === "FREE" ? "Free" : `₹${l.price}`,
    photoUrl: l.photos[0]?.url || null,
    status: l.status,
    statusLabel: status.label,
    statusColor: status.color,
    statusTint: status.tint,
    showStatus: l.status !== "AVAILABLE",
    saved: savedIds.has(l.id),
  };
}

export function listingDetail(
  l: ListingWithRelations & { owner: { id: string; name: string; school: string; course: string; semester: string; displayMode: string; verified: boolean } },
  saved: boolean
) {
  const status = STATUS_META[l.status];
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    category: l.category.label,
    categoryKey: l.category.key,
    context: [l.course, l.semester, l.subjectCode].filter(Boolean).join(" · "),
    priceLabel: l.priceType === "FREE" ? "Free" : `₹${l.price}`,
    photos: l.photos.map((p) => p.url),
    status: l.status,
    statusLabel: status.label,
    statusColor: status.color,
    statusTint: status.tint,
    showStatus: l.status !== "AVAILABLE",
    isPassed: l.status === "PASSED",
    condition: CONDITION_LABELS[l.condition],
    conditionKey: l.condition,
    pickupSpot: l.pickupSpot,
    availability: l.availability,
    tags: l.usefulFor,
    saved,
    owner: {
      id: l.owner.id,
      name: l.owner.displayMode === "ANONYMOUS" ? "Anonymous student" : l.owner.name.split(" ")[0],
      anonymous: l.owner.displayMode === "ANONYMOUS",
      meta: `${l.owner.school} · ${l.owner.course} · ${l.owner.semester}`,
      verified: l.owner.verified,
    },
    ownerId: l.ownerId,
  };
}

export function requestCard(r: Request & { category: Category; requester: { id: string; name: string; displayMode: string; school: string; course: string; semester: string } }) {
  return {
    id: r.id,
    title: r.title,
    category: r.category.label,
    categoryKey: r.category.key,
    context: [r.school, r.course, r.semester, r.subjectCode].filter(Boolean).join(" · "),
    needBy: r.needBy,
    note: r.note,
    open: r.open,
    requesterId: r.requesterId,
    by: {
      name: r.requester.displayMode === "ANONYMOUS" ? "Anonymous student" : r.requester.name.split(" ")[0],
      anonymous: r.requester.displayMode === "ANONYMOUS",
      meta: `${r.requester.school} · ${r.requester.semester}`,
    },
  };
}
