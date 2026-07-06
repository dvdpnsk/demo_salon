"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

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

async function uploadPhotoIfProvided(formData: FormData) {
  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return undefined;
  }

  const blob = await put(`staff/${crypto.randomUUID()}-${photo.name}`, photo, {
    access: "public",
  });

  return blob.url;
}

export async function createStaff(formData: FormData) {
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
  const id = formData.get("id");
  if (typeof id !== "string") return;
  await prisma.staff.delete({ where: { id } });
  revalidatePath("/admin/team");
}
