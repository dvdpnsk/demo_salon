"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function createStaff(formData: FormData) {
  const { serviceIds, ...data } = parseStaffInput(formData);

  const staff = await prisma.staff.create({ data });

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

  await prisma.staff.update({ where: { id }, data });
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
