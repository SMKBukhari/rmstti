import {
  company,
  Department,
  PublicHoliday,
  RequestCategory,
  Requests,
  Skills,
  UserProfile,
} from "@prisma/client";
import CreateDepartments from "./_components/createdepartments";
import CompanyBasicInfo from "./_components/basic";
import CreateRequestsCategory from "./_components/createRequestsCategories";
import UploadCompanyPolicy from "./_components/uploadCompanyPolicy";
import PublicHolidays from "./_components/publicHolidays";

interface GeneralTabPageProps {
  user: UserProfile | null;
  userSkills: (UserProfile & { skills: Skills[] }) | null;
  departments: (Department & { users: UserProfile[] })[];
  company: (UserProfile & { company: company | null }) | null;
  category: (RequestCategory & { requests: Requests[] })[];
  publicHolidays: (PublicHoliday & { employees: UserProfile[] })[] | [];
  employees: UserProfile[];
}

const GeneralTabPage = ({
  user,
  userSkills,
  departments,
  company,
  category,
  publicHolidays,
  employees,
}: GeneralTabPageProps) => {
  return (
    <>
      <div className='w-full flex flex-col items-center justify-center gap-10 px-5 py-10 pt-13 rounded-xl mt-5'>
        {/* <BasicInfo user={user} /> */}
        <div className='w-full flex flex-col items-center justify-center gap-10 pt-13 rounded-xl mt-5'>
          <h2 className='text-xl font-medium text-muted-foreground self-start'>
            Company Details
          </h2>
          <CompanyBasicInfo company={company} />
        </div>
        <UploadCompanyPolicy company={company} />
        <CreateDepartments user={userSkills} departments={departments} />
        <CreateRequestsCategory user={userSkills} category={category} />
        <PublicHolidays
          user={user}
          publicHolidays={publicHolidays}
          employees={employees}
        />
      </div>
    </>
  );
};

export default GeneralTabPage;
