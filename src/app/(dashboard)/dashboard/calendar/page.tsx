import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { PageHeader } from "@/components/common/PageHeader";
import { CalendarView } from "./_components/CalendarView";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export default async function CalendarPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "EMPLOYEE") {
    redirect("/login");
  }

  const userId = session.user.id;

  const orders = await prisma.order.findMany({
    where: {
      employeeId: userId,
      deadline: { not: null },
      status: {
        notIn: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      },
    },
    include: {
      service: {
        select: {
          title: true,
        },
      },
      student: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      deadline: "asc",
    },
  });

  return (
    <div dir="rtl">
      <PageHeader
        title="المواعيد"
        description="تقويم مواعيد التسليم النهائية"
      />
      <CalendarView orders={orders} />
    </div>
  );
}
