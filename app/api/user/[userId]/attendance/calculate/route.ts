// import { db } from "@/lib/db";
// import { type NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { dateFrom, dateTo } = await req.json();
//     const startDate = new Date(dateFrom);
//     const endDate = new Date(dateTo);

//     // Fetch all employees
//     const employees = await db.userProfile.findMany({
//       select: { userId: true, fullName: true, totalLeavesBalance: true },
//     });

//     // Fetch all attendance records for the date range
//     const attendanceRecords = await db.attendence.findMany({
//       where: {
//         date: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//       select: { userId: true, date: true },
//     });

//     // Map attendance records to "YYYY-MM-DD" for faster lookup
//     const attendanceMap = new Map();
//     attendanceRecords.forEach((record) => {
//       const dateString = record.date.toISOString().split("T")[0];
//       if (!attendanceMap.has(dateString)) {
//         attendanceMap.set(dateString, new Set());
//       }
//       attendanceMap.get(dateString).add(record.userId);
//     });

//     // Fetch public holidays within the date range
//     const publicHolidays = await db.publicHoliday.findMany({
//       where: {
//         date: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//       select: { date: true },
//     });
//     const publicHolidayDates = new Set(
//       publicHolidays.map((holiday) => holiday.date.toISOString().split("T")[0])
//     );

//     // Fetch all approved leave requests for the date range
//     const leaveRequests = await db.leaveRequest.findMany({
//       where: {
//         status: "Approved",
//         startDate: { lte: endDate },
//         endDate: { gte: startDate },
//       },
//       select: { userId: true, startDate: true, endDate: true },
//     });

//     // Map leave requests for quick lookup
//     const leaveMap = new Map();
//     leaveRequests.forEach((leave) => {
//       const currentDate = new Date(leave.startDate);
//       while (currentDate <= leave.endDate) {
//         const dateString = currentDate.toISOString().split("T")[0];
//         if (!leaveMap.has(dateString)) {
//           leaveMap.set(dateString, new Set());
//         }
//         leaveMap.get(dateString).add(leave.userId);
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//     });

//     const attendanceReport = employees.map((employee) => ({
//       userId: employee.userId,
//       name: employee.fullName,
//       missingDates: [],
//       approvedLeaveDates: [],
//       publicHolidayDates: [],
//       daysToDeduct: 0,
//     }));

//     // Iterate through each day in the date range
//     for (
//       let currentDate = new Date(startDate);
//       currentDate <= endDate;
//       currentDate.setDate(currentDate.getDate() + 1)
//     ) {
//       const dateString = currentDate.toISOString().split("T")[0];

//       // Skip weekends (assuming Saturday and Sunday are non-working days)
//       if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

//       // Check for public holidays
//       if (publicHolidayDates.has(dateString)) {
//         attendanceReport.forEach((report) => {
//           report.publicHolidayDates.push(dateString);
//         });
//         continue;
//       }

//       // Check for missing attendance for each employee
//       attendanceReport.forEach((report) => {
//         const isPresent =
//           attendanceMap.has(dateString) &&
//           attendanceMap.get(dateString).has(report.userId);
//         const isOnLeave =
//           leaveMap.has(dateString) &&
//           leaveMap.get(dateString).has(report.userId);

//         if (isOnLeave) {
//           report.approvedLeaveDates.push(dateString);
//         } else if (!isPresent) {
//           report.missingDates.push(dateString);
//           report.daysToDeduct++;
//         }
//       });
//     }

//     return NextResponse.json({ attendanceReport });
//   } catch (error) {
//     console.error("Error in Calculating Attendance Report:", error);
//     return NextResponse.json(
//       { error: "Failed to process attendance report calculation" },
//       { status: 500 }
//     );
//   }
// }

type LeaveRequest = {
  startDate: string; // Assuming the date is a string
  endDate: string;
  status: string; // You can further specify the status if needed
};

export async function POST(req: NextRequest) {
  try {
    const { dateFrom, dateTo } = await req.json();

    // Find Attendance Records
    const attendanceRecords = await db.attendence.findMany({
      where: {
        date: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            totalLeavesBalance: true,
            leaveRequests: {
              select: {
                startDate: true,
                endDate: true,
                status: true,
              },
            },
          },
        },
        checkLog: true,
      },
    });

    console.table(
      attendanceRecords.map((record) => {
        return {
          date: record.date,
          user: record.user.fullName,
          checkLog: record.checkLog,
        };
      })
    );

    // Find Public Holidays
    const publicHolidays = await db.publicHoliday.findMany({
      where: {
        date: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      },
    });

    // Convert public holiday dates to a Set for fast lookup
    const publicHolidayDates = new Set(
      publicHolidays.map((holiday) => holiday.date.toISOString().split("T")[0])
    );

    // Find all employees who have attendance records
    const employees = Array.from(
      new Set(attendanceRecords.map((record) => JSON.stringify(record.user)))
    ).map((userStr) => JSON.parse(userStr));

    // Create a date range from dateFrom to dateTo
    const generateDateRange = (startDate: Date, endDate: Date): string[] => {
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };
    const dateRange = generateDateRange(new Date(dateFrom), new Date(dateTo));

    // Initialize Missing Dates
    const missingDates: Record<string, string[]> = {};

    // Check each date in the range for missing attendance
    employees.forEach((employee) => {
      const employeeAttendanceDates = new Set(
        attendanceRecords
          .filter((record) => record.user.userId === employee.userId)
          .map((record) => record.date.toISOString().split("T")[0])
      );

      // Find dates that are not in the employee's attendance records
      missingDates[employee.fullName] = dateRange.filter((date) => {
        return (
          !employeeAttendanceDates.has(date) && // Date not in attendance
          !publicHolidayDates.has(date) && // Date not a public holiday
          !employee.leaveRequests.some(
            (leave:LeaveRequest) =>
              leave.status === "Approved" &&
              new Date(leave.startDate) <= new Date(date) &&
              new Date(leave.endDate) >= new Date(date)
          ) // Date not covered by approved leave
        );
      });
    });

    // Now Calculate Days to Deduct
    const daysToDeduct: Record<string, number> = {};
    employees.forEach((employee) => {
      daysToDeduct[employee.fullName] =
        missingDates[employee.fullName]?.length || 0;
    });

    // TODO: Add more logic related to deduction cause Magazine Department is not clear and we want to check also from Magazine Department TimeTable that if not day of particular employee then also skip

    return NextResponse.json({
      attendanceRecords,
      publicHolidays,
      employees,
      missingDates,
      daysToDeduct,
    });
  } catch (error) {
    console.error("Error in Calculating Attendance Report:", error);
    return NextResponse.json(
      { error: "Failed to process attendance report calculation" },
      { status: 500 }
    );
  }
}
