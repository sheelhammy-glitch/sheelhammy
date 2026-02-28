"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Clock, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";
import { OrderStatus } from "@prisma/client";

type DeadlineOrder = {
  id: string;
  orderNumber: string;
  service: string;
  studentName: string;
  status: OrderStatus;
  employeeProfit: number;
  deadline: string;
};

function calculateTimeRemaining(deadline: string) {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (hours < 0) {
    return { isOverdue: true, text: `متأخر ${Math.abs(hours)} ساعة` };
  }

  if (hours < 24) {
    return { isOverdue: false, text: `${hours} ساعة متبقية`, hours };
  }

  return {
    isOverdue: false,
    text: `${days} يوم و ${remainingHours} ساعة`,
    hours,
  };
}

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<DeadlineOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch deadlines
  useEffect(() => {
    const fetchDeadlines = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/dashboard/deadlines");
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch deadlines");
        }
        const data = await response.json();
        setDeadlines(data);
      } catch (error: any) {
        toast.error(error.message || "حدث خطأ أثناء تحميل المواعيد");
        console.error("Error fetching deadlines:", error);
        setDeadlines([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  const sortedDeadlines = [...deadlines].sort((a, b) => {
    const aTime = calculateTimeRemaining(a.deadline);
    const bTime = calculateTimeRemaining(b.deadline);
    if (aTime.isOverdue && !bTime.isOverdue) return -1;
    if (!aTime.isOverdue && bTime.isOverdue) return 1;
    return (aTime.hours || 0) - (bTime.hours || 0);
  });

  const urgentDeadlines = sortedDeadlines.filter(
    (d) => !calculateTimeRemaining(d.deadline).isOverdue && (calculateTimeRemaining(d.deadline).hours || 0) < 24
  );
  const overdueDeadlines = sortedDeadlines.filter(
    (d) => calculateTimeRemaining(d.deadline).isOverdue
  );

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="المواعيد والتقويم"
          description="تنظيم الوقت ومتابعة المواعيد النهائية"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="المواعيد والتقويم"
        description="تنظيم الوقت ومتابعة المواعيد النهائية"
      />

      {/* Urgent Alerts */}
      {urgentDeadlines.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>مواعيد عاجلة</AlertTitle>
          <AlertDescription>
            لديك {urgentDeadlines.length} طلب/طلبات تقترب مواعيدها النهائية (أقل من 24 ساعة)
          </AlertDescription>
        </Alert>
      )}

      {overdueDeadlines.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>طلبات متأخرة</AlertTitle>
          <AlertDescription>
            لديك {overdueDeadlines.length} طلب/طلبات متأخرة عن الموعد النهائي
          </AlertDescription>
        </Alert>
      )}

      {/* Deadlines List */}
      <div className="space-y-4">
        {sortedDeadlines.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">لا توجد مواعيد نهائية</p>
            </CardContent>
          </Card>
        ) : (
          sortedDeadlines.map((order) => {
          const timeInfo = calculateTimeRemaining(order.deadline);
          return (
            <Card
              key={order.id}
              className={timeInfo.isOverdue ? "border-red-500" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock
                        className={`h-5 w-5 ${
                          timeInfo.isOverdue
                            ? "text-red-500"
                            : (timeInfo.hours || 0) < 24
                            ? "text-orange-500"
                            : "text-blue-500"
                        }`}
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {order.orderNumber} - {order.service}
                        </h3>
                        <p className="text-sm text-gray-500">
                          الموعد النهائي: {formatDateTime(order.deadline)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={order.status} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ربح: {formatCurrency(order.employeeProfit)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div
                      className={`text-2xl font-bold ${
                        timeInfo.isOverdue
                          ? "text-red-600"
                          : (timeInfo.hours || 0) < 24
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    >
                      {timeInfo.text}
                    </div>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="mt-2">
                        فتح مساحة العمل
                      </Button>
                    </Link>
                  </div>
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
