import {
  company,
  Department,
  Skills,
  UserProfile,
} from "@prisma/client";
import { Card } from "@/components/ui/card";
import CreateDepartments from "./_components/createdepartments";
import CompanyBasicInfo from "./_components/basic";

interface GeneralTabPageProps {
  user: UserProfile | null;
  userSkills: (UserProfile & { skills: Skills[] }) | null;
  departments: (Department & { users: UserProfile[] })[];
  company: (UserProfile & { company: company | null }) | null;
}

const GeneralTabPage = ({
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
    </>
  );
};

export default GeneralTabPage;
