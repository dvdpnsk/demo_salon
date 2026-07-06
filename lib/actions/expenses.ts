"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createExpense(formData: FormData) {
  const categoryId = formData.get("categoryId");
  const note = formData.get("note");
  const amount = formData.get("amount");
  const date = formData.get("date");

  if (
    typeof categoryId !== "string" ||
    !categoryId ||
    typeof amount !== "string" ||
    typeof date !== "string"
  ) {
    throw new Error("Bitte alle Felder ausfüllen.");
  }

  await prisma.expense.create({
    data: {
      categoryId,
      note: typeof note === "string" && note.trim() ? note.trim() : null,
      amountCents: Math.round(parseFloat(amount.replace(",", ".")) * 100) || 0,
      date: new Date(date),
    },
  });

  revalidatePath("/admin/finanzen");
}

export async function deleteExpense(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/admin/finanzen");
}
