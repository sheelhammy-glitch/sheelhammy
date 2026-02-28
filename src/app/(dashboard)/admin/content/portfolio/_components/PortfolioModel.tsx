"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PortfolioItem } from "./PortfolioTable";
import { toast } from "sonner";

interface PortfolioModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioItem: PortfolioItem | null;
  onSuccess: () => void;
}

export function PortfolioModel({
  open,
  onOpenChange,
  portfolioItem,
  onSuccess,
}: PortfolioModelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!portfolioItem) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/portfolio/${portfolioItem.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success("تم حذف النموذج بنجاح");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
    } finally {
      setIsLoading(false);
    }
  };

  if (!portfolioItem) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="حذف النموذج"
      description={`هل أنت متأكد من حذف النموذج "${portfolioItem.title}"؟`}
      confirmLabel="حذف"
      onConfirm={handleDelete}
      variant="destructive"
      isLoading={isLoading}
    />
  );
}
