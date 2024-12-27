import ClientAvatar from "@/components/AvatarClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Role, UserProfile } from "@prisma/client";
import { format } from "date-fns";
import { CalendarCheck, Crown, MapPin } from "lucide-react";

interface UserProfileSectionProps {
  user: (UserProfile & { role: Role | null }) | null;
}
const UserProfileSection = ({ user }: UserProfileSectionProps) => {
  const avatarFallback = user?.fullName?.substring(0, 2).toUpperCase() || "U";
  return (
    <Card className='w-full md:h-24 h-40 flex md:flex-row flex-col md:justify-start justify-end items-center bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl relative'>
      <div className='md:w-16 md:h-16 sm:w-24 sm:h-24 w-16 h-16  ml-5 md:relative absolute md:-top-0 -top-3'>
        {user?.userImage ? (
          <Avatar className='w-full h-full'>
            <AvatarImage src={user.userImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        ) : (
          <ClientAvatar avatarFallback={avatarFallback} />
        )}
      </div>
      <div className='ml-2 flex flex-col md:items-start items-center gap-1 md:mb-0 mb-3'>
        <h2 className='font-normal text-base'>{user?.fullName}</h2>
        <div className='flex gap-4 flex-wrap md:justify-start justify-center'>
          <div className='flex gap-1 items-center'>
            <Crown className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-sm mt-0.5'>
              {user?.role?.name}
            </h3>
          </div>
          <div className='flex gap-1 items-center'>
            <MapPin className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-sm mt-0.5'>
              {`${user?.city}`}
            </h3>
          </div>
          <div className='flex gap-1 items-center'>
            <CalendarCheck className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-sm mt-0.5'>
              {user?.DOJ
                ? format(new Date(user?.DOJ), "dd MMM yyyy")
                : "Not Appointed Yet"}
            </h3>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserProfileSection;
