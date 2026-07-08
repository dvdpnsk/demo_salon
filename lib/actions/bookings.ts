"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createBooking,
  ServiceNotFoundError,
  SlotUnavailableError,
  StaffServiceMismatchError,
} from "@/lib/booking";
import { isValidEmail, isValidName, isValidPhone } from "@/lib/validation";
import { parseZonedDateTimeLocal } from "@/lib/timezone";
import { requireAdmin } from "@/lib/admin-auth";

export async function createBookingByAdmin(formData: FormData) {
  await requireAdmin();
  const serviceId = formData.get("serviceId");
  const staffId = formData.get("staffId");
  const startTimeRaw = formData.get("startTime");
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");

  if (
    typeof serviceId !== "string" ||
    typeof staffId !== "string" ||
    typeof startTimeRaw !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string"
  ) {
    throw new Error("Bitte alle Felder ausfüllen.");
  }

  if (!isValidName(name)) {
    throw new Error("Bitte einen gültigen Vor- und Nachnamen angeben.");
  }
  if (!isValidEmail(email)) {
    throw new Error("Bitte eine gültige E-Mail-Adresse angeben.");
  }
  if (!isValidPhone(phone)) {
    throw new Error("Bitte eine gültige Telefonnummer angeben.");
  }

  const startTime = parseZonedDateTimeLocal(startTimeRaw);
  if (!startTime || Number.isNaN(startTime.getTime())) {
    throw new Error("Ungültige Startzeit.");
  }

  try {
    await createBooking({
      serviceId,
      staffId,
      startTime,
      customer: { name, email, phone },
    });
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      throw new Error(
        "Dieser Zeitraum ist für diese:n Mitarbeiter:in bereits belegt."
      );
    }
    if (
      error instanceof ServiceNotFoundError ||
      error instanceof StaffServiceMismatchError
    ) {
      throw new Error("Ungültige Service-/Mitarbeiter-Kombination.");
    }
    throw error;
  }

  revalidatePath("/admin/buchungen");
  revalidatePath("/admin");
  redirect("/admin/buchungen");
}
