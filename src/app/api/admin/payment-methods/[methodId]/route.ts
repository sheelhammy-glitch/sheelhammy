import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// PATCH - Update payment method
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ methodId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { methodId } = await params;
    const body = await request.json();

    const { label, enabled } = body;

    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (enabled !== undefined) updateData.enabled = enabled;

    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: methodId },
      data: updateData,
    });

    return NextResponse.json(paymentMethod);
  } catch (error: any) {
    console.error("Error updating payment method:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update payment method" },
      { status: 500 }
    );
  }
}

// DELETE - Delete payment method
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ methodId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { methodId } = await params;

    await prisma.paymentMethod.delete({
      where: { id: methodId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete payment method" },
      { status: 500 }
    );
  }
}
