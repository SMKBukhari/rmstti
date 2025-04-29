import { db } from "@/lib/db";
import { cookies } from "next/headers";
import UserAboutSection from "./UserAboutSection";
import UserExperienceEducationSection from "./UserExperienceEducationSection";
import UserSkillsSection from "./UserSkillsSection";
import UserCoverLetterSection from "./UserCoverLetterSection";
import UserResumeSection from "./UserResumeSection";

interface EmployeeProfilePageProps {
  employeeId: string;
}

const EmployeeProfilePage = async ({
  employeeId,
}: EmployeeProfilePageProps) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findFirst({
    where: {
      userId: userId,
    },
  });

  const employee = await db.userProfile.findFirst({
    where: {
      userId: employeeId,
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
      <div className='grid md:grid-cols-3 grid-cols-1 md:gap-5 gap-0'>
        <div className='md:col-span-1'>
          <UserAboutSection
            applicant={employee}
            user={user}
            userJobApplications={userWithJobApplications}
          />
        </div>
        <div className='md:col-span-2'>
          {/* <AttendanceChart userId={employee?.userId ?? ""} /> */}
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

export default EmployeeProfilePage;
