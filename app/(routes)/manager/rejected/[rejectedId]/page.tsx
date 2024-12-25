import { db } from "@/lib/db";
import UserAboutSection from "./_components/UserAboutSection";
import UserExperienceEducationSection from "./_components/UserExperienceEducationSection";
import UserCoverLetterSection from "./_components/UserCoverLetterSection";
import UserSkillsSection from "./_components/UserSkillsSection";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import UserResumeSection from "./_components/UserResumeSection";
import { cookies } from "next/headers";

const RejectedApplicantDetailsPage = async ({
  params,
}: {
  params: { rejectedId: string };
}) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findFirst({
    where: {
      userId: userId,
    },
  });

  const rejectedApplicant = await db.userProfile.findFirst({
    where: {
      userId: params.rejectedId,
    },
    include: {
      role: true,
      status: true,
      skills: true,
      jobExperience: true,
      education: true,
      JobApplications: true,
      applicationStatus: true,
    },
  });

  const isRejectedApplicant =
    rejectedApplicant?.applicationStatus?.name === "Rejected";

  const userWithJobExperiences = rejectedApplicant
    ? {
        ...rejectedApplicant,
        jobExperiences: rejectedApplicant?.jobExperience || [],
        userId: rejectedApplicant.userId || "", // Ensure `userId` is a string
      }
    : null;

  const userWithEducations = rejectedApplicant
    ? {
        ...rejectedApplicant,
        educations: rejectedApplicant?.education || [],
        userId: rejectedApplicant.userId || "",
      }
    : null;

  const userWithJobApplications = rejectedApplicant
    ? {
        ...rejectedApplicant,
        jobApplications: rejectedApplicant?.JobApplications || [],
        userId: rejectedApplicant.userId || "",
      }
    : null;

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb
          breadCrumbPage={rejectedApplicant?.fullName || ""}
          breadCrumbItem={[{ link: "/admin/rejected", label: "Rejected" }]}
        />
      </div>
      <div className='grid md:grid-cols-3 grid-cols-1 md:gap-5 gap-0'>
        <div className='md:col-span-1'>
          <UserAboutSection
            isRejectedApplicant={isRejectedApplicant}
            applicant={rejectedApplicant}
            user={user}
            userJobApplications={userWithJobApplications}
          />
        </div>
        <div className='md:col-span-2'>
          <UserExperienceEducationSection
            userExperiences={userWithJobExperiences}
            userEducations={userWithEducations}
          />
          <UserSkillsSection user={rejectedApplicant} />
          <UserCoverLetterSection
            userJobApplications={userWithJobApplications}
          />
          <UserResumeSection user={rejectedApplicant} />
        </div>
      </div>
    </div>
  );
};

export default RejectedApplicantDetailsPage;
