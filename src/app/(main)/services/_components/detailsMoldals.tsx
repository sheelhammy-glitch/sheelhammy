import { Icon } from '@iconify/react';
import Link from 'next/link';
import React from 'react'

export default function DetailsMoldals({
    open,
    title,
    children,
    onClose,
  }: {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
  }) {
    if (!open) return null;
  
    return (
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6"
        role="dialog"
        aria-modal="true"
      >
        <div onClick={onClose} className="absolute inset-0 bg-black/40 cursor-pointer" aria-hidden="true" />
   
        <div
          className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden"
          style={{ border: "2px solid #e1efff" }}
        >
          <div
            className="flex items-center justify-between gap-3 px-5 py-4 border-b"
            style={{ borderColor: "#e1efff" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#e1efff" }}
              >
                <Icon icon="solar:info-circle-bold" className="w-5 h-5" style={{ color: "#0056d2" }} />
              </div>
              <h4 className="text-base md:text-lg font-extrabold text-black">{title}</h4>
            </div>
  
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition hover:scale-[1.03] cursor-pointer"
              style={{ backgroundColor: "#e1efff" }}
              aria-label="إغلاق النافذة"
            >
              <Icon icon="solar:close-circle-bold" className="w-6 h-6" style={{ color: "#0056d2" }} />
            </button>
          </div>
          <div className="px-5 py-4 overflow-y-auto max-h-[60vh] sm:max-h-[72vh]">
            {children}
          </div>
  
          <div className="px-5 pb-4 pt-3 border-t" style={{ borderColor: "#e1efff" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 text-sm font-extrabold text-white transition"
                style={{ backgroundColor: "#0056d2" }}
              >
                اطلب الخدمة الآن
                <Icon icon="solar:arrow-left-bold" className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
  
              <button
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 text-sm font-extrabold transition cursor-pointer"
                style={{ backgroundColor: "#e1efff", color: "#0056d2", border: "2px solid #0056d2" }}
              >
                إغلاق
                <Icon icon="solar:shield-check-bold" className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
  
        </div>
      </div>
    );
  }
  