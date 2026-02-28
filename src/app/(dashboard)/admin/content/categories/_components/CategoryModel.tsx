"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Category } from "./CategoryTable";
import { toast } from "sonner";

interface CategoryModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess: () => void;
}

export function CategoryModel({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryModelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!category) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success("تم حذف الفئة بنجاح");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
    } finally {
      setIsLoading(false);
    }
  };

  if (!category) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="حذف الفئة"
      description={`هل أنت متأكد من حذف الفئة "${category.name}"؟ ${
        category.servicesCount > 0
          ? `تحذير: هذه الفئة تحتوي على ${category.servicesCount} خدمة.`
          : ""
      }`}
      confirmLabel="حذف"
      onConfirm={handleDelete}
      variant="destructive"
      isLoading={isLoading}
    />
  );
}
