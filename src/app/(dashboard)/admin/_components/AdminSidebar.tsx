"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  CreditCard,
  Star,
  Settings,
  Menu,
  X,
  UserCheck,
  Ticket,
  FileText,
  BarChart3,
  Tag,
  MessageSquare,
  Home,
  Book,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "إدارة الطلبات", icon: ShoppingCart },
  { href: "/admin/employees", label: "الموظفين", icon: UserCheck },
  { href: "/admin/students", label: "الطلاب", icon: Users },
  { href: "/admin/content/categories", label: "الفئات", icon: Tag },
  { href: "/admin/content/services", label: "الخدمات", icon: Package },
  { href: "/admin/content/testimonials", label: "آراء العملاء", icon: Star },
  { href: "/admin/content/portfolio", label: "النماذج", icon: FileText },
  { href: "/admin/content/faqs", label: "الأسئلة الشائعة", icon: MessageSquare },
  { href: "/admin/finance", label: "النظام المالي", icon: DollarSign },
  { href: "/admin/content/blog", label: "المقالات", icon: Book },
  { href: "/admin/notifications", label: "الإشعارات", icon: Ticket },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <> 
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
 
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              لوحة الإدارة
            </h2>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              // Fix active state: exact match for admin home, or starts with for others
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-md font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <Link
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-md font-medium transition-colors",
                  "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Home className="h-5 w-5" />
                العودة للموقع
              </Link>
            </div>
          </nav>
        </div>
      </aside>
 
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
