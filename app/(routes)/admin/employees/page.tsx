import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { db } from "@/lib/db";
import React from "react";
import { columns } from "./_components/columns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddNewEmployee from "./_components/AddNewEmployee";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { employeesListTabs } from "@/lib/data";
import LeaveManagementReport from "./_components/LeaveManagementReport";
import LeaveBalanceManagement from "./_components/LeaveBalanceManagement";
import AppraisalPage from "./_components/appraisal/Appraisal";

const ApplicantsPage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const departments = await db.department.findMany();
  const roles = await db.role.findMany({
    where: {
      name: {
        notIn: ["User", "Applicant", "Interviewee", "CEO"],
      },
    },
  });
  const status = await db.status.findMany();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Hired" },
  });

  const employees = await db.userProfile.findMany({
    where: {
      applicationStatusId: applicationStatus?.id,
      role: {
        name: {
          notIn: ["User", "Applicant", "Interviewee", "CEO"],
        },
      },
    },
    include: {
      role: true,
      workstatus: true,
      status: true,
      department: true,
      company: true,
      Warnings: true,
      leaveBalanceAdjustment: {
        orderBy: {
          date: "desc",
        },
      },
      leaveRequests: {
        orderBy: {
          createdAt: "desc",
        },
      },
      Attendence: {
        where: {
          workStatus: {
            name: "Absent",
          },
        },
        include: {
          workStatus: true,
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  const formattedEmployees = employees
    .map((employee) => ({
      user: user,
      id: employee.userId,
      fullName: employee.fullName ?? "N/A",
      email: employee.email ?? "N/A",
      contact: employee.contactNumber ?? "N/A",
      role: employee.role?.name ?? "N/A",
      status: employee.status?.name ?? "N/A",
      department: employee.department?.name ?? "N/A",
      designation: employee.designation ?? "N/A",
      company: employee?.company?.name ?? "N/A",
      userImage: employee.userImage ?? "N/A",
    }))
    .sort((a, b) => {
      const statusOrder = ["Active", "Former", "Resigned", "Terminated"];
      const aStatusIndex = statusOrder.indexOf(a.status);
      const bStatusIndex = statusOrder.indexOf(b.status);

      // If a status is not in the defined order, assign it a high index.
      return (
        (aStatusIndex === -1 ? statusOrder.length : aStatusIndex) -
        (bStatusIndex === -1 ? statusOrder.length : bStatusIndex)
      );
    });

  const leaveBalanceManagement = await db.leaveBalanceAdjustment.findMany({
    include: {
      user: true,
    },
  });

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex space-y-8'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Employees' />
      </div>

      <Tabs defaultValue='employeesList' className='w-full'>
        <TabsList className='bg-transparent gap-10'>
          {employeesListTabs.map((tab) => (
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
        <div className='mt-8'>
          <TabsContent value='employeesList'>
            <AddNewEmployee user={user} department={departments} role={roles} />

            <div className='mt-6 w-full'>
              <DataTable
                columns={columns}
                data={formattedEmployees}
                routePrefix='admin/employees'
                title='Employees List'
                filterableColumns={[
                  {
                    id: "status",
                    title: "Status",
                    options: status
                      .map((status) => status.name)
                      .filter(Boolean),
                  },
                  {
                    id: "department",
                    title: "Department",
                    options: departments
                      .map((dept) => dept.name)
                      .filter(Boolean),
                  },
                  {
                    id: "role",
                    title: "Role",
                    options: roles.map((role) => role.name).filter(Boolean),
                  },
                  {
                    id: "fullName",
                    title: "Name",
                  },
                ]}
              />
            </div>
          </TabsContent>
          <TabsContent value='leaveBalanceManagement'>
            <LeaveBalanceManagement
              user={user}
              leaveBalanceManagement={leaveBalanceManagement}
            />
          </TabsContent>
          <TabsContent value='leaveBalanceReport'>
            <LeaveManagementReport employees={employees} />
          </TabsContent>
          <TabsContent value='appraisals'>
            <AppraisalPage />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ApplicantsPage;
