"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from "@/types/dashboard";
import { TableSkeleton } from "@/components/common/Skeletons";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/dashboard/profile");
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch profile");
        }
        const data = await response.json();
        setUser(data);
      } catch (error: any) {
        toast.error(error.message || "حدث خطأ أثناء تحميل الملف الشخصي");
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updateData: UpdateProfileRequest = {
        name: user.name,
        phone: user.phone || undefined,
        avatar: user.avatar || undefined,
      };

      const response = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setIsSaving(true);
    try {
      const passwordData: ChangePasswordRequest = {
        currentPassword,
        newPassword,
        confirmPassword,
      };

      const response = await fetch("/api/dashboard/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change password");
      }

      toast.success("تم تغيير كلمة المرور بنجاح");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="ملفي الشخصي"
          description="إدارة بياناتك الشخصية وكلمة المرور"
        />
        <TableSkeleton rows={3} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="ملفي الشخصي"
          description="إدارة بياناتك الشخصية وكلمة المرور"
        />
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">فشل تحميل الملف الشخصي</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="ملفي الشخصي"
        description="إدارة بياناتك الشخصية وكلمة المرور"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>البيانات الشخصية</CardTitle>
            <CardDescription>
              تحديث معلوماتك الشخصية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback>
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 left-0 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
              />
            </div>
            <div>
              <Label>الاسم</Label>
              <Input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div>
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">
                لا يمكن تغيير البريد الإلكتروني
              </p>
            </div>
            <div>
              <Label>رقم الهاتف</Label>
              <Input
                type="tel"
                value={user.phone || ""}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                placeholder="0791234567"
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
              <Save className="ml-2 h-4 w-4" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>تغيير كلمة المرور</CardTitle>
            <CardDescription>
              قم بتغيير كلمة المرور الخاصة بك
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>كلمة المرور الحالية</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label>كلمة المرور الجديدة</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label>تأكيد كلمة المرور</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
              className="w-full"
            >
              تغيير كلمة المرور
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
