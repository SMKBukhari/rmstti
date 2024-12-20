import { Education, JobExperience, Skills, UserProfile } from "@prisma/client";
import ImageUpload from "./_components/imageUpload";
import UserBaiscInfo from "./_components/userBasicInfo";
import SocialLinls from "./_components/socialLinks";
import UserExperiences from "./_components/userExperiences";
import UserEducation from "./_components/userEducations";
import UserSkillss from "./_components/userSkills";
import UserResumeUpload from "./_components/userResumeUpload";

interface AccountTabPageProps {
  user: UserProfile | null;
  userExperiences: (UserProfile & { jobExperiences: JobExperience[] }) | null;
  userEducation: (UserProfile & { education: Education[] }) | null;
  userSkills: (UserProfile & { skills: Skills[] }) | null;
}

const AccountTabPage = ({ user, userExperiences, userEducation, userSkills }: AccountTabPageProps) => {
  return (
    <>
      <div className='w-full flex flex-col items-center justify-center gap-10 px-5 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <ImageUpload user={user} />
        <UserBaiscInfo user={user} />
      </div>

      <UserResumeUpload user={user} />

      <div className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Social Links
        </h2>
        <SocialLinls user={user} />
      </div>

      <UserExperiences user={userExperiences} />

      <UserEducation user={userEducation} />

      <UserSkillss user={userSkills} />
    </>
  );
};

export default AccountTabPage;
