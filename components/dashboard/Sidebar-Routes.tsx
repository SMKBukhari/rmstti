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

interface SidebarRoutesProps {
  user: (UserProfile & { role: Role | null }) | null;
}
interface Route {
  href: string;
  icon: LucideIcon;
  label: string;
}
const SidebarRoutes = ({ user }: SidebarRoutesProps) => {
  // const pathName = usePathname();

  // const isAdminPage = pathName?.startsWith("/admin");
  // const isUserPage = pathName?.startsWith("/dashboard");
  // const isProfilePage = pathName?.startsWith("/profile");
  // const isSettingsPage = pathName?.startsWith("/settings");
  // const isRecruiterPage = pathName?.startsWith("/recruiter");
  // const isInterviewerPage = pathName?.startsWith("/interviewer");
  // const isEmployeePage = pathName?.startsWith("/employee");
  // const isManagerPage = pathName?.startsWith("/manager");
  // const isCEOPage = pathName?.startsWith("/ceo");
  // const isSearchPage = pathName?.startsWith("/search");

  // const routes = [
  //   ...(isAdminPage ? adminRoutes : []),
  //   ...(isUserPage ? userRoutes : []),
  //   ...(isProfilePage ? userRoutes : []),
  //   ...(isSettingsPage ? userRoutes : []),
  //   ...(isRecruiterPage ? recruiterRoutes : []),
  //   ...(isInterviewerPage ? interviewerRoutes : []),
  //   ...(isEmployeePage ? employeeRoutes : []),
  //   ...(isManagerPage ? managerRoutes : []),
  //   ...(isCEOPage ? ceoRoutes : []),
  // ]

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
        <SidebarRouteItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
