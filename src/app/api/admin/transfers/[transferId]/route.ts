import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// PATCH - Update transfer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ transferId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transferId } = await params;
    const body = await request.json();

    const { status, receiptImage } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (receiptImage !== undefined) updateData.receiptImage = receiptImage || null;

    const transfer = await prisma.transfer.update({
      where: { id: transferId },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(transfer);
  } catch (error: any) {
    console.error("Error updating transfer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update transfer" },
      { status: 500 }
    );
  }
}

// DELETE - Delete transfer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ transferId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transferId } = await params;

    await prisma.transfer.delete({
      where: { id: transferId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting transfer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete transfer" },
      { status: 500 }
    );
  }
}
