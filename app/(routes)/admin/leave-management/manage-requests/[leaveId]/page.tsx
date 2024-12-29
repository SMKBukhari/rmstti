import { db } from "@/lib/db";
import { redirect } from "next/navigation";
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
  params: { applicantId: string };
}) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  if (userId.length < 24) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findFirst({
    where: {
      userId: userId,
    },
  });

  const applicant = await db.userProfile.findFirst({
    where: {
      userId: params.applicantId,
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

  const isApplicant = applicant?.role?.name === "Applicant";

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

  if (!user) {
    redirect("/admin/applicants");
  }

  if (!isApplicant) {
    redirect("/admin/applicants");
  }
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb
          breadCrumbPage={applicant?.fullName || ""}
          breadCrumbItem={[{ link: "/admin/applicants", label: "Applicants" }]}
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
