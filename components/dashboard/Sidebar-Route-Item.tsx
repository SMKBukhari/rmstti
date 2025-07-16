"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarRouteItem = ({
  icon: Icon,
  label,
  href,
}: SidebarRouteItemProps) => {
  const pathName = usePathname();
  const router = useRouter();

  const isActive =
    (pathName === "/" && href === "/") ||
    pathName === href ||
    pathName.startsWith(`${href}/`);

  const onclick = () => {
    router.push(href);
  };
  return (
    <div
      onClick={onclick}
      className={cn(
        "flex items-center m-2 rounded-lg gap-x-2 dark:text-neutral-400 text-neutral-500 text-sm font-[500] pl-6 transition-all dark:hover:text-neutral-400 hover:text-neutral-500 hover:bg-neutral-300/20 cursor-pointer",
        isActive &&
          "text-[#ffff] dark:text-[#ffff] font-medium tracking-wider bg-[#295B81] hover:bg-[#295B81] dark:bg-[#1034ff] dark:hover:bg-[#1034ff] hover:text-[#ffff] dark:hover:text-[#ffff]"
      )}
    >
      <div className='flex items-center gap-x-2 py-4'>
        <Icon
          className={cn(
            "dark:text-neutral-400 text-neutral-500",
            isActive && "text-[#ffff] dark:text-[#ffff]"
          )}
          size={22}
        />
        {label}
      </div>

      {/* Highlighter */}
      {/* <div
        className={cn(
          "ml-auto opacity-0 border-2 dark:border-[#1034ff] border-[#295B81] h-full transition-all", isActive && "opacity-100"
        )}
      ></div> */}
    </div>
  );
};

export default SidebarRouteItem;
