"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";
import { Service, getServiceColumns } from "./_components/ServiceTable";
import { ServiceForm } from "./_components/ServiceForm";
import { ServiceModel } from "./_components/ServiceModel";
import { ServiceViewDialog } from "./_components/ServiceViewDialog"; 

type Category = {
  id: string;
  name: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء تحميل الخدمات");
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const handleSuccess = () => {
    fetchServices();
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (service: Service) => {
    setSelectedService(service);
    setIsViewDialogOpen(true);
  };

  const columns = getServiceColumns(handleEdit, handleDelete, handleView);

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="إدارة الخدمات"
          description="إضافة وتعديل الخدمات المتاحة"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="إدارة الخدمات"
        description="إضافة وتعديل الخدمات المتاحة"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            خدمة جديدة
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={services}
        searchKey="title"
        searchPlaceholder="البحث بالعنوان..."
        filterOptions={[
          {
            column: "category",
            title: "الفئة",
            options: categories.map((cat) => ({
              label: cat.name,
              value: cat.name,
            })),
          },
          {
            column: "isActive",
            title: "الحالة",
            options: [
              { label: "مفعلة", value: "true" },
              { label: "مخفية", value: "false" },
            ],
          },
        ]}
      />

      <ServiceForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        categories={categories}
        onSuccess={handleSuccess}
      />

      <ServiceForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        service={selectedService}
        categories={categories}
        onSuccess={handleSuccess}
      />

      <ServiceModel
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        service={selectedService}
        onSuccess={handleSuccess}
      />

      <ServiceViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        service={selectedService}
      />
    </div>
  );
}
