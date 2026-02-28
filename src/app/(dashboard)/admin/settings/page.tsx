"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { SettingsForm } from "./_components/SettingsForm";
import { TableSkeleton } from "@/components/common/Skeletons";
import { toast } from "sonner";

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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      setSettings(data);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء تحميل الإعدادات");
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSuccess = () => {
    fetchSettings();
  };

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="الإعدادات"
          description="إعدادات المنصة العامة والنظام"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="الإعدادات"
        description="إعدادات المنصة العامة والنظام"
      />
      <SettingsForm settings={settings} onSuccess={handleSuccess} />
    </div>
  );
}
