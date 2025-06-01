import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { employeesTabs } from "@/lib/data";
import React from "react";
import EmployeeProfilePage from "./_components/Profile";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { db } from "@/lib/db";
import EmployeeReportPage from "./_components/Report";
import AppraisalPage from "./_components/appraisal/Appraisal";

const AttendanceManagementPage = async ({
  params,
}: {
  params: { employeeId: string };
}) => {
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
      company: true,
      department: true,
    },
  });
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb
          breadCrumbPage={employee?.fullName || ""}
          breadCrumbItem={[{ link: "/admin/employees", label: "Employees" }]}
        />
      </div>
      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='bg-transparent gap-10'>
          {employeesTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='px-8 py-3 text-base data-[state=active]:bg-[#295B81] data-[state=active]:dark:bg-[#1034ff] rounded-md dark:shadow-white dark:text-[#fff] data-[state=active]:text-[#fff] text-neutral-800 font-medium'
            >
              <div className='flex gap-2 items-center justify-center w-full'>
                <tab.icon className='w-5 h-5' />
                {tab.label}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className=''>
          <TabsContent value='profile'>
            <EmployeeProfilePage employeeId={params.employeeId} />
          </TabsContent>
          <TabsContent value='report'>
            <EmployeeReportPage employeeId={params.employeeId} />
          </TabsContent>
          <TabsContent value='appraisal'>
            <AppraisalPage employeeId={params.employeeId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AttendanceManagementPage;
