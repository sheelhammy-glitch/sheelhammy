"use client";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const GlobeDemo = dynamic(() => import("@/components/ui/globe-demo").then((m) => m.default), {
  ssr: false,
});


export default function CountriesGlobeModal({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), 260);
    return () => window.clearTimeout(t);
  }, [open]);
  
  // Close modal when clicking outside
  useEffect(() => {
    if (!open || !visible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add event listener with a small delay to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, visible, onClose]);
  
  useEffect(() => {
    if (!mounted) return;
  
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
   
  
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onClose]);
  
    if (!mounted) return null;
  
  
  
    const COUNTRIES = [
      "🇯🇴 الأردن",
      "🇸🇦 السعودية",
      "🇦🇪 الإمارات",
      "🇶🇦 قطر",
      "🇰🇼 الكويت",
      "🇧🇭 البحرين",
      "🇴🇲 عُمان",
      "🇪🇬 مصر",
      "🇲🇦 المغرب",
      "🇹🇳 تونس",
      "🇩🇿 الجزائر",
      "🇮🇶 العراق",
      "🇵🇸 فلسطين",
      "🇱🇧 لبنان",
      "🇸🇾 سوريا",
      "🇾🇪 اليمن",
    ] as const;
  
    return (
      <div
        className={[
          "fixed inset-0 z-50 isolate",
          "transition-opacity duration-300 ease-out",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={onClose}
          className={[
            "absolute inset-0 w-full h-full",
            "bg-black/60 dark:bg-black/75",
            "backdrop-blur-[16px]",
            "transition-opacity duration-300 ease-out",
            "cursor-pointer",
            visible ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-label="إغلاق"
        />
  
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className={[
              "w-full max-w-lg",
              "rounded-3xl",
              "bg-white/75 dark:bg-slate-950/70",
              "backdrop-blur-2xl",
              "border border-white/50 dark:border-white/15",
              "shadow-[0_50px_180px_-80px_rgba(0,0,0,0.75)]",
              "transition-[transform,opacity,filter] duration-400 ease-out",
              visible
                ? "opacity-100 translate-y-0 scale-100 blur-0"
                : "opacity-0 translate-y-4 scale-[0.98] blur-[3px]",
            ].join(" ")}
          >
            <div className="p-5 sm:p-6" dir="rtl">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <Icon
                      icon="solar:global-bold-duotone"
                      className="w-6 h-6 text-[#0056d2]"
                    />
                    الدول التي نخدمها
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-white/75 mt-1.5">
                    تغطية شاملة للوطن العربي — دعم 24/7
                  </p>
                </div>
  
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl px-3 py-2 text-sm font-semibold bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/15 border border-white/40 dark:border-white/10 transition cursor-pointer"
                >
                  <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                  
                </button>
              </div>
  
              <div className="relative rounded-2xl overflow-hidden border border-white/40 dark:border-white/15 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 dark:from-white/5 dark:to-white/5 p-4">
                <div className="relative w-full" style={{ height: '400px', minHeight: '400px' }}>
                  {mounted && visible && (
                    <GlobeDemo />
                  )}
                </div>
              </div>
  
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {COUNTRIES.map((country, i) => (
                  <div
                    key={country}
                    className="flex items-center justify-center px-2 py-1 rounded-md bg-white/55 dark:bg-white/5 border border-white/35 dark:border-white/10 hover:bg-white/75 dark:hover:bg-white/10 transition-all hover:scale-[1.02] cursor-default"
                    style={{ animationDelay: `${i * 0.02}s` }}
                  >
                    <span className="text-[11px] sm:text-xs font-bold text-gray-800 dark:text-white">
                      {country}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }