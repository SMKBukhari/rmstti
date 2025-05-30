import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AttendanceRecord, columns } from "./_components/columns";
import UploadAttendancePage from "./_components/UploadCSV";
import CalculateAttendancePage from "./_components/CalculateAttendaceRecord";

const ManageAttendance = async () => {
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

  const attendanceRecords = await db.attendence.findMany({
    include: {
      user: {
        include: {
          department: true,
          role: true,
        },
      },
      workStatus: true,
      checkLog: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const workStatus = await db.workStatus.findMany();

  // Formatting the applicants data for the table
  const formattedAttendanceRecord: AttendanceRecord[] = attendanceRecords.map(
    (attendanceRecord) => ({
      user: user,
      workStatus: workStatus,
      id: attendanceRecord.id || "N/A",
      fullName: attendanceRecord.user.fullName || "N/A",
      status: attendanceRecord.workStatus?.name || "N/A",
      userImage: attendanceRecord.user.userImage || "",
      date: attendanceRecord.date
        ? format(new Date(attendanceRecord.date), "EEEE, MMMM d, yyyy")
        : "N/A",
      // In your frontend component:
      // checkIn: attendanceRecord.checkLog?.checkInTime
      //   ? format(new Date(attendanceRecord.checkLog.checkInTime), "hh:mm:ss a")
      //   : "Not Checked in",
      checkIn: attendanceRecord.checkLog?.checkInTime
        ? formatInTimeZone(
            attendanceRecord.checkLog.checkInTime,
            "UTC",
            "hh:mm:ss a"
          )
        : "Not Checked in",
      // checkOut: attendanceRecord.checkLog?.checkOutTime
      //   ? format(
      //       new Date(attendanceRecord.checkLog?.checkOutTime),
      //       "hh:mm:ss a"
      //     )
      //   : "Not Checked Out",
      checkOut: attendanceRecord.checkLog?.checkOutTime
        ? formatInTimeZone(
            attendanceRecord.checkLog.checkOutTime,
            "UTC",
            "hh:mm:ss a"
          )
        : "Not Checked Out",
      workingHours: attendanceRecord.workingHours || "N/A",
      department: attendanceRecord.user.department?.name || "N/A",
      role: attendanceRecord.user.role?.name || "N/A",
    })
  );

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex w-full'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb
          breadCrumbPage='Manage Employee Attendance'
          breadCrumbItem={[
            {
              label: "Attendance Management",
              link: "/admin/attendance-management/mark-attendance",
            },
          ]}
        />
      </div>

      <div className='flex gap-1 justify-end w-full'>
        <UploadAttendancePage user={user} />
        <CalculateAttendancePage user={user} />
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedAttendanceRecord}
          filterableColumns={[
            {
              id: "fullName",
              title: "Name",
            },
            {
              id: "status",
              title: "Status",
              options: [
                "Not Checked in",
                "On Site",
                "Absent",
                "Work from Home",
                "On Leave",
              ].filter(Boolean),
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
          ]}
        />
      </div>
    </div>
  );
};

export default ManageAttendance;
