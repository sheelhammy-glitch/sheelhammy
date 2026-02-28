"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FAQ } from "./FAQTable";
import { toast } from "sonner";

interface FAQModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: FAQ | null;
  onSuccess: () => void;
}

export function FAQModel({
  open,
  onOpenChange,
  faq,
  onSuccess,
}: FAQModelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!faq) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success("تم حذف السؤال بنجاح");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
    } finally {
      setIsLoading(false);
    }
  };

  if (!faq) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="حذف السؤال"
      description={`هل أنت متأكد من حذف السؤال "${faq.question}"؟`}
      confirmLabel="حذف"
      onConfirm={handleDelete}
      variant="destructive"
      isLoading={isLoading}
    />
  );
}
