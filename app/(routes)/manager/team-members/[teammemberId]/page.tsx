import { db } from "@/lib/db";
import UserAboutSection from "./_components/UserAboutSection";
import UserExperienceEducationSection from "./_components/UserExperienceEducationSection";
import UserCoverLetterSection from "./_components/UserCoverLetterSection";
import UserSkillsSection from "./_components/UserSkillsSection";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import UserResumeSection from "./_components/UserResumeSection";
import { cookies } from "next/headers";

const ApplicantDetailsPage = async ({
  params,
}: {
  params: { teammemberId: string };
}) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findFirst({
    where: {
      userId: userId,
    },
  });

  const applicant = await db.userProfile.findFirst({
    where: {
      userId: params.teammemberId,
    },
    include: {
      role: true,
      status: true,
      skills: true,
      jobExperience: true,
      education: true,
      JobApplications: true,
      company: true,
      department: true,
    },
  });

  const userWithJobExperiences = applicant
    ? {
        ...applicant,
        jobExperiences: applicant?.jobExperience || [],
        userId: applicant.userId || "", // Ensure `userId` is a string
      }
    : null;

  const userWithEducations = applicant
    ? {
        ...applicant,
        educations: applicant?.education || [],
        userId: applicant.userId || "",
      }
    : null;

  const userWithJobApplications = applicant
    ? {
        ...applicant,
        jobApplications: applicant?.JobApplications || [],
        userId: applicant.userId || "",
      }
    : null;

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb
          breadCrumbPage={applicant?.fullName || ""}
          breadCrumbItem={[
            { link: "/manager/team-members", label: "Team Members" },
          ]}
        />
      </div>
      <div className='grid md:grid-cols-3 grid-cols-1 md:gap-5 gap-0'>
        <div className='md:col-span-1'>
          <UserAboutSection
            applicant={applicant}
            user={user}
            userJobApplications={userWithJobApplications}
          />
        </div>
        <div className='md:col-span-2'>
          <UserExperienceEducationSection
            userExperiences={userWithJobExperiences}
            userEducations={userWithEducations}
          />
          <UserSkillsSection user={applicant} />
          <UserCoverLetterSection
            userJobApplications={userWithJobApplications}
          />
          <UserResumeSection user={applicant} />
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsPage;
