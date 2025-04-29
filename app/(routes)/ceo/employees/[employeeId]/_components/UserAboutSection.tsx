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
import {
  Check,
  Crown,
  HeartPulse,
  IdCard,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import CellActions from "../../_components/CellActions";
import { BiLogoZoom, BiWorld } from "react-icons/bi";
import {
  LiaBehance,
  LiaFacebook,
  LiaGithub,
  LiaInstagram,
  LiaLinkedin,
  LiaSkype,
  LiaTwitter,
} from "react-icons/lia";
import { SiGooglemeet } from "react-icons/si";
import Link from "next/link";
import {
  FaFemale,
  FaMale,
  FaMoneyBillWave,
  FaTransgenderAlt,
} from "react-icons/fa";
import { GiBookStorm } from "react-icons/gi";

interface UserAboutSectionProps {
  user: UserProfile | null;
  applicant:
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
  applicant,
  userJobApplications,
}: UserAboutSectionProps) => {
  const countryName = applicant?.country
    ? Country.getCountryByCode(applicant.country)?.name || applicant.country
    : "Not Specified";

  const avatarFallback =
    applicant?.fullName?.substring(0, 2).toUpperCase() || "U";
  return (
    <main>
      <div className='w-full flex flex-col gap-10 px-5 py-10 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <div className='flex flex-col gap-4'>
          <div className='w-full flex flex-col gap-5 items-center justify-center'>
            <div className='lg:w-32 lg:h-32 md:w-24 md:h-24 sm:w-40 sm:h-40 w-32 h-32'>
              {applicant?.userImage ? (
                <Avatar className='w-full h-full'>
                  <AvatarImage
                    className='w-full h-full object-cover object-center'
                    src={applicant.userImage}
                  />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <ClientAvatar avatarFallback={avatarFallback} />
              )}
            </div>
            <div className='flex flex-col gap-2 items-center'>
              <h2 className='text-lg'>{applicant?.fullName}</h2>
              <h3 className='text-muted-foreground text-base bg-gray-800 py-1 px-3 rounded-sm'>
                {applicant?.role?.name}
              </h3>
            </div>
          </div>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            Details
          </h3>
          <Separator />
          <div className='flex gap-2'>
            <User className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Full Name: ${applicant?.fullName}`}</h3>
          </div>
          <div className='flex gap-2'>
            {applicant?.gender === "Male" ? (
              <FaMale className='w-5 h-5 text-muted-foreground' />
            ) : applicant?.gender === "Female" ? (
              <FaFemale className='w-5 h-5 text-muted-foreground' />
            ) : (
              <FaTransgenderAlt className='w-5 h-5 text-muted-foreground' />
            )}
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Gender: ${applicant?.gender}`}</h3>
          </div>
          <div className='flex gap-2'>
            <IdCard className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`CNIC: ${applicant?.cnic}`}</h3>
          </div>
          <div className='flex gap-2'>
            <Check className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Status: ${
              applicant?.status?.name || "Not Appointed Yet"
            }`}</h3>
          </div>
          <div className='flex gap-2'>
            <Crown className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Role: ${applicant?.role?.name}`}</h3>
          </div>
          {applicant?.designation && (
            <div className='flex gap-2'>
              <GiBookStorm className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5'>{`Designation: ${applicant?.designation}`}</h3>
            </div>
          )}
          {applicant?.salary && (
            <div className='flex gap-2'>
              <FaMoneyBillWave className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5'>{`Salary: ${applicant.salary} PKR/month`}</h3>
            </div>
          )}
          <div className='flex gap-2'>
            <BiWorld className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Country: ${countryName}`}</h3>
          </div>
          <div className='flex gap-2'>
            <MapPin className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Address: ${
              applicant?.address === null ? "Not Entered" : applicant?.address
            }`}</h3>
          </div>
          <div className='flex gap-2'>
            <HeartPulse className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Blood Group: ${applicant?.bloodGroup}`}</h3>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            Contacts
          </h3>
          {applicant?.contactNumber && (
            <div className='flex gap-2'>
              <Phone className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5'>
                {`Mobile No: `}
                <Link href={`tel:${applicant?.contactNumber}`}>
                  {applicant?.contactNumber}
                </Link>
              </h3>
            </div>
          )}
          {applicant?.emergencyContactNumber && (
            <div className='flex gap-2'>
              <Phone className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5'>
                {`Emergency Contact No: `}
                <Link href={`tel:${applicant?.emergencyContactNumber}`}>
                  {applicant?.emergencyContactNumber}
                </Link>
              </h3>
            </div>
          )}
          {applicant?.email && (
            <div className='flex gap-2'>
              <Mail className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Email: ${applicant?.email}`}</h3>
            </div>
          )}
          {applicant?.skype && (
            <div className='flex gap-2'>
              <LiaSkype className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Skype: ${applicant?.skype}`}</h3>
            </div>
          )}
          {applicant?.zoomId && (
            <div className='flex gap-2'>
              <BiLogoZoom className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Zoom Id: ${applicant?.zoomId}`}</h3>
            </div>
          )}
          {applicant?.googleMeetId && (
            <div className='flex gap-2'>
              <SiGooglemeet className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Google Meet Id: ${applicant?.googleMeetId}`}</h3>
            </div>
          )}
          {applicant?.facebook && (
            <div className='flex gap-2'>
              <LiaFacebook className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Facebook: ${applicant?.facebook}`}</h3>
            </div>
          )}
          {applicant?.instagram && (
            <div className='flex gap-2'>
              <LiaInstagram className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Instagram: ${applicant?.instagram}`}</h3>
            </div>
          )}
          {applicant?.linkedIn && (
            <div className='flex gap-2'>
              <LiaLinkedin className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`LinkedIn: ${applicant?.linkedIn}`}</h3>
            </div>
          )}
          {applicant?.twitter && (
            <div className='flex gap-2'>
              <LiaTwitter className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Twitter: ${applicant?.twitter}`}</h3>
            </div>
          )}
          {applicant?.github && (
            <div className='flex gap-2'>
              <LiaGithub className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Github: ${applicant?.github}`}</h3>
            </div>
          )}
          {applicant?.behance && (
            <div className='flex gap-2'>
              <LiaBehance className='w-5 h-5 text-muted-foreground' />
              <h3 className='text-muted-foreground text-base -mt-0.5 truncate'>{`Behance: ${applicant?.behance}`}</h3>
            </div>
          )}
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
            company={applicant?.company?.name || ""}
            department={applicant?.department?.name || ""}
            designation={applicant?.designation || ""}
            email={applicant?.email || ""}
            fullName={applicant?.fullName || ""}
            id={applicant?.userId || ""}
            role={applicant?.role?.name || ""}
            user={user}
          />
        </div>
      </div>
    </main>
  );
};

export default UserAboutSection;
