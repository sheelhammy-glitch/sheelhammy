import { PROCESS_STEPS, Step } from "@/app/(home)/_components/process";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";


 export default function StepModalProess({
    open,
    step,
    onClose,
  }: {
    open: boolean;
    step: Step | null;
    onClose: () => void;
  }) {
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      if (open) setMounted(true);
    }, [open]);
  
    useEffect(() => {
      if (!open) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);
  
    if (!mounted || !step) return null;
  
    const handleTransitionEnd = () => {
      if (!open) setMounted(false);
    };
  
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <button
          aria-label="إغلاق"
          onClick={onClose}
          className={`absolute cursor-pointer inset-0 transition-all duration-200 cursor-pointer ${
            open
              ? "bg-black/45 dark:bg-black/70 backdrop-blur-[2px]"
              : "bg-black/0 backdrop-blur-0"
          }`}
        />
  
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-xl transition-all duration-200 ${
            open ? "scale-100 translate-y-0" : "scale-[0.98] translate-y-2"
          }`}
        >
          <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-[#0056d2]/35 via-transparent to-[#2563EB]/25 blur-xl opacity-70" />
  
          <div className="relative overflow-hidden rounded-[26px] border border-white/25 dark:border-white/10 bg-white/70 dark:bg-gray-950/55 backdrop-blur-2xl shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-l from-[#0056d2]/18 via-[#0056d2]/8 to-transparent" />
  
            <div className="relative px-6 pt-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#0056d2]/25 dark:border-blue-400/15 flex items-center justify-center shadow-sm">
                      <Icon icon={step.icon} className="w-7 h-7 text-[#0056d2]" />
                    </div>
  
                    <div className="absolute -top-2 -right-2 w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0056d2] to-[#2563EB] text-white text-sm font-extrabold flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>
                  </div>
  
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10 text-xs text-gray-700 dark:text-gray-200">
                      <span className="w-2 h-2 rounded-full bg-[#0056d2]" />
                      تفاصيل الخطوة
                    </div>
  
                    <h3 className="mt-2 text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-snug">
                      {step.title}
                    </h3>
                  </div>
                </div>
  
                <button
                  onClick={onClose}
                  className="w-11 h-11 rounded-2xl bg-white/75 dark:bg-white/5 border border-white/30 dark:border-white/10 flex items-center justify-center hover:scale-[1.03] active:scale-[0.98] transition cursor-pointer"
                  aria-label="إغلاق"
                >
                  <Icon
                    icon="solar:close-circle-bold"
                    className="w-7 h-7 text-gray-700 dark:text-gray-200"
                  />
                </button>
              </div>
            </div>
  
            <div className="relative px-6 pb-6">
              <div className="rounded-2xl border border-white/25 dark:border-white/10 bg-white/55 dark:bg-white/5 p-5 md:p-6">
                <p className="text-sm md:text-base leading-8 text-gray-800 dark:text-gray-100">
                  {step.description}
                </p>
              </div>
  
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  خطوة {step.number} من {PROCESS_STEPS.length}
                </div>
  
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10 text-gray-800 dark:text-gray-100 font-semibold hover:brightness-105 transition cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
  
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/30 to-transparent dark:from-white/5" />
          </div>
        </div>
      </div>
    );
  }