import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get single student with orders
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId } = await params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        orders: {
          include: {
            service: true,
            employee: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch student" },
      { status: 500 }
    );
  }
}

// PATCH - Update student
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId } = await params;
    const body = await request.json();

    const { name, whatsapp, phoneCountryCode, email, country, academicLevel, specialization, university, notes } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (phoneCountryCode !== undefined) updateData.phoneCountryCode = phoneCountryCode;
    if (email !== undefined) updateData.email = email || null;
    if (country !== undefined) updateData.country = country || null;
    if (academicLevel !== undefined) updateData.academicLevel = academicLevel || null;
    if (specialization !== undefined) updateData.specialization = specialization || null;
    if (university !== undefined) updateData.university = university || null;
    if (notes !== undefined) updateData.notes = notes || null;

    const student = await prisma.student.update({
      where: { id: studentId },
      data: updateData,
    });

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("Error updating student:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "رقم الواتساب موجود بالفعل" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId } = await params;

    // Check if student has orders
    const orderCount = await prisma.order.count({
      where: { studentId },
    });

    if (orderCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete student with existing orders" },
        { status: 400 }
      );
    }

    await prisma.student.delete({
      where: { id: studentId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete student" },
      { status: 500 }
    );
  }
}
