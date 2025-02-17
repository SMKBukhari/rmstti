import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { attendanceRecordsColumns, columns } from "./_components/columns";

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
    include: {
      department: true,
    },
  });

  const attendanceRecords = await db.attendence.findMany({
    where: {
      user: {
        department: {
          name: user?.department?.name,
        },
        NOT: {
          userId: user?.userId,
        },
      },
    },
    include: {
      user: true,
      workStatus: true,
      checkLog: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const workStatus = await db.workStatus.findMany();

  const formattedAttendanceRecord: attendanceRecordsColumns[] =
    attendanceRecords.map((attendanceRecord) => {
      const formatLocalTime = (time: Date | null | undefined) => {
        if (!time) return "N/A";
        return time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      return {
        user: user,
        workStatus: workStatus,
        id: attendanceRecord.id || "N/A",
        fullName: attendanceRecord.user.fullName || "N/A",
        status: attendanceRecord.workStatus?.name || "N/A",
        userImage: attendanceRecord.user.userImage || "",
        date: attendanceRecord.date.toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        checkIn: formatLocalTime(attendanceRecord.checkLog?.checkInTime),
        checkOut: formatLocalTime(attendanceRecord.checkLog?.checkOutTime),
        workingHours: attendanceRecord.workingHours || "N/A",
      };
    });

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb
          breadCrumbPage='Manage Employee Attendance'
          breadCrumbItem={[
            {
              label: "Attendance Management",
              link: "/manager/attendance-management/mark-attendance",
            },
          ]}
        />
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedAttendanceRecord}
          filterableColumns={[
            {
              id: "fullName",
              title: "Full Name",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ApplicantsPage;
