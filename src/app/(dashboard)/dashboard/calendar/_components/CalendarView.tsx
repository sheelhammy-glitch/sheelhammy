"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";

interface Order {
  id: string;
  orderNumber: string;
  deadline: Date | null;
  status: OrderStatus;
  service: {
    title: string;
  };
  student: {
    id: string;
    name: string;
  };
}

interface CalendarViewProps {
  orders: Order[];
}

export function CalendarView({ orders }: CalendarViewProps) {
  const [filter, setFilter] = useState<"all" | "today" | "week" | "overdue">("all");

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekFromNow = new Date(now);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const filteredOrders = orders.filter((order) => {
    if (!order.deadline) return false;
    const deadline = order.deadline instanceof Date ? order.deadline : new Date(order.deadline);

    if (filter === "overdue") {
      return deadline < now;
    }
    if (filter === "today") {
      return deadline.toDateString() === now.toDateString();
    }
    if (filter === "week") {
      return deadline <= weekFromNow && deadline >= now;
    }
    return true;
  });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!order.deadline) return acc;
    const deadlineDate = order.deadline instanceof Date ? order.deadline : new Date(order.deadline);
    const dateKey = deadlineDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setFilter("today")}
          className={`px-4 py-2 rounded-lg ${
            filter === "today"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          اليوم
        </button>
        <button
          onClick={() => setFilter("week")}
          className={`px-4 py-2 rounded-lg ${
            filter === "week"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          هذا الأسبوع
        </button>
        <button
          onClick={() => setFilter("overdue")}
          className={`px-4 py-2 rounded-lg ${
            filter === "overdue"
              ? "bg-red-600 text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          متأخرة
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {Object.keys(groupedOrders).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">لا توجد مواعيد</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedOrders)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, dateOrders]) => {
              const isOverdue = new Date(date) < now;
              const isToday = new Date(date).toDateString() === now.toDateString();

              return (
                <Card key={date}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {isOverdue ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : isToday ? (
                        <Clock className="h-5 w-5 text-orange-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {new Date(date).toLocaleDateString("ar-EG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      <Badge variant={isOverdue ? "destructive" : isToday ? "warning" : "default"}>
                        {dateOrders.length} طلب
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dateOrders.map((order) => {
                        if (!order.deadline) return null;
                        const deadlineDate = order.deadline instanceof Date ? order.deadline : new Date(order.deadline);
                        const isOverdue = deadlineDate < new Date();
                        return (
                          <Link
                            key={order.id}
                            href={`/dashboard/orders/${order.id}`}
                            className="block p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <code className="text-sm font-mono">
                                    {order.orderNumber}
                                  </code>
                                  {isOverdue && (
                                    <Badge variant="destructive" className="text-xs">
                                      متأخر
                                    </Badge>
                                  )}
                                </div>
                                <p className="font-medium mt-1">{order.service.title}</p>
                                <p className="text-sm text-gray-500">
                                  {order.student.name}
                                </p>
                                {order.deadline && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDateTime(deadlineDate)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })
        )}
      </div>
    </div>
  );
}
