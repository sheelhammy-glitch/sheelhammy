import { cn } from "@/lib/utils";


export const ReviewCard = ({
    img,
    name,
    username,
    body,
  }: {
    img: string;
    name: string;
    username: string;
    body: string;
  }) => {
    return (
      <figure
        className={cn(
          "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300",
          
          "border-[#0056d2]/20 bg-[#EFF6FF] hover:bg-[#E1EFFF] hover:border-[#0056d2]/40 hover:shadow-lg",
         
          "dark:border-[#0056d2]/30 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 dark:hover:border-[#0056d2]/50"
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <img
            className="rounded-full border-2 border-[#0056d2]/20 dark:border-[#0056d2]/30"
            width="24"
            height="24"
            alt=""
            src={img}
          />
          <div className="flex flex-col">
            <figcaption className="text-sm font-semibold text-gray-900 dark:text-white">
              {name}
            </figcaption>
            <p className="text-xs font-medium text-[#0056d2] dark:text-[#5ba0ff]">{username}</p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{body}</blockquote>
      </figure>
    );
  };
  