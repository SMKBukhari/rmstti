"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserProfile } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import UserPopover from "./UserPopover";
import { useTheme } from "next-themes";

interface UserNavButtonProps {
  userProfile: UserProfile | null;
}

const UserNavButton = ({ userProfile }: UserNavButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const avatarFallback = userProfile?.fullName?.substring(0, 2).toUpperCase();

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
  return (
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
          <ChevronUp className='w-4 h-4 md:block hidden' />
        ) : (
          <ChevronDown className='w-4 h-4 md:block hidden' />
        )}
      </PopoverTrigger>
      <PopoverContent className='md:w-64 w-52'>
        <UserPopover userProfile={userProfile} />
      </PopoverContent>
    </Popover>
  );
};

export default UserNavButton;
