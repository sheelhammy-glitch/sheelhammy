"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { SidebarProvider } from "@/components/ui/sidebar";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide header and footer in admin and dashboard routes
  const isDashboardRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");
  
  if (isDashboardRoute) {
    // For dashboard routes, don't show header and footer
    return <>{children}</>;
  }
  
  // For other routes, show header and footer
  return (
    <SidebarProvider>
      <Header />
      {children}
      <Footer />
    </SidebarProvider>
  );
}
