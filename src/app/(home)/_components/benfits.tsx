import { Icon } from "@iconify/react";
import React from "react";

export default function Benfits() {
  const FEATURES = [
    {
      icon: "solar:clipboard-check-bold",
      title: "متابعة أكاديمية شاملة",
      subtitle: "تنفيذ منظم من الفكرة حتى التسليم",
    },
    {
      icon: "solar:chart-2-bold",
      title: "نتائج أكاديمية مدروسة",
      subtitle: "تحسين واضح في مستوى الأداء",
    },
    {
      icon: "solar:shield-check-bold",
      title: "معايير أكاديمية دقيقة",
      subtitle: "سرية تامة وتنفيذ احترافي",
    },

  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div key={index} className="relative">

              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div
                  className="absolute inset-[-2px] rounded-2xl animate-spin"
                  style={{
                    animationDuration: "6s",
                    background:
                      "conic-gradient(from 0deg, rgba(0,86,210,0) 0deg, rgba(0,86,210,0.9) 90deg, rgba(0,86,210,0) 180deg, rgba(0,86,210,0) 360deg)",
                  }}
                />
              </div>

              <div
                className="
                  relative rounded-2xl p-5 bg-white m-[2px]
                  shadow-[0_8px_20px_#e1efff]
                  transition-all duration-300
                "
              >
                <div className="flex items-start gap-4">

                  <div className="flex-shrink-0 w-12 h-12 rounded-xl 
                  flex items-center justify-center bg-[#0056d2]">
                    <Icon
                      icon={feature.icon}
                      className="w-6 h-6 text-[#ffffff]"
                    />
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-lg font-bold text-gray-900 leading-snug">
                      {feature.title}
                    </p>
                    <p className="text-base text-gray-700 mt-1 leading-snug">
                      {feature.subtitle}
                    </p>

                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
