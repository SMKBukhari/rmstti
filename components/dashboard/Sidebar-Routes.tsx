"use client";
// import { usePathname, useRouter } from "next/navigation";
import SidebarRouteItem from "./Sidebar-Route-Item";
// import { Separator } from "@/components/ui/separator";
import {
  adminRoutes,
  ceoRoutes,
  employeeRoutes,
  // interviewerRoutes,
  managerRoutes,
  // recruiterRoutes,
  userRoutes,
} from "@/lib/data";
import { Role, UserProfile } from "@prisma/client";
import { LucideIcon } from "lucide-react";
import CollapsibleNavItem from "./CollapsibleNavItem";

interface SidebarRoutesProps {
  user: (UserProfile & { role: Role | null }) | null;
}
interface Route {
  href: string;
  icon: LucideIcon;
  label: string;
  subitems?: Route[];
}
const SidebarRoutes = ({ user }: SidebarRoutesProps) => {

  // Check user role with the routes
  let routes: Route[] = [];

  if (user?.role?.name === "Admin") {
    routes = adminRoutes;
  } else if (user?.role?.name === "User" || user?.role?.name === "Applicant" || user?.role?.name === "Interviewee") {
    routes = userRoutes;
  } else if (user?.role?.name === "Employee") {
    routes = employeeRoutes;
  } else if (user?.role?.name === "Manager") {
    routes = managerRoutes;
  } else if (user?.role?.name === "CEO") {
    routes = ceoRoutes;
  }

  return (
    <div className='flex flex-col w-full'>
      {routes.map((route) => (
        route.subitems ? (
          <CollapsibleNavItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            subitems={route.subitems}
          />
        ) : (
          <SidebarRouteItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        )
      ))}
    </div>
  );
};

export default SidebarRoutes;
