// ======================================================
// ======================================================
// ======================================================

// import { db } from "@/lib/db";
// import { type NextRequest, NextResponse } from "next/server";
// import { ShiftType } from "@prisma/client";

// type LeaveRequest = {
//   id: string;
//   startDate: string | Date;
//   endDate: string | Date;
//   status: string;
//   userId: string;
// };

// type Employee = {
//   userId: string;
//   fullName: string;
//   totalLeavesBalance: string | null;
//   leaveRequests: LeaveRequest[];
//   DOJ: Date | string | null;
// };

// type AttendanceRecord = {
//   id: string;
//   userId: string;
//   date: Date;
//   workingHours: string | null;
//   workStatus: {
//     id: string;
//     name: string;
//     createdAt: Date;
//     updatedAt: Date;
//   } | null;
//   checkLog: {
//     id: string;
//     checkInTime: Date | null;
//     checkOutTime: Date | null;
//     workingHours: string | null;
//     createdAt: Date;
//     updatedAt: Date;
//   } | null;
// };

// type TimetableEntry = {
//   id: string;
//   userId: string;
//   date: Date;
//   shiftStart: Date | null;
//   shiftEnd: Date | null;
//   shiftType: ShiftType;
// };

// type AttendanceCalculationResult = {
//   userId: string;
//   fullName: string;
//   totalDaysChecked: number;
//   unauthorizedAbsences: string[];
//   lateArrivals: string[];
//   earlyExits: string[];
//   leavesDeducted: number;
//   previousLateCount: number;
//   newLateCount: number;
// };

// function parseDate(date: Date | string | null): Date | null {
//   if (!date) return null;
//   if (date instanceof Date) return date;

//   try {
//     const parsedDate = new Date(date);
//     return isNaN(parsedDate.getTime()) ? null : parsedDate;
//   } catch {
//     return null;
//   }
// }

// function formatDate(date: Date | string | null): string {
//   const parsedDate = parseDate(date);
//   return parsedDate ? parsedDate.toISOString().split("T")[0] : "Not available";
// }

// function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
//   return date >= startDate && date <= endDate;
// }

// // Improved time parsing function that handles both "9:00" and "9:00 AM" formats
// // function parseTimeToMinutes(timeString: string | null): number {
// //   if (!timeString) return 9 * 60; // 9:00 AM UTC
// //   const [timePart] = timeString.split(" "); // Ignore AM/PM if present
// //   const [hoursStr, minutesStr] = timePart.split(":");
// //   return parseInt(hoursStr) * 60 + parseInt(minutesStr || "0");
// // }

// // Improved function to extract time from datetime and convert to minutes
// function extractTimeFromDateTime(dateTime: Date): number {
//   // Use the raw hours and minutes from the database without timezone conversion
//   const timeString = dateTime.toISOString();
//   const timePart = timeString.split("T")[1];
//   const [hours, minutes] = timePart.split(":").map(Number);

//   console.log(
//     `    Raw DateTime: ${dateTime.toISOString()}, Extracted Hours: ${hours}, Minutes: ${minutes}`
//   );

//   return hours * 60 + minutes;
// }

// // Improved function to check if employee is late with grace period
// function isLate(
//   checkInTime: Date | null,
//   expectedShiftStart: Date | null
// ): boolean {
//   if (!checkInTime || !expectedShiftStart) return false;

//   const expectedMinutes = extractTimeFromDateTime(expectedShiftStart);
//   const actualMinutes = extractTimeFromDateTime(checkInTime);

//   // Allow 15 minutes grace period
//   const graceMinutes = 0;
//   const isLateResult = actualMinutes > expectedMinutes + graceMinutes;

//   console.log(
//     `    Time check: Expected ${expectedShiftStart.toISOString()} (${expectedMinutes}min), ` +
//       `Actual ${checkInTime.toISOString()} (${actualMinutes}min), Grace: ${graceMinutes}min, Late: ${isLateResult}`
//   );

//   return isLateResult;
// }

// // Improved function to check if employee left early with grace period
// function isEarlyExit(
//   checkOutTime: Date | null,
//   expectedShiftEnd: Date | null
// ): boolean {
//   if (!checkOutTime || !expectedShiftEnd) return false;

//   const expectedMinutes = extractTimeFromDateTime(expectedShiftEnd);
//   const actualMinutes = extractTimeFromDateTime(checkOutTime);

//   // Allow 10 minutes grace period for early exit
//   const graceMinutes = 0;
//   const isEarly = actualMinutes < expectedMinutes - graceMinutes;

//   console.log(
//     `    Time check: Expected ${expectedShiftEnd.toISOString()} (${expectedMinutes}min), ` +
//       `Actual ${checkOutTime.toISOString()} (${actualMinutes}min), Grace: ${graceMinutes}min, Early: ${isEarly}`
//   );

//   return isEarly;
// }

// function hasApprovedHalfLeaveOnDate(
//   employee: Employee,
//   dateStr: string
// ): boolean {
//   const targetDate = new Date(dateStr);

//   return employee.leaveRequests.some((leave) => {
//     if (leave.status !== "Approved") return false;

//     const leaveStart = new Date(leave.startDate);
//     const leaveEnd = new Date(leave.endDate);

//     // Check if the leave spans the target date
//     if (targetDate < leaveStart || targetDate > leaveEnd) return false;

//     // Check if it's a half day leave (assuming half day leaves are same-day)
//     return (
//       formatDate(leaveStart) === formatDate(leaveEnd) &&
//       formatDate(leaveStart) === dateStr
//     );
//   });
// }

// // Helper function to get the earliest check-in and latest check-out for a day
// function getDayAttendanceSummary(records: AttendanceRecord[]) {
//   if (records.length === 0) return null;

//   let earliestCheckIn: Date | null = null;
//   let latestCheckOut: Date | null = null;

//   console.log(`    Processing ${records.length} attendance records:`);

//   for (const record of records) {
//     console.log(
//       `      Record ID: ${record.id}, CheckLog: ${
//         record.checkLog ? "exists" : "missing"
//       }`
//     );

//     if (record.checkLog?.checkInTime) {
//       const checkInTime = new Date(record.checkLog.checkInTime);
//       console.log(`        Check-in: ${checkInTime.toISOString()}`);

//       if (!earliestCheckIn || checkInTime < earliestCheckIn) {
//         earliestCheckIn = checkInTime;
//       }
//     }

//     if (record.checkLog?.checkOutTime) {
//       const checkOutTime = new Date(record.checkLog.checkOutTime);
//       console.log(`        Check-out: ${checkOutTime.toISOString()}`);

//       if (!latestCheckOut || checkOutTime > latestCheckOut) {
//         latestCheckOut = checkOutTime;
//       }
//     }
//   }

//   console.log(
//     `    Final times - Check-in: ${
//       earliestCheckIn?.toISOString() || "none"
//     }, Check-out: ${latestCheckOut?.toISOString() || "none"}`
//   );

//   return {
//     checkInTime: earliestCheckIn,
//     checkOutTime: latestCheckOut,
//     recordCount: records.length,
//   };
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     const { userId } = params;
//     const { dateFrom, dateTo, employeeIds } = await req.json();
//     const reportStartDate = new Date(dateFrom);
//     const reportEndDate = new Date(dateTo);

//     // Check if user has permission to calculate attendance
//     const requestingUser = await db.userProfile.findUnique({
//       where: { userId },
//       include: { role: true },
//     });

//     if (
//       !requestingUser ||
//       !["Admin", "CEO"].includes(requestingUser.role?.name || "")
//     ) {
//       return NextResponse.json(
//         { error: "You don't have permission to calculate attendance" },
//         { status: 403 }
//       );
//     }

//     // Find or create "Unauthorized Absent" leave type (commented out as we're not updating DB)
//     /*
//     let unauthorizedAbsentLeaveTyp0e = await db.leaveType.findFirst({
//       where: { name: "Unauthorized Absent" },
//     });

//     if (!unauthorizedAbsentLeaveType) {
//       unauthorizedAbsentLeaveType = await db.leaveType.create({
//         data: { name: "Unauthorized Absent" },
//       });
//       console.log("Created 'Unauthorized Absent' leave type");
//     }
//     */

//     // Find all employees who should be included in the calculation
//     const employees = await db.userProfile.findMany({
//       where: {
//         userId: {
//           in: employeeIds,
//         },
//         isHired: true,
//         status: {
//           name: "Active",
//         },
//         DOJ: {
//           lte: reportEndDate,
//         },
//       },
//       select: {
//         userId: true,
//         fullName: true,
//         totalLeavesBalance: true,
//         DOJ: true,
//         leaveRequests: {
//           select: {
//             id: true,
//             startDate: true,
//             endDate: true,
//             status: true,
//             userId: true,
//           },
//         },
//       },
//     });

//     console.log(
//       `Found ${employees.length} selected employees for attendance calculation`
//     );

//     // Find Attendance Records
//     const attendanceRecords = await db.attendence.findMany({
//       where: {
//         date: {
//           gte: reportStartDate,
//           lte: reportEndDate,
//         },
//         userId: {
//           in: employees.map((emp) => emp.userId),
//         },
//       },
//       include: {
//         checkLog: true,
//         workStatus: true,
//       },
//       orderBy: [{ userId: "asc" }, { date: "asc" }, { createdAt: "asc" }],
//     });

//     console.log(
//       `Found ${attendanceRecords.length} attendance records in the date range`
//     );

//     // Find Public Holidays
//     const publicHolidays = await db.publicHoliday.findMany({
//       where: {
//         date: {
//           gte: reportStartDate,
//           lte: reportEndDate,
//         },
//       },
//       include: {
//         employees: {
//           select: {
//             userId: true,
//           },
//         },
//       },
//     });

//     console.log(
//       `Found ${publicHolidays.length} public holidays in the date range`
//     );

//     // Fetch Timetables
//     const timetables = await db.timeTable.findMany({
//       where: {
//         date: {
//           gte: reportStartDate,
//           lte: reportEndDate,
//         },
//         userId: {
//           in: employees.map((emp) => emp.userId),
//         },
//       },
//     });

//     console.log(
//       `Found ${timetables.length} timetable entries in the date range`
//     );

//     // Get previous late counts for the current month (read-only)
//     const currentMonth = new Date().getMonth();
//     const currentYear = new Date().getFullYear();
//     const previousLateCountsMap = new Map<string, number>();

//     const lateCountRecords = await db.lateCount.findMany({
//       where: {
//         userId: {
//           in: employees.map((emp) => emp.userId),
//         },
//         month: currentMonth,
//         year: currentYear,
//       },
//     });

//     lateCountRecords.forEach((record) => {
//       previousLateCountsMap.set(record.userId, record.count);
//     });

//     // Create maps for quick lookups
//     const employeeMap = new Map<string, Employee>();
//     employees.forEach((emp) => employeeMap.set(emp.userId, emp as Employee));

//     // Group attendance records by user and date (now supports multiple records per day)
//     const attendanceMap = new Map<string, Map<string, AttendanceRecord[]>>();
//     attendanceRecords.forEach((record) => {
//       const userId = record.userId;
//       const dateKey = formatDate(record.date);

//       if (!attendanceMap.has(userId)) {
//         attendanceMap.set(userId, new Map<string, AttendanceRecord[]>());
//       }
//       if (!attendanceMap.get(userId)!.has(dateKey)) {
//         attendanceMap.get(userId)!.set(dateKey, []);
//       }
//       attendanceMap
//         .get(userId)!
//         .get(dateKey)!
//         .push(record as AttendanceRecord);
//     });

//     const timetableMap = new Map<string, Map<string, TimetableEntry>>();
//     timetables.forEach((entry) => {
//       const userId = entry.userId;
//       const dateKey = formatDate(entry.date);

//       if (!timetableMap.has(userId)) {
//         timetableMap.set(userId, new Map<string, TimetableEntry>());
//       }
//       timetableMap.get(userId)!.set(dateKey, entry as TimetableEntry);
//     });

//     const holidayMap = new Map<string, Set<string>>();
//     publicHolidays.forEach((holiday) => {
//       const dateKey = formatDate(holiday.date);

//       if (holiday.isForAll) {
//         // Global holiday for all employees
//         employees.forEach((emp) => {
//           if (!holidayMap.has(emp.userId)) {
//             holidayMap.set(emp.userId, new Set<string>());
//           }
//           holidayMap.get(emp.userId)!.add(dateKey);
//         });
//       } else {
//         // Holiday for specific employees
//         holiday.employees.forEach((emp) => {
//           if (!holidayMap.has(emp.userId)) {
//             holidayMap.set(emp.userId, new Set<string>());
//           }
//           holidayMap.get(emp.userId)!.add(dateKey);
//         });
//       }
//     });

//     // Generate date range
//     const generateDateRange = (startDate: Date, endDate: Date): string[] => {
//       const dates = [];
//       const currentDate = new Date(startDate);
//       while (currentDate <= endDate) {
//         dates.push(formatDate(currentDate));
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//       return dates;
//     };

//     // Calculate attendance for each employee
//     const calculationResults: AttendanceCalculationResult[] = [];
//     // Removed dbUpdates array since we're not performing any updates

//     // Get work statuses for attendance records (read-only)
//     const absentWorkStatus = await db.workStatus.findFirst({
//       where: { name: "Absent" },
//     });

//     const lateWorkStatus = await db.workStatus.findFirst({
//       where: { name: "Late" },
//     });

//     const earlyWorkStatus = await db.workStatus.findFirst({
//       where: { name: "Early" },
//     });

//     const lateAndEarlyWorkStatus = await db.workStatus.findFirst({
//       where: { name: "Late and Early" },
//     });

//     if (
//       !absentWorkStatus ||
//       !lateWorkStatus ||
//       !earlyWorkStatus ||
//       !lateAndEarlyWorkStatus
//     ) {
//       console.warn(
//         "Warning: Required work status types not found in the database"
//       );
//       // Continue without failing since we're not updating records
//     }

//     for (const employee of employees) {
//       const employeeDOJ = parseDate(employee.DOJ);
//       const employeeStartDate =
//         employeeDOJ && employeeDOJ > reportStartDate
//           ? employeeDOJ
//           : reportStartDate;

//       const dateRange = generateDateRange(employeeStartDate, reportEndDate);

//       const unauthorizedAbsences: string[] = [];
//       const lateArrivals: string[] = [];
//       const earlyExits: string[] = [];

//       const employeeAttendanceMap =
//         attendanceMap.get(employee.userId) || new Map();
//       const employeeTimetableMap =
//         timetableMap.get(employee.userId) || new Map();
//       const employeeHolidaySet = holidayMap.get(employee.userId) || new Set();

//       // Process each date in the range
//       for (const dateStr of dateRange) {
//         const currentDate = new Date(dateStr);
//         const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

//         // Get timetable entry for this date
//         const timetableEntry = employeeTimetableMap.get(dateStr);

//         // Skip weekends (Saturday and Sunday) unless specifically scheduled
//         if ((dayOfWeek === 0 || dayOfWeek === 6) && !timetableEntry) {
//           continue;
//         }

//         // Check if it's a holiday
//         if (employeeHolidaySet.has(dateStr)) {
//           continue;
//         }

//         // Check if it's an approved leave
//         const isApprovedLeave = employee.leaveRequests.some(
//           (leave) =>
//             leave.status === "Approved" &&
//             isDateInRange(
//               currentDate,
//               new Date(leave.startDate),
//               new Date(leave.endDate)
//             )
//         );

//         if (isApprovedLeave) {
//           continue;
//         }

//         // Check timetable to see if employee is scheduled to work
//         if (!timetableEntry) {
//           console.log(
//             `Employee ${employee.fullName} has no timetable entry for ${dateStr}, skipping attendance check.`
//           );
//           continue;
//         }

//         // Check timetable to see if employee is scheduled to work
//         // const shiftType = employeeTimetableMap.get(dateStr);
//         console.log(
//           `Employee ${employee.fullName} is scheduled for ${timetableEntry.shiftType} on ${dateStr}`
//         );

//         if (timetableEntry.shiftType === ShiftType.Off) {
//           console.log(
//             `Employee ${employee.fullName} is off on ${dateStr}, skipping attendance check.`
//           );
//           continue;
//         }

//         // Check attendance records for this date
//         const dayAttendanceRecords = employeeAttendanceMap.get(dateStr) || [];

//         if (dayAttendanceRecords.length === 0) {
//           // No attendance record found - unauthorized absence
//           unauthorizedAbsences.push(dateStr);

//           // Commented out database update
//           /*
//           dbUpdates.push(
//             db.attendence.create({
//               data: {
//                 user: { connect: { userId: employee.userId } },
//                 date: currentDate,
//                 workStatus: { connect: { id: absentWorkStatus.id } },
//                 workingHours: "0 hours 0 minutes",
//               },
//             })
//           );

//           dbUpdates.push(
//             db.leaveRequest.create({
//               data: {
//                 userId: employee.userId,
//                 leaveTypeId: unauthorizedAbsentLeaveType.id,
//                 startDate: currentDate,
//                 endDate: currentDate,
//                 reason: "Automatically applied due to unauthorized absence",
//                 status: "Approved",
//                 managerApproval: true,
//                 adminApproval: true,
//                 ceoApproval: true,
//                 approvedBy: "System",
//               },
//             })
//           );
//           */
//           continue;
//         }

//         // Get the summary of the day (earliest check-in, latest check-out)
//         const daySummary = getDayAttendanceSummary(dayAttendanceRecords);

//         if (!daySummary || !daySummary.checkInTime) {
//           // No valid check-in found - unauthorized absence
//           unauthorizedAbsences.push(dateStr);
//           continue;
//         }

//         // Check for late arrival using the earliest check-in
//         const isLateArrival = isLate(
//           daySummary.checkInTime,
//           timetableEntry.shiftStart
//         );

//         if (isLateArrival) {
//           lateArrivals.push(dateStr);

//           if (timetableEntry.shiftStart) {
//             const expectedMinutes = extractTimeFromDateTime(
//               timetableEntry.shiftStart
//             );
//             const actualMinutes = extractTimeFromDateTime(
//               daySummary.checkInTime!
//             );
//             const lateMinutes = actualMinutes - expectedMinutes;
//             const lateHours = lateMinutes / 60;

//             console.log(
//               `    Employee was ${lateHours.toFixed(
//                 2
//               )} hours late on ${dateStr}`
//             );

//             // Check if employee was 1 hour or more late and doesn't have approved half leave
//             if (
//               lateHours >= 1 &&
//               !hasApprovedHalfLeaveOnDate(employee, dateStr)
//             ) {
//               // Deduct 0.5 leaves as unauthorized half leave
//               // Commented out database updates as requested
//               /*
//       dbUpdates.push(
//         db.userProfile.update({
//           where: { userId: employee.userId },
//           data: {
//             totalLeavesBalance: (parseFloat(employee.totalLeavesBalance || "0") - 0.5).toString()
//           }
//         })
//       );

//       dbUpdates.push(
//         db.leaveRequest.create({
//           data: {
//             userId: employee.userId,
//             leaveTypeId: unauthorizedAbsentLeaveType.id,
//             startDate: currentDate,
//             endDate: currentDate,
//             reason: `Automatically deducted 0.5 leave for being ${lateHours.toFixed(2)} hours late on ${dateStr}`,
//             status: "Approved",
//             managerApproval: true,
//             adminApproval: true,
//             ceoApproval: true,
//             approvedBy: "System",
//           },
//         })
//       );
//       */
//             }

//             console.log(
//               `    Deducted 0.5 leaves for unauthorized late arrival on ${dateStr}`
//             );
//           }
//         }

//         // Check for early exit using the latest check-out
//         if (daySummary.checkOutTime && timetableEntry.shiftEnd) {
//           const isEarlyExitVal = isEarlyExit(
//             daySummary.checkOutTime,
//             timetableEntry.shiftEnd
//           );

//           if (isEarlyExitVal) {
//             earlyExits.push(dateStr);

//             // Calculate how early the employee left in hours
//             const expectedMinutes = extractTimeFromDateTime(
//               timetableEntry.shiftEnd
//             );
//             const actualMinutes = extractTimeFromDateTime(
//               daySummary.checkOutTime
//             );
//             const earlyMinutes = expectedMinutes - actualMinutes;
//             const earlyHours = earlyMinutes / 60;

//             console.log(
//               `    Employee left ${earlyHours.toFixed(
//                 2
//               )} hours early on ${dateStr}`
//             );

//             // Check if employee left 1 hour or more early and doesn't have approved half leave
//             if (
//               earlyHours >= 1 &&
//               !hasApprovedHalfLeaveOnDate(employee, dateStr)
//             ) {
//               // Deduct 0.5 leaves as unauthorized half leave
//               // Commented out database updates as requested
//               /*
//       dbUpdates.push(
//         db.userProfile.update({
//           where: { userId: employee.userId },
//           data: {
//             totalLeavesBalance: (parseFloat(employee.totalLeavesBalance || "0") - 0.5).toString()
//           }
//         })
//       );

//       dbUpdates.push(
//         db.leaveRequest.create({
//           data: {
//             userId: employee.userId,
//             leaveTypeId: unauthorizedAbsentLeaveType.id,
//             startDate: currentDate,
//             endDate: currentDate,
//             reason: `Automatically deducted 0.5 leave for leaving ${earlyHours.toFixed(2)} hours early on ${dateStr}`,
//             status: "Approved",
//             managerApproval: true,
//             adminApproval: true,
//             ceoApproval: true,
//             approvedBy: "System",
//           },
//         })
//       );
//       */

//               console.log(
//                 `    Deducted 0.5 leaves for unauthorized early exit on ${dateStr}`
//               );
//             }
//           }
//         }
//       }

//       // Calculate leave deductions based on late arrivals
//       const previousLateCount = previousLateCountsMap.get(employee.userId) || 0;
//       const combinedLateEarlyCount =
//         previousLateCount + lateArrivals.length + earlyExits.length;
//       const leavesToDeduct =
//         Math.floor(combinedLateEarlyCount / 3) -
//         Math.floor(previousLateCount / 3);

//       // Commented out database updates for late count and leave balance
//       /*
//       if (lateArrivals.length > 0) {
//         dbUpdates.push(
//           db.lateCount.upsert({
//             where: {
//               userId_month_year: {
//                 userId: employee.userId,
//                 month: currentMonth,
//                 year: currentYear,
//               },
//             },
//             update: { count: newLateCount },
//             create: {
//               userId: employee.userId,
//               month: currentMonth,
//               year: currentYear,
//               count: newLateCount,
//             },
//           })
//         );
//       }

//       if (leavesToDeduct > 0 && employee.totalLeavesBalance !== null) {
//         const newLeaveBalance = Math.max(
//           0,
//           (Number.parseInt(employee.totalLeavesBalance || "0", 10) || 0) -
//             leavesToDeduct
//         );

//         dbUpdates.push(
//           db.userProfile.update({
//             where: { userId: employee.userId },
//             data: { totalLeavesBalance: newLeaveBalance.toString() },
//           })
//         );

//         if (leavesToDeduct > 0) {
//           dbUpdates.push(
//             db.leaveRequest.create({
//               data: {
//                 userId: employee.userId,
//                 leaveTypeId: unauthorizedAbsentLeaveType.id,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 reason: `Automatically deducted ${leavesToDeduct} leave(s) due to ${newLateCount} late arrivals`,
//                 status: "Approved",
//                 managerApproval: true,
//                 adminApproval: true,
//                 ceoApproval: true,
//                 approvedBy: "System",
//               },
//             })
//           );
//         }
//       }
//       */

//       // Add to calculation results
//       calculationResults.push({
//         userId: employee.userId,
//         fullName: employee.fullName,
//         totalDaysChecked: dateRange.length,
//         unauthorizedAbsences,
//         lateArrivals,
//         earlyExits,
//         leavesDeducted: leavesToDeduct,
//         previousLateCount,
//         newLateCount: combinedLateEarlyCount,
//       });
//     }

//     // Removed database updates execution
//     // await Promise.all(dbUpdates);

//     // Generate summary
//     const summary = {
//       totalEmployees: employees.length,
//       totalDaysChecked: calculationResults.reduce(
//         (sum, result) => sum + result.totalDaysChecked,
//         0
//       ),
//       totalUnauthorizedAbsences: calculationResults.reduce(
//         (sum, result) => sum + result.unauthorizedAbsences.length,
//         0
//       ),
//       totalLateArrivals: calculationResults.reduce(
//         (sum, result) => sum + result.lateArrivals.length,
//         0
//       ),
//       totalEarlyExits: calculationResults.reduce(
//         (sum, result) => sum + result.earlyExits.length,
//         0
//       ),
//       totalLeavesDeducted: calculationResults.reduce(
//         (sum, result) => sum + result.leavesDeducted,
//         0
//       ),
//     };

//     console.table({
//       summary,
//     });

//     return NextResponse.json({
//       success: true,
//       message:
//         "Attendance calculation completed successfully (no database updates were performed)",
//       summary,
//       employeeResults: calculationResults,
//     });
//   } catch (error) {
//     console.error(
//       "Error in Calculating Attendance Report:",
//       error instanceof Error ? error.message : String(error)
//     );
//     return NextResponse.json(
//       {
//         error: "Failed to process attendance report calculation",
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   }
// }

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

type TimetableEntry = {
  id: string;
  userId: string;
  date: Date;
  shiftStart: Date | null;
  shiftEnd: Date | null;
  shiftType: ShiftType;
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
  sandwichDays: string[]; // NEW: Detected sandwich dates
  sandwichDeductions: number; // NEW: Additional leaves to deduct
  halfLeaveDeductionsLate: number; // Half leaves deducted for late arrivals
  halfLeaveDeductionsEarly: number; // Half leaves deducted for early exits
  totalHalfLeaveDeductions: number; // Total half leaves deducted
  unauthorizedHalfLeaveDatesLate: string[]; // Dates with unauthorized half leaves for late arrivals
  unauthorizedHalfLeaveDatesEarly: string[]; // Dates with unauthorized half leaves for early exits
  creditedLeaves: string[]; // NEW: Dates where leaves were credited back
  creditedLeaveCount: number; // NEW: Total leaves credited back
};

function parseDate(date: Date | string | null): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;

  try {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  } catch {
    return null;
  }
}

function formatDate(date: Date | string | null): string {
  const parsedDate = parseDate(date);
  return parsedDate ? parsedDate.toISOString().split("T")[0] : "Not available";
}

function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

// Improved time parsing function that handles both "9:00" and "9:00 AM" formats
// function parseTimeToMinutes(timeString: string | null): number {
//   if (!timeString) return 9 * 60; // 9:00 AM UTC
//   const [timePart] = timeString.split(" "); // Ignore AM/PM if present
//   const [hoursStr, minutesStr] = timePart.split(":");
//   return parseInt(hoursStr) * 60 + parseInt(minutesStr || "0");
// }

// Improved function to extract time from datetime and convert to minutes
function extractTimeFromDateTime(dateTime: Date): number {
  // Use the raw hours and minutes from the database without timezone conversion
  const timeString = dateTime.toISOString();
  const timePart = timeString.split("T")[1];
  const [hours, minutes] = timePart.split(":").map(Number);

  console.log(
    `    Raw DateTime: ${dateTime.toISOString()}, Extracted Hours: ${hours}, Minutes: ${minutes}`
  );

  return hours * 60 + minutes;
}

// Improved function to check if employee is late with grace period
function isLate(
  checkInTime: Date | null,
  expectedShiftStart: Date | null
): boolean {
  if (!checkInTime || !expectedShiftStart) return false;

  const expectedMinutes = extractTimeFromDateTime(expectedShiftStart);
  const actualMinutes = extractTimeFromDateTime(checkInTime);

  // Allow 15 minutes grace period
  const graceMinutes = 0;
  const isLateResult = actualMinutes > expectedMinutes + graceMinutes;

  console.log(
    `    Time check: Expected ${expectedShiftStart.toISOString()} (${expectedMinutes}min), ` +
      `Actual ${checkInTime.toISOString()} (${actualMinutes}min), Grace: ${graceMinutes}min, Late: ${isLateResult}`
  );

  return isLateResult;
}

// Improved function to check if employee left early with grace period
function isEarlyExit(
  checkOutTime: Date | null,
  expectedShiftEnd: Date | null
): boolean {
  if (!checkOutTime || !expectedShiftEnd) return false;

  const expectedMinutes = extractTimeFromDateTime(expectedShiftEnd);
  const actualMinutes = extractTimeFromDateTime(checkOutTime);

  // Allow 10 minutes grace period for early exit
  const graceMinutes = 0;
  const isEarly = actualMinutes < expectedMinutes - graceMinutes;

  console.log(
    `    Time check: Expected ${expectedShiftEnd.toISOString()} (${expectedMinutes}min), ` +
      `Actual ${checkOutTime.toISOString()} (${actualMinutes}min), Grace: ${graceMinutes}min, Early: ${isEarly}`
  );

  return isEarly;
}

function hasApprovedHalfLeaveOnDate(
  employee: Employee,
  dateStr: string
): boolean {
  const targetDate = new Date(dateStr);

  return employee.leaveRequests.some((leave) => {
    if (leave.status !== "Approved") return false;

    const leaveStart = new Date(leave.startDate);
    const leaveEnd = new Date(leave.endDate);

    // Check if the leave spans the target date
    if (targetDate < leaveStart || targetDate > leaveEnd) return false;

    // Check if it's a half day leave (assuming half day leaves are same-day)
    return (
      formatDate(leaveStart) === formatDate(leaveEnd) &&
      formatDate(leaveStart) === dateStr
    );
  });
}

// Helper function to get the earliest check-in and latest check-out for a day
function getDayAttendanceSummary(records: AttendanceRecord[]) {
  if (records.length === 0) return null;

  let earliestCheckIn: Date | null = null;
  let latestCheckOut: Date | null = null;

  console.log(`    Processing ${records.length} attendance records:`);

  for (const record of records) {
    console.log(
      `      Record ID: ${record.id}, CheckLog: ${
        record.checkLog ? "exists" : "missing"
      }`
    );

    if (record.checkLog?.checkInTime) {
      const checkInTime = new Date(record.checkLog.checkInTime);
      console.log(`        Check-in: ${checkInTime.toISOString()}`);

      if (!earliestCheckIn || checkInTime < earliestCheckIn) {
        earliestCheckIn = checkInTime;
      }
    }

    if (record.checkLog?.checkOutTime) {
      const checkOutTime = new Date(record.checkLog.checkOutTime);
      console.log(`        Check-out: ${checkOutTime.toISOString()}`);

      if (!latestCheckOut || checkOutTime > latestCheckOut) {
        latestCheckOut = checkOutTime;
      }
    }
  }

  console.log(
    `    Final times - Check-in: ${
      earliestCheckIn?.toISOString() || "none"
    }, Check-out: ${latestCheckOut?.toISOString() || "none"}`
  );

  return {
    checkInTime: earliestCheckIn,
    checkOutTime: latestCheckOut,
    recordCount: records.length,
  };
}

function detectSandwichDays(
  employee: Employee,
  dateRange: string[],
  timetableMap: Map<string, Map<string, TimetableEntry>>,
  holidayMap: Map<string, Set<string>>,
  unauthorizedAbsences: string[],
  unauthorizedHalfLeaves: string[]
): string[] {
  const sandwichDays: string[] = [];

  // 1. Combine ALL leave dates (approved + unauthorized)
  const allLeaveDates = new Set<string>([
    ...unauthorizedAbsences,
    ...unauthorizedHalfLeaves,
    ...employee.leaveRequests
      .filter((leave) => leave.status === "Approved")
      .flatMap((leave) => {
        const dates = [];
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(formatDate(d));
        }
        return dates;
      }),
  ]);

  // 2. Sort dates chronologically
  const sortedLeaveDates = Array.from(allLeaveDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // 3. Find sandwich patterns between consecutive leave dates
  for (let i = 0; i < sortedLeaveDates.length - 1; i++) {
    const currentLeave = new Date(sortedLeaveDates[i]);
    const nextLeave = new Date(sortedLeaveDates[i + 1]);

    // Only check sequences where leaves are separated by 1-3 days
    const dayDiff =
      (nextLeave.getTime() - currentLeave.getTime()) / (1000 * 60 * 60 * 24);
    if (dayDiff <= 1 || dayDiff > 3) continue;

    // Check each day between the two leaves
    const checkDate = new Date(currentLeave);
    checkDate.setDate(checkDate.getDate() + 1);

    while (checkDate < nextLeave) {
      const checkDateStr = formatDate(checkDate);

      // Verify it's truly an off day
      const isHoliday = holidayMap.get(employee.userId)?.has(checkDateStr);
      const timetableEntry = timetableMap
        .get(employee.userId)
        ?.get(checkDateStr);
      const isScheduledOff = timetableEntry?.shiftType === ShiftType.Off;
      const isWeekend = !timetableEntry && [0, 6].includes(checkDate.getDay());

      if (
        (isHoliday || isScheduledOff || isWeekend) &&
        !allLeaveDates.has(checkDateStr) &&
        !sandwichDays.includes(checkDateStr)
      ) {
        sandwichDays.push(checkDateStr);
        console.log(
          `✅ Sandwich day detected: ${checkDateStr} between ${
            sortedLeaveDates[i]
          } and ${sortedLeaveDates[i + 1]}`
        );
      }

      checkDate.setDate(checkDate.getDate() + 1);
    }
  }

  return sandwichDays;
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

    // Find or create "Unauthorized Absent" leave type (commented out as we're not updating DB)
    /*
    let unauthorizedAbsentLeaveTyp0e = await db.leaveType.findFirst({
      where: { name: "Unauthorized Absent" },
    });

    if (!unauthorizedAbsentLeaveType) {
      unauthorizedAbsentLeaveType = await db.leaveType.create({
        data: { name: "Unauthorized Absent" },
      });
      console.log("Created 'Unauthorized Absent' leave type");
    }
    */

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
      orderBy: [{ userId: "asc" }, { date: "asc" }, { createdAt: "asc" }],
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

    // Get previous late counts for the current month (read-only)
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

    // Group attendance records by user and date (now supports multiple records per day)
    const attendanceMap = new Map<string, Map<string, AttendanceRecord[]>>();
    attendanceRecords.forEach((record) => {
      const userId = record.userId;
      const dateKey = formatDate(record.date);

      if (!attendanceMap.has(userId)) {
        attendanceMap.set(userId, new Map<string, AttendanceRecord[]>());
      }
      if (!attendanceMap.get(userId)!.has(dateKey)) {
        attendanceMap.get(userId)!.set(dateKey, []);
      }
      attendanceMap
        .get(userId)!
        .get(dateKey)!
        .push(record as AttendanceRecord);
    });

    const timetableMap = new Map<string, Map<string, TimetableEntry>>();
    timetables.forEach((entry) => {
      const userId = entry.userId;
      const dateKey = formatDate(entry.date);

      if (!timetableMap.has(userId)) {
        timetableMap.set(userId, new Map<string, TimetableEntry>());
      }
      timetableMap.get(userId)!.set(dateKey, entry as TimetableEntry);
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
          holidayMap.get(emp.userId)!.add(dateKey);
        });
      } else {
        // Holiday for specific employees
        holiday.employees.forEach((emp) => {
          if (!holidayMap.has(emp.userId)) {
            holidayMap.set(emp.userId, new Set<string>());
          }
          holidayMap.get(emp.userId)!.add(dateKey);
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
    // Removed dbUpdates array since we're not performing any updates

    // Get work statuses for attendance records (read-only)
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
      console.warn(
        "Warning: Required work status types not found in the database"
      );
      // Continue without failing since we're not updating records
    }

    for (const employee of employees) {
      const employeeDOJ = parseDate(employee.DOJ);
      const employeeStartDate =
        employeeDOJ && employeeDOJ > reportStartDate
          ? employeeDOJ
          : reportStartDate;

      const dateRange = generateDateRange(employeeStartDate, reportEndDate);

      const unauthorizedAbsences: string[] = [];

      const unauthorizedHalfLeaveDatesLate: string[] = [];
      const unauthorizedHalfLeaveDatesEarly: string[] = [];

      const lateArrivals: string[] = [];
      const earlyExits: string[] = [];

      const creditedLeaves: string[] = [];
      let creditedLeaveCount = 0;

      // // NEW: Sandwich leave detection
      // const sandwichDays: string[] = [];
      // let consecutiveLeaves: string[] = [];

      let halfLeaveDeductionsLate = 0;
      let halfLeaveDeductionsEarly = 0;

      const unauthorizedLateDates = new Set<string>();
      const unauthorizedEarlyDates = new Set<string>();

      const employeeAttendanceMap =
        attendanceMap.get(employee.userId) || new Map();
      const employeeTimetableMap =
        timetableMap.get(employee.userId) || new Map();
      const employeeHolidaySet = holidayMap.get(employee.userId) || new Set();

      // Process each date in the range
      for (const dateStr of dateRange) {
        const currentDate = new Date(dateStr);
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Get timetable entry for this date
        const timetableEntry = employeeTimetableMap.get(dateStr);

        // Skip weekends (Saturday and Sunday) unless specifically scheduled
        if ((dayOfWeek === 0 || dayOfWeek === 6) && !timetableEntry) {
          continue;
        }

        // Check if it's a holiday
        if (employeeHolidaySet.has(dateStr)) {
          continue;
        }

        // // Check if it's an approved leave
        // const isApprovedLeave = employee.leaveRequests.some(
        //   (leave) =>
        //     leave.status === "Approved" &&
        //     isDateInRange(
        //       currentDate,
        //       new Date(leave.startDate),
        //       new Date(leave.endDate)
        //     )
        // );

        // if (isApprovedLeave) {
        //   continue;
        // }

        // Check if it's an approved leave
        const approvedLeaves = employee.leaveRequests.filter(
          (leave) =>
            leave.status === "Approved" &&
            isDateInRange(
              currentDate,
              new Date(leave.startDate),
              new Date(leave.endDate)
            )
        );

        // Check attendance records for this date
        const dayAttendanceRecords = employeeAttendanceMap.get(dateStr) || [];

        if (approvedLeaves.length > 0 && dayAttendanceRecords.length > 0) {
          // Credit back leave
          creditedLeaves.push(dateStr);
          creditedLeaveCount += approvedLeaves.length;
          console.log(
            `Leave credited back for ${employee.fullName} on ${dateStr} because attendance was found. Total leaves credited back: ${creditedLeaveCount} (${approvedLeaves.length} leaves)`
          );
          // Commented out database update for leave credit
          /*
          // For each approved leave that covers this date
          for (const leave of approvedLeaves) {
          // Credit back the leave
          dbUpdates.push(
             db.userProfile.update({
              where: { userId: employee.userId },
              data: {
                totalLeavesBalance: (parseFloat(employee.totalLeavesBalance || "0") + approvedLeaves.length).toString()
              }
             })
          )
             // Add leave balance adjustment record
             dbUpdates.push(
              db.leaveBalanceAdjustment.create({
                data: {
                  userId: employee.userId,
                   entitledLeaves: "1",
                  reason: `Leave credited back for ${dateStr} as employee attended work`,
                  date: new Date(),
                }
              })
          }
          */
          continue;
        }

        // Check timetable to see if employee is scheduled to work
        if (!timetableEntry) {
          console.log(
            `Employee ${employee.fullName} has no timetable entry for ${dateStr}, skipping attendance check.`
          );
          continue;
        }

        // Check timetable to see if employee is scheduled to work
        // const shiftType = employeeTimetableMap.get(dateStr);
        console.log(
          `Employee ${employee.fullName} is scheduled for ${timetableEntry.shiftType} on ${dateStr}`
        );

        if (timetableEntry.shiftType === ShiftType.Off) {
          console.log(
            `Employee ${employee.fullName} is off on ${dateStr}, skipping attendance check.`
          );
          continue;
        }

        if (dayAttendanceRecords.length === 0) {
          // No attendance record found - unauthorized absence
          unauthorizedAbsences.push(dateStr);

          // Commented out database update
          /*
          dbUpdates.push(
            db.attendence.create({
              data: {
                user: { connect: { userId: employee.userId } },
                date: currentDate,
                workStatus: { connect: { id: absentWorkStatus.id } },
                workingHours: "0 hours 0 minutes",
              },
            })
          );

          dbUpdates.push(
            db.leaveRequest.create({
              data: {
                userId: employee.userId,
                leaveTypeId: unauthorizedAbsentLeaveType.id,
                startDate: currentDate,
                endDate: currentDate,
                reason: "Automatically applied due to unauthorized absence",
                status: "Approved",
                managerApproval: true,
                adminApproval: true,
                ceoApproval: true,
                approvedBy: "System",
              },
            })
          );
          */
          continue;
        }

        // const isLeaveDay = employee.leaveRequests.some(
        //   (leave) =>
        //     leave.status === "Approved" &&
        //     isDateInRange(
        //       new Date(dateStr),
        //       new Date(leave.startDate),
        //       new Date(leave.endDate)
        //     )
        // );

        // Get the summary of the day (earliest check-in, latest check-out)
        const daySummary = getDayAttendanceSummary(dayAttendanceRecords);

        if (!daySummary || !daySummary.checkInTime) {
          // No valid check-in found - unauthorized absence
          unauthorizedAbsences.push(dateStr);
          continue;
        }

        // Check for late arrival using the earliest check-in
        const isLateArrival = isLate(
          daySummary.checkInTime,
          timetableEntry.shiftStart
        );

        if (isLateArrival) {
          if (timetableEntry.shiftStart) {
            const expectedMinutes = extractTimeFromDateTime(
              timetableEntry.shiftStart
            );
            const actualMinutes = extractTimeFromDateTime(
              daySummary.checkInTime!
            );
            const lateMinutes = actualMinutes - expectedMinutes;
            const lateHours = lateMinutes / 60;

            console.log(
              `    Employee was ${lateHours.toFixed(
                2
              )} hours late on ${dateStr}`
            );

            // Check if employee was 1 hour or more late and doesn't have approved half leave
            if (
              lateHours >= 1 &&
              !hasApprovedHalfLeaveOnDate(employee, dateStr)
            ) {
              halfLeaveDeductionsLate += 0.5;
              unauthorizedLateDates.add(dateStr);
              unauthorizedHalfLeaveDatesLate.push(dateStr);
              console.log(
                `    Would deduct 0.5 leaves for unauthorized late arrival on ${dateStr} (Total late deductions so far: ${halfLeaveDeductionsLate})`
              );
              // Deduct 0.5 leaves as unauthorized half leave
              // Commented out database updates as requested
              /*
      dbUpdates.push(
        db.userProfile.update({
          where: { userId: employee.userId },
          data: {
            totalLeavesBalance: (parseFloat(employee.totalLeavesBalance || "0") - 0.5).toString()
          }
        })
      );
  
      dbUpdates.push(
        db.leaveRequest.create({
          data: {
            userId: employee.userId,
            leaveTypeId: unauthorizedAbsentLeaveType.id,
            startDate: currentDate,
            endDate: currentDate,
            reason: `Automatically deducted 0.5 leave for being ${lateHours.toFixed(2)} hours late on ${dateStr}`,
            status: "Approved",
            managerApproval: true,
            adminApproval: true,
            ceoApproval: true,
            approvedBy: "System",
          },
        })
      );
      */
            }

            console.log(
              `    Deducted 0.5 leaves for unauthorized late arrival on ${dateStr}`
            );
          }
          if (!unauthorizedLateDates.has(dateStr)) {
            lateArrivals.push(dateStr);
          }
        }

        // Check for early exit using the latest check-out
        if (daySummary.checkOutTime && timetableEntry.shiftEnd) {
          const isEarlyExitVal = isEarlyExit(
            daySummary.checkOutTime,
            timetableEntry.shiftEnd
          );

          if (isEarlyExitVal) {
            // Calculate how early the employee left in hours
            const expectedMinutes = extractTimeFromDateTime(
              timetableEntry.shiftEnd
            );
            const actualMinutes = extractTimeFromDateTime(
              daySummary.checkOutTime
            );
            const earlyMinutes = expectedMinutes - actualMinutes;
            const earlyHours = earlyMinutes / 60;

            console.log(
              `    Employee left ${earlyHours.toFixed(
                2
              )} hours early on ${dateStr}`
            );

            // Check if employee left 1 hour or more early and doesn't have approved half leave
            if (
              earlyHours >= 1 &&
              !hasApprovedHalfLeaveOnDate(employee, dateStr)
            ) {
              halfLeaveDeductionsEarly += 0.5;
              unauthorizedHalfLeaveDatesEarly.push(dateStr);
              unauthorizedEarlyDates.add(dateStr);
              console.log(
                `    Would deduct 0.5 leaves for unauthorized early exit on ${dateStr} (Total early deductions so far: ${halfLeaveDeductionsEarly})`
              );
              // Deduct 0.5 leaves as unauthorized half leave
              // Commented out database updates as requested
              /*
      dbUpdates.push(
        db.userProfile.update({
          where: { userId: employee.userId },
          data: {
            totalLeavesBalance: (parseFloat(employee.totalLeavesBalance || "0") - 0.5).toString()
          }
        })
      );

      dbUpdates.push(
        db.leaveRequest.create({
          data: {
            userId: employee.userId,
            leaveTypeId: unauthorizedAbsentLeaveType.id,
            startDate: currentDate,
            endDate: currentDate,
            reason: `Automatically deducted 0.5 leave for leaving ${earlyHours.toFixed(2)} hours early on ${dateStr}`,
            status: "Approved",
            managerApproval: true,
            adminApproval: true,
            ceoApproval: true,
            approvedBy: "System",
          },
        })
      );
      */

              console.log(
                `    Deducted 0.5 leaves for unauthorized early exit on ${dateStr}`
              );
            }
            if (!unauthorizedEarlyDates.has(dateStr)) {
              earlyExits.push(dateStr);
            }
          }
        }
      }

      // Calculate leave deductions based on late arrivals
      const previousLateCount = previousLateCountsMap.get(employee.userId) || 0;
      const combinedLateEarlyCount =
        previousLateCount + lateArrivals.length + earlyExits.length;
      const leavesToDeduct =
        Math.floor(combinedLateEarlyCount / 3) -
        Math.floor(previousLateCount / 3);

      // Commented out database updates for late count and leave balance
      /*
      if (lateArrivals.length > 0) {
        dbUpdates.push(
          db.lateCount.upsert({
            where: {
              userId_month_year: {
                userId: employee.userId,
                month: currentMonth,
                year: currentYear,
              },
            },
            update: { count: newLateCount },
            create: {
              userId: employee.userId,
              month: currentMonth,
              year: currentYear,
              count: newLateCount,
            },
          })
        );
      }

      if (leavesToDeduct > 0 && employee.totalLeavesBalance !== null) {
        const newLeaveBalance = Math.max(
          0,
          (Number.parseInt(employee.totalLeavesBalance || "0", 10) || 0) -
            leavesToDeduct
        );

        dbUpdates.push(
          db.userProfile.update({
            where: { userId: employee.userId },
            data: { totalLeavesBalance: newLeaveBalance.toString() },
          })
        );

        if (leavesToDeduct > 0) {
          dbUpdates.push(
            db.leaveRequest.create({
              data: {
                userId: employee.userId,
                leaveTypeId: unauthorizedAbsentLeaveType.id,
                startDate: new Date(),
                endDate: new Date(),
                reason: `Automatically deducted ${leavesToDeduct} leave(s) due to ${newLateCount} late arrivals`,
                status: "Approved",
                managerApproval: true,
                adminApproval: true,
                ceoApproval: true,
                approvedBy: "System",
              },
            })
          );
        }
      }
      */

      const sandwichDays = detectSandwichDays(
        employee,
        dateRange,
        timetableMap,
        holidayMap,
        unauthorizedAbsences,
        [...unauthorizedHalfLeaveDatesLate, ...unauthorizedHalfLeaveDatesEarly] // Combine half-leaves
      );

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
        newLateCount: combinedLateEarlyCount,
        sandwichDays, // NEW
        sandwichDeductions: sandwichDays.length, // NEW
        // NEW: Add half leave deduction counts
        halfLeaveDeductionsLate,
        halfLeaveDeductionsEarly,
        totalHalfLeaveDeductions:
          halfLeaveDeductionsLate + halfLeaveDeductionsEarly,
        unauthorizedHalfLeaveDatesLate,
        unauthorizedHalfLeaveDatesEarly,
        creditedLeaves,
        creditedLeaveCount,
      });

      // NEW: Log the total deductions for this employee
      console.log(
        `Employee ${
          employee.fullName
        } would have ${halfLeaveDeductionsLate} half leaves deducted for late arrivals and ${halfLeaveDeductionsEarly} for early exits (Total: ${
          halfLeaveDeductionsLate + halfLeaveDeductionsEarly
        })`
      );
    }

    // Removed database updates execution
    // await Promise.all(dbUpdates);

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
      // ... existing summary fields ...,
      totalSandwichDays: calculationResults.reduce(
        (sum, result) => sum + result.sandwichDays.length,
        0
      ),
      totalSandwichDeductions: calculationResults.reduce(
        (sum, result) => sum + result.sandwichDeductions,
        0
      ),
      // NEW: Add half leave deduction summary
      totalHalfLeaveDeductionsLate: calculationResults.reduce(
        (sum, result) => sum + result.halfLeaveDeductionsLate,
        0
      ),
      totalHalfLeaveDeductionsEarly: calculationResults.reduce(
        (sum, result) => sum + result.halfLeaveDeductionsEarly,
        0
      ),
      totalHalfLeaveDeductions: calculationResults.reduce(
        (sum, result) => sum + result.totalHalfLeaveDeductions,
        0
      ),
      totalCreditedLeaves: calculationResults.reduce(
        (sum, result) => sum + result.creditedLeaves.length,
        0
      ),
      totalCreditedLeaveCount: calculationResults.reduce(
        (sum, result) => sum + result.creditedLeaveCount,
        0
      ),
    };

    console.table({
      summary,
    });

    return NextResponse.json({
      success: true,
      message:
        "Attendance calculation completed successfully (no database updates were performed)",
      summary,
      employeeResults: calculationResults,
    });
  } catch (error) {
    console.error(
      "Error in Calculating Attendance Report:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        error: "Failed to process attendance report calculation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
