import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Get all public portfolio items (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const portfolio = await prisma.portfolio.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(portfolio);
  } catch (error: any) {
    console.error("Error fetching public portfolio:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
