import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get employee services summary
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all completed orders with employee and service
    const orders = await prisma.order.findMany({
      where: {
        status: "COMPLETED",
        employeeId: { not: null },
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Get transfers for employees
    const transfers = await prisma.transfer.findMany({
      where: {
        status: "COMPLETED",
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group by employee and service
    const employeeServiceMap = new Map<string, EmployeeService>();

    orders.forEach((order) => {
      if (!order.employeeId || !order.employee) return;

      const key = `${order.employeeId}-${order.serviceId}`;
      const existing = employeeServiceMap.get(key);

      // Calculate total received from employeeProfit (not transfers, as transfers are not linked to orders)
      const received = order.employeeProfit || 0;

      if (existing) {
        existing.totalOrders += 1;
        existing.totalReceived += received;
      } else {
        // Find last transfer for this employee
        const employeeTransfers = transfers.filter(
          (t) => t.employeeId === order.employeeId
        );
        const lastTransfer = employeeTransfers[0];

        employeeServiceMap.set(key, {
          employeeId: order.employeeId,
          employeeName: order.employee.name,
          serviceId: order.serviceId,
          serviceTitle: order.service.title,
          totalOrders: 1,
          totalReceived: received,
          lastPaymentDate: lastTransfer
            ? lastTransfer.createdAt.toISOString().split("T")[0]
            : null,
        });
      }
    });

    const employeeServices = Array.from(employeeServiceMap.values());

    return NextResponse.json(employeeServices);
  } catch (error: any) {
    console.error("Error fetching employee services:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch employee services" },
      { status: 500 }
    );
  }
}

type EmployeeService = {
  employeeId: string;
  employeeName: string;
  serviceId: string;
  serviceTitle: string;
  totalOrders: number;
  totalReceived: number;
  lastPaymentDate: string | null;
};
