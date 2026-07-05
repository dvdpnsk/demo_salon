"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ServiceStep } from "./booking-steps/service-step";
import { StaffStep } from "./booking-steps/staff-step";
import { DateTimeStep } from "./booking-steps/datetime-step";
import { ContactStep } from "./booking-steps/contact-step";
import { SuccessStep } from "./booking-steps/success-step";

export interface ServiceOption {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  priceCents: number;
}

export interface StaffOption {
  id: string;
  name: string;
  role: string;
  serviceIds: string[];
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
}

export interface SlotChoice {
  time: string;
  staffId: string;
}

const STEPS = ["service", "staff", "datetime", "contact", "success"] as const;
type Step = (typeof STEPS)[number];

interface BookingWizardProps {
  services: ServiceOption[];
  staff: StaffOption[];
}

export function BookingWizard({ services, staff }: BookingWizardProps) {
  const [step, setStep] = useState<Step>("service");
  const [direction, setDirection] = useState(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [staffChoice, setStaffChoice] = useState<string | "any" | null>(null);
  const [slot, setSlot] = useState<SlotChoice | null>(null);
  const [customer, setCustomer] = useState<CustomerInput>({
    name: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [managementToken, setManagementToken] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) ?? null,
    [services, serviceId]
  );

  const eligibleStaff = useMemo(
    () =>
      serviceId
        ? staff.filter((member) => member.serviceIds.includes(serviceId))
        : [],
    [staff, serviceId]
  );

  function goTo(next: Step, dir: 1 | -1) {
    setDirection(dir);
    setStep(next);
  }

  async function handleSubmit() {
    if (!selectedService || !slot) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          staffId: slot.staffId,
          startTime: slot.time,
          customer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Etwas ist schiefgelaufen.");
        setSubmitting(false);
        return;
      }

      setManagementToken(data.managementToken);
      goTo("success", 1);
    } catch {
      setError("Verbindung fehlgeschlagen. Bitte versuch es erneut.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <div>
      {step !== "success" && (
        <div className="mb-10 flex items-center gap-2">
          {STEPS.slice(0, 4).map((s, index) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index <= stepIndex ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: 40 * direction }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 * direction }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === "service" && (
            <ServiceStep
              services={services}
              selectedId={serviceId}
              onSelect={(id) => {
                setServiceId(id);
                setStaffChoice(null);
                setSlot(null);
                goTo("staff", 1);
              }}
            />
          )}

          {step === "staff" && selectedService && (
            <StaffStep
              staff={eligibleStaff}
              selectedId={staffChoice}
              onSelect={(id) => {
                setStaffChoice(id);
                setSlot(null);
                goTo("datetime", 1);
              }}
              onBack={() => goTo("service", -1)}
            />
          )}

          {step === "datetime" && selectedService && staffChoice && (
            <DateTimeStep
              service={selectedService}
              staffChoice={staffChoice}
              selectedSlot={slot}
              onSelect={(chosenSlot) => {
                setSlot(chosenSlot);
                goTo("contact", 1);
              }}
              onBack={() => goTo("staff", -1)}
            />
          )}

          {step === "contact" && selectedService && slot && (
            <ContactStep
              service={selectedService}
              staffName={
                staff.find((member) => member.id === slot.staffId)?.name ?? ""
              }
              slot={slot.time}
              customer={customer}
              onChange={setCustomer}
              onSubmit={handleSubmit}
              onBack={() => goTo("datetime", -1)}
              submitting={submitting}
              error={error}
            />
          )}

          {step === "success" && (
            <SuccessStep managementToken={managementToken} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
