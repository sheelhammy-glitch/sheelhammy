import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET - Get single employee
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { employeeId } = await params;

    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      include: {
        assignedJobs: {
          include: {
            service: true,
            student: true,
          },
        },
        transfers: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            assignedJobs: true,
          },
        },
      },
    });

    if (!employee || employee.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Calculate stats
    const completedOrders = await prisma.order.count({
      where: {
        employeeId: employee.id,
        status: "COMPLETED",
      },
    });

    const totalProfit = await prisma.order.aggregate({
      where: {
        employeeId: employee.id,
        status: "COMPLETED",
      },
      _sum: {
        employeeProfit: true,
      },
    });

    return NextResponse.json({
      ...employee,
      stats: {
        currentLoad: employee.assignedJobs.filter(
          (job) => !["COMPLETED", "CANCELLED"].includes(job.status)
        ).length,
        totalOrders: completedOrders,
        totalProfit: totalProfit._sum.employeeProfit || 0,
      },
    });
  } catch (error: any) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

// PATCH - Update employee
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { employeeId } = await params;
    const body = await request.json();

    const { name, email, phone, phoneCountryCode, defaultProfitRate, isActive, country, specialization, services, academicLevels, isReferrer, referrerCode, commissionRate } = body;

    // Generate referrer code if isReferrer is true and code is empty
    let finalReferrerCode = referrerCode;
    if (isReferrer !== undefined && isReferrer && !referrerCode) {
      // Get current employee name to generate code
      const currentEmployee = await prisma.user.findUnique({
        where: { id: employeeId },
        select: { name: true },
      });
      if (currentEmployee) {
        const namePart = (name || currentEmployee.name).replace(/\s/g, "").substring(0, 3).toUpperCase();
        const randomPart = Math.floor(100 + Math.random() * 900);
        finalReferrerCode = `${namePart}${randomPart}`;
      }
    } else if (isReferrer !== undefined && !isReferrer) {
      finalReferrerCode = null;
    }

    // Update user
    const userUpdateData: any = {};
    if (name !== undefined) userUpdateData.name = name;
    if (email !== undefined) userUpdateData.email = email;
    if (phone !== undefined) userUpdateData.phone = phone;
    if (phoneCountryCode !== undefined) userUpdateData.phoneCountryCode = phoneCountryCode;
    if (defaultProfitRate !== undefined) userUpdateData.defaultProfitRate = defaultProfitRate || null;
    if (isActive !== undefined) userUpdateData.isActive = isActive;
    if (country !== undefined) userUpdateData.country = country || null;
    if (specialization !== undefined) userUpdateData.specialization = specialization || null;
    if (services !== undefined) userUpdateData.services = services || null;
    if (academicLevels !== undefined) userUpdateData.academicLevels = academicLevels || null;
    if (isReferrer !== undefined) {
      userUpdateData.isReferrer = isReferrer;
      userUpdateData.referrerCode = isReferrer ? (finalReferrerCode || null) : null;
      userUpdateData.commissionRate = isReferrer ? (commissionRate || null) : null;
    } else if (referrerCode !== undefined) {
      userUpdateData.referrerCode = finalReferrerCode;
    }
    if (commissionRate !== undefined && isReferrer !== false) {
      userUpdateData.commissionRate = commissionRate || null;
    }

    const employee = await prisma.user.update({
      where: { id: employeeId },
      data: userUpdateData,
    });

    return NextResponse.json(employee);
  } catch (error: any) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE - Delete employee (soft delete by setting isActive to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { employeeId } = await params;

    // Check if employee has active orders
    const activeOrders = await prisma.order.count({
      where: {
        employeeId,
        status: {
          notIn: ["COMPLETED", "CANCELLED"],
        },
      },
    });

    if (activeOrders > 0) {
      return NextResponse.json(
        { error: "Cannot delete employee with active orders" },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.user.update({
      where: { id: employeeId },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Employee deactivated successfully" });
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
