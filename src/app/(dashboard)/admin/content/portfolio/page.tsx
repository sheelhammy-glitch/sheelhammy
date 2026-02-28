"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  PortfolioItem,
  getPortfolioColumns,
} from "./_components/PortfolioTable";
import { PortfolioForm } from "./_components/PortfolioForm";
import { PortfolioModel } from "./_components/PortfolioModel";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/portfolio");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch portfolio");
      }
      const data = await response.json();
      setPortfolio(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "حدث خطأ أثناء تحميل النماذج";
      toast.error(errorMessage);
      console.error("Error fetching portfolio:", error);
      setPortfolio([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleEdit = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchPortfolio();
  };

  const columns = getPortfolioColumns(handleEdit, handleDelete);

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="النماذج"
          description="إدارة نماذج الأعمال السابقة"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="النماذج"
        description="إدارة نماذج الأعمال السابقة"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            نموذج جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={portfolio}
        searchKey="title"
        searchPlaceholder="البحث بالعنوان..."
        filterOptions={[
          {
            column: "academicLevel",
            title: "المرحلة الدراسية",
            options: [
              { label: "مدرسة", value: "school" },
              { label: "دبلوم", value: "diploma" },
              { label: "بكالوريوس", value: "bachelor" },
              { label: "ماجستير", value: "master" },
              { label: "دكتوراه", value: "phd" },
            ],
          },
        ]}
      />

      <PortfolioForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleSuccess}
      />

      <PortfolioForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        portfolioItem={selectedItem}
        onSuccess={handleSuccess}
      />

      <PortfolioModel
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        portfolioItem={selectedItem}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
