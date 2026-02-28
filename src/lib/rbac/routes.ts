import { Role } from "@prisma/client";

export const roleRoutes: Record<Role, string[]> = {
  ADMIN: ["/admin"],
  EMPLOYEE: ["/dashboard"],
};

export const publicRoutes = [
  "/",
  "/login",
  "/auth/register",
  "/services",
  "/services/[serviceId]",
  "/samples",
];

export function canAccessRoute(role: Role, pathname: string): boolean {
  // Check public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return true;
  }

  // Check role-specific routes
  const allowedRoutes = roleRoutes[role];
  return allowedRoutes.some((route) => pathname.startsWith(route));
}

export function getRedirectPath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "EMPLOYEE":
      return "/dashboard";
    default:
      return "/login";
  }
}
