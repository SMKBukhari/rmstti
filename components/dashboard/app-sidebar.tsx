"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Bell,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  LucideIcon,
  Settings,
  UserRoundPen,
} from "lucide-react";
import {
  adminRoutes,
  ceoRoutes,
  employeeRoutes,
  managerRoutes,
  userRoutes,
} from "@/lib/data";
import { Role, UserProfile } from "@prisma/client";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Image from "next/image";

interface AppSidebarProps {
  user: (UserProfile & { role: Role | null }) | null;
}

interface Route {
  href: string;
  icon: LucideIcon;
  label: string;
  subitems?: Route[];
}

export default function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const handleSignOut = () => {
    // Clear session data
    Cookies.remove("sessionToken");
    Cookies.remove("sessionExpiry");
    Cookies.remove("userId");
    router.push("/signIn");
    toast.success("Signed out successfully");
  };

  const company = {
    name: "The Truth International",
    logo: "/img/logo_white_tti.svg",
    designation: user?.designation,
  };

  let routes: Route[] = [];

  if (user?.role?.name === "Admin") {
    routes = adminRoutes;
  } else if (
    user?.role?.name === "User" ||
    user?.role?.name === "Applicant" ||
    user?.role?.name === "Interviewee"
  ) {
    routes = userRoutes;
  } else if (user?.role?.name === "Employee") {
    routes = employeeRoutes;
  } else if (user?.role?.name === "Manager") {
    routes = managerRoutes;
  } else if (user?.role?.name === "CEO") {
    routes = ceoRoutes;
  }

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex gap-2 py-2 text-sidebar-accent-foreground'>
          <div className='flex aspect-square size-8 items-center relative justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
            <Image src={company.logo} alt={company.name} width={10} height={10} />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>{company.name}</span>
            <span className='truncate text-xs'>{company.designation}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {routes.map((route) =>
              route.subitems ? (
                <Collapsible key={route.href} className='w-full'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={pathname.startsWith(route.href)}
                        tooltip={route.label}
                      >
                        <route.icon className='mr-2 h-4 w-4' />
                        <span>{route.label}</span>
                        <ChevronRight className='ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {route.subitems.map((subitem) => (
                          <SidebarMenuSubItem key={subitem.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subitem.href}
                            >
                              <Link href={subitem.href}>
                                <subitem.icon className='mr-2 h-4 w-4' />
                                <span>{subitem.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === route.href ||
                      pathname.startsWith(`${route.href}/`)
                    }
                    tooltip={route.label}
                  >
                    <Link href={route.href}>
                      <route.icon className='mr-2 h-4 w-4' />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage
                      src={user?.userImage || ""}
                      alt={user?.fullName || ""}
                    />
                    <AvatarFallback className='rounded-lg'>
                      {user?.fullName?.slice(0, 2)?.toUpperCase() || "CN"}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.fullName || ""}
                    </span>
                    <span className='truncate text-xs'>
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarImage
                        src={user?.userImage || ""}
                        alt={user?.fullName || ""}
                      />
                      <AvatarFallback className='rounded-lg'>
                        {user?.fullName?.slice(0, 2)?.toUpperCase() || "CN"}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {user?.fullName || ""}
                      </span>
                      <span className='truncate text-xs'>
                        {user?.email || ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href={"/profile"}>
                    <DropdownMenuItem className='cursor-pointer'>
                      <UserRoundPen className='mr-2 h-4 w-4' />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"/settings"}>
                    <DropdownMenuItem className='cursor-pointer'>
                      <Settings className='mr-2 h-4 w-4' />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"/notifications"}>
                    <DropdownMenuItem className='cursor-pointer'>
                      <Bell className='mr-2 h-4 w-4' />
                      Notifications
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className='cursor-pointer'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
