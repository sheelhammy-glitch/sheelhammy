import { FAQItem } from "@/app/(home)/_components/faq";
import { Icon } from "@iconify/react";


export default function FAQRow({
    item,
    isOpen,
    onToggle,
  }: {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
  }) {
    return (
      <div className="group">
        <div
          className={`relative overflow-hidden rounded-xl transition-all duration-300 ${isOpen
            ? "bg-white dark:bg-gray-800 shadow-xl ring-2 ring-[#0056d2]/15"
            : "bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
            }`}
        >
          <div
            className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0056d2] to-[#0056d2] transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-50"
              }`}
          />
  
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-right cursor-pointer"
          >
            <span
              className={`flex-shrink-0 px-2.5 py-1 rounded-md text-xs sm:text-sm font-bold transition-all duration-300 ${isOpen
                ? "bg-[#0056d2] text-white"
                : "bg-[#0056d2]/10 text-[#0056d2] group-hover:bg-[#0056d2]/15"
                }`}
            >
              {item.category}
            </span>
  
            <span
              className={`flex-1 text-sm sm:text-base font-semibold transition-colors duration-200 ${isOpen
                ? "text-[#0056d2]"
                : "text-gray-800 dark:text-gray-200 group-hover:text-[#0056d2]"
                }`}
            >
              {item.q}
            </span>
  
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                ? "bg-[#0056d2] rotate-45"
                : "bg-gray-100 group-hover:bg-[#0056d2]/10"
                }`}
            >
              <Icon
                icon="solar:add-circle-bold"
                className={`w-5 h-5 transition-colors duration-200 ${isOpen
                  ? "text-white"
                  : "text-gray-500 group-hover:text-[#0056d2]"
                  }`}
              />
            </div>
          </button>
  
          <div
            className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-4 pr-16">
                <div className="pt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  