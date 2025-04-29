import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { ShiftType } from "@prisma/client";

type LeaveRequest = {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  status: string;
  userId: string;
};

type Employee = {
  userId: string;
  fullName: string;
  totalLeavesBalance: string | null;
  leaveRequests: LeaveRequest[];
  DOJ: Date | string | null;
  officeTimingIn: string | null;
  OfficeTimingOut: string | null;
};

type AttendanceRecord = {
  id: string;
  userId: string;
  date: Date;
  workingHours: string | null;
  workStatus: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  checkLog: {
    id: string;
    checkInTime: Date | null;
    checkOutTime: Date | null;
    workingHours: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

type AttendanceCalculationResult = {
  userId: string;
  fullName: string;
  totalDaysChecked: number;
  unauthorizedAbsences: string[];
  lateArrivals: string[];
  earlyExits: string[];
  leavesDeducted: number;
  previousLateCount: number;
  newLateCount: number;
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

function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

function parseTimeToMinutes(timeString: string | null): number {
  if (!timeString) return 9 * 60; // Default to 9:00 AM if not specified

  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function isLate(checkInTime: Date, expectedTimeString: string | null): boolean {
  if (!checkInTime) return false;

  const expectedMinutes = parseTimeToMinutes(expectedTimeString);
  const checkInHours = checkInTime.getHours();
  const checkInMinutes = checkInTime.getMinutes();
  const checkInTotalMinutes = checkInHours * 60 + checkInMinutes;

  console.log(
    `Check-in time: ${checkInTime.toLocaleTimeString()}, Expected time: ${expectedTimeString}, Check-in total minutes: ${checkInTotalMinutes}, Expected total minutes: ${expectedMinutes}`
  );

  return checkInTotalMinutes > expectedMinutes;
}

function isEarlyExit(
  checkOutTime: Date,
  expectedTimeString: string | null
): boolean {
  if (!checkOutTime) return false;

  const expectedMinutes = parseTimeToMinutes(expectedTimeString);
  const checkOutHours = checkOutTime.getHours();
  const checkOutMinutes = checkOutTime.getMinutes();
  const checkOutTotalMinutes = checkOutHours * 60 + checkOutMinutes;

  return checkOutTotalMinutes < expectedMinutes;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { dateFrom, dateTo, employeeIds } = await req.json();
    const reportStartDate = new Date(dateFrom);
    const reportEndDate = new Date(dateTo);

    // Check if user has permission to calculate attendance
    const requestingUser = await db.userProfile.findUnique({
      where: { userId },
      include: { role: true },
    });

    if (
      !requestingUser ||
      !["Admin", "CEO"].includes(requestingUser.role?.name || "")
    ) {
      return NextResponse.json(
        { error: "You don't have permission to calculate attendance" },
        { status: 403 }
      );
    }

    // Find or create "Unauthorized Absent" leave type
    let unauthorizedAbsentLeaveType = await db.leaveType.findFirst({
      where: { name: "Unauthorized Absent" },
    });

    if (!unauthorizedAbsentLeaveType) {
      unauthorizedAbsentLeaveType = await db.leaveType.create({
        data: { name: "Unauthorized Absent" },
      });
      console.log("Created 'Unauthorized Absent' leave type");
    }

    // Find all employees who should be included in the calculation
    const employees = await db.userProfile.findMany({
      where: {
        userId: {
          in: employeeIds,
        },
        isHired: true,
        status: {
          name: "Active",
        },
        DOJ: {
          lte: reportEndDate,
        },
      },
      select: {
        userId: true,
        fullName: true,
        totalLeavesBalance: true,
        DOJ: true,
        officeTimingIn: true,
        OfficeTimingOut: true,
        leaveRequests: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            userId: true,
          },
        },
      },
    });

    console.log(
      `Found ${employees.length} selected employees for attendance calculation`
    );

    // Find Attendance Records
    const attendanceRecords = await db.attendence.findMany({
      where: {
        date: {
          gte: reportStartDate,
          lte: reportEndDate,
        },
        userId: {
          in: employees.map((emp) => emp.userId),
        },
      },
      include: {
        checkLog: true,
        workStatus: true,
      },
    });

    console.log(
      `Found ${attendanceRecords.length} attendance records in the date range`
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
        employees: {
          select: {
            userId: true,
          },
        },
      },
    });

    console.log(
      `Found ${publicHolidays.length} public holidays in the date range`
    );

    // Fetch Timetables
    const timetables = await db.timeTable.findMany({
      where: {
        date: {
          gte: reportStartDate,
          lte: reportEndDate,
        },
        userId: {
          in: employees.map((emp) => emp.userId),
        },
      },
    });

    console.log(
      `Found ${timetables.length} timetable entries in the date range`
    );

    // Get previous late counts for the current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const previousLateCountsMap = new Map<string, number>();

    const lateCountRecords = await db.lateCount.findMany({
      where: {
        userId: {
          in: employees.map((emp) => emp.userId),
        },
        month: currentMonth,
        year: currentYear,
      },
    });

    lateCountRecords.forEach((record) => {
      previousLateCountsMap.set(record.userId, record.count);
    });

    // Create maps for quick lookups
    const employeeMap = new Map<string, Employee>();
    employees.forEach((emp) => employeeMap.set(emp.userId, emp as Employee));

    const attendanceMap = new Map<string, Map<string, AttendanceRecord>>();
    attendanceRecords.forEach((record) => {
      const userId = record.userId;
      const dateKey = formatDate(record.date);

      if (!attendanceMap.has(userId)) {
        attendanceMap.set(userId, new Map<string, AttendanceRecord>());
      }
      attendanceMap.get(userId)?.set(dateKey, record as AttendanceRecord);
    });

    const timetableMap = new Map<string, Map<string, ShiftType>>();
    timetables.forEach((entry) => {
      const userId = entry.userId;
      // Use the same date formatting as in generateDateRange
      const dateKey = entry.date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      if (!timetableMap.has(userId)) {
        timetableMap.set(userId, new Map<string, ShiftType>());
      }
      timetableMap.get(userId)?.set(dateKey, entry.shiftType);
    });

    timetableMap.forEach((userMap, userId) => {
      const employee = employeeMap.get(userId);
      console.log(`Timetable for ${employee?.fullName}:`);
      userMap.forEach((shiftType, date) => {
        console.log(`  ${date}: ${shiftType}`);
      });
    });

    const holidayMap = new Map<string, Set<string>>();
    publicHolidays.forEach((holiday) => {
      const dateKey = formatDate(holiday.date);

      if (holiday.isForAll) {
        // Global holiday for all employees
        employees.forEach((emp) => {
          if (!holidayMap.has(emp.userId)) {
            holidayMap.set(emp.userId, new Set<string>());
          }
          holidayMap.get(emp.userId)?.add(dateKey);
        });
      } else {
        // Holiday for specific employees
        holiday.employees.forEach((emp) => {
          if (!holidayMap.has(emp.userId)) {
            holidayMap.set(emp.userId, new Set<string>());
          }
          holidayMap.get(emp.userId)?.add(dateKey);
        });
      }
    });

    // Generate date range
    const generateDateRange = (startDate: Date, endDate: Date): string[] => {
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    // Calculate attendance for each employee
    const calculationResults: AttendanceCalculationResult[] = [];
    const dbUpdates: Promise<unknown>[] = [];

    // Get work statuses for attendance records
    const absentWorkStatus = await db.workStatus.findFirst({
      where: { name: "Absent" },
    });

    const lateWorkStatus = await db.workStatus.findFirst({
      where: { name: "Late" },
    });

    const earlyWorkStatus = await db.workStatus.findFirst({
      where: { name: "Early" },
    });

    const lateAndEarlyWorkStatus = await db.workStatus.findFirst({
      where: { name: "Late and Early" },
    });

    if (
      !absentWorkStatus ||
      !lateWorkStatus ||
      !earlyWorkStatus ||
      !lateAndEarlyWorkStatus
    ) {
      return NextResponse.json(
        { error: "Required work status types not found in the database" },
        { status: 500 }
      );
    }

    for (const employee of employees) {
      const employeeDOJ = parseDate(employee.DOJ);
      const employeeStartDate =
        employeeDOJ && employeeDOJ > reportStartDate
          ? employeeDOJ
          : reportStartDate;

      const dateRange = generateDateRange(employeeStartDate, reportEndDate);

      const unauthorizedAbsences: string[] = [];
      const lateArrivals: string[] = [];
      const earlyExits: string[] = [];

      const employeeAttendanceMap =
        attendanceMap.get(employee.userId) || new Map();
      const employeeTimetableMap =
        timetableMap.get(employee.userId) || new Map();
      const employeeHolidaySet = holidayMap.get(employee.userId) || new Set();

      // Process each date in the range
      for (const dateStr of dateRange) {
        const currentDate = new Date(dateStr);
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Skip weekends (Saturday and Sunday) unless specifically scheduled
        if (
          (dayOfWeek === 0 || dayOfWeek === 6) &&
          !employeeTimetableMap.has(dateStr)
        ) {
          continue;
        }

        // Check if it's a holiday
        if (employeeHolidaySet.has(dateStr)) {
          continue;
        }

        // Check if it's an approved leave
        const isApprovedLeave = employee.leaveRequests.some(
          (leave) =>
            leave.status === "Approved" &&
            isDateInRange(
              currentDate,
              new Date(leave.startDate),
              new Date(leave.endDate)
            )
        );

        if (isApprovedLeave) {
          continue;
        }

        // Check timetable to see if employee is scheduled to work
        const shiftType = employeeTimetableMap.get(dateStr);
        console.log(
          `Employee ${employee.fullName} is scheduled for ${shiftType} on ${dateStr}`
        );
        if (shiftType === ShiftType.Off) {
          console.log(
            `Employee ${employee.fullName} is off on ${dateStr}, skipping attendance check.`
          );
          continue;
        }

        // Check attendance record
        const attendanceRecord = employeeAttendanceMap.get(dateStr);

        if (!attendanceRecord) {
          // No attendance record found - unauthorized absence
          unauthorizedAbsences.push(dateStr);

          // Create a new attendance record marked as absent
          // dbUpdates.push(
          //   db.attendence.create({
          //     data: {
          //       user: {
          //         connect: {
          //           userId: employee.userId,
          //         },
          //       },
          //       date: currentDate,
          //       workStatus: {
          //         connect: {
          //           id: absentWorkStatus.id,
          //         },
          //       },
          //       workingHours: "0 hours 0 minutes",
          //     },
          //   })
          // );

          // Create a leave record for unauthorized absence
          // dbUpdates.push(
          //   db.leaveRequest.create({
          //     data: {
          //       userId: employee.userId,
          //       leaveTypeId: unauthorizedAbsentLeaveType.id,
          //       startDate: currentDate,
          //       endDate: currentDate,
          //       reason: "Automatically applied due to unauthorized absence",
          //       status: "Approved",
          //       managerApproval: true,
          //       adminApproval: true,
          //       ceoApproval: true,
          //       approvedBy: "System",
          //     },
          //   })
          // );
        } else {
          // Check for late arrival
          if (attendanceRecord.checkLog?.checkInTime) {
            const isLateArrival = isLate(
              attendanceRecord.checkLog.checkInTime,
              employee.officeTimingIn
            );

            console.log(
              `=========Employee ${employee.fullName} is late on ${dateStr}===========`
            );

            if (isLateArrival) {
              lateArrivals.push(dateStr);

              // Update attendance record to mark as late
              // dbUpdates.push(
              //   db.attendence.update({
              //     where: { id: attendanceRecord.id },
              //     data: {
              //       workStatus: {
              //         connect: {
              //           id: lateWorkStatus.id,
              //         },
              //       },
              //     },
              //   })
              // );
            }
          }

          // Check for early exit
          if (attendanceRecord.checkLog?.checkOutTime) {
            const isEarlyExitVal = isEarlyExit(
              attendanceRecord.checkLog.checkOutTime,
              employee.OfficeTimingOut
            );

            if (isEarlyExitVal) {
              earlyExits.push(dateStr);

              // If already marked as late, update to "Late and Early Exit"
              if (lateArrivals.includes(dateStr)) {
                // dbUpdates.push(
                //   db.attendence.update({
                //     where: { id: attendanceRecord.id },
                //     data: {
                //       workStatus: {
                //         connect: { id: lateAndEarlyWorkStatus.id },
                //       },
                //     },
                //   })
                // );
              } else {
                // Otherwise just mark as early exit
                // dbUpdates.push(
                //   db.attendence.update({
                //     where: { id: attendanceRecord.id },
                //     data: {
                //       workStatus: { connect: { id: earlyWorkStatus.id } },
                //     },
                //   })
                // );
              }
            }
          }
        }
      }

      // Calculate leave deductions
      const previousLateCount = previousLateCountsMap.get(employee.userId) || 0;
      const newLateCount = previousLateCount + lateArrivals.length;
      const leavesToDeduct =
        Math.floor(newLateCount / 3) - Math.floor(previousLateCount / 3);

      // Update late count in database
      if (lateArrivals.length > 0) {
        // dbUpdates.push(
        //   db.lateCount.upsert({
        //     where: {
        //       userId_month_year: {
        //         userId: employee.userId,
        //         month: currentMonth,
        //         year: currentYear,
        //       },
        //     },
        //     update: {
        //       count: newLateCount,
        //     },
        //     create: {
        //       userId: employee.userId,
        //       month: currentMonth,
        //       year: currentYear,
        //       count: newLateCount,
        //     },
        //   })
        // );
      }

      // Deduct leaves if necessary
      if (leavesToDeduct > 0 && employee.totalLeavesBalance !== null) {
        const newLeaveBalance = Math.max(
          0,
          (Number.parseInt(employee.totalLeavesBalance || "0", 10) || 0) -
            leavesToDeduct
        );

        // dbUpdates.push(
        //   db.userProfile.update({
        //     where: { userId: employee.userId },
        //     data: { totalLeavesBalance: newLeaveBalance.toString() },
        //   })
        // );

        // Create a leave record for leave deduction due to lateness
        if (leavesToDeduct > 0) {
          // dbUpdates.push(
          //   db.leaveRequest.create({
          //     data: {
          //       userId: employee.userId,
          //       leaveTypeId: unauthorizedAbsentLeaveType.id,
          //       startDate: new Date(),
          //       endDate: new Date(),
          //       reason: `Automatically deducted ${leavesToDeduct} leave(s) due to ${newLateCount} late arrivals`,
          //       status: "Approved",
          //       managerApproval: true,
          //       adminApproval: true,
          //       ceoApproval: true,
          //       approvedBy: "System",
          //     },
          //   })
          // );
        }
      }

      // Add to calculation results
      calculationResults.push({
        userId: employee.userId,
        fullName: employee.fullName,
        totalDaysChecked: dateRange.length,
        unauthorizedAbsences,
        lateArrivals,
        earlyExits,
        leavesDeducted: leavesToDeduct,
        previousLateCount,
        newLateCount,
      });
    }

    // Execute all database updates
    await Promise.all(dbUpdates);

    // Generate summary
    const summary = {
      totalEmployees: employees.length,
      totalDaysChecked: calculationResults.reduce(
        (sum, result) => sum + result.totalDaysChecked,
        0
      ),
      totalUnauthorizedAbsences: calculationResults.reduce(
        (sum, result) => sum + result.unauthorizedAbsences.length,
        0
      ),
      totalLateArrivals: calculationResults.reduce(
        (sum, result) => sum + result.lateArrivals.length,
        0
      ),
      totalEarlyExits: calculationResults.reduce(
        (sum, result) => sum + result.earlyExits.length,
        0
      ),
      totalLeavesDeducted: calculationResults.reduce(
        (sum, result) => sum + result.leavesDeducted,
        0
      ),
    };

    console.table({
      summary,
    });

    return NextResponse.json({
      success: true,
      message: "Attendance calculation completed successfully",
      summary,
      employeeResults: calculationResults,
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
