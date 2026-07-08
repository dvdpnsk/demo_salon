"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { ServiceCategory } from "@/app/generated/prisma/client";

function parseServiceInput(formData: FormData) {
  const name = formData.get("name");
  const category = formData.get("category");
  const durationMinutes = formData.get("durationMinutes");
  const price = formData.get("price");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof category !== "string" ||
    !(category in ServiceCategory) ||
    typeof durationMinutes !== "string" ||
    typeof price !== "string"
  ) {
    throw new Error("Ungültige Eingabe");
  }

  return {
    name: name.trim(),
    category: category as ServiceCategory,
    durationMinutes: Math.max(5, parseInt(durationMinutes, 10) || 0),
    priceCents: Math.round(parseFloat(price.replace(",", ".")) * 100) || 0,
  };
}

export async function createService(formData: FormData) {
  await requireAdmin();
  const data = parseServiceInput(formData);
  await prisma.service.create({ data });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseServiceInput(formData);
  await prisma.service.update({ where: { id }, data });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
}
