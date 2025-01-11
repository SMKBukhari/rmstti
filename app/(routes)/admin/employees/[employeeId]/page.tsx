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
  params: { employeeId: string };
}) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findFirst({
    where: {
      userId: userId,
    },
  });

  const employee = await db.userProfile.findFirst({
    where: {
      userId: params.employeeId,
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

  const userWithJobExperiences = employee
    ? {
        ...employee,
        jobExperiences: employee?.jobExperience || [],
        userId: employee.userId || "", // Ensure `userId` is a string
      }
    : null;

  const userWithEducations = employee
    ? {
        ...employee,
        educations: employee?.education || [],
        userId: employee.userId || "",
      }
    : null;

  const userWithJobApplications = employee
    ? {
        ...employee,
        jobApplications: employee?.JobApplications || [],
        userId: employee.userId || "",
      }
    : null;

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb
          breadCrumbPage={employee?.fullName || ""}
          breadCrumbItem={[{ link: "/admin/employees", label: "Employees" }]}
        />
      </div>
      <div className='grid md:grid-cols-3 grid-cols-1 md:gap-5 gap-0'>
        <div className='md:col-span-1'>
          <UserAboutSection
            applicant={employee}
            user={user}
            userJobApplications={userWithJobApplications}
          />
        </div>
        <div className='md:col-span-2'>
          <UserExperienceEducationSection
            userExperiences={userWithJobExperiences}
            userEducations={userWithEducations}
          />
          <UserSkillsSection user={employee} />
          <UserCoverLetterSection
            userJobApplications={userWithJobApplications}
          />
          <UserResumeSection user={employee} />
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsPage;
