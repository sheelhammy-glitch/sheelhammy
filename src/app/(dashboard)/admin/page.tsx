"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Package,
  CreditCard,
  Loader2,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";

type Stats = {
  orders: {
    total: number;
    filtered: number;
  };
  revenue: {
    total: number;
    filtered: number;
  };
  employeeProfits: number;
  expenses: number;
  netProfit: number;
  counts: {
    totalEmployees: number;
    totalStudents: number;
    activeServices: number;
  };
  overdueOrders: Array<{
    id: string;
    orderNumber: string;
    studentName: string;
    service: string;
    deadline: string | null;
  }>;
};

type DateFilterType = "day" | "month" | "year" | "custom";

export default function AdminPage() {
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>("month");
  const [customDate, setCustomDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    fetchStats();
  }, [dateFilterType, customDate]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/stats?period=${dateFilterType}`;
      if (dateFilterType === "custom") {
        url += `&date=${customDate}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء تحميل الإحصائيات");
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFilter = (type: DateFilterType) => {
    setDateFilterType(type);
    if (type !== "custom") {
      setCustomDate(new Date().toISOString().split("T")[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="لوحة التحكم"
          description="نظرة سريعة على صحة الشغل"
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="لوحة التحكم"
          description="نظرة سريعة على صحة الشغل"
        />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>
            فشل تحميل الإحصائيات. يرجى المحاولة مرة أخرى.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PageHeader
          title="لوحة التحكم"
          description="نظرة سريعة على الإحصائيات"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant={dateFilterType === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("day")}
            >
              اليوم
            </Button>
            <Button
              variant={dateFilterType === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("month")}
            >
              الشهر
            </Button>
            <Button
              variant={dateFilterType === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("year")}
            >
              السنة
            </Button>
            <Button
              variant={dateFilterType === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("custom")}
            >
              <Calendar className="h-4 w-4 ml-2" />
              يوم محدد
            </Button>
          </div>
          {dateFilterType === "custom" && (
            <Input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-[180px]"
            />
          )}
        </div>
      </div>

      {/* تنبيهات عاجلة */}
      {stats.overdueOrders.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>تنبيهات عاجلة</AlertTitle>
          <AlertDescription>
            {stats.overdueOrders.length} طلب متأخر (Overdue) يحتاج متابعة فورية
            <Link href="/admin/orders?filter=overdue">
              <Button variant="link" className="p-0 h-auto mr-2">
                عرض التفاصيل
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* المالية */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي المقبوضات"
          value={formatCurrency(stats.revenue.filtered, settings?.currency || "JOD")}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="أرباح الموظفين"
          value={formatCurrency(stats.employeeProfits, settings?.currency || "JOD")}
          icon={Users}
          variant="info"
        />
        <StatCard
          title="المصاريف"
          value={formatCurrency(stats.expenses, settings?.currency || "JOD")}
          icon={CreditCard}
          variant="warning"
        />
        <StatCard
          title="صافي الربح"
          value={formatCurrency(stats.netProfit, settings?.currency || "JOD")}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* الإحصائيات العامة */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="الطلبات"
          value={stats.orders.filtered || stats.orders.total}
          icon={ShoppingCart}
        />
        <StatCard
          title="الموظفين"
          value={stats.counts.totalEmployees}
          icon={Users}
        />
        <StatCard
          title="الطلاب"
          value={stats.counts.totalStudents}
          icon={Users}
        />
        <StatCard
          title="الخدمات النشطة"
          value={stats.counts.activeServices}
          icon={Package}
        />
      </div>

      {/* الطلبات المتأخرة */}
      {stats.overdueOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>الطلبات المتأخرة</CardTitle>
            <CardDescription>طلبات تجاوزت موعد التسليم النهائي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.overdueOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.studentName} - {order.service}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">موعد التسليم</p>
                    <p className="font-semibold text-red-600">{order.deadline || "غير محدد"}</p>
                  </div>
                  <Link href={`/admin/orders?orderId=${order.id}`}>
                    <Button variant="outline" size="sm">
                      عرض التفاصيل
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* نظرة عامة */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="الموظفين النشطين"
          value={stats.counts.totalEmployees}
          icon={Users}
        />
        <StatCard
          title="الطلاب"
          value={stats.counts.totalStudents}
          icon={Users}
        />
        <StatCard
          title="الخدمات النشطة"
          value={stats.counts.activeServices}
          icon={Package}
        />
      </div>
    </div>
  );
}
