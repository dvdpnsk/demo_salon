export interface WorkingHoursForDay {
  startMinute: number;
  endMinute: number;
}

export interface BookedRange {
  startTime: Date;
  endTime: Date;
}

interface GetAvailableSlotsParams {
  dayStart: Date;
  durationMinutes: number;
  workingHours: WorkingHoursForDay | null;
  existingBookings: BookedRange[];
  slotIntervalMinutes?: number;
  minLeadMinutes?: number;
  now?: Date;
}

export function getAvailableSlots({
  dayStart,
  durationMinutes,
  workingHours,
  existingBookings,
  slotIntervalMinutes = 15,
  minLeadMinutes = 60,
  now = new Date(),
}: GetAvailableSlotsParams): Date[] {
  if (!workingHours) return [];

  const earliestStart = new Date(now.getTime() + minLeadMinutes * 60_000);
  const slots: Date[] = [];

  for (
    let minute = workingHours.startMinute;
    minute + durationMinutes <= workingHours.endMinute;
    minute += slotIntervalMinutes
  ) {
    const slotStart = new Date(dayStart.getTime() + minute * 60_000);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60_000);

    if (slotStart < earliestStart) continue;

    const overlaps = existingBookings.some(
      (booking) => slotStart < booking.endTime && slotEnd > booking.startTime
    );
    if (overlaps) continue;

    slots.push(slotStart);
  }

  return slots;
}
