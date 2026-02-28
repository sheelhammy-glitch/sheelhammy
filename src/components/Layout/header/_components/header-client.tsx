"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import logo from "@/assets/logo.svg";

const navigation = [
  { name: "الرئيسية", href: "/" },
  { name: "من نحن", href: "/about-us" },
  { name: "الخدمات", href: "/services" },
  { name: "نماذج الأعمال", href: "/samples" },
  { name: "طرق الدفع", href: "/payment" },
  { name: "تواصل معنا", href: "/contact-us" },
];

const BRAND = "#0056D2";

const WHATSAPP_NUMBER = "962781858647";
const WHATSAPP_TEXT = encodeURIComponent(
  "مرحبًا، أود الحصول على استشارة لتحديد الخدمة الأكاديمية المناسبة."
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

export function HeaderClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ سلاسة التنقل
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // ✅ لما يتغير المسار نعتبر التنقل انتهى
  useEffect(() => {
    if (!isNavigating) return;

    // خلي شريط التحميل يوصل للآخر بنعومة
    setProgress(100);
    const t1 = window.setTimeout(() => setIsNavigating(false), 220);
    const t2 = window.setTimeout(() => setProgress(0), 420);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname, isNavigating]);

  // ✅ Prefetch للصفحات عشان التنقل يصير أسرع
  useEffect(() => {
    // ملاحظة: router.prefetch موجودة في Next 13+ (App Router)
    navigation.forEach((item) => {
      try {
        router.prefetch?.(item.href);
      } catch {}
    });
  }, [router]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const scrollToTopSmooth = useCallback(() => {
    // requestAnimationFrame لنتأكد أنه بعد التحديث
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  const startFakeProgress = useCallback(() => {
    setIsNavigating(true);
    setProgress(12);

    // تقدّم تدريجي “وهمي” يعطي إحساس سلاسة
    const steps = [24, 38, 52, 66, 78, 86, 92];
    let i = 0;

    const tick = () => {
      if (!document || i >= steps.length) return;
      setProgress((p) => (p < steps[i] ? steps[i] : p));
      i += 1;
      if (i < steps.length) window.setTimeout(tick, 120);
    };

    window.setTimeout(tick, 120);
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      if (isNavigating) return; // ✅ امنع ضغط متكرر
      setIsMobileMenuOpen(false);

      // نفس الصفحة؟ بس Scroll Top
      if (href === "/") {
        if (pathname === "/") {
          scrollToTopSmooth();
          return;
        }
      } else {
        if (pathname === href || pathname.startsWith(href)) {
          scrollToTopSmooth();
          return;
        }
      }

      startFakeProgress();

      startTransition(() => {
        router.push(href, { scroll: false });
      });

      // ✅ ScrollTop بعد push بنعومة وبشكل ثابت
      // (مرتين بحالات نادرة لو كانت الصفحة ثقيلة)
      requestAnimationFrame(scrollToTopSmooth);
      window.setTimeout(scrollToTopSmooth, 120);
    },
    [isNavigating, pathname, router, scrollToTopSmooth, startFakeProgress]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:border-gray-800"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      {/* ✅ Top Loading Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className="h-full transition-[width] duration-200 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, rgba(0,86,210,0.0), rgba(0,86,210,0.95), rgba(0,86,210,0.0))",
            opacity: isNavigating ? 1 : 0,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <nav className="flex items-center justify-between h-20">
          {/* LOGO */}
          <button
            type="button"
            onClick={() => handleNavClick("/")}
            className="flex cursor-pointer items-center gap-3 text-right"
          >
            <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-md ring-1 ring-gray-100 dark:ring-gray-700">
              <Image src={logo} alt="شيل همي" width={28} height={28} priority />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                شيل همي
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                خدمات أكاديمية وطلابية
              </span>
            </div>
          </button>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-8">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  disabled={isNavigating}
                  className={`relative cursor-pointer px-4 py-2 rounded-xl text-md font-medium transition ${
                    active
                      ? "bg-[#EEF5FF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  } ${isNavigating ? "opacity-70 cursor-not-allowed" : ""}`}
                  style={{ color: active ? BRAND : undefined }}
                >
                  {item.name}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: BRAND }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* DESKTOP WHATSAPP (ONLY LG+) */}
          <div className="hidden lg:flex items-center">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                px-3.5 py-2
                rounded-xl
                text-sm font-semibold
                text-white
                shadow-sm
                transition-all duration-200
                hover:shadow-md
                hover:-translate-y-[1px]
                active:scale-[0.97]
              "
              style={{ backgroundColor: BRAND }}
            >
              <Icon
                icon="logos:whatsapp-icon"
                className="w-4 h-4"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <span>تواصل مباشر</span>
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="lg:hidden cursor-pointer p-2.5"
            style={{ color: BRAND }}
            disabled={isNavigating}
          >
            {isMobileMenuOpen ? (
              <Icon icon="solar:close-circle-bold" className="w-7 h-7" />
            ) : (
              <Icon icon="solar:hamburger-menu-bold" className="w-7 h-7" />
            )}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6">
            <div className="flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 mt-4">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    disabled={isNavigating}
                    className={`text-right cursor-pointer px-4 py-3 rounded-xl text-sm font-medium transition ${
                      active
                        ? "bg-[#EEF5FF]"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } ${isNavigating ? "opacity-70 cursor-not-allowed" : ""}`}
                    style={{ color: active ? BRAND : undefined }}
                  >
                    {item.name}
                  </button>
                );
              })}

              {/* MOBILE WHATSAPP (ONLY INSIDE MENU) */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="
                    flex items-center justify-center gap-2
                    px-3.5 py-2.5
                    rounded-xl
                    text-sm font-semibold
                    text-white
                    shadow-sm
                    transition-all duration-200
                    active:scale-[0.97]
                  "
                  style={{ backgroundColor: BRAND }}
                >
                  <Icon
                    icon="logos:whatsapp-icon"
                    className="w-4 h-4"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                  <span>تواصل مباشر</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}