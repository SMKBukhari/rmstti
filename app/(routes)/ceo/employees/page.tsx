import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { columns, EmployeeColumns } from "./_components/columns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddNewEmployee from "./_components/AddNewEmployee";

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

  const role = await db.role.findMany();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Hired" },
  });
  const employees = await db.userProfile.findMany({
    where: {
      applicationStatusId: applicationStatus?.id,
    },
    include: {
      role: true,
      workstatus: true,
      Attendence: {
        where: {
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          }
        },
        include: {
          workStatus: true,
        },
      },
      department: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedEmployees: EmployeeColumns[] = employees.map((employee) => ({
    user: user,
    id: employee.userId,
    fullName: employee.fullName ?? "N/A",
    email: employee.email ?? "N/A",
    contact: employee.contactNumber ?? "N/A",
    role: employee.role?.name ?? "N/A",
    status: employee.Attendence[0]?.workStatus?.name ?? "Not Checked in",
    department: employee.department?.name ?? "N/A",
    userImage: employee.userImage ?? "N/A",
  }));

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Employees' />
      </div>

      <AddNewEmployee user={user} department={departments} role={role} />

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
