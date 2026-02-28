import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
 
export async function GET(request: NextRequest) {
  try { 
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          platformDescription: "",
        },
      });
    }
 
    return NextResponse.json({
      platformName: settings.platformName,
      platformDescription: settings.platformDescription,
      currency: settings.currency,
      workingHoursStart: settings.workingHoursStart,
      workingHoursEnd: settings.workingHoursEnd,
      siteTitle: settings.siteTitle,
      siteDescription: settings.siteDescription,
      siteKeywords: settings.siteKeywords,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      defaultFreeRevisions: settings.defaultFreeRevisions,
      cancellationPolicy: settings.cancellationPolicy,
    });
  } catch (error: any) {
    console.error("Error fetching public settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
