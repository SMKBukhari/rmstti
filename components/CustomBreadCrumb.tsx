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
    pathName?.startsWith("/employee/profile") ||
    pathName?.startsWith("/employee/settings");

  const isAdminPage =
    pathName?.startsWith("/admin/dashboard") ||
    pathName?.startsWith("/admin/employees") ||
    pathName?.startsWith("/admin/applicants") ||
    pathName?.startsWith("/admin/interviewees") ||
    pathName?.startsWith("/admin/profile") ||
    pathName?.startsWith("/admin/settings");

  const isManagerPage =
    pathName?.startsWith("/manager/dashboard") ||
    pathName?.startsWith("/manager/profile") ||
    pathName?.startsWith("/manager/settings");

  const isCEOPage =
    pathName?.startsWith("/ceo/dashboard") ||
    pathName?.startsWith("/ceo/dashboard/employees") ||
    pathName?.startsWith("/ceo/dashboard/applicants") ||
    pathName?.startsWith("/ceo/dashboard/interviewees") ||
    pathName?.startsWith("/ceo/dashboard/overview") ||
    pathName?.startsWith("/ceo/profile") ||
    pathName?.startsWith("/ceo/settings");

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
