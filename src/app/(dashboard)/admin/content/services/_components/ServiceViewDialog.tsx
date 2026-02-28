"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Service } from "./ServiceTable";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ARAB_COUNTRIES } from "@/lib/countries";

type ServiceDetail = {
  id: string;
  title: string;
  shortDescription?: string | null;
  description: string;
  detailedDescription?: string | null;
  image: string | null;
  priceGuideline: number | null;
  features?: string | string[] | null;
  countries?: string | string[] | null;
  isActive?: boolean;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
  };
};

interface ServiceViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

export function ServiceViewDialog({
  open,
  onOpenChange,
  service,
}: ServiceViewDialogProps) {
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && service) {
      fetchServiceDetail();
    } else {
      setServiceDetail(null);
    }
  }, [open, service]);

  const fetchServiceDetail = async () => {
    if (!service) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/services/${service.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch service details");
      }
      const data = await response.json();
      
      // Parse JSON fields
      let parsedFeatures: string[] = [];
      if (data.features) {
        if (typeof data.features === 'string') {
          try {
            parsedFeatures = JSON.parse(data.features);
          } catch {
            parsedFeatures = [];
          }
        } else if (Array.isArray(data.features)) {
          parsedFeatures = data.features;
        }
      }

      let parsedCountries: string[] = [];
      if (data.countries) {
        if (typeof data.countries === 'string') {
          try {
            parsedCountries = JSON.parse(data.countries);
          } catch {
            parsedCountries = [];
          }
        } else if (Array.isArray(data.countries)) {
          parsedCountries = data.countries;
        }
      }

      setServiceDetail({
        ...data,
        features: parsedFeatures,
        countries: parsedCountries,
      });
    } catch (error) {
      console.error("Error fetching service detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!service) return null;

  const getCountryName = (code: string) => {
    return ARAB_COUNTRIES.find(c => c.code === code)?.name || code;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" dir="rtl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>تفاصيل الخدمة</DialogTitle>
          <DialogDescription>
            عرض جميع المعلومات المتعلقة بالخدمة
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : serviceDetail ? (
          <div className="space-y-4 py-4 overflow-y-auto flex-1">
            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الخدمة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{serviceDetail.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الفئة</p>
                    <Badge variant="outline" className="mt-1">
                      {serviceDetail.category.name}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">حالة الخدمة</p>
                    <StatusBadge status={serviceDetail.isActive ? "ACTIVE" : "INACTIVE"} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">السعر الاسترشادي</p>
                    <p className="font-semibold">
                      {serviceDetail.priceGuideline
                        ? formatCurrency(serviceDetail.priceGuideline)
                        : "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">تاريخ الإنشاء</p>
                    <p className="font-semibold">{formatDateTime(serviceDetail.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">آخر تحديث</p>
                    <p className="font-semibold">{formatDateTime(serviceDetail.updatedAt)}</p>
                  </div>
                </div>
                {serviceDetail.shortDescription && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">الوصف المختصر</p>
                    <p className="text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      {serviceDetail.shortDescription}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">الوصف</p>
                  <p className="text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    {serviceDetail.description}
                  </p>
                </div>
                {serviceDetail.detailedDescription && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">الوصف التفصيلي</p>
                    <p className="text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      {serviceDetail.detailedDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image */}
            {serviceDetail.image && (
              <Card>
                <CardHeader>
                  <CardTitle>صورة الخدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <Image
                      src={serviceDetail.image}
                      alt={serviceDetail.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {Array.isArray(serviceDetail.features) && serviceDetail.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>الميزات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {serviceDetail.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        <span className="text-sm">• {feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Countries */}
            {Array.isArray(serviceDetail.countries) && serviceDetail.countries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>الدول المتاحة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {serviceDetail.countries.map((countryCode, index) => (
                      <Badge key={index} variant="outline">
                        {getCountryName(countryCode)}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {serviceDetail.countries.length} دولة متاحة
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            {serviceDetail._count && (
              <Card>
                <CardHeader>
                  <CardTitle>الإحصائيات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">عدد الطلبات</p>
                      <p className="text-2xl font-bold">{serviceDetail._count.orders || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            فشل تحميل تفاصيل الخدمة
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
