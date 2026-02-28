import { prisma } from "@/lib/db";
 
export async function getSettings() {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
            platformName: "شيل همي",
            siteTitle: null,
            siteDescription: null,
            siteKeywords: null,
            contactEmail: null,
            contactPhone: null,
            defaultFreeRevisions: 2,
            cancellationPolicy: null,
            currency: "JOD",
            workingHoursStart: "09:00",
            workingHoursEnd: "17:00",
            platformDescription: "",
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    
    return {
      platformName: "شيل همي",
      siteTitle: null,
      siteDescription: null,
      siteKeywords: null,
    };
  }
}
