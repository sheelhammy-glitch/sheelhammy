"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, User, Mail, Phone, FileText, Briefcase, Clock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
  experience: z.number().optional(),
  status: z.string().optional(),
  specialties: z.string().optional(),
  academicLevels: z.string().optional(),
  dailyCapacity: z.number().optional(),
});

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profile: {
    bio: string | null;
    skills: string;
    experience: number | null;
  } | null;
  employeeProfile: {
    status: string;
    specialties: string;
    academicLevels: string;
    dailyCapacity: number;
  } | null;
};

interface ProfileFormProps {
  user: User;
  role: Role;
}

export function ProfileForm({ user, role }: ProfileFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      bio: user.profile?.bio || "",
      skills: user.profile?.skills ? JSON.parse(user.profile.skills).join(", ") : "",
      experience: user.profile?.experience || undefined,
      status: user.employeeProfile?.status || "AVAILABLE",
      specialties: user.employeeProfile?.specialties
        ? JSON.parse(user.employeeProfile.specialties).join(", ")
        : "",
      academicLevels: user.employeeProfile?.academicLevels
        ? JSON.parse(user.employeeProfile.academicLevels).join(", ")
        : "",
      dailyCapacity: user.employeeProfile?.dailyCapacity || 5,
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsSaving(true);
    try {
      const skillsArray = values.skills
        ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const specialtiesArray = values.specialties
        ? values.specialties.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const academicLevelsArray = values.academicLevels
        ? values.academicLevels.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          bio: values.bio,
          skills: JSON.stringify(skillsArray),
          experience: values.experience,
          status: values.status,
          specialties: JSON.stringify(specialtiesArray),
          academicLevels: JSON.stringify(academicLevelsArray),
          dailyCapacity: values.dailyCapacity,
        }),
      });

      if (!response.ok) throw new Error("فشل تحديث الملف الشخصي");

      toast.success("تم تحديث الملف الشخصي بنجاح");
      router.refresh();
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role === "EMPLOYEE" && (
                <>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نبذة عنك</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                        <FormDescription>
                          اكتب نبذة مختصرة عن خبراتك ومهاراتك
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المهارات</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: برمجة، تصميم، كتابة"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          اكتب المهارات مفصولة بفواصل
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>سنوات الخبرة</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button type="submit" disabled={isSaving} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {role === "EMPLOYEE" && user.employeeProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              إعدادات الموظف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>حالتك</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">
                        متاح
                      </SelectItem>
                      <SelectItem value="BUSY">
                        مشغول
                      </SelectItem>
                      <SelectItem value="ON_LEAVE">
                        إجازة
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    تغيير حالتك يؤثر على إسناد الطلبات الجديدة
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>التخصصات</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="مثال: كتابة أبحاث، برمجة، تصميم"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    التخصصات التي تعمل بها (مفصولة بفواصل)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="academicLevels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المستويات الأكاديمية</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="مثال: BACHELOR, MASTER, PHD"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    المستويات التي تستطيع تنفيذها (مفصولة بفواصل)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dailyCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سقف الحمل اليومي</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    عدد الطلبات التي يمكنك استقبالها يومياً
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>تغيير كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            تغيير كلمة المرور
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
