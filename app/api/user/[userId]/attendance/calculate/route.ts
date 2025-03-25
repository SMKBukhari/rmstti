// import { db } from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

// type LeaveRequest = {
//   startDate: string; // Assuming the date is a string
//   endDate: string;
//   status: string; // You can further specify the status if needed
// };

// export async function POST(req: NextRequest) {
//   try {
//     const { dateFrom, dateTo } = await req.json();

//     // Find Attendance Records
//     const attendanceRecords = await db.attendence.findMany({
//       where: {
//         date: {
//           gte: new Date(dateFrom),
//           lte: new Date(dateTo),
//         },
//       },
//       include: {
//         user: {
//           select: {
//             userId: true,
//             fullName: true,
//             totalLeavesBalance: true,
//             leaveRequests: {
//               select: {
//                 startDate: true,
//                 endDate: true,
//                 status: true,
//               },
//             },
//           },
//         },
//         checkLog: true,
//       },
//     });

//     console.table(
//       attendanceRecords.map((record) => {
//         return {
//           date: record.date,
//           user: record.user.fullName,
//           checkLog: {
//             checkIn: record.checkLog?.checkInTime,
//             checkOut: record.checkLog?.checkOutTime,
//           },
//         };
//       })
//     );

//     // Find Public Holidays
//     const publicHolidays = await db.publicHoliday.findMany({
//       where: {
//         date: {
//           gte: new Date(dateFrom),
//           lte: new Date(dateTo),
//         },
//       },
//       include: {
//         employees: true,
//       },
//     });

//     // Convert public holiday dates to a Set for fast lookup
//     const publicHolidayDates = new Set(
//       publicHolidays.map((holiday) => holiday.date.toISOString().split("T")[0])
//     );

//     console.table(
//       publicHolidays.map((holiday) => {
//         return {
//           date: holiday.date,
//           name: holiday.name,
//           isForAll: holiday.isForAll,
//           employees: holiday.employees.map((employee) => employee.fullName),
//         };
//       })
//     );

//     // Find all employees who have attendance records
//     const employees = Array.from(
//       new Set(attendanceRecords.map((record) => JSON.stringify(record.user)))
//     ).map((userStr) => JSON.parse(userStr));

//     console.table(
//       employees.map((employee) => {
//         return {
//           userId: employee.userId,
//           fullName: employee.fullName,
//           totalLeavesBalance: employee.totalLeavesBalance,
//           leaveRequests: employee.leaveRequests,
//         };
//       })
//     );

//     // Create a date range from dateFrom to dateTo
//     const generateDateRange = (startDate: Date, endDate: Date): string[] => {
//       const dates = [];
//       const currentDate = new Date(startDate);
//       while (currentDate <= endDate) {
//         dates.push(currentDate.toISOString().split("T")[0]);
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//       return dates;
//     };
//     const dateRange = generateDateRange(new Date(dateFrom), new Date(dateTo));

//     // Initialize Missing Dates
//     const missingDates: Record<string, string[]> = {};

//     // Check each date in the range for missing attendance
//     employees.forEach((employee) => {
//       const employeeAttendanceDates = new Set(
//         attendanceRecords
//           .filter((record) => record.user.userId === employee.userId)
//           .map((record) => record.date.toISOString().split("T")[0])
//       );

//       // Find dates that are not in the employee's attendance records
//       missingDates[employee.fullName] = dateRange.filter((date) => {
//         return (
//           !employeeAttendanceDates.has(date) && // Date not in attendance
//           !publicHolidayDates.has(date) && // Date not a public holiday
//           !employee.leaveRequests.some(
//             (leave: LeaveRequest) =>
//               leave.status === "Approved" &&
//               new Date(leave.startDate) <= new Date(date) &&
//               new Date(leave.endDate) >= new Date(date)
//           ) // Date not covered by approved leave
//         );
//       });
//     });

//     // Now Calculate Days to Deduct
//     const daysToDeduct: Record<string, number> = {};
//     employees.forEach((employee) => {
//       daysToDeduct[employee.fullName] =
//         missingDates[employee.fullName]?.length || 0;
//     });

//     // TODO: Add more logic related to deduction cause Magazine Department is not clear and we want to check also from Magazine Department TimeTable that if not day of particular employee then also skip

//     console.table(missingDates);
//     console.table(daysToDeduct);

//     // Now

//     return NextResponse.json({
//       attendanceRecords,
//       publicHolidays,
//       employees,
//       missingDates,
//       daysToDeduct,
//     });
//   } catch (error) {
//     console.error("Error in Calculating Attendance Report:", error);
//     return NextResponse.json(
//       { error: "Failed to process attendance report calculation" },
//       { status: 500 }
//     );
//   }
// }

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type LeaveRequest = {
  startDate: string;
  endDate: string;
  status: string;
};

type Employee = {
  userId: string;
  fullName: string;
  totalLeavesBalance: string | null;
  leaveRequests: LeaveRequest[];
  DOJ: Date | string | null;
};

type TimeTableEntry = {
  userId: string;
  date: Date;
  shiftType: "Morning" | "Evening" | "Off";
};

function parseDate(date: Date | string | null): Date | null {
  if (date instanceof Date) return date;
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  return null;
}

function formatDate(date: Date | string | null): string {
  const parsedDate = parseDate(date);
  return parsedDate ? parsedDate.toISOString().split("T")[0] : "Not available";
}

export async function POST(req: NextRequest) {
  try {
    const { dateFrom, dateTo } = await req.json();
    const reportStartDate = new Date(dateFrom);
    const reportEndDate = new Date(dateTo);

    // Find Attendance Records
    const attendanceRecords = await db.attendence.findMany({
      where: {
        date: {
          gte: reportStartDate,
          lte: reportEndDate,
        },
      },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            totalLeavesBalance: true,
            DOJ: true,
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
      attendanceRecords.map((record) => ({
        date: formatDate(record.date),
        user: record.user.fullName,
        checkLog: {
          checkIn: record.checkLog?.checkInTime
            ? formatDate(record.checkLog.checkInTime)
            : "N/A",
          checkOut: record.checkLog?.checkOutTime
            ? formatDate(record.checkLog.checkOutTime)
            : "N/A",
        },
      }))
    );

    // Find Public Holidays
    const publicHolidays = await db.publicHoliday.findMany({
      where: {
        date: {
          gte: reportStartDate,
          lte: reportEndDate,
        },
      },
      include: {
        employees: true,
      },
    });

    const publicHolidayDates = new Set(
      publicHolidays.map((holiday) => formatDate(holiday.date))
    );

    console.table(
      publicHolidays.map((holiday) => ({
        date: formatDate(holiday.date),
        name: holiday.name,
        isForAll: holiday.isForAll,
        employees: holiday.employees.map((employee) => employee.fullName),
      }))
    );

    // Find all employees who have attendance records
    const employees: Employee[] = Array.from(
      new Set(attendanceRecords.map((record) => JSON.stringify(record.user)))
    ).map((userStr) => JSON.parse(userStr));

    console.table(
      employees.map((employee) => ({
        userId: employee.userId,
        fullName: employee.fullName,
        totalLeavesBalance: employee.totalLeavesBalance,
        DOJ: formatDate(employee.DOJ),
        leaveRequests: employee.leaveRequests,
      }))
    );

    // Fetch Timetables
    const timetables = await db.timeTable.findMany({
      where: {
        date: {
          gte: reportStartDate,
          lte: reportEndDate,
        },
      },
    });

    // Create a map of timetables for quick lookup
    const timetableMap = new Map<string, Map<string, string>>();
    timetables.forEach((entry: TimeTableEntry) => {
      const userId = entry.userId;
      const dateKey = formatDate(entry.date);
      if (!timetableMap.has(userId)) {
        timetableMap.set(userId, new Map<string, string>());
      }
      timetableMap.get(userId)?.set(dateKey, entry.shiftType);
    });

    console.table(
      timetables.map((entry) => ({
        userId: entry.userId,
        date: formatDate(entry.date),
        shiftType: entry.shiftType,
      }))
    );

    const generateDateRange = (startDate: Date, endDate: Date): string[] => {
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    const missingDates: Record<string, string[]> = {};
    const missingDateReasons: Record<string, Record<string, string>> = {};

    employees.forEach((employee) => {
      const employeeDOJ = parseDate(employee.DOJ);
      const employeeStartDate =
        employeeDOJ && employeeDOJ > reportStartDate
          ? employeeDOJ
          : reportStartDate;
      const dateRange = generateDateRange(employeeStartDate, reportEndDate);

      const employeeAttendanceDates = new Set(
        attendanceRecords
          .filter((record) => record.user.userId === employee.userId)
          .map((record) => formatDate(record.date))
      );

      missingDates[employee.fullName] = [];
      missingDateReasons[employee.fullName] = {};

      dateRange.forEach((date) => {
        const currentDate = new Date(date);
        const timetableEntry = timetableMap.get(employee.userId)?.get(date);

        if (!employeeAttendanceDates.has(date)) {
          if (publicHolidayDates.has(date)) {
            missingDateReasons[employee.fullName][date] = "Public Holiday";
          } else if (
            employee.leaveRequests.some(
              (leave: LeaveRequest) =>
                leave.status === "Approved" &&
                new Date(leave.startDate) <= currentDate &&
                new Date(leave.endDate) >= currentDate
            )
          ) {
            missingDateReasons[employee.fullName][date] = "Approved Leave";
          } else if (timetableEntry === "Off") {
            missingDateReasons[employee.fullName][date] = "Scheduled Off";
          } else if (!timetableEntry) {
            missingDateReasons[employee.fullName][date] = "Not Scheduled";
          } else {
            missingDates[employee.fullName].push(date);
            missingDateReasons[employee.fullName][date] =
              "Unauthorized Absence";
          }
        }
      });
    });

    const daysToDeduct: Record<string, number> = {};
    employees.forEach((employee) => {
      daysToDeduct[employee.fullName] = missingDates[employee.fullName].length;
    });

    console.table(missingDates);
    console.table(daysToDeduct);

    console.log("\n=== DETAILED REPORT ===");
    employees.forEach((employee) => {
      console.log(`\nEmployee: ${employee.fullName}`);
      console.log(`User ID: ${employee.userId}`);
      console.log(`Leave Balance: ${employee.totalLeavesBalance}`);
      console.log(`Date of Joining: ${formatDate(employee.DOJ)}`);
      console.log(`Days to Deduct: ${daysToDeduct[employee.fullName]}`);
      if (Object.keys(missingDateReasons[employee.fullName]).length > 0) {
        console.log("Missing Dates and Reasons:");
        Object.entries(missingDateReasons[employee.fullName]).forEach(
          ([date, reason]) => {
            console.log(`  ${date}: ${reason}`);
          }
        );
      } else {
        console.log("No missing dates");
      }
    });

    return NextResponse.json({
      attendanceRecords,
      publicHolidays,
      employees,
      missingDates,
      missingDateReasons,
      daysToDeduct,
    });
  } catch (error) {
    console.error("Error in Calculating Attendance Report:", error);
    return NextResponse.json(
      {
        error: "Failed to process attendance report calculation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// import { db } from "@/lib/db";
// import { type NextRequest, NextResponse } from "next/server";

// type TimingViolation = {
//   date: string;
//   checkInTime: string | null;
//   checkOutTime: string | null;
//   expectedCheckInTime: string;
//   expectedCheckOutTime: string;
//   isLate: boolean;
//   isEarlyDeparture: boolean;
// };

// type EmployeeTimingReport = {
//   userId: string;
//   fullName: string;
//   violations: TimingViolation[];
//   totalLateArrivals: number;
//   totalEarlyDepartures: number;
//   totalBothViolations: number;
// };

// export async function POST(req: NextRequest) {
//   try {
//     const { dateFrom, dateTo } = await req.json();
//     const reportStartDate = new Date(dateFrom);
//     const reportEndDate = new Date(dateTo);

//     // Find Attendance Records with check logs
//     const attendanceRecords = await db.attendence.findMany({
//       where: {
//         date: {
//           gte: reportStartDate,
//           lte: reportEndDate,
//         },
//         checkLog: {
//           isNot: null,
//         },
//       },
//       include: {
//         user: {
//           select: {
//             userId: true,
//             fullName: true,
//             officeTimingIn: true,
//             OfficeTimingOut: true,
//           },
//         },
//         checkLog: true,
//       },
//     });

//     // Get all unique employees from attendance records
//     const employeeIds = [
//       ...new Set(attendanceRecords.map((record) => record.userId)),
//     ];

//     // Fetch all employees with their office timings
//     const employees = await db.userProfile.findMany({
//       where: {
//         userId: {
//           in: employeeIds,
//         },
//       },
//       select: {
//         userId: true,
//         fullName: true,
//         officeTimingIn: true,
//         OfficeTimingOut: true,
//       },
//     });

//     // Create employee timing reports
//     const employeeTimingReports: EmployeeTimingReport[] = [];

//     for (const employee of employees) {
//       const employeeAttendance = attendanceRecords.filter(
//         (record) => record.userId === employee.userId
//       );

//       const violations: TimingViolation[] = [];
//       let totalLateArrivals = 0;
//       let totalEarlyDepartures = 0;
//       let totalBothViolations = 0;

//       // Default office timings if not set for employee
//       const defaultCheckInTime = "09:00";
//       const defaultCheckOutTime = "18:00";

//       // Get employee's expected check-in and check-out times
//       const expectedCheckInTime = employee.officeTimingIn || defaultCheckInTime;
//       const expectedCheckOutTime =
//         employee.OfficeTimingOut || defaultCheckOutTime;

//       for (const record of employeeAttendance) {
//         if (!record.checkLog) continue;

//         const checkInTime = record.checkLog.checkInTime;
//         const checkOutTime = record.checkLog.checkOutTime;
//         const recordDate = record.date.toISOString().split("T")[0];

//         // Parse expected times for the day
//         const [expectedCheckInHour, expectedCheckInMinute] = expectedCheckInTime
//           .split(":")
//           .map(Number);
//         const [expectedCheckOutHour, expectedCheckOutMinute] =
//           expectedCheckOutTime.split(":").map(Number);

//         // Create date objects with expected times for comparison
//         const expectedCheckInDateTime = new Date(record.date);
//         expectedCheckInDateTime.setHours(
//           expectedCheckInHour,
//           expectedCheckInMinute,
//           0,
//           0
//         );

//         const expectedCheckOutDateTime = new Date(record.date);
//         expectedCheckOutDateTime.setHours(
//           expectedCheckOutHour,
//           expectedCheckOutMinute,
//           0,
//           0
//         );

//         // Check if employee was late
//         const isLate = checkInTime
//           ? checkInTime > expectedCheckInDateTime
//           : false;

//         // Check if employee left early
//         const isEarlyDeparture = checkOutTime
//           ? checkOutTime < expectedCheckOutDateTime
//           : false;

//         // Only add to violations if there was a timing issue
//         if (isLate || isEarlyDeparture) {
//           violations.push({
//             date: recordDate,
//             checkInTime: checkInTime ? formatTime(checkInTime) : null,
//             checkOutTime: checkOutTime ? formatTime(checkOutTime) : null,
//             expectedCheckInTime: expectedCheckInTime,
//             expectedCheckOutTime: expectedCheckOutTime,
//             isLate,
//             isEarlyDeparture,
//           });

//           if (isLate) totalLateArrivals++;
//           if (isEarlyDeparture) totalEarlyDepartures++;
//           if (isLate && isEarlyDeparture) totalBothViolations++;
//         }
//       }

//       employeeTimingReports.push({
//         userId: employee.userId,
//         fullName: employee.fullName,
//         violations,
//         totalLateArrivals,
//         totalEarlyDepartures,
//         totalBothViolations,
//       });
//     }

//     // Sort reports by total violations (most violations first)
//     employeeTimingReports.sort((a, b) => {
//       const totalA = a.totalLateArrivals + a.totalEarlyDepartures;
//       const totalB = b.totalLateArrivals + b.totalEarlyDepartures;
//       return totalB - totalA;
//     });

//     return NextResponse.json({
//       employeeTimingReports,
//       summary: {
//         totalEmployees: employeeTimingReports.length,
//         employeesWithLateArrivals: employeeTimingReports.filter(
//           (e) => e.totalLateArrivals > 0
//         ).length,
//         employeesWithEarlyDepartures: employeeTimingReports.filter(
//           (e) => e.totalEarlyDepartures > 0
//         ).length,
//         employeesWithBothViolations: employeeTimingReports.filter(
//           (e) => e.totalBothViolations > 0
//         ).length,
//       },
//     });
//   } catch (error) {
//     console.error("Error in Calculating Timing Report:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to process timing report calculation",
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to format time as HH:MM
// function formatTime(date: Date): string {
//   return date.toTimeString().substring(0, 5);
// }
