import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, ServiceCategory } from "../app/generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const services = [
  { key: "schnitt-damen", name: "Schnitt Damen", category: ServiceCategory.HAARE, durationMinutes: 45, priceCents: 4500 },
  { key: "schnitt-herren", name: "Schnitt Herren", category: ServiceCategory.HAARE, durationMinutes: 30, priceCents: 3000 },
  { key: "coloration", name: "Coloration", category: ServiceCategory.HAARE, durationMinutes: 90, priceCents: 7500 },
  { key: "balayage", name: "Balayage", category: ServiceCategory.HAARE, durationMinutes: 150, priceCents: 12000 },
  { key: "foehnen-styling", name: "Föhnen & Styling", category: ServiceCategory.HAARE, durationMinutes: 30, priceCents: 2500 },
  { key: "maniküre", name: "Maniküre klassisch", category: ServiceCategory.NAILS, durationMinutes: 45, priceCents: 3500 },
  { key: "gel-modellage", name: "Gel-Modellage", category: ServiceCategory.NAILS, durationMinutes: 75, priceCents: 5500 },
  { key: "nail-art", name: "Nail Art (Aufpreis)", category: ServiceCategory.NAILS, durationMinutes: 15, priceCents: 1000 },
  { key: "brows-zupfen", name: "Augenbrauen zupfen", category: ServiceCategory.BROWS, durationMinutes: 15, priceCents: 1500 },
  { key: "brow-lamination", name: "Brow Lamination", category: ServiceCategory.BROWS, durationMinutes: 45, priceCents: 3500 },
  { key: "wimpernlifting", name: "Wimpernlifting", category: ServiceCategory.BROWS, durationMinutes: 60, priceCents: 4500 },
  { key: "kopfhaut", name: "Kopfhautbehandlung", category: ServiceCategory.PFLEGE, durationMinutes: 30, priceCents: 3000 },
  { key: "haarkur", name: "Intensiv-Haarkur", category: ServiceCategory.PFLEGE, durationMinutes: 20, priceCents: 2000 },
] as const;

const staffMembers = [
  {
    key: "lena",
    name: "Lena Vogt",
    role: "Salonleitung & Coloration",
    bio: "Seit über zwölf Jahren im Handwerk zu Hause. Lena leitet das Studio und ist auf komplexe Coloration-Techniken spezialisiert.",
    serviceKeys: ["coloration", "balayage", "foehnen-styling"],
  },
  {
    key: "amara",
    name: "Amara Keller",
    role: "Hair Styling & Schnitt",
    bio: "Schneidet seit über zehn Jahren und findet für jede Kopfform den passenden Schnitt — präzise, aber nie steif.",
    serviceKeys: ["schnitt-damen", "foehnen-styling", "kopfhaut", "haarkur"],
  },
  {
    key: "nora",
    name: "Nora Islam",
    role: "Nails & Brows",
    bio: "Präzision im Detail — von natürlichen Brows bis zu aufwendigem Nail-Art, immer mit Blick fürs Ganze.",
    serviceKeys: ["maniküre", "gel-modellage", "nail-art", "brows-zupfen", "brow-lamination", "wimpernlifting"],
  },
  {
    key: "jonas",
    name: "Jonas Reimer",
    role: "Herrenschnitt & Bartpflege",
    bio: "Klassisch geschult, modern im Blick — für den Schnitt, der auch in zwei Wochen noch sitzt.",
    serviceKeys: ["schnitt-herren", "foehnen-styling"],
  },
] as const;

// Öffnungszeiten: Di–Fr 9:00–19:00, Sa 9:00–15:00, So & Mo geschlossen
const workingDays = [
  { weekday: 2, startMinute: 9 * 60, endMinute: 19 * 60 }, // Dienstag
  { weekday: 3, startMinute: 9 * 60, endMinute: 19 * 60 }, // Mittwoch
  { weekday: 4, startMinute: 9 * 60, endMinute: 19 * 60 }, // Donnerstag
  { weekday: 5, startMinute: 9 * 60, endMinute: 19 * 60 }, // Freitag
  { weekday: 6, startMinute: 9 * 60, endMinute: 15 * 60 }, // Samstag
];

async function main() {
  console.log("Lösche bestehende Daten…");
  await prisma.booking.deleteMany();
  await prisma.staffService.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.service.deleteMany();
  await prisma.staff.deleteMany();

  console.log("Lege Services an…");
  const createdServices = new Map<string, string>();
  for (const service of services) {
    const created = await prisma.service.create({
      data: {
        name: service.name,
        category: service.category,
        durationMinutes: service.durationMinutes,
        priceCents: service.priceCents,
      },
    });
    createdServices.set(service.key, created.id);
  }

  console.log("Lege Team-Mitglieder inkl. Zuordnungen an…");
  for (const member of staffMembers) {
    const createdStaff = await prisma.staff.create({
      data: { name: member.name, role: member.role, bio: member.bio },
    });

    for (const serviceKey of member.serviceKeys) {
      const serviceId = createdServices.get(serviceKey);
      if (!serviceId) continue;
      await prisma.staffService.create({
        data: { staffId: createdStaff.id, serviceId },
      });
    }

    for (const day of workingDays) {
      await prisma.workingHours.create({
        data: { staffId: createdStaff.id, ...day },
      });
    }
  }

  console.log("Seed abgeschlossen.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
