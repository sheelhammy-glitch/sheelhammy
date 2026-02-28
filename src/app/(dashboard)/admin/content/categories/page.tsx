"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";
import { Category, getCategoryColumns } from "./_components/CategoryTable";
import { CategoryForm } from "./_components/CategoryForm";
import { CategoryModel } from "./_components/CategoryModel";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء تحميل الفئات");
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSuccess = () => {
    fetchCategories();
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const columns = getCategoryColumns(handleEdit, handleDelete);

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="إدارة الفئات"
          description="إدارة فئات الخدمات"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="إدارة الفئات"
        description="إدارة فئات الخدمات"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            فئة جديدة
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="البحث باسم الفئة..."
      />

      <CategoryForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleSuccess}
      />

      <CategoryForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />

      <CategoryModel
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
