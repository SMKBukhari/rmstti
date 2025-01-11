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
  params: { interviewId: string };
}) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findFirst({
    where: {
      userId: userId,
    },
    include: {
      role: true,
    },
  });

  const departments = await db.department.findMany();
  const roles = await db.role.findMany();

  const interviewee = await db.userProfile.findFirst({
    where: {
      userId: params.interviewId,
    },
    include: {
      role: true,
      status: true,
      skills: true,
      jobExperience: true,
      education: true,
      JobApplications: true,
    },
  });

  const userWithJobExperiences = interviewee
    ? {
        ...interviewee,
        jobExperiences: interviewee?.jobExperience || [],
        userId: interviewee.userId || "", // Ensure `userId` is a string
      }
    : null;

  const userWithEducations = interviewee
    ? {
        ...interviewee,
        educations: interviewee?.education || [],
        userId: interviewee.userId || "",
      }
    : null;

  const userWithJobApplications = interviewee
    ? {
        ...interviewee,
        jobApplications: interviewee?.JobApplications || [],
        userId: interviewee.userId || "",
      }
    : null;

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb
          breadCrumbPage={interviewee?.fullName || ""}
          breadCrumbItem={[{ link: "/admin/interviewees", label: "Interviewees" }]}
        />
      </div>
      <div className='grid md:grid-cols-3 grid-cols-1 md:gap-5 gap-0'>
        <div className='md:col-span-1'>
          <UserAboutSection
            role={roles}
            department={departments}
            applicant={interviewee}
            user={user}
            userJobApplications={userWithJobApplications}
          />
        </div>
        <div className='md:col-span-2'>
          <UserExperienceEducationSection
            userExperiences={userWithJobExperiences}
            userEducations={userWithEducations}
          />
          <UserSkillsSection user={interviewee} />
          <UserCoverLetterSection
            userJobApplications={userWithJobApplications}
          />
          <UserResumeSection user={interviewee} />
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsPage;
