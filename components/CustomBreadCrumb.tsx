"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface CustomBreadCrumbProps {
  breadCrumbPage: string;
  breadCrumbItem?: { link: string; label: string }[];
}

const CustomBreadCrumb = ({
  breadCrumbPage,
  breadCrumbItem,
}: CustomBreadCrumbProps) => {
  const pathName = usePathname();

  const isEmployeePage =
    pathName?.startsWith("/employee/dashboard") ||
    pathName?.startsWith("/employee/team-members") ||
    pathName?.startsWith("/employee/attendance-management") ||
    pathName?.startsWith("/employee/leave-management") ||
    pathName?.startsWith("/employee/workFromHome") ||
    pathName?.startsWith("/employee/resign") ||
    pathName?.startsWith("/employee/requests") ||
    pathName?.startsWith("/employee/complaints") ||
    pathName?.startsWith("/employee/appraisals") ||
    pathName?.startsWith("/employee/profile") ||
    pathName?.startsWith("/employee/settings") ||
    pathName?.startsWith("/notifications");

  const isAdminPage =
    pathName?.startsWith("/admin/dashboard") ||
    pathName?.startsWith("/admin/team-members") ||
    pathName?.startsWith("/admin/attendance-management") ||
    pathName?.startsWith("/admin/leave-management") ||
    pathName?.startsWith("/admin/workFromHome") ||
    pathName?.startsWith("/admin/timetable") ||
    pathName?.startsWith("/admin/jobs") ||
    pathName?.startsWith("/admin/employees") ||
    pathName?.startsWith("/admin/applicants") ||
    pathName?.startsWith("/admin/rejected") ||
    pathName?.startsWith("/admin/interviewees") ||
    pathName?.startsWith("/admin/resignationManagement") ||
    pathName?.startsWith("/admin/requests") ||
    pathName?.startsWith("/admin/complaints") ||
    pathName?.startsWith("/admin/appraisals") ||
    pathName?.startsWith("/admin/contract-management") ||
    pathName?.startsWith("/admin/profile") ||
    pathName?.startsWith("/admin/settings") ||
    pathName?.startsWith("/admin/configuration") ||
    pathName?.startsWith("/notifications");

  const isManagerPage =
    pathName?.startsWith("/manager/dashboard") ||
    pathName?.startsWith("/manager/team-members") ||
    pathName?.startsWith("/manager/attendance-management") ||
    pathName?.startsWith("/manager/leave-management") ||
    pathName?.startsWith("/manager/workFromHome") ||
    pathName?.startsWith("/manager/applicants") ||
    pathName?.startsWith("/manager/rejected") ||
    pathName?.startsWith("/manager/interviewees") ||
    pathName?.startsWith("/manager/resign") ||
    pathName?.startsWith("/manager/requests") ||
    pathName?.startsWith("/manager/complaints") ||
    pathName?.startsWith("/manager/appraisals") ||
    pathName?.startsWith("/manager/profile") ||
    pathName?.startsWith("/manager/settings") ||
    pathName?.startsWith("/notifications");

  const isCEOPage =
    pathName?.startsWith("/ceo/dashboard") ||
    pathName?.startsWith("/ceo/employees") ||
    pathName?.startsWith("/ceo/leave-management") ||
    pathName?.startsWith("/ceo/workFromHome") ||
    pathName?.startsWith("/ceo/attendance-management") ||
    pathName?.startsWith("/ceo/timetable") ||
    pathName?.startsWith("/ceo/jobs") ||
    pathName?.startsWith("/ceo/applicants") ||
    pathName?.startsWith("/ceo/rejected") ||
    pathName?.startsWith("/ceo/interviewees") ||
    pathName?.startsWith("/ceo/resign/manage-resignations") ||
    pathName?.startsWith("/ceo/requests") ||
    pathName?.startsWith("/ceo/complaints") ||
    pathName?.startsWith("/ceo/overview") ||
    pathName?.startsWith("/ceo/profile") ||
    pathName?.startsWith("/ceo/settings") ||
    pathName?.startsWith("/ceo/configuration") ||
    pathName?.startsWith("/notifications");

  let dashboardLink = "/dashboard";
  if (isAdminPage) {
    dashboardLink = "/admin/dashboard";
  } else if (isEmployeePage) {
    dashboardLink = "/employee/dashboard";
  } else if (isManagerPage) {
    dashboardLink = "/manager/dashboard";
  } else if (isCEOPage) {
    dashboardLink = "/ceo/dashboard";
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={dashboardLink}
            className='flex items-center justify-center'
          >
            <Home className='w-3 h-3 mr-2' />
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadCrumbItem && (
          <>
            {breadCrumbItem.map((item, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </>
        )}

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadCrumb;
