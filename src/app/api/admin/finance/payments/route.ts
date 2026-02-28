import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get all orders with payment status
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isPaid = searchParams.get("isPaid");

    const where: any = {};
    if (isPaid !== null) where.isPaid = isPaid === "true";

    const orders = await prisma.order.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        paymentRecords: {
          orderBy: {
            paymentDate: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format orders for payments table
    const payments = await Promise.all(
      orders.map(async (order) => {
        const totalAmount = order.totalPrice - (order.discount || 0);
        const paidAmount = order.paymentRecords.reduce(
          (sum, record) => sum + record.amount,
          0
        );
        const remainingAmount = totalAmount - paidAmount;
        const isPaid = remainingAmount <= 0;

        // Get last payment date
        const lastPayment = order.paymentRecords[0];
        const lastPaymentDate = lastPayment
          ? lastPayment.paymentDate.toISOString().split("T")[0]
          : null;

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          studentName: order.student.name,
          totalAmount,
          paidAmount,
          remainingAmount,
          isPaid,
          paymentType: order.paymentType || "cash",
          paidDate: isPaid ? order.updatedAt.toISOString().split("T")[0] : null,
          lastPaymentDate,
        };
      })
    );

    return NextResponse.json(payments);
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
