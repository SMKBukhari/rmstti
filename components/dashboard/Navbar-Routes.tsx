"use client";

import { Notifications, UserProfile } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserPopover from "./UserPopover";
import { useState } from "react";
import BellNotification from "./Bell";

interface NavbarRoutesProps {
  userProfile: UserProfile | null;
  notifications:
    | (Notifications & {
        user: { fullName: string; userImage: string | null };
      })[]
    | null;
}

const NavbarRoutes = ({ userProfile, notifications }: NavbarRoutesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  // Get first two characters of the user profile full name
  const avatarFallback = userProfile?.fullName?.substring(0, 2).toUpperCase();

  const { resolvedTheme } = useTheme();

  const userImage = () => {
    if (resolvedTheme === "dark") {
      return "/img/user_dark.png";
    } else {
      return "/img/user_light.png";
    }
  };

  const chevronIcon = () => {
    setIsOpen(!isOpen);
  };

  const generalPage =
    pathName?.startsWith("/settings") ||
    pathName?.startsWith("/profile") ||
    pathName?.startsWith("/notifications");
  const isUserPage = pathName?.startsWith("/dashboard");

  // const isRecruiterPage =
  //   pathName?.startsWith("/recruiter/dashboard") ||
  //   pathName?.startsWith("/recruiter/profile") ||
  //   pathName?.startsWith("/recruiter/settings");

  // const isInterviewerPage =
  //   pathName?.startsWith("/interviewer/dashboard") ||
  //   pathName?.startsWith("/interviewer/profile") ||
  //   pathName?.startsWith("/interviewer/settings");

  const isEmployeePage =
    pathName?.startsWith("/employee/dashboard") ||
    pathName?.startsWith("/employee/profile") ||
    pathName?.startsWith("/employee/settings");

  const isAdminPage =
    pathName?.startsWith("/admin/dashboard") ||
    pathName?.startsWith("/admin/employees") ||
    pathName?.startsWith("/admin/applicants") ||
    pathName?.startsWith("/admin/rejected") ||
    pathName?.startsWith("/admin/interviewees") ||
    pathName?.startsWith("/admin/profile") ||
    pathName?.startsWith("/admin/settings");

  const isManagerPage =
    pathName?.startsWith("/manager/dashboard") ||
    pathName?.startsWith("/manager/employees") ||
    pathName?.startsWith("/manager/applicants") ||
    pathName?.startsWith("/manager/rejected") ||
    pathName?.startsWith("/manager/interviewees") ||
    pathName?.startsWith("/manager/profile") ||
    pathName?.startsWith("/manager/settings");

  const isCEOPage =
    pathName?.startsWith("/ceo/dashboard") ||
    pathName?.startsWith("/ceo/dashboard/employees") ||
    pathName?.startsWith("/ceo/dashboard/applicants") ||
    pathName?.startsWith("/ceo/dashboard/rejected") ||
    pathName?.startsWith("/ceo/dashboard/interviewees") ||
    pathName?.startsWith("/ceo/dashboard/overview") ||
    pathName?.startsWith("/ceo/profile") ||
    pathName?.startsWith("/ceo/settings");

  // Make sure the condition is grouped correctly
  const shouldShowPopover =
    generalPage ||
    isAdminPage ||
    isUserPage ||
    // isRecruiterPage ||
    // isInterviewerPage ||
    isEmployeePage ||
    isManagerPage ||
    isCEOPage;

  return (
    <div className='flex justify-between w-full items-center'>
      <div>
        <p className='text-muted-foreground md:text-sm text-xs'>
          Welcome back!
        </p>
        {userProfile?.fullName ? (
          <h1 className='md:text-xl text-lg font-semibold text-neutral-900 dark:text-neutral-100'>
            {userProfile.fullName}
          </h1>
        ) : (
          <h1 className='md:text-xl text-lg font-semibold text-neutral-900 dark:text-neutral-100'>
            User
          </h1>
        )}
      </div>
      <div className='flex gap-x-5 ml-auto items-center'>
        <BellNotification user={userProfile} notifications={notifications} />
        {shouldShowPopover && (
          <Popover onOpenChange={chevronIcon}>
            <PopoverTrigger className='flex items-center gap-2'>
              {userProfile?.userImage ? (
                <Avatar>
                  <AvatarImage src={userProfile.userImage} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarImage src={userImage()} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              )}
              {isOpen ? (
                <ChevronDown className='w-4 h-4 md:block hidden' />
              ) : (
                <ChevronUp className='w-4 h-4 md:block hidden' />
              )}
            </PopoverTrigger>
            <PopoverContent className='md:w-64 w-52'>
              <UserPopover userProfile={userProfile} />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default NavbarRoutes;
