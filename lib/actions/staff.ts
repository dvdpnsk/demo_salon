"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

function parseStaffInput(formData: FormData) {
  const name = formData.get("name");
  const role = formData.get("role");
  const bio = formData.get("bio");
  const serviceIds = formData
    .getAll("serviceIds")
    .filter((value): value is string => typeof value === "string");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof role !== "string" ||
    !role.trim()
  ) {
    throw new Error("Ungültige Eingabe");
  }

  return {
    name: name.trim(),
    role: role.trim(),
    bio: typeof bio === "string" && bio.trim() ? bio.trim() : null,
    serviceIds,
  };
}

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

async function uploadPhotoIfProvided(formData: FormData) {
  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return undefined;
  }

  const extension = ALLOWED_IMAGE_TYPES[photo.type];
  if (!extension) {
    throw new Error("Nur JPEG-, PNG- oder WebP-Bilder sind erlaubt.");
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    throw new Error("Das Bild darf höchstens 5 MB groß sein.");
  }

  // Zufälliger Dateiname + aus dem MIME-Typ abgeleitete Endung – der vom
  // Nutzer gelieferte Dateiname fließt bewusst nicht in den Blob-Key ein.
  const blob = await put(`staff/${crypto.randomUUID()}.${extension}`, photo, {
    access: "public",
    contentType: photo.type,
  });

  return blob.url;
}

export async function createStaff(formData: FormData) {
  await requireAdmin();
  const { serviceIds, ...data } = parseStaffInput(formData);
  const imageUrl = await uploadPhotoIfProvided(formData);

  const staff = await prisma.staff.create({
    data: { ...data, imageUrl: imageUrl ?? null },
  });

  if (serviceIds.length > 0) {
    await prisma.staffService.createMany({
      data: serviceIds.map((serviceId) => ({ staffId: staff.id, serviceId })),
    });
  }

  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function updateStaff(id: string, formData: FormData) {
  await requireAdmin();
  const { serviceIds, ...data } = parseStaffInput(formData);
  const imageUrl = await uploadPhotoIfProvided(formData);

  await prisma.staff.update({
    where: { id },
    data: { ...data, ...(imageUrl ? { imageUrl } : {}) },
  });

  await prisma.staffService.deleteMany({ where: { staffId: id } });

  if (serviceIds.length > 0) {
    await prisma.staffService.createMany({
      data: serviceIds.map((serviceId) => ({ staffId: id, serviceId })),
    });
  }

  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function deleteStaff(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  await prisma.staff.delete({ where: { id } });
  revalidatePath("/admin/team");
}
