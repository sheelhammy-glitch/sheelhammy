import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

/**
 * Check if the request is authenticated
 * Returns the user if authenticated, null otherwise
 */
export async function checkAuth(request: NextRequest): Promise<{
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
  } | null;
  error?: NextResponse;
}> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, error: "غير مصرح. يرجى تسجيل الدخول" },
          { status: 401 }
        ),
      };
    }

    // Decode session token to get user ID
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
    const [userId] = decoded.split(":");

    if (!userId) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, error: "جلسة غير صالحة" },
          { status: 401 }
        ),
      };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, error: "حساب غير نشط" },
          { status: 403 }
        ),
      };
    }

    return { user };
  } catch (error) {
    console.error("Auth check error:", error);
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: "خطأ في التحقق من الهوية" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Require authentication - throws error response if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<{
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
  };
  error?: NextResponse;
}> {
  const { user, error } = await checkAuth(request);
  
  if (!user || error) {
    throw error || NextResponse.json(
      { success: false, error: "غير مصرح" },
      { status: 401 }
    );
  }

  return { user };
}
