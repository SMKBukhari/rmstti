import {
  company,
  Department,
  PublicHoliday,
  RequestCategory,
  Requests,
  Skills,
  UserProfile,
} from "@prisma/client";
import { Card } from "@/components/ui/card";
import CreateDepartments from "./_components/createdepartments";
import CompanyBasicInfo from "./_components/basic";
import PublicHolidays from "./_components/publicHolidays";
import UploadCompanyPolicy from "./_components/uploadCompanyPolicy";
import CreateRequestsCategory from "./_components/createRequestsCategories";

interface GeneralTabPageProps {
  user: UserProfile | null;
  userSkills: (UserProfile & { skills: Skills[] }) | null;
  departments: (Department & { users: UserProfile[] })[];
  company: (UserProfile & { company: company | null }) | null;
  category: (RequestCategory & { requests: Requests[] })[];
  publicHolidays: PublicHoliday[] | [];
}

const GeneralTabPage = ({
  user,
  userSkills,
  departments,
  category,
  company,
  publicHolidays,
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
        <UploadCompanyPolicy company={company} />
        <CreateDepartments user={userSkills} departments={departments} />
        <CreateRequestsCategory user={userSkills} category={category} />
        <PublicHolidays user={user} publicHoidays={publicHolidays} />
      </div>
    </>
  );
};

export default GeneralTabPage;
