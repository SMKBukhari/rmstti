"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { type LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import SidebarRouteItem from "./Sidebar-Route-Item";

interface CollapsibleNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  subitems: {
    icon: LucideIcon;
    label: string;
    href: string;
  }[];
}

const CollapsibleNavItem = ({
  icon: Icon,
  label,
  href,
  subitems,
}: CollapsibleNavItemProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = pathname.startsWith(href);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger className="w-full">
        <div
          className={cn(
            "flex items-center justify-between m-2 rounded-lg gap-x-2 dark:text-neutral-400 text-neutral-500 text-sm font-[500] pl-6 transition-all dark:hover:text-neutral-400 hover:text-neutral-500 hover:bg-neutral-300/20 cursor-pointer",
            isActive &&
              "text-[#ffff] dark:text-[#ffff] font-medium tracking-wider bg-[#295B81] hover:bg-[#295B81] dark:bg-[#1034ff] dark:hover:bg-[#1034ff] hover:text-[#ffff] dark:hover:text-[#ffff]"
          )}
        >
          <div className="flex items-center gap-x-2 py-4">
            <Icon
              className={cn("dark:text-neutral-400 text-neutral-500", isActive && "text-[#ffff] dark:text-[#ffff]")}
              size={22}
            />
            {label}
          </div>
          <ChevronDown
            className={cn(
              "mr-2 h-4 w-4 transition-transform duration-200",
              isOpen && "-rotate-180"
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {subitems.map((subitem) => (
          <SidebarRouteItem
            key={subitem.href}
            icon={subitem.icon}
            label={subitem.label}
            href={subitem.href}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleNavItem;

