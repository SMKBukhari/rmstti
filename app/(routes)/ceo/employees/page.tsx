import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { db } from "@/lib/db";
import React from "react";
import { columns } from "./_components/columns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddNewEmployee from "./_components/AddNewEmployee";
import { DataTable } from "@/components/ui/data-table";

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
  const rolesCombo = await db.role.findMany({});
  const dapartmentCombo = await db.department.findMany({});

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
      roleCombo: rolesCombo,
      statusCombo: status,
      departmentCombo: dapartmentCombo,
      gender: employee.gender ?? "Select",
      contactNumber: employee.contactNumber ?? "",
      cnic: employee.cnic ?? "",
      DOB: employee.DOB ?? new Date(),
      DOJ: employee.DOJ ?? new Date(),
      city: employee.city ?? "",
      country: employee.country ?? "",
      address: employee.address ?? "",
      statusId: employee.status?.name ?? "",
      salary: employee.salary ?? "",
      officeTimingIn: employee.officeTimingIn ?? "",
      officeTimingOut: employee.OfficeTimingOut ?? "",
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

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Employees' />
      </div>

      <AddNewEmployee user={user} department={departments} role={roles} />

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedEmployees}
          routePrefix='ceo/employees'
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: status.map((status) => status.name).filter(Boolean),
            },
            {
              id: "department",
              title: "Department",
              options: departments.map((dept) => dept.name).filter(Boolean),
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
    </div>
  );
};

export default ApplicantsPage;
