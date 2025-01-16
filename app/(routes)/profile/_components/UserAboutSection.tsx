import EmployeeQRCode from "@/components/EmployeeQRCode";
import AvatarGroup from "@/components/ui/avatar-group";
import { Card } from "@/components/ui/card";
import { Role, Status, UserProfile } from "@prisma/client";
import { Country } from "country-state-city";
import { Check, Crown, Flag, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import {
  LiaBehance,
  LiaFacebook,
  LiaGithub,
  LiaInstagram,
  LiaLinkedin,
  LiaSkype,
  LiaTwitter,
} from "react-icons/lia";
import { FaMoneyBillWave } from "react-icons/fa";
import { GiBookStorm } from "react-icons/gi";
import { BiLogoZoom } from "react-icons/bi";
import { SiGooglemeet } from "react-icons/si";

interface UserAboutSectionProps {
  user:
    | (UserProfile & { role: Role | null } & { status: Status | null })
    | null;
  teamMembers?: (UserProfile & { role: Role | null })[];
}

const UserAboutSection = ({ user, teamMembers }: UserAboutSectionProps) => {
  const countryName = user?.country
    ? Country.getCountryByCode(user.country)?.name || user.country
    : "Not Specified";

  const teamMembersAvatar =
    teamMembers?.map((member) => ({
      id: parseInt(member.userId, 10),
      userId: member.userId || "",
      name: member.fullName || "",
      image: member.userImage || "",
      role: member.role?.name || "",
    })) || [];
  return (
    <>
      <Card className='w-full flex flex-col gap-10 px-5 py-7 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <div className='flex flex-col gap-4'>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            About
          </h3>
          <div className='flex gap-2'>
            <User className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Full Name: ${user?.fullName}`}</h3>
          </div>
          <div className='flex gap-2'>
            <Check className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Status: ${
              user?.status?.name || "Not Appointed Yet"
            }`}</h3>
          </div>
          <div className='flex gap-2'>
            <Crown className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Role: ${user?.role?.name}`}</h3>
          </div>
          {user?.designation && (
            <div className='flex gap-2'>
              <GiBookStorm className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5'>{`Designation: ${user.designation}`}</h3>
            </div>
          )}
          {user?.salary && (
            <div className='flex gap-2'>
              <FaMoneyBillWave className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5'>{`Salary: ${user.salary} PKR/month`}</h3>
            </div>
          )}
          <div className='flex gap-2'>
            <Flag className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Country: ${countryName}`}</h3>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            Contacts
          </h3>
          {user?.contactNumber && (
            <div className='flex gap-2'>
              <Phone className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5'>
                {`Mobile No: `}
                <Link href={`tel:${user.contactNumber}`}>
                  {user.contactNumber}
                </Link>
              </h3>
            </div>
          )}
          {user?.email && (
            <div className='flex gap-2'>
              <Mail className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Email: ${user.email}`}</h3>
            </div>
          )}
          {user?.skype && (
            <div className='flex gap-2'>
              <LiaSkype className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Skype: ${user.skype}`}</h3>
            </div>
          )}
          {user?.zoomId && (
            <div className='flex gap-2'>
              <BiLogoZoom className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Zoom Id: ${user.zoomId}`}</h3>
            </div>
          )}
          {user?.googleMeetId && (
            <div className='flex gap-2'>
              <SiGooglemeet className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Google Meet Id: ${user.googleMeetId}`}</h3>
            </div>
          )}
          {user?.facebook && (
            <div className='flex gap-2'>
              <LiaFacebook className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Facebook: ${user.facebook}`}</h3>
            </div>
          )}
          {user?.instagram && (
            <div className='flex gap-2'>
              <LiaInstagram className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Instagram: ${user.instagram}`}</h3>
            </div>
          )}
          {user?.linkedIn && (
            <div className='flex gap-2'>
              <LiaLinkedin className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`LinkedIn: ${user.linkedIn}`}</h3>
            </div>
          )}
          {user?.twitter && (
            <div className='flex gap-2'>
              <LiaTwitter className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Twitter: ${user.twitter}`}</h3>
            </div>
          )}
          {user?.github && (
            <div className='flex gap-2'>
              <LiaGithub className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Github: ${user.github}`}</h3>
            </div>
          )}
          {user?.behance && (
            <div className='flex gap-2'>
              <LiaBehance className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Behance: ${user.behance}`}</h3>
            </div>
          )}
        </div>
        <div className='flex gap-2'>
          <EmployeeQRCode employeeId={user?.userId || ""} />
        </div>
        {user?.role?.name !== "User" && (teamMembers?.length ?? 0) > 0 && (
          <div className='flex flex-col gap-4'>
            <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
              Team Members
            </h3>
            <AvatarGroup users={teamMembersAvatar} limit={4} />
          </div>
        )}
      </Card>
    </>
  );
};

export default UserAboutSection;
