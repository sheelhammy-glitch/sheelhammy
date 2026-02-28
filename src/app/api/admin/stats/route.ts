import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

// GET - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // day, month, year, custom
    const customDate = searchParams.get("date");

    // Calculate date ranges
    const now = new Date();
    let filterStart: Date;
    let filterEnd: Date;

    if (period === "custom" && customDate) {
      // Custom date: filter for that specific day
      const selectedDate = new Date(customDate);
      filterStart = new Date(selectedDate);
      filterStart.setHours(0, 0, 0, 0);
      filterEnd = new Date(selectedDate);
      filterEnd.setHours(23, 59, 59, 999);
    } else {
      // Default periods
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      
      const monthStart = new Date(now);
      monthStart.setMonth(monthStart.getMonth() - 1);
      
      const yearStart = new Date(now);
      yearStart.setFullYear(yearStart.getFullYear() - 1);

      switch (period) {
        case "day":
          filterStart = todayStart;
          filterEnd = now;
          break;
        case "month":
          filterStart = monthStart;
          filterEnd = now;
          break;
        case "year":
          filterStart = yearStart;
          filterEnd = now;
          break;
        default:
          filterStart = monthStart;
          filterEnd = now;
      }
    }

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    
    const monthStart = new Date(now);
    monthStart.setMonth(monthStart.getMonth() - 1);
    
    const yearStart = new Date(now);
    yearStart.setFullYear(yearStart.getFullYear() - 1);

    // Order counts by period
    const ordersToday = await prisma.order.count({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
    });

    const ordersWeek = await prisma.order.count({
      where: {
        createdAt: {
          gte: weekStart,
        },
      },
    });

    const ordersMonth = await prisma.order.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    });

    const ordersTotal = await prisma.order.count();

    // Order counts by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const statusCounts: Record<string, number> = {};
    ordersByStatus.forEach((item) => {
      statusCounts[item.status] = item._count.id;
    });

    // Overdue orders (deadline passed and not completed/cancelled)
    const overdueOrders = await prisma.order.findMany({
      where: {
        deadline: {
          lt: new Date(),
        },
        status: {
          notIn: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
        },
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            title: true,
          },
        },
      },
      take: 10,
      orderBy: {
        deadline: "asc",
      },
    });

    // Revenue calculations
    const revenueToday = await prisma.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: todayStart,
        },
      },
      _sum: {
        totalPrice: true,
      },
    });

    const revenueMonth = await prisma.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: monthStart,
        },
      },
      _sum: {
        totalPrice: true,
      },
    });

    const revenueYear = await prisma.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: yearStart,
        },
      },
      _sum: {
        totalPrice: true,
      },
    });

    const revenueTotal = await prisma.order.aggregate({
      where: {
        isPaid: true,
      },
      _sum: {
        totalPrice: true,
      },
    });

    // Employee profits
    const employeeProfits = await prisma.order.aggregate({
      where: {
        status: OrderStatus.COMPLETED,
      },
      _sum: {
        employeeProfit: true,
      },
    });

    // Expenses
    const expenses = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Counts
    const totalEmployees = await prisma.user.count({
      where: {
        role: "EMPLOYEE",
        isActive: true,
      },
    });

    const totalStudents = await prisma.student.count();

    const activeServices = await prisma.service.count();

    // Calculate net profit
    const netProfit =
      (revenueTotal._sum.totalPrice || 0) -
      (employeeProfits._sum.employeeProfit || 0) -
      (expenses._sum.amount || 0);

    // Get filtered revenue and orders based on period
    let filteredRevenue = 0;
    let filteredOrders = 0;

    if (period === "custom" && customDate) {
      // Calculate revenue for custom date
      const customRevenue = await prisma.order.aggregate({
        where: {
          isPaid: true,
          createdAt: {
            gte: filterStart,
            lte: filterEnd,
          },
        },
        _sum: {
          totalPrice: true,
        },
      });
      filteredRevenue = customRevenue._sum.totalPrice || 0;

      // Calculate orders for custom date
      filteredOrders = await prisma.order.count({
        where: {
          createdAt: {
            gte: filterStart,
            lte: filterEnd,
          },
        },
      });
    } else {
      switch (period) {
        case "day":
          filteredRevenue = revenueToday._sum.totalPrice || 0;
          filteredOrders = ordersToday;
          break;
        case "month":
          filteredRevenue = revenueMonth._sum.totalPrice || 0;
          filteredOrders = ordersMonth;
          break;
        case "year":
          filteredRevenue = revenueYear._sum.totalPrice || 0;
          filteredOrders = await prisma.order.count({
            where: {
              createdAt: {
                gte: yearStart,
              },
            },
          });
          break;
        default:
          filteredRevenue = revenueMonth._sum.totalPrice || 0;
          filteredOrders = ordersMonth;
      }
    }

    return NextResponse.json({
      orders: {
        total: ordersTotal,
        filtered: filteredOrders,
      },
      revenue: {
        total: revenueTotal._sum.totalPrice || 0,
        filtered: filteredRevenue,
      },
      employeeProfits: employeeProfits._sum.employeeProfit || 0,
      expenses: expenses._sum.amount || 0,
      netProfit,
      counts: {
        totalEmployees,
        totalStudents,
        activeServices,
      },
      overdueOrders: overdueOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        studentName: order.student.name,
        service: order.service.title,
        deadline: order.deadline?.toISOString().split("T")[0] || null,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
