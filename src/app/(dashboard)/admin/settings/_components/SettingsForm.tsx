"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Percent,
  Save,
  Globe,
  Bell,
  Shield,
  FileText,
  Users,
  Settings as SettingsIcon,
  Mail,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentMethodsList } from "./PaymentMethodsList";

type Settings = {
  id: string;
  platformName: string;
  platformDescription: string;
  currency: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  defaultFreeRevisions: number;
  cancellationPolicy: string | null;
  quoteExpiryHours: number;
  defaultEmployeeProfitRate: number;
  autoAssignOrders: boolean;
  maxOrdersPerEmployee: number;
  enable2FA: boolean;
  enableAuditLogs: boolean;
  rateLimit: number;
  deadlineReminderHours: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  smsApiKey: string | null;
  whatsappApiKey: string | null;
  siteTitle: string | null;
  siteDescription: string | null;
  siteKeywords: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  platformFee: number;
};

interface SettingsFormProps {
  settings: Settings | null;
  onSuccess: () => void;
}

export function SettingsForm({ settings, onSuccess }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Settings | null>(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  if (!formData) {
    return <div>جاري التحميل...</div>;
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success("تم حفظ الإعدادات بنجاح");
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("settingsUpdated"));
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Tabs defaultValue="general" className="space-y-6" dir="rtl">
      <TabsList>
        <TabsTrigger value="general">
          <SettingsIcon className="ml-2 h-4 w-4" />
          عامة
        </TabsTrigger>
        <TabsTrigger value="payments">
          <CreditCard className="ml-2 h-4 w-4" />
          المدفوعات
        </TabsTrigger>
        <TabsTrigger value="orders">
          <FileText className="ml-2 h-4 w-4" />
          الطلبات
        </TabsTrigger>
        
        <TabsTrigger value="employees">
          <Users className="ml-2 h-4 w-4" />
          الموظفين
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="ml-2 h-4 w-4" />
          الإشعارات
        </TabsTrigger>
        <TabsTrigger value="website">
          <Globe className="ml-2 h-4 w-4" />
          الموقع
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              بيانات المنصة
            </CardTitle>
            <CardDescription>معلومات عامة عن المنصة والعملة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>اسم المنصة</Label>
              <Input
                value={formData.platformName}
                onChange={(e) =>
                  setFormData({ ...formData, platformName: e.target.value })
                }
              />
            </div>
            <div>
              <Label>وصف المنصة</Label>
              <Textarea
                value={formData.platformDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    platformDescription: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div>
              <Label>العملة</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JOD">دينار أردني (JOD)</SelectItem>
                  <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  <SelectItem value="EUR">يورو (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>أوقات العمل</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={formData.workingHoursStart}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workingHoursStart: e.target.value,
                    })
                  }
                />
                <span>إلى</span>
                <Input
                  type="time"
                  value={formData.workingHoursEnd}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workingHoursEnd: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments" className="space-y-6">
        <PaymentMethodsList />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              عمولة المنصة
            </CardTitle>
            <CardDescription>
              النسبة المئوية الافتراضية لعمولة المنصة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>نسبة العمولة (%)</Label>
              <Input
                type="number"
                value={formData.platformFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    platformFee: Number(e.target.value),
                  })
                }
                min={0}
                max={100}
              />
            </div>
            <p className="text-sm text-gray-500">
              يمكن تحديد نسبة عمولة مختلفة لكل خدمة من صفحة إدارة الخدمات
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="orders" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              إعدادات الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عدد التعديلات المجانية الافتراضي</Label>
              <Input
                type="number"
                value={formData.defaultFreeRevisions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultFreeRevisions: Number(e.target.value),
                  })
                }
                min={0}
              />
              <p className="text-sm text-gray-500 mt-1">
                عدد التعديلات المجانية التي يحصل عليها الطالب افتراضياً
              </p>
            </div>
            <div>
              <Label>زمن انتهاء عرض السعر (ساعة)</Label>
              <Input
                type="number"
                value={formData.quoteExpiryHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quoteExpiryHours: Number(e.target.value),
                  })
                }
                min={1}
              />
            </div>
            <div>
              <Label>سياسة الإلغاء</Label>
              <Textarea
                value={formData.cancellationPolicy || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cancellationPolicy: e.target.value,
                  })
                }
                rows={4}
                placeholder="وصف سياسة الإلغاء والاسترداد..."
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
 

      <TabsContent value="employees" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إعدادات الموظفين
            </CardTitle>
            <CardDescription>
              إعدادات عامة للموظفين ونسب الأرباح
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>نسبة الربح الافتراضية للموظفين (%)</Label>
              <Input
                type="number"
                value={formData.defaultEmployeeProfitRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultEmployeeProfitRate: Number(e.target.value),
                  })
                }
                min={0}
                max={100}
              />
              <p className="text-sm text-gray-500 mt-1">
                النسبة الافتراضية لربح الموظف من كل طلب (يمكن تعديلها لكل موظف)
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>التعيين التلقائي للطلبات</Label>
                <p className="text-sm text-gray-500">
                  تعيين الطلبات تلقائياً للموظفين حسب التوفر
                </p>
              </div>
              <Switch
                checked={formData.autoAssignOrders}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, autoAssignOrders: checked })
                }
                dir="ltr"
              />
            </div>
            <div>
              <Label>الحد الأقصى للطلبات لكل موظف</Label>
              <Input
                type="number"
                value={formData.maxOrdersPerEmployee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxOrdersPerEmployee: Number(e.target.value),
                  })
                }
                min={1}
              />
              <p className="text-sm text-gray-500 mt-1">
                الحد الأقصى لعدد الطلبات التي يمكن أن يعمل عليها موظف واحد في نفس الوقت
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              إعدادات الإشعارات
            </CardTitle>
            <CardDescription>
              إعدادات الإشعارات والتنبيهات للموظفين والطلاب
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>وقت التنبيه قبل الموعد النهائي (ساعة)</Label>
              <Select
                value={formData.deadlineReminderHours.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    deadlineReminderHours: Number(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ساعة واحدة</SelectItem>
                  <SelectItem value="6">6 ساعات</SelectItem>
                  <SelectItem value="12">12 ساعة</SelectItem>
                  <SelectItem value="24">24 ساعة</SelectItem>
                  <SelectItem value="48">48 ساعة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>الإشعارات عبر البريد الإلكتروني</Label>
                  <p className="text-sm text-gray-500">
                    إرسال إشعارات عبر البريد الإلكتروني
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, emailNotifications: checked })
                  }
                  dir="ltr"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>الإشعارات عبر SMS</Label>
                  <p className="text-sm text-gray-500">
                    إرسال إشعارات عبر الرسائل النصية
                  </p>
                </div>
                <Switch
                  checked={formData.smsNotifications}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, smsNotifications: checked })
                  }
                  
                  dir="ltr"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>الإشعارات عبر WhatsApp</Label>
                  <p className="text-sm text-gray-500">
                    إرسال إشعارات عبر واتساب
                  </p>
                </div>
                <Switch
                  checked={formData.whatsappNotifications}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      whatsappNotifications: checked,
                    })
                  }
                  
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <Label>مزود SMS API Key</Label>
              <Input
                type="password"
                value={formData.smsApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, smsApiKey: e.target.value })
                }
                placeholder="أدخل API Key..."
              />
            </div>
            <div>
              <Label>مزود WhatsApp API Key</Label>
              <Input
                type="password"
                value={formData.whatsappApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappApiKey: e.target.value })
                }
                placeholder="أدخل API Key..."
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="website" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              إعدادات SEO والموقع
            </CardTitle>
            <CardDescription>
              إعدادات محركات البحث والمعلومات العامة للموقع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عنوان الموقع (Title)</Label>
              <Input
                value={formData.siteTitle || ""}
                onChange={(e) =>
                  setFormData({ ...formData, siteTitle: e.target.value })
                }
                placeholder="عنوان الموقع في محركات البحث"
              />
            </div>
            <div>
              <Label>وصف الموقع (Description)</Label>
              <Textarea
                value={formData.siteDescription || ""}
                onChange={(e) =>
                  setFormData({ ...formData, siteDescription: e.target.value })
                }
                rows={3}
                placeholder="وصف الموقع في محركات البحث"
              />
            </div>
            <div>
              <Label>الكلمات المفتاحية (Keywords)</Label>
              <Input
                value={formData.siteKeywords || ""}
                onChange={(e) =>
                  setFormData({ ...formData, siteKeywords: e.target.value })
                }
                placeholder="كلمات مفتاحية مفصولة بفواصل"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              معلومات الاتصال
            </CardTitle>
            <CardDescription>
              معلومات الاتصال المعروضة في الموقع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                value={formData.contactEmail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                placeholder="info@example.com"
              />
            </div>
            <div>
              <Label>رقم الهاتف</Label>
              <Input
                type="tel"
                value={formData.contactPhone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                placeholder="0791234567"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="flex justify-start">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <Save className="ml-2 h-4 w-4" />
          حفظ جميع الإعدادات
        </Button>
      </div>
    </Tabs>
  );
}
