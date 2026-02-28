"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.facebook.com/share/1F76Q4Mfbt/?mibextid=wwXIfr", icon: "mdi:instagram" },
  { name: "Facebook", href: "https://www.instagram.com/sheelhammy?igsh=MTJwYmE1ZDFpcDQweg==", icon: "mdi:facebook" },
  { name: "X", href: "https://x.com/sheelhammy?s=21", icon: "simple-icons:x" },
  { name: "WhatsApp", href: "https://wa.me/962781858647", icon: "mdi:whatsapp" },
];


export function FloatingUI() {
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.loop = true;
    el.preload = "auto";

    if (audioOn) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [audioOn]);

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-3">
      {SOCIAL_LINKS.map((s) => (
        <Link
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group relative flex items-center justify-center
            w-9 hover:w-32 h-8
            bg-[#0056d2]
            border border-[#004bb5]
            rounded-md
            shadow-md hover:shadow-lg
            transition-all duration-300 ease-out
            overflow-hidden
          "
        >
          {/* Icon */}
          <span
            className="
              absolute inset-0 flex items-center justify-center
              text-white
              transition-all duration-300 ease-out
              group-hover:-translate-x-8
            "
          >
            <Icon icon={s.icon} className="w-6 h-6" />
          </span>

          {/* Text */}
          <span
            className="
              absolute right-3
              opacity-0
              pr-2
              text-xs font-medium
              text-white
              whitespace-nowrap
              transition-all duration-300 ease-out
              group-hover:opacity-100
            "
          >
            {s.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
