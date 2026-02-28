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
import { Employee } from "./EmployeeTable";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { ARAB_COUNTRIES, ACADEMIC_LEVELS, getWhatsAppLink } from "@/lib/countries";

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
  onSuccess: () => void;
}

export function EmployeeForm({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Array<{ id: string; title: string }>>([]);
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    phoneCountryCode: (employee as any)?.phoneCountryCode || "+962",
    password: "",
    defaultProfitRate: (employee as any)?.defaultProfitRate || null,
    country: (employee as any)?.country || "",
    specialization: (employee as any)?.specialization || "",
    services: [] as string[],
    academicLevels: [] as string[],
    isReferrer: (employee as any)?.isReferrer || false,
    referrerCode: (employee as any)?.referrerCode || "",
    commissionRate: (employee as any)?.commissionRate || null,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/admin/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (open) {
      if (employee) {
        const emp = employee as any;
        // Parse JSON fields if they are strings
        let servicesArray: string[] = [];
        if (emp.services) {
          if (Array.isArray(emp.services)) {
            servicesArray = emp.services;
          } else if (typeof emp.services === 'string') {
            try {
              servicesArray = JSON.parse(emp.services);
            } catch {
              servicesArray = [];
            }
          }
        }

        let academicLevelsArray: string[] = [];
        if (emp.academicLevels) {
          if (Array.isArray(emp.academicLevels)) {
            academicLevelsArray = emp.academicLevels;
          } else if (typeof emp.academicLevels === 'string') {
            try {
              academicLevelsArray = JSON.parse(emp.academicLevels);
            } catch {
              academicLevelsArray = [];
            }
          }
        }

        setFormData({
          name: employee.name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          phoneCountryCode: emp.phoneCountryCode || "+962",
          password: "",
          defaultProfitRate: emp.defaultProfitRate ?? null,
          country: emp.country || "",
          specialization: emp.specialization || "",
          services: servicesArray,
          academicLevels: academicLevelsArray,
          isReferrer: emp.isReferrer || false,
          referrerCode: emp.referrerCode || "",
          commissionRate: emp.commissionRate ?? null,
        });
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          phoneCountryCode: "+962",
          password: "",
          defaultProfitRate: null,
          country: "",
          specialization: "",
          services: [],
          academicLevels: [],
          isReferrer: false,
          referrerCode: "",
          commissionRate: null,
        });
      }
    }
  }, [employee, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = employee
        ? `/api/admin/employees/${employee.id}`
        : "/api/admin/employees";
      const method = employee ? "PATCH" : "POST";

      // Generate referrer code if isReferrer is true and code is empty
      let referrerCode = formData.referrerCode;
      if (formData.isReferrer && !referrerCode) {
        // Generate code from name (first 3 letters + random 3 numbers)
        const namePart = formData.name.replace(/\s/g, "").substring(0, 3).toUpperCase();
        const randomPart = Math.floor(100 + Math.random() * 900);
        referrerCode = `${namePart}${randomPart}`;
      } else if (!formData.isReferrer) {
        referrerCode = null;
      }

      const body: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        phoneCountryCode: formData.phoneCountryCode,
        defaultProfitRate: formData.defaultProfitRate || null,
        country: formData.country || null,
        specialization: formData.specialization || null,
        services: formData.services.length > 0 ? formData.services : null,
        academicLevels: formData.academicLevels.length > 0 ? formData.academicLevels : null,
        isReferrer: formData.isReferrer,
        referrerCode: referrerCode || null,
        commissionRate: formData.isReferrer ? (formData.commissionRate || null) : null,
      };

      if (!employee && !formData.password) {
        toast.error("كلمة المرور مطلوبة");
        setIsLoading(false);
        return;
      }

      if (formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success(
        employee ? "تم تحديث بيانات الموظف بنجاح" : "تم إضافة الموظف بنجاح"
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
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {employee ? "تعديل الموظف" : "إضافة موظف جديد"}
          </DialogTitle>
          <DialogDescription>
            {employee
              ? `تعديل بيانات الموظف ${employee.name}`
              : "إضافة حساب جديد للموظف"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 py-4 overflow-y-auto flex-1">
            <div>
              <Label>الاسم</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="اسم الموظف"
                required
              />
            </div>
            <div>
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
                required
                disabled={!!employee}
              />
              {employee && (
                <p className="text-sm text-gray-500 mt-1">
                  لا يمكن تغيير البريد الإلكتروني
                </p>
              )}
            </div>
            <div>
              <Label>الهاتف</Label>
              <div className="grid grid-cols-[150px_1fr_auto] gap-2">
                <Select
                  value={formData.phoneCountryCode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, phoneCountryCode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ARAB_COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.dial}>
                        {country.name} ({country.dial})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="7XXXXXXXX"
                />
                {formData.phone && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const link = getWhatsAppLink(
                        formData.phoneCountryCode,
                        formData.phone
                      );
                      window.open(link, "_blank");
                    }}
                    title="فتح واتساب"
                  >
                    <Icon icon="mdi:whatsapp" className="w-5 h-5 text-green-600" />
                  </Button>
                )}
              </div>
            </div>
            {!employee && (
              <div>
                <Label>كلمة المرور</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            <div>
              <Label>نسبة الربح الافتراضية (%) (اختياري)</Label>
              <Input
                type="number"
                value={formData.defaultProfitRate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultProfitRate: e.target.value ? Number(e.target.value) : null,
                  })
                }
                min={0}
                max={100}
                placeholder="40"
              />
            </div>
            <div>
              <Label>الدولة</Label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  setFormData({ ...formData, country: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  {ARAB_COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>التخصص</Label>
              <Input
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                placeholder="مثال: هندسة البرمجيات"
              />
            </div>
            <div>
              <Label>الخدمات التي يشتغلها</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (!formData.services.includes(value)) {
                    setFormData({
                      ...formData,
                      services: [...formData.services, value],
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر خدمة" />
                </SelectTrigger>
                <SelectContent>
                  {services
                    .filter((s) => !formData.services.includes(s.id))
                    .map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formData.services.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.services.map((serviceId) => {
                    const service = services.find((s) => s.id === serviceId);
                    return (
                      <span
                        key={serviceId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                      >
                        {service?.title || serviceId}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              services: formData.services.filter(
                                (id) => id !== serviceId
                              ),
                            })
                          }
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <Label>المستويات التي يغطيها</Label>
              <div className="space-y-2">
                {ACADEMIC_LEVELS.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id={`level-${level.value}`}
                      checked={formData.academicLevels.includes(level.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            academicLevels: [...formData.academicLevels, level.value],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            academicLevels: formData.academicLevels.filter(
                              (l) => l !== level.value
                            ),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={`level-${level.value}`} className="cursor-pointer">
                      {level.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">إعدادات المندوب</h3>
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <input
                  type="checkbox"
                  id="isReferrer"
                  checked={formData.isReferrer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isReferrer: e.target.checked,
                      referrerCode: e.target.checked && !formData.referrerCode
                        ? `${formData.name.replace(/\s/g, "").substring(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`
                        : formData.referrerCode,
                    })
                  }
                  className="rounded"
                />
                <Label htmlFor="isReferrer" className="cursor-pointer">
                  هذا الموظف مندوب (يجيب طلاب)
                </Label>
              </div>
              {formData.isReferrer && (
                <>
                  <div>
                    <Label>كود المندوب</Label>
                    <Input
                      value={formData.referrerCode}
                      onChange={(e) =>
                        setFormData({ ...formData, referrerCode: e.target.value.toUpperCase() })
                      }
                      placeholder="مثال: ABC123"
                    />
                    {formData.referrerCode && (
                      <p className="text-xs text-gray-500 mt-1">
                        رابط المندوب: {typeof window !== "undefined" && `${window.location.origin}/ref/${formData.referrerCode}`}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>نسبة العمولة (%)</Label>
                    <Input
                      type="number"
                      value={formData.commissionRate || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commissionRate: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      min={0}
                      max={100}
                      placeholder="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      نسبة العمولة التي يحصل عليها المندوب على كل طلب
                    </p>
                  </div>
                </>
              )}
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
              {isLoading ? "جاري الحفظ..." : employee ? "حفظ" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
