"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Testimonial } from "./TestimonialTable";
import { toast } from "sonner";

interface TestimonialModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
  onSuccess: () => void;
}

export function TestimonialModel({
  open,
  onOpenChange,
  testimonial,
  onSuccess,
}: TestimonialModelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!testimonial) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success("تم حذف الرأي بنجاح");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
    } finally {
      setIsLoading(false);
    }
  };

  if (!testimonial) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="حذف الرأي"
      description={`هل أنت متأكد من حذف رأي "${testimonial.clientName}"؟`}
      confirmLabel="حذف"
      onConfirm={handleDelete}
      variant="destructive"
      isLoading={isLoading}
    />
  );
}
