import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { attendanceRecordsColumns, columns } from "./_components/columns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AttendanceUpdate from "./_components/AttendanceUpdate";

const AttendancePage = async () => {
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

  const attendanceRecords = await db.attendence.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      user: true,
      workStatus: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 30, // Limit to last 30 records
  });

  const formattedAttendanceRecord: attendanceRecordsColumns[] =
    attendanceRecords.map((attendanceRecord) => {
      const formatLocalTime = (time: Date | null) => {
        if (!time) return "N/A";
        return time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      return {
        user: user,
        id: attendanceRecord.id || "N/A",
        date: attendanceRecord.date.toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        checkIn: formatLocalTime(attendanceRecord.checkInTime),
        checkOut: formatLocalTime(attendanceRecord.checkOutTime),
        workingHours: attendanceRecord.workingHours || "N/A",
      };
    });

  return (
    <div className='flex-col p-4 md:p-8 space-y-8'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Attendance Management' />
      </div>

      <AttendanceUpdate user={user} />

      <div className='w-full'>
        <h2 className='text-2xl font-bold mb-4'>Attendance History</h2>
        <DataTable
          columns={columns}
          data={formattedAttendanceRecord}
          searchKey='date'
        />
      </div>
    </div>
  );
};

export default AttendancePage;