import CustomBreadCrumb from "@/components/CustomBreadCrumb"
import { db } from "@/lib/db"
import React from "react"
import { columns } from "./_components/columns"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AddNewEmployee from "./_components/AddNewEmployee"
import { DataTable } from "@/components/ui/data-table"

const ApplicantsPage = async () => {
  const cookieStore = cookies()
  const userId = (await cookieStore).get("userId")?.value

  if (!userId) {
    redirect("/signIn")
  }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  })

  const departments = await db.department.findMany()
  const roles = await db.role.findMany()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Hired" },
  })
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
  })

  const formattedEmployees = employees.map((employee) => ({
    id: employee.userId,
    fullName: employee.fullName ?? "N/A",
    email: employee.email ?? "N/A",
    contact: employee.contactNumber ?? "N/A",
    role: employee.role?.name ?? "N/A",
    status: employee.Attendence[0]?.workStatus?.name ?? "Not Checked in",
    department: employee.department?.name ?? "N/A",
    userImage: employee.userImage ?? "N/A",
  }))

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
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: ["Not Checked in", "Present", "Absent", "On Leave"].filter(Boolean),
            },
            {
              id: "department",
              title: "Department",
              options: departments.map(dept => dept.name).filter(Boolean),
            },
            {
              id: "role",
              title: "Role",
              options: roles.map(role => role.name).filter(Boolean),
            },
            {
              id: "fullName",
              title: "Name",
            },
          ]}
        />
      </div>
    </div>
  )
}

export default ApplicantsPage

