import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
 
export async function GET(request: NextRequest) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(testimonials);
  } catch (error: any) {
    console.error("Error fetching public testimonials:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
