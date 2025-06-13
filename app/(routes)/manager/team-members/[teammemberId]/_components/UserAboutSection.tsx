"use client";
import ClientAvatar from "@/components/AvatarClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  company,
  Department,
  JobApplications,
  Role,
  Status,
  UserProfile,
} from "@prisma/client";
import { Country } from "country-state-city";
import { Check, Crown, Flag, Mail, User } from "lucide-react";
import CellActions from "../../_components/CellActions";

interface UserAboutSectionProps {
  user: UserProfile | null;
  employee:
    | (UserProfile & { role: Role | null } & { status: Status | null } & {
        company: company | null;
      } & { department: Department | null })
    | null;
  userJobApplications:
    | (UserProfile & { jobApplications: JobApplications[] })
    | null;
}

const UserAboutSection = ({
  user,
  employee,
  userJobApplications,
}: UserAboutSectionProps) => {
  const countryName = employee?.country
    ? Country.getCountryByCode(employee.country)?.name || employee.country
    : "Not Specified";

  const avatarFallback =
    employee?.fullName?.substring(0, 2).toUpperCase() || "U";
  return (
    <main>
      <div className='w-full flex flex-col gap-10 px-5 py-10 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <div className='flex flex-col gap-4'>
          <div className='w-full flex flex-col gap-5 items-center justify-center'>
            <div className='lg:w-32 lg:h-32 md:w-24 md:h-24 sm:w-40 sm:h-40 w-32 h-32'>
              {employee?.userImage ? (
                <Avatar className='w-full h-full'>
                  <AvatarImage className="w-full h-full object-cover object-center" src={employee.userImage} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <ClientAvatar avatarFallback={avatarFallback} />
              )}
            </div>
            <div className='flex flex-col gap-2 items-center'>
              <h2 className='text-lg'>{employee?.fullName}</h2>
              <h3 className='text-muted-foreground text-base bg-gray-800 py-1 px-3 rounded-sm'>
                {employee?.role?.name}
              </h3>
            </div>
          </div>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            Details
          </h3>
          <Separator />
          <div className='flex gap-2'>
            <User className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Full Name: ${employee?.fullName}`}</h3>
          </div>
          <div className='flex gap-2'>
            <Mail className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Email: ${employee?.email}`}</h3>
          </div>
          <div className='flex gap-2'>
            <Check className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Status: ${
              employee?.status?.name || "Not Appointed Yet"
            }`}</h3>
          </div>
          <div className='flex gap-2'>
            <Crown className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Role: ${employee?.role?.name}`}</h3>
          </div>
          <div className='flex gap-2'>
            <Flag className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Country: ${countryName}`}</h3>
          </div>
        </div>
        <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
          Reference
        </h3>
        <Separator className='-mt-5' />
        {userJobApplications?.jobApplications.map((application, index) => (
          <div key={index} className='flex flex-col gap-1 -mt-6'>
            {application.reference ? (
              <h3 className='text-muted-foreground text-base'>
                {application.reference}
              </h3>
            ) : (
              <h3 className='text-muted-foreground text-base'>
                No reference provided.
              </h3>
            )}
            {application.referenceContact ? (
              <h3 className='text-muted-foreground text-base'>
                {application.referenceContact}
              </h3>
            ) : (
              <h3 className='text-muted-foreground text-base'>
                No reference contact provided.
              </h3>
            )}
          </div>
        ))}
        <div className='flex sm:flex-row w-full flex-col flex-wrap justify-end gap-4'>
          <CellActions
            company={employee?.company?.name || ""}
            department={employee?.department?.name || ""}
            designation={employee?.designation || ""}
            email={employee?.email || ""}
            fullName={employee?.fullName || ""}
            id={employee?.userId || ""}
            role={employee?.role?.name || ""}
            user={user}
          />
        </div>
      </div>

      
    </main>
  );
};

export default UserAboutSection;
