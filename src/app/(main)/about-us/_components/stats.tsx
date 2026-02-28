"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";

const STATS = [
  { icon: "fluent-emoji-high-contrast:man-teacher", number: 95, label: "خبير متخصص", suffix: "+" },
  { icon: "solar:case-bold", number: 4000, label: "واجب منجز", suffix: "+" },
  { icon: "solar:book-bold", number: 900, label: "بحث أكاديمي", suffix: "+" },
  { icon: "eos-icons:project-outlined", number: 7500, label: "مشروع مكتمل", suffix: "+" },
  { icon: "solar:verified-check-bold", number: 6, label: "سنوات خبرة", suffix: "+" },
  { icon: "solar:users-group-two-rounded-bold", number: 5000, label: "طالب وثقوا بنا", suffix: "+" },
];

function CountUp({
  end,
  duration = 2800,
  start,
}: {
  end: number;
  duration?: number;
  start: boolean;
}) {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!start || !mounted) return;

    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(percentage * end));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start, mounted]);
 
 
  const displayCount = count.toLocaleString('en-US');

  return <span suppressHydrationWarning>{displayCount}</span>;
}

export function Stats() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} dir="rtl" className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:w-7xl w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-7">
          {STATS.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group cursor-default">

              <div
                className="
                  relative w-16 h-16 rounded-xl
                  bg-white
                  flex items-center justify-center mb-3
                  border border-[#0056d2]/20
                  shadow-[0_4px_12px_#e1efff]
                  transition-all duration-300
                  overflow-hidden
                "
              >
                <span className="absolute inset-0 pointer-events-none">
                  <span
                    className="absolute inset-[-2px] rounded-[14px] animate-spin"
                    style={{
                      animationDuration: "3s",
                      background:
                        "conic-gradient(from 0deg, rgba(0,86,210,0) 0deg, rgba(0,86,210,0.95) 80deg, rgba(0,86,210,0) 160deg, rgba(0,86,210,0) 360deg)",
                    }}
                  />
                  <span className="absolute inset-[2px] rounded-[12px] bg-white" />
                </span>

                <Icon
                  icon={stat.icon}
                  className="relative w-7 h-7 text-[#0056d2]"
                />
              </div>

              <div className="text-2xl md:text-3xl font-bold text-[#0f1114] mb-1 transition-colors duration-300 group-hover:text-[#0056d2]">
                {stat.suffix}
                <CountUp end={stat.number} start={startCount} />
              </div>

              <div className="text-sm md:text-base font-bold text-gray-700 transition-colors duration-300 group-hover:text-[#0056d2]">
                {stat.label}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
