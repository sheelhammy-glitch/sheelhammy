"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Service } from "./ServiceTable";
import { toast } from "sonner";
import { FileUploader } from "@/components/common/FileUploader";
import { Checkbox } from "@/components/ui/checkbox";
import { ARAB_COUNTRIES } from "@/lib/countries";

type Category = {
  id: string;
  name: string;
};

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  categories: Category[];
  onSuccess: () => void;
}

export function ServiceForm({
  open,
  onOpenChange,
  service,
  categories,
  onSuccess,
}: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    categoryId: "",
    priceGuideline: "",
    image: "",
    isActive: true,
  });

  useEffect(() => {
    if (open && service) {
      // Fetch full service data when editing
      fetchServiceData();
    } else if (open && !service) {
      // Create mode - reset form
      setFormData({
        title: "",
        shortDescription: "",
        description: "",
        categoryId: "",
        priceGuideline: "",
        image: "",
        isActive: true,
      });
      setFeatures([]);
      setCountries([]);
      setNewFeature("");
    }
  }, [service, open]);

  const fetchServiceData = async () => {
    if (!service) return;
    
    setIsLoadingData(true);
    try {
      const response = await fetch(`/api/admin/services/${service.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch service data");
      }
      const serviceData = await response.json();
      
      // Parse features if it's a JSON string
      let parsedFeatures: string[] = [];
      if (serviceData.features) {
        if (typeof serviceData.features === 'string') {
          try {
            parsedFeatures = JSON.parse(serviceData.features);
          } catch {
            parsedFeatures = [];
          }
        } else if (Array.isArray(serviceData.features)) {
          parsedFeatures = serviceData.features;
        }
      }

      // Parse countries if it's a JSON string
      let parsedCountries: string[] = [];
      if (serviceData.countries) {
        if (typeof serviceData.countries === 'string') {
          try {
            parsedCountries = JSON.parse(serviceData.countries);
          } catch {
            parsedCountries = [];
          }
        } else if (Array.isArray(serviceData.countries)) {
          parsedCountries = serviceData.countries;
        }
      }

      setFormData({
        title: serviceData.title || "",
        shortDescription: serviceData.shortDescription || "",
        description: serviceData.description || "",
        categoryId: serviceData.categoryId || serviceData.category?.id || "",
        priceGuideline: serviceData.priceGuideline?.toString() || "",
        image: serviceData.image || "",
        isActive: serviceData.isActive !== undefined ? serviceData.isActive : true,
      });
      setFeatures(parsedFeatures);
      setCountries(parsedCountries);
    } catch (error) {
      console.error("Error fetching service data:", error);
      toast.error("فشل تحميل بيانات الخدمة");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = service
        ? `/api/admin/services/${service.id}`
        : "/api/admin/services";
      const method = service ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          shortDescription: formData.shortDescription || null,
          description: formData.description,
          categoryId: formData.categoryId,
          priceGuideline: formData.priceGuideline || null,
          image: formData.image || null,
          features: features.length > 0 ? features : null,
          isActive: formData.isActive,
          countries: countries.length > 0 ? countries : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success(
        service ? "تم تحديث الخدمة بنجاح" : "تم إضافة الخدمة بنجاح"
      );
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        dir="rtl"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {service ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
          </DialogTitle>
          <DialogDescription>
            {service
              ? `تعديل بيانات الخدمة ${service.title}`
              : "إضافة خدمة جديدة إلى الموقع"}
          </DialogDescription>
        </DialogHeader>
        {isLoadingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-gray-500">جاري تحميل البيانات...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="space-y-4 py-4 flex-1 overflow-y-auto pr-1">
            <div>
              <Label>العنوان</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="عنوان الخدمة"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label>الفئة</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
                required
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>الوصف المختصر (للكارد)</Label>
              <Textarea
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                placeholder="وصف مختصر يظهر في الكارد..."
                rows={2}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                وصف مختصر يظهر في بطاقة الخدمة (اختياري)
              </p>
            </div>
            <div>
              <Label>الوصف التفصيلي</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="وصف تفصيلي للخدمة..."
                rows={4}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label>السعر الاسترشادي (اختياري)</Label>
              <Input
                type="number"
                value={formData.priceGuideline}
                onChange={(e) =>
                  setFormData({ ...formData, priceGuideline: e.target.value })
                }
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            <div>
              <FileUploader
                value={formData.image || undefined}
                onChange={(url) =>
                  setFormData({ ...formData, image: url as string || "" })
                }
                accept="image/*"
                multiple={false}
                maxSize={5}
                label="صورة الخدمة (اختياري)"
                description="يمكنك رفع صورة للخدمة (حد أقصى 5 ميجابايت)"
                disabled={isLoading}
                type="image"
              />
            </div>
            <div>
              <Label>الميزات (اختياري)</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="أضف ميزة جديدة..."
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newFeature.trim()) {
                        e.preventDefault();
                        setFeatures([...features, newFeature.trim()]);
                        setNewFeature("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newFeature.trim()) {
                        setFeatures([...features, newFeature.trim()]);
                        setNewFeature("");
                      }
                    }}
                    disabled={isLoading || !newFeature.trim()}
                  >
                    إضافة
                  </Button>
                </div>
                {features.length > 0 && (
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        <span className="flex-1 text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFeatures(features.filter((_, i) => i !== index));
                          }}
                          disabled={isLoading}
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>الدول المتاحة (اختياري)</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                  {ARAB_COUNTRIES.map((country) => (
                    <div key={country.code} className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        id={`country-${country.code}`}
                        checked={countries.includes(country.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCountries([...countries, country.code]);
                          } else {
                            setCountries(countries.filter((c) => c !== country.code));
                          }
                        }}
                        className="rounded"
                        disabled={isLoading}
                      />
                      <Label htmlFor={`country-${country.code}`} className="cursor-pointer text-sm">
                          {country.name}
                        </Label>
                    </div>
                  ))}
                </div>
                {countries.length > 0 && (
                  <p className="text-xs text-gray-500">
                    تم اختيار {countries.length} دولة
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
                disabled={isLoading}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                الخدمة مفعلة (ستظهر في الموقع)
              </Label>
            </div>
            </div>
            <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : service ? "حفظ" : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
