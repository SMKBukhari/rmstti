import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { columns, EmployeeColumns } from "./_components/columns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Hired" },
  });
  const employees = await db.jobApplications.findMany({
    where: {
      applicationStatusId: applicationStatus?.id,
    },
    include: {
      user: {
        include: {
          role: true,
          workstatus: true,
        },
      },
    },
  });

  // Formatting the applicants data for the table
  const formattedEmployees: EmployeeColumns[] = employees.map((employee) => ({
    user: user,
    id: employee.user.userId,
    fullName: employee.user?.fullName ?? "N/A",
    email: employee.user?.email ?? "N/A",
    contact: employee.user?.contactNumber ?? "N/A",
    role: employee.user.role?.name ?? "N/A",
    department: employee.department ?? "N/A",
    status: employee.user.workstatus?.name ?? "N/A",
    userImage: employee.user?.userImage ?? "N/A",
  }));

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Employees' />
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedEmployees}
          searchKey='fullName'
          routePrefix='ceo/employees'
        />
      </div>
    </div>
  );
};

export default ApplicantsPage;
