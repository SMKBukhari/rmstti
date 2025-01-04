import {
  company,
  Department,
  Education,
  JobExperience,
  Skills,
  UserProfile,
} from "@prisma/client";
import SocialLinls from "./_components/socialLinks";
import UserExperiences from "./_components/userExperiences";
import UserEducation from "./_components/userEducations";
import UserSkillss from "./_components/userSkills";
import UserResumeUpload from "./_components/userResumeUpload";
import { Card } from "@/components/ui/card";
import CreateDepartments from "./_components/createdepartments";
import CompanyBasicInfo from "./_components/basic";

interface GeneralTabPageProps {
  user: UserProfile | null;
  userExperiences: (UserProfile & { jobExperiences: JobExperience[] }) | null;
  userEducation: (UserProfile & { education: Education[] }) | null;
  userSkills: (UserProfile & { skills: Skills[] }) | null;
  departments: (Department & { users: UserProfile[] })[];
  company: (UserProfile & { company: company | null }) | null;
}

const GeneralTabPage = ({
  user,
  userExperiences,
  userEducation,
  userSkills,
  departments,
  company,
}: GeneralTabPageProps) => {
  return (
    <>
      <div className='w-full flex flex-col items-center justify-center gap-10 px-5 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        {/* <BasicInfo user={user} /> */}
        <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
          <h2 className='text-xl font-medium text-muted-foreground self-start'>
            Company Details
          </h2>
          <CompanyBasicInfo company={company} />
        </Card>
        <CreateDepartments user={userSkills} departments={departments} />
      </div>

      <UserResumeUpload user={user} />

      <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Social Links
        </h2>
        <SocialLinls user={user} />
      </Card>

      <UserExperiences user={userExperiences} />

      <UserEducation user={userEducation} />

      <UserSkillss user={userSkills} />
    </>
  );
};

export default GeneralTabPage;
