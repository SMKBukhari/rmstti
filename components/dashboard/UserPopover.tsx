import { LogOut, Settings, UserRoundPen } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { UserProfile } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";

interface UserPopoverProps {
  userProfile: UserProfile | null;
}

const UserPopover = ({ userProfile }: UserPopoverProps) => {
  const avatarFallback = userProfile?.fullName?.substring(0, 2).toUpperCase();
  //   Get the first two words of the user profile fullname
  const profileName =
    userProfile?.fullName?.split(" ")[0] +
    " " +
    userProfile?.fullName?.split(" ")[1];

  const { resolvedTheme } = useTheme();

  const userImage = () => {
    if (resolvedTheme === "dark") {
      return "/img/user_dark.png";
    } else {
      return "/img/user_light.png";
    }
  };
  const router = useRouter();
  const handleSignOut = () => {
    // Clear session data
    Cookies.remove("sessionToken");
    Cookies.remove("sessionExpiry");
    Cookies.remove("userId");
    router.push("/signIn");
    toast.success("Signed out successfully");
  };
  return (
    <div className='flex flex-col gap-2.5'>
      <div className='flex gap-2 items-center'>
        {userProfile?.userImage ? (
          <Avatar>
            <AvatarImage className="w-full object-cover object-center" src={userProfile.userImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar>
            <AvatarImage className="w-full object-cover object-center" src={userImage()} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <h2 className='font-normal md:text-sm text-xs'>{profileName}</h2>
          <h3 className='text-muted-foreground md:text-xs text-[10px]'>
            {userProfile?.email}
          </h3>
        </div>
      </div>
      <Separator />
      <Link href={"/profile"}>
        <Button
          variant={"ghost"}
          className='flex gap-2 items-center justify-start w-full'
        >
          <UserRoundPen size={20} />
          <h4>Profile</h4>
        </Button>
      </Link>
      <Link href={"/settings"}>
        <Button
          variant={"ghost"}
          className='flex gap-2 items-center justify-start w-full'
        >
          <Settings size={20} />
          <h4>Settings</h4>
        </Button>
      </Link>
      <Button
        variant={"ghost"}
        className='flex gap-2 items-center justify-start hover:dark:text-[#ff816b] dark:text-[#ff816b] text-[#d31510] hover:text-[#d31510]'
        onClick={handleSignOut}
      >
        <LogOut size={20} />
        <h4>Sign Out</h4>
      </Button>
    </div>
  );
};

export default UserPopover;
