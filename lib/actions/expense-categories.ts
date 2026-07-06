"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createExpenseCategory(formData: FormData) {
  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Bitte einen Namen für die Kategorie angeben.");
  }

  await prisma.expenseCategory.create({ data: { name: name.trim() } });
  revalidatePath("/admin/finanzen");
}

export async function deleteExpenseCategory(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const usageCount = await prisma.expense.count({ where: { categoryId: id } });
  if (usageCount > 0) {
    throw new Error(
      "Diese Kategorie wird noch von Ausgaben verwendet und kann nicht gelöscht werden."
    );
  }

  await prisma.expenseCategory.delete({ where: { id } });
  revalidatePath("/admin/finanzen");
}
