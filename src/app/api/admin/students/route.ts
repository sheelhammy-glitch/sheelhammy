import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get all students
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      include: {
        orders: {
          select: {
            id: true,
            totalPrice: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format students with stats
    const formattedStudents = students.map((student) => {
      const totalSpent = student.orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );
      const lastOrder = student.orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      return {
        id: student.id,
        name: student.name,
        whatsapp: student.whatsapp,
        phoneCountryCode: student.phoneCountryCode,
        email: student.email,
        country: student.country,
        academicLevel: student.academicLevel,
        specialization: student.specialization,
        university: student.university,
        notes: student.notes,
        totalOrders: student._count.orders,
        totalSpent,
        lastOrderDate: lastOrder
          ? new Date(lastOrder.createdAt).toISOString().split("T")[0]
          : null,
      };
    });

    return NextResponse.json(formattedStudents);
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// POST - Create new student
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, whatsapp, phoneCountryCode, email, country, academicLevel, specialization, university, notes } = body;

    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: "Name and WhatsApp are required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        name,
        whatsapp,
        phoneCountryCode: phoneCountryCode || "+962",
        email: email || null,
        country: country || null,
        academicLevel: academicLevel || null,
        specialization: specialization || null,
        university: university || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "رقم الواتساب موجود بالفعل" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create student" },
      { status: 500 }
    );
  }
}
