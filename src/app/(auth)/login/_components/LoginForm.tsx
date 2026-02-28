"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Role } from "@prisma/client";

interface SignInFormData {
  email: string;
  password: string;
}

function getRedirectPath(role: Role | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "EMPLOYEE":
      return "/dashboard";
    default:
      return "/dashboard";
  }

}
export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();
 
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const redirectPath = getRedirectPath(session.user.role);
      router.push(redirectPath);
    }
  }, [status, session, router]);

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        toast.error("فشل تسجيل الدخول", {
          description: "يرجى التحقق من بياناتك والمحاولة مرة أخرى",
        });
        setLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("تم تسجيل الدخول بنجاح", {
          description: "مرحباً بك في النظام",
        });

        // Wait a bit for session to update, then redirect
        setTimeout(() => {
          // Use callbackUrl if it's a valid path, otherwise use role-based redirect
          if (callbackUrl && callbackUrl !== "/login") {
            router.push(callbackUrl);
          } else {
            // Will be handled by useEffect when session updates
            router.refresh();
          }
        }, 100);
      }
    } catch (error: any) {
      setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى");
      toast.error("خطأ في الاتصال", {
        description: "يرجى التحقق من اتصالك بالإنترنت",
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-2 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-blue-600 dark:bg-blue-700">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              أدخل بياناتك للوصول إلى حسابك
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && (
            <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-900/20">
              <AlertDescription className="text-sm font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                {...register("email", {
                  required: "البريد الإلكتروني مطلوب",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "يرجى إدخال بريد إلكتروني صحيح",
                  },
                })}
                type="email"
                placeholder="example@email.com"
                className={`h-11 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                } transition-all`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  id="password"
                  {...register("password", {
                    required: "كلمة المرور مطلوبة",
                    minLength: {
                      value: 6,
                      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 pr-10 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } transition-all`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              نسيت كلمة المرور؟{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
              >
                استعادة كلمة المرور
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}