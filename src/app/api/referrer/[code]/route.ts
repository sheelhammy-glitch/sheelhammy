import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Verify referrer code (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const referrer = await prisma.user.findFirst({
      where: {
        referrerCode: code,
        isReferrer: true,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        referrerCode: true,
        commissionRate: true,
      },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid referrer code" },
        { status: 404 }
      );
    }

    return NextResponse.json(referrer);
  } catch (error: any) {
    console.error("Error verifying referrer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify referrer" },
      { status: 500 }
    );
  }
}
