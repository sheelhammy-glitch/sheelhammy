import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get all payment methods
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(paymentMethods);
  } catch (error: any) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}

// POST - Create new payment method
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, label, enabled } = body;

    if (!code || !label) {
      return NextResponse.json(
        { error: "Code and label are required" },
        { status: 400 }
      );
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        code,
        label,
        enabled: enabled !== undefined ? enabled : true,
      },
    });

    return NextResponse.json(paymentMethod, { status: 201 });
  } catch (error: any) {
    console.error("Error creating payment method:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Payment method code already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create payment method" },
      { status: 500 }
    );
  }
}
