import { FEATURES, THEME } from '@/app/(home)/_components/why-us';
import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom';


function Portal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return createPortal(children, document.body);
  }
  
 
export default function DetailsModalWhyUS({
    open,
    onClose,
    feature,
  }: {
    open: boolean;
    onClose: () => void;
    feature: (typeof FEATURES)[number] | null;
  }) { 
    const dialogRef = useRef<HTMLDivElement>(null);
 
    useEffect(() => {
      if (!open) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
 
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open, onClose]);

    useEffect(() => {
      if (!open) return;
  
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKeyDown);
  
      const body = document.body;
      const prevOverflow = body.style.overflow;
      const prevPaddingRight = body.style.paddingRight;
      const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
  
      body.style.overflow = "hidden";
      if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;
  
      return () => {
        window.removeEventListener("keydown", onKeyDown);
        body.style.overflow = prevOverflow;
        body.style.paddingRight = prevPaddingRight;
      };
    }, [open, onClose]);
  
    if (!feature) return null;
  
    return (
      <Portal>
        <div
          className={[
            "fixed inset-0 z-[999999]", 
            "transition-all duration-200 ease-out",
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
          aria-hidden={!open}
        >
          {/* overlay */}
          <div
            className={[
              "absolute inset-0 w-full h-full",
              "bg-black/55 dark:bg-black/70",
              "backdrop-blur-[10px]",
            ].join(" ")}
          />
  
          {/* dialog */}
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
              className={[
                "w-full max-w-md",
                "rounded-2xl",
                "bg-white dark:bg-slate-950",
                "border border-[#e1efff] dark:border-white/10",
                "shadow-[0_22px_80px_-40px_rgba(0,0,0,0.55)]",
                "transition-all duration-200 ease-out",
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              ].join(" ")}
            >
              {/* header */}
              <div className="p-4 border-b border-[#e1efff] dark:border-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: THEME.primary }}
                      >
                        <Icon icon={feature.icon} className="w-5 h-5 text-white" />
                      </span>
  
                      <h3 className="text-[17px] sm:text-lg font-extrabold text-[#000000] dark:text-white truncate">
                        {feature.title}
                      </h3>
                    </div>
  
                    <p className="mt-2 text-[13px] sm:text-sm text-black/70 dark:text-white/75 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
  
                  <button
                    type="button"
                    onClick={onClose}
                    className={[
                      "shrink-0 cursor-pointer rounded-xl px-3 py-2",
                      "text-xs font-bold",
                      "bg-[#e1efff] text-[#0056d2]",
                      "hover:opacity-90 transition",
                    ].join(" ")}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                      إغلاق
                    </span>
                  </button>
                </div>
              </div>
  
              {/* content */}
              <div className="p-4">
                <div className="rounded-2xl bg-[#e1efff]/40 border border-[#e1efff] p-3.5">
                  <h4 className="text-xs font-extrabold text-[#000000] dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: THEME.primary }} />
                    التفاصيل
                  </h4>
  
                  <ul className="space-y-2.5 max-h-[34vh] overflow-auto custom-scrollbar pr-1">
                    {feature.details?.points?.map((p, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span
                          className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: THEME.primary }}
                        />
                        <span className="text-[13px] sm:text-sm text-black/80 dark:text-white/80 leading-relaxed">
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
  
                  {feature.details?.note && (
                    <div className="mt-3 rounded-xl bg-white/85 dark:bg-white/5 border border-white/60 dark:border-white/10 p-3">
                      <div className="flex gap-2.5">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: THEME.primary }}
                        >
                          <Icon icon="solar:lightbulb-bold" className="w-4 h-4 text-white" />
                        </span>
                        <div className="text-[13px] sm:text-sm text-black/80 dark:text-white/80 leading-relaxed">
                          <span className="font-extrabold">ملاحظة: </span>
                          {feature.details.note}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
  
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl cursor-pointer px-4 py-2 text-sm font-extrabold bg-[#000000] text-white hover:opacity-90 transition"
                  >
                    تم
                  </button>
                </div>
              </div>
   
            </div>
          </div>
        </div>
      </Portal>
    );
  }