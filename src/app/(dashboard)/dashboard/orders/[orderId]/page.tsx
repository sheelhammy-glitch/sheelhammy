"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { OrderDetail } from "@/types/dashboard";
import { TableSkeleton } from "@/components/common/Skeletons";
import { OrderStatusCard } from "./_components/OrderStatusCard";
import { OrderDeadlineCard } from "./_components/OrderDeadlineCard";
import { ClientFilesCard } from "./_components/ClientFilesCard";
import { OrderActionsCard } from "./_components/OrderActionsCard";
import { DeliverDialog } from "./_components/DeliverDialog";
import { OrderInfoCard } from "./_components/OrderInfoCard";

export default function OrderWorkspacePage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeliverDialogOpen, setIsDeliverDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch order
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/dashboard/orders/${orderId}`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch order");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error: any) {
        toast.error(error.message || "حدث خطأ أثناء تحميل الطلب");
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleStartWork = async () => {
    if (!order) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/dashboard/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IN_PROGRESS" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update order");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      toast.success("تم تحديث الحالة إلى قيد التنفيذ");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تحديث الحالة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeliver = async (files: OrderDetail["workFiles"], links: string) => {
    if (!order) return;

    setIsSubmitting(true);
    try {
      // Prepare work files
      const workFiles = files.length > 0 ? files : undefined;

      const response = await fetch(`/api/dashboard/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "DELIVERED",
          workFiles: workFiles || (links ? [{ name: "روابط التسليم", url: links }] : []),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to deliver work");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setIsDeliverDialogOpen(false);
      toast.success("تم رفع العمل بنجاح! سيتم مراجعته من قبل الأدمن");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء رفع العمل");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="مساحة عمل الطلب"
          description="جاري التحميل..."
        />
        <TableSkeleton rows={3} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="مساحة عمل الطلب"
          description="الطلب غير موجود"
        />
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">الطلب غير موجود أو ليس لديك صلاحية للوصول إليه</p>
          <Link href="/dashboard/orders">
            <Button variant="outline">العودة للقائمة</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`مساحة عمل الطلب ${order.orderNumber}`}
          description={order.service.title}
        />
        <Link href="/dashboard/orders">
          <Button variant="outline">العودة للقائمة</Button>
        </Link>
      </div>

      {/* Revision Notes */}
      {order.revisionNotes && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>ملاحظات التعديل</AlertTitle>
          <AlertDescription className="mt-2">
            {order.revisionNotes}
          </AlertDescription>
        </Alert>
      )}

      {/* Status and Deadline Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <OrderStatusCard order={order} />
        <OrderDeadlineCard order={order} />
      </div>

      {/* Order Info Card */}
      <OrderInfoCard order={order} />

      {/* Client Files */}
      <ClientFilesCard order={order} />

      {/* Actions */}
      <OrderActionsCard
        order={order}
        onStartWork={handleStartWork}
        onDeliver={() => setIsDeliverDialogOpen(true)}
        isLoading={isSubmitting}
      />

      {/* Deliver Dialog */}
      <DeliverDialog
        open={isDeliverDialogOpen}
        onOpenChange={setIsDeliverDialogOpen}
        onDeliver={handleDeliver}
        isLoading={isSubmitting}
      />
    </div>
  );
}
