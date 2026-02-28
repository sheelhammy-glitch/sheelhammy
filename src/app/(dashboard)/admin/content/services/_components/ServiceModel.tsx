"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Service } from "./ServiceTable";
import { toast } from "sonner";

interface ServiceModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSuccess: () => void;
}

export function ServiceModel({
  open,
  onOpenChange,
  service,
  onSuccess,
}: ServiceModelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!service) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success("تم حذف الخدمة بنجاح");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
    } finally {
      setIsLoading(false);
    }
  };

  if (!service) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="حذف الخدمة"
      description={`هل أنت متأكد من حذف الخدمة "${service.title}"؟`}
      confirmLabel="حذف"
      onConfirm={handleDelete}
      variant="destructive"
      isLoading={isLoading}
    />
  );
}
