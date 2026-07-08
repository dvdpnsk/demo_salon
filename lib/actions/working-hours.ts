"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export async function updateWorkingHours(staffId: string, formData: FormData) {
  await requireAdmin();
  for (const weekday of WEEKDAYS) {
    const isOpen = formData.get(`open-${weekday}`) === "on";
    const start = formData.get(`start-${weekday}`);
    const end = formData.get(`end-${weekday}`);

    if (
      !isOpen ||
      typeof start !== "string" ||
      typeof end !== "string" ||
      !start ||
      !end
    ) {
      await prisma.workingHours.deleteMany({ where: { staffId, weekday } });
      continue;
    }

    const startMinute = timeToMinutes(start);
    const endMinute = timeToMinutes(end);

    await prisma.workingHours.upsert({
      where: { staffId_weekday: { staffId, weekday } },
      update: { startMinute, endMinute },
      create: { staffId, weekday, startMinute, endMinute },
    });
  }

  revalidatePath("/admin/arbeitszeiten");
}
