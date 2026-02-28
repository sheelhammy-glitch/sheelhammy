"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FAQ, getFAQColumns } from "./_components/FAQTable";
import { FAQForm } from "./_components/FAQForm";
import { FAQModel } from "./_components/FAQModel";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  const fetchFAQs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/faqs");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch FAQs");
      }
      const data = await response.json();
      setFaqs(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "حدث خطأ أثناء تحميل الأسئلة الشائعة";
      toast.error(errorMessage);
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchFAQs();
  };

  const columns = getFAQColumns(handleEdit, handleDelete);

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="الأسئلة الشائعة"
          description="إدارة الأسئلة الشائعة وإجاباتها"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="الأسئلة الشائعة"
        description="إدارة الأسئلة الشائعة وإجاباتها"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            سؤال جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={faqs}
        searchKey="question"
        searchPlaceholder="البحث بالسؤال..."
      />

      <FAQForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleSuccess}
      />

      <FAQForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        faq={selectedFAQ}
        onSuccess={handleSuccess}
      />

      <FAQModel
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        faq={selectedFAQ}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
