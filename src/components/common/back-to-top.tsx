"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="العودة إلى الأعلى"
      className={`fixed bottom-6 right-6 z-50
      w-10 h-10 flex items-center justify-center
      rounded-md
      bg-[#0056d2] text-white
      shadow-md
      transition-all duration-300
      hover:bg-[#0047b3] hover:-translate-y-1 hover:shadow-lg
      active:scale-95
      ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Icon icon="mdi:chevron-up" className="w-5 h-5 text-white" />
    </button>
  );
}
