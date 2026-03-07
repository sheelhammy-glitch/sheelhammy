"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { Icon } from "@iconify/react";
import { useSearchParams } from "next/navigation";

const WHATSAPP_NUMBER = "962781858647";

function FloatingWhatsAppContent() {
  const [isHovered, setIsHovered] = useState(false);
  const [referrerCode, setReferrerCode] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL params first
    const ref = searchParams?.get("ref");
    if (ref) {
      if (typeof window !== "undefined") {
        localStorage.setItem("referrerCode", ref);
      }
      setReferrerCode(ref);
    } else {
      // Check localStorage
      if (typeof window !== "undefined") {
        const savedRef = localStorage.getItem("referrerCode");
        if (savedRef) {
          setReferrerCode(savedRef);
        }
      }
    }
  }, [searchParams]);

  const whatsappLink = useMemo(() => {
    let message = "مرحبا، أريد خدمة أكاديمية";
    
    if (referrerCode) {
      message += `\nكود المندوب: ${referrerCode}`;
    }
    
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [referrerCode]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(whatsappLink, "_blank");
  };

  return (
    <a
      href={whatsappLink}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا على WhatsApp"
      className="fixed bottom-6 left-6 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          group relative flex items-center gap-3
          h-14
          rounded-full
          border border-black/10
          bg-white/90 backdrop-blur-md
          shadow-[0_14px_50px_rgba(0,0,0,0.12)]
          transition-all duration-300 ease-out
          hover:shadow-[0_20px_70px_rgba(0,0,0,0.16)]
          ${isHovered ? "w-52" : "w-14"}
          overflow-hidden
        `}
      > 
        <div className="pointer-events-none absolute -inset-6 bg-[#25D366] opacity-15 blur-2xl" />
 
        <div
          className={`
            relative shrink-0 grid place-items-center
            w-14 h-14
            rounded-full
            bg-[#25D366]
            shadow-[0_12px_30px_rgba(37,211,102,0.35)]
            transition-transform duration-300
            group-hover:scale-105
          `}
        >
          <Icon icon="mdi:whatsapp" className="w-7 h-7 text-white" />
        </div>

        {/* Text area */}
        <div
          className={`
            min-w-0 pr-4
            text-right
            transition-all duration-300
            ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"}
          `}
        >
          <p className="text-sm font-extrabold text-neutral-900 leading-tight">
            تواصل معنا
          </p>
          <p className="text-xs text-neutral-600 leading-tight">
            رد سريع على واتساب
          </p>
        </div>

        {/* tiny indicator */}
        <div
          className={`
            absolute right-4 top-1/2 -translate-y-1/2
            transition-all duration-300
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
        >
          <Icon icon="solar:arrow-right-bold" className="w-4 h-4 text-neutral-500" />
        </div>
      </div>
    </a>
  );
}

export function FloatingWhatsApp() {
  return (
    <Suspense fallback={null}>
      <FloatingWhatsAppContent />
    </Suspense>
  );
}