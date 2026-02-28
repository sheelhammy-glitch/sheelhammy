import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Get all public FAQs (no auth required)
export async function GET(request: NextRequest) {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(faqs);
  } catch (error: any) {
    console.error("Error fetching public FAQs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}
