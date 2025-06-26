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
//   officeTimingIn: string | null;
//   OfficeTimingOut: string | null;
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

// // function parseDate(date: Date | string | null): Date | null {
// //   if (date instanceof Date) return date;
// //   if (typeof date === "string") {
// //     const parsedDate = new Date(date);
// //     return isNaN(parsedDate.getTime()) ? null : parsedDate;
// //   }
// //   return null;
// // }

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

// // function parseTimeToMinutes(timeString: string | null): number {
// //   if (!timeString) return 9 * 60; // Default to 9:00 AM if not specified

// //   const [hours, minutes] = timeString.split(":").map(Number);
// //   return hours * 60 + minutes;
// // }

// // function parseTimeToMinutes(timeString: string | null): number {
// //   if (!timeString) return 9 * 60; // Default to 9:00 AM if not specified

// //   try {
// //     const [hours, minutes] = timeString.split(":").map(Number);
// //     if (isNaN(hours)) return 9 * 60;
// //     if (isNaN(minutes)) return hours * 60;
// //     return hours * 60 + minutes;
// //   } catch {
// //     return 9 * 60;
// //   }
// // }

// function parseTimeToMinutes(timeString: string): number {
//   if (!timeString) return 9 * 60; // Default to 9:00 AM if not specified

//   // Handle both "9:00" and "9:00 AM" formats
//   const [timePart, period] = timeString.split(' ');
//   const [hoursStr, minutesStr] = timePart.split(':');

//   let hours = parseInt(hoursStr, 10);
//   const minutes = parseInt(minutesStr || '0', 10);

//   // Handle 12-hour format if period is specified
//   if (period) {
//     if (period.toLowerCase() === 'pm' && hours < 12) {
//       hours += 12;
//     } else if (period.toLowerCase() === 'am' && hours === 12) {
//       hours = 0;
//     }
//   }

//   return hours * 60 + minutes;
// }

// // function isLate(checkInTime: Date, expectedTimeString: string | null): boolean {
// //   if (!checkInTime) return false;

// //   const expectedMinutes = parseTimeToMinutes(expectedTimeString);
// //   const checkInHours = checkInTime.getHours();
// //   const checkInMinutes = checkInTime.getMinutes();
// //   const checkInTotalMinutes = checkInHours * 60 + checkInMinutes;

// //   console.log(
// //     `Check-in time: ${checkInTime.toLocaleTimeString()}, Expected time: ${expectedTimeString}, Check-in total minutes: ${checkInTotalMinutes}, Expected total minutes: ${expectedMinutes}`
// //   );

// //   return checkInTotalMinutes > expectedMinutes;
// // }

// function isLate(checkInTime: Date | null, expectedTimeString: string | null): boolean {
//   if (!checkInTime) return false;

//   // Convert checkInTime to local time string for comparison
//   const localCheckInTime = new Date(checkInTime.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));

//   // Get expected time (default to 9:00 AM if not specified)
//   const expectedMinutes = parseTimeToMinutes(expectedTimeString || "9:00");

//   const checkInHours = localCheckInTime.getHours();
//   const checkInMinutes = localCheckInTime.getMinutes();
//   const checkInTotalMinutes = checkInHours * 60 + checkInMinutes;

//   console.log(
//     `Check-in time: ${localCheckInTime.toLocaleTimeString()}, ` +
//     `Expected time: ${expectedTimeString || "9:00"}, ` +
//     `Check-in total minutes: ${checkInTotalMinutes}, ` +
//     `Expected total minutes: ${expectedMinutes}`
//   );

//   return checkInTotalMinutes > expectedMinutes;
// }

// function isEarlyExit(
//   checkOutTime: Date,
//   expectedTimeString: string | null
// ): boolean {
//   if (!checkOutTime) return false;

//   const expectedMinutes = parseTimeToMinutes(expectedTimeString);
//   const checkOutHours = checkOutTime.getHours();
//   const checkOutMinutes = checkOutTime.getMinutes();
//   const checkOutTotalMinutes = checkOutHours * 60 + checkOutMinutes;

//   return checkOutTotalMinutes < expectedMinutes;
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

//     // Find or create "Unauthorized Absent" leave type
//     let unauthorizedAbsentLeaveType = await db.leaveType.findFirst({
//       where: { name: "Unauthorized Absent" },
//     });

//     if (!unauthorizedAbsentLeaveType) {
//       unauthorizedAbsentLeaveType = await db.leaveType.create({
//         data: { name: "Unauthorized Absent" },
//       });
//       console.log("Created 'Unauthorized Absent' leave type");
//     }

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
//         officeTimingIn: true,
//         OfficeTimingOut: true,
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

//     // Get previous late counts for the current month
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

//     const attendanceMap = new Map<string, Map<string, AttendanceRecord>>();
//     attendanceRecords.forEach((record) => {
//       const userId = record.userId;
//       const dateKey = formatDate(record.date);

//       if (!attendanceMap.has(userId)) {
//         attendanceMap.set(userId, new Map<string, AttendanceRecord>());
//       }
//       attendanceMap.get(userId)?.set(dateKey, record as AttendanceRecord);
//     });

//     const timetableMap = new Map<string, Map<string, ShiftType>>();
//     timetables.forEach((entry) => {
//       const userId = entry.userId;
//       // Use the same date formatting as in generateDateRange
//       const dateKey = entry.date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

//       if (!timetableMap.has(userId)) {
//         timetableMap.set(userId, new Map<string, ShiftType>());
//       }
//       timetableMap.get(userId)?.set(dateKey, entry.shiftType);
//     });

//     timetableMap.forEach((userMap, userId) => {
//       const employee = employeeMap.get(userId);
//       console.log(`Timetable for ${employee?.fullName}:`);
//       userMap.forEach((shiftType, date) => {
//         console.log(`  ${date}: ${shiftType}`);
//       });
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
//           holidayMap.get(emp.userId)?.add(dateKey);
//         });
//       } else {
//         // Holiday for specific employees
//         holiday.employees.forEach((emp) => {
//           if (!holidayMap.has(emp.userId)) {
//             holidayMap.set(emp.userId, new Set<string>());
//           }
//           holidayMap.get(emp.userId)?.add(dateKey);
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
//     const dbUpdates: Promise<unknown>[] = [];

//     // Get work statuses for attendance records
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
//       return NextResponse.json(
//         { error: "Required work status types not found in the database" },
//         { status: 500 }
//       );
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

//         // Skip weekends (Saturday and Sunday) unless specifically scheduled
//         if (
//           (dayOfWeek === 0 || dayOfWeek === 6) &&
//           !employeeTimetableMap.has(dateStr)
//         ) {
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
//         const shiftType = employeeTimetableMap.get(dateStr);
//         console.log(
//           `Employee ${employee.fullName} is scheduled for ${shiftType} on ${dateStr}`
//         );
//         if (shiftType === ShiftType.Off) {
//           console.log(
//             `Employee ${employee.fullName} is off on ${dateStr}, skipping attendance check.`
//           );
//           continue;
//         }

//         // Check attendance record
//         const attendanceRecord = employeeAttendanceMap.get(dateStr);

//         if (!attendanceRecord) {
//           // No attendance record found - unauthorized absence
//           unauthorizedAbsences.push(dateStr);

//           // Create a new attendance record marked as absent
//           // dbUpdates.push(
//           //   db.attendence.create({
//           //     data: {
//           //       user: {
//           //         connect: {
//           //           userId: employee.userId,
//           //         },
//           //       },
//           //       date: currentDate,
//           //       workStatus: {
//           //         connect: {
//           //           id: absentWorkStatus.id,
//           //         },
//           //       },
//           //       workingHours: "0 hours 0 minutes",
//           //     },
//           //   })
//           // );

//           // Create a leave record for unauthorized absence
//           // dbUpdates.push(
//           //   db.leaveRequest.create({
//           //     data: {
//           //       userId: employee.userId,
//           //       leaveTypeId: unauthorizedAbsentLeaveType.id,
//           //       startDate: currentDate,
//           //       endDate: currentDate,
//           //       reason: "Automatically applied due to unauthorized absence",
//           //       status: "Approved",
//           //       managerApproval: true,
//           //       adminApproval: true,
//           //       ceoApproval: true,
//           //       approvedBy: "System",
//           //     },
//           //   })
//           // );
//         } else {
//           // Check for late arrival
//           if (attendanceRecord.checkLog?.checkInTime) {
//             // const isLateArrival = isLate(
//             //   attendanceRecord.checkLog.checkInTime,
//             //   employee.officeTimingIn
//             // );
//             const isLateArrival = isLate(
//               attendanceRecord.checkLog?.checkInTime,
//               employee.officeTimingIn || "9:00" // Default to 9:00 AM if not specified
//             );
//             console.log(
//               `Check-in time: ${attendanceRecord.checkLog.checkInTime}, Expected time: ${employee.officeTimingIn}`
//             );

//             console.log(
//               `=========Employee ${employee.fullName} is late on ${dateStr}===========`
//             );

//             if (isLateArrival) {
//               lateArrivals.push(dateStr);

//               // Update attendance record to mark as late
//               // dbUpdates.push(
//               //   db.attendence.update({
//               //     where: { id: attendanceRecord.id },
//               //     data: {
//               //       workStatus: {
//               //         connect: {
//               //           id: lateWorkStatus.id,
//               //         },
//               //       },
//               //     },
//               //   })
//               // );
//             }
//           }

//           // Check for early exit
//           if (attendanceRecord.checkLog?.checkOutTime) {
//             const isEarlyExitVal = isEarlyExit(
//               attendanceRecord.checkLog.checkOutTime,
//               employee.OfficeTimingOut
//             );

//             if (isEarlyExitVal) {
//               earlyExits.push(dateStr);

//               // If already marked as late, update to "Late and Early Exit"
//               if (lateArrivals.includes(dateStr)) {
//                 // dbUpdates.push(
//                 //   db.attendence.update({
//                 //     where: { id: attendanceRecord.id },
//                 //     data: {
//                 //       workStatus: {
//                 //         connect: { id: lateAndEarlyWorkStatus.id },
//                 //       },
//                 //     },
//                 //   })
//                 // );
//               } else {
//                 // Otherwise just mark as early exit
//                 // dbUpdates.push(
//                 //   db.attendence.update({
//                 //     where: { id: attendanceRecord.id },
//                 //     data: {
//                 //       workStatus: { connect: { id: earlyWorkStatus.id } },
//                 //     },
//                 //   })
//                 // );
//               }
//             }
//           }
//         }
//       }

//       // Calculate leave deductions
//       const previousLateCount = previousLateCountsMap.get(employee.userId) || 0;
//       const newLateCount = previousLateCount + lateArrivals.length;
//       const leavesToDeduct =
//         Math.floor(newLateCount / 3) - Math.floor(previousLateCount / 3);

//       // Update late count in database
//       if (lateArrivals.length > 0) {
//         // dbUpdates.push(
//         //   db.lateCount.upsert({
//         //     where: {
//         //       userId_month_year: {
//         //         userId: employee.userId,
//         //         month: currentMonth,
//         //         year: currentYear,
//         //       },
//         //     },
//         //     update: {
//         //       count: newLateCount,
//         //     },
//         //     create: {
//         //       userId: employee.userId,
//         //       month: currentMonth,
//         //       year: currentYear,
//         //       count: newLateCount,
//         //     },
//         //   })
//         // );
//       }

//       // Deduct leaves if necessary
//       if (leavesToDeduct > 0 && employee.totalLeavesBalance !== null) {
//         const newLeaveBalance = Math.max(
//           0,
//           (Number.parseInt(employee.totalLeavesBalance || "0", 10) || 0) -
//             leavesToDeduct
//         );

//         // dbUpdates.push(
//         //   db.userProfile.update({
//         //     where: { userId: employee.userId },
//         //     data: { totalLeavesBalance: newLeaveBalance.toString() },
//         //   })
//         // );

//         // Create a leave record for leave deduction due to lateness
//         if (leavesToDeduct > 0) {
//           // dbUpdates.push(
//           //   db.leaveRequest.create({
//           //     data: {
//           //       userId: employee.userId,
//           //       leaveTypeId: unauthorizedAbsentLeaveType.id,
//           //       startDate: new Date(),
//           //       endDate: new Date(),
//           //       reason: `Automatically deducted ${leavesToDeduct} leave(s) due to ${newLateCount} late arrivals`,
//           //       status: "Approved",
//           //       managerApproval: true,
//           //       adminApproval: true,
//           //       ceoApproval: true,
//           //       approvedBy: "System",
//           //     },
//           //   })
//           // );
//         }
//       }

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
//         newLateCount,
//       });
//     }

//     // Execute all database updates
//     await Promise.all(dbUpdates);

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
//       message: "Attendance calculation completed successfully",
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

// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================

// import { db } from "@/lib/db"
// import { type NextRequest, NextResponse } from "next/server"
// import { ShiftType } from "@prisma/client"

// type AttendanceCalculationResult = {
//   userId: string
//   fullName: string
//   totalDaysChecked: number
//   totalWorkingDays: number
//   presentDays: number
//   unauthorizedAbsences: string[]
//   lateArrivals: string[]
//   earlyExits: string[]
//   leavesDeducted: number
//   previousLateCount: number
//   newLateCount: number
//   attendancePercentage: number
// }

// // Helper function to parse time string to minutes (handles 24-hour format)
// function parseTimeToMinutes(timeString: string | null): number {
//   if (!timeString) return 9 * 60 // Default to 9:00 AM

//   try {
//     // Handle formats like "9:00", "09:00"
//     const cleanTime = timeString.trim()
//     const [hoursStr, minutesStr] = cleanTime.split(":")
//     const hours = Number.parseInt(hoursStr, 10)
//     const minutes = Number.parseInt(minutesStr || "0", 10)

//     return hours * 60 + minutes
//   } catch (error) {
//     console.error("Error parsing time:", timeString, error)
//     return 9 * 60 // Default fallback
//   }
// }

// // Helper function to extract time from datetime and convert to minutes
// function extractTimeFromDateTime(dateTime: Date): number {
//   // Create a new date in local timezone to avoid UTC issues
//   const localDate = new Date(dateTime.getTime() + dateTime.getTimezoneOffset() * 60000)
//   const hours = localDate.getHours()
//   const minutes = localDate.getMinutes()

//   console.log(
//     `    Raw DateTime: ${dateTime.toISOString()}, Local: ${localDate.toLocaleTimeString()}, Hours: ${hours}, Minutes: ${minutes}`,
//   )

//   return hours * 60 + minutes
// }

// // Helper function to check if employee is late
// function isEmployeeLate(checkInTime: Date, expectedTimeString: string | null): boolean {
//   if (!checkInTime) return false

//   const expectedMinutes = parseTimeToMinutes(expectedTimeString || "9:00")
//   const actualMinutes = extractTimeFromDateTime(checkInTime)

//   // Allow 5 minutes grace period
//   const graceMinutes = 15

//   const isLate = actualMinutes > expectedMinutes + graceMinutes

//   console.log(
//     `    Time check: Expected ${expectedTimeString || "9:00"} (${expectedMinutes}min), Actual ${checkInTime.getHours()}:${checkInTime.getMinutes().toString().padStart(2, "0")} (${actualMinutes}min), Grace: ${graceMinutes}min, Late: ${isLate}`,
//   )

//   return isLate
// }

// // Helper function to check if employee left early
// function isEmployeeEarly(checkOutTime: Date, expectedTimeString: string | null): boolean {
//   if (!checkOutTime) return false

//   const expectedMinutes = parseTimeToMinutes(expectedTimeString || "17:00")
//   const actualMinutes = extractTimeFromDateTime(checkOutTime)

//   // Allow 10 minutes grace period for early exit
//   const graceMinutes = 10

//   return actualMinutes < expectedMinutes - graceMinutes
// }

// // Helper function to format date as YYYY-MM-DD
// function formatDate(date: Date): string {
//   return date.toISOString().split("T")[0]
// }

// // Helper function to check if date is in range
// function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
//   const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
//   const startOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
//   const endOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

//   return dateOnly >= startOnly && dateOnly <= endOnly
// }

// // Generate array of dates between start and end
// function generateDateRange(startDate: Date, endDate: Date): Date[] {
//   const dates: Date[] = []
//   const currentDate = new Date(startDate)

//   while (currentDate <= endDate) {
//     dates.push(new Date(currentDate))
//     currentDate.setDate(currentDate.getDate() + 1)
//   }

//   return dates
// }

// // Helper function to get the earliest check-in and latest check-out for a day
// function getDayAttendanceSummary(records: any[]) {
//   if (records.length === 0) return null

//   let earliestCheckIn: Date | null = null
//   let latestCheckOut: Date | null = null

//   console.log(`    Processing ${records.length} attendance records:`)

//   for (const record of records) {
//     console.log(`      Record ID: ${record.id}, CheckLog: ${record.checkLog ? "exists" : "missing"}`)

//     if (record.checkLog?.checkInTime) {
//       const checkInTime = new Date(record.checkLog.checkInTime)
//       console.log(`        Check-in: ${checkInTime.toISOString()} -> ${checkInTime.toLocaleTimeString()}`)

//       if (!earliestCheckIn || checkInTime < earliestCheckIn) {
//         earliestCheckIn = checkInTime
//       }
//     }

//     if (record.checkLog?.checkOutTime) {
//       const checkOutTime = new Date(record.checkLog.checkOutTime)
//       console.log(`        Check-out: ${checkOutTime.toISOString()} -> ${checkOutTime.toLocaleTimeString()}`)

//       if (!latestCheckOut || checkOutTime > latestCheckOut) {
//         latestCheckOut = checkOutTime
//       }
//     }
//   }

//   console.log(
//     `    Final times - Check-in: ${earliestCheckIn?.toLocaleTimeString() || "none"}, Check-out: ${latestCheckOut?.toLocaleTimeString() || "none"}`,
//   )

//   return {
//     checkInTime: earliestCheckIn,
//     checkOutTime: latestCheckOut,
//     recordCount: records.length,
//   }
// }

// export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
//   try {
//     const { userId } = params
//     const { dateFrom, dateTo, employeeIds } = await req.json()

//     if (!dateFrom || !dateTo || !employeeIds || employeeIds.length === 0) {
//       return NextResponse.json(
//         { error: "Missing required parameters: dateFrom, dateTo, or employeeIds" },
//         { status: 400 },
//       )
//     }

//     const reportStartDate = new Date(dateFrom)
//     const reportEndDate = new Date(dateTo)

//     console.log(`\n🔍 Calculating attendance from ${formatDate(reportStartDate)} to ${formatDate(reportEndDate)}`)

//     // Check if user has permission
//     const requestingUser = await db.userProfile.findUnique({
//       where: { userId },
//       include: { role: true },
//     })

//     if (!requestingUser || !["Admin", "CEO"].includes(requestingUser.role?.name || "")) {
//       return NextResponse.json({ error: "You don't have permission to calculate attendance" }, { status: 403 })
//     }

//     // Get employees data
//     const employees = await db.userProfile.findMany({
//       where: {
//         userId: { in: employeeIds },
//         isHired: true,
//         status: { name: "Active" },
//         DOJ: { lte: reportEndDate },
//       },
//       select: {
//         userId: true,
//         fullName: true,
//         totalLeavesBalance: true,
//         DOJ: true,
//         officeTimingIn: true,
//         OfficeTimingOut: true,
//         leaveRequests: {
//           where: {
//             status: "Approved",
//             startDate: { lte: reportEndDate },
//             endDate: { gte: reportStartDate },
//           },
//           select: {
//             startDate: true,
//             endDate: true,
//           },
//         },
//       },
//     })

//     console.log(`👥 Found ${employees.length} employees for calculation`)

//     // Get attendance records
//     const attendanceRecords = await db.attendence.findMany({
//       where: {
//         date: { gte: reportStartDate, lte: reportEndDate },
//         userId: { in: employeeIds },
//       },
//       include: {
//         checkLog: true,
//         workStatus: true,
//       },
//       orderBy: [{ userId: "asc" }, { date: "asc" }, { createdAt: "asc" }],
//     })

//     console.log(`📋 Found ${attendanceRecords.length} attendance records`)

//     // Get public holidays
//     const publicHolidays = await db.publicHoliday.findMany({
//       where: {
//         date: { gte: reportStartDate, lte: reportEndDate },
//       },
//       include: {
//         employees: { select: { userId: true } },
//       },
//     })

//     // Get timetables
//     const timetables = await db.timeTable.findMany({
//       where: {
//         date: { gte: reportStartDate, lte: reportEndDate },
//         userId: { in: employeeIds },
//       },
//     })

//     // Get current late counts
//     const currentMonth = new Date().getMonth()
//     const currentYear = new Date().getFullYear()
//     const lateCountRecords = await db.lateCount.findMany({
//       where: {
//         userId: { in: employeeIds },
//         month: currentMonth,
//         year: currentYear,
//       },
//     })

//     // Create lookup maps - Group attendance records by user and date
//     const attendanceMap = new Map<string, Map<string, any[]>>()
//     attendanceRecords.forEach((record) => {
//       const userId = record.userId
//       const dateKey = formatDate(record.date)

//       if (!attendanceMap.has(userId)) {
//         attendanceMap.set(userId, new Map())
//       }
//       if (!attendanceMap.get(userId)!.has(dateKey)) {
//         attendanceMap.get(userId)!.set(dateKey, [])
//       }
//       attendanceMap.get(userId)!.get(dateKey)!.push(record)
//     })

//     const timetableMap = new Map<string, Map<string, ShiftType>>()
//     timetables.forEach((entry) => {
//       const userId = entry.userId
//       const dateKey = formatDate(entry.date)

//       if (!timetableMap.has(userId)) {
//         timetableMap.set(userId, new Map())
//       }
//       timetableMap.get(userId)!.set(dateKey, entry.shiftType)
//     })

//     const holidayMap = new Map<string, Set<string>>()
//     publicHolidays.forEach((holiday) => {
//       const dateKey = formatDate(holiday.date)

//       if (holiday.isForAll) {
//         // Global holiday
//         employees.forEach((emp) => {
//           if (!holidayMap.has(emp.userId)) {
//             holidayMap.set(emp.userId, new Set())
//           }
//           holidayMap.get(emp.userId)!.add(dateKey)
//         })
//       } else {
//         // Specific employee holidays
//         holiday.employees.forEach((emp) => {
//           if (!holidayMap.has(emp.userId)) {
//             holidayMap.set(emp.userId, new Set())
//           }
//           holidayMap.get(emp.userId)!.add(dateKey)
//         })
//       }
//     })

//     const lateCountMap = new Map<string, number>()
//     lateCountRecords.forEach((record) => {
//       lateCountMap.set(record.userId, record.count)
//     })

//     // Calculate attendance for each employee
//     const calculationResults: AttendanceCalculationResult[] = []

//     for (const employee of employees) {
//       console.log(`\n👤 === Processing ${employee.fullName} ===`)
//       console.log(`   Office timing: ${employee.officeTimingIn || "9:00"} - ${employee.OfficeTimingOut || "17:00"}`)

//       const employeeDOJ = employee.DOJ ? new Date(employee.DOJ) : null
//       const employeeStartDate = employeeDOJ && employeeDOJ > reportStartDate ? employeeDOJ : reportStartDate

//       const dateRange = generateDateRange(employeeStartDate, reportEndDate)
//       const employeeAttendanceMap = attendanceMap.get(employee.userId) || new Map()
//       const employeeTimetableMap = timetableMap.get(employee.userId) || new Map()
//       const employeeHolidaySet = holidayMap.get(employee.userId) || new Set()

//       let totalWorkingDays = 0
//       let presentDays = 0
//       const unauthorizedAbsences: string[] = []
//       const lateArrivals: string[] = []
//       const earlyExits: string[] = []

//       for (const currentDate of dateRange) {
//         const dateKey = formatDate(currentDate)
//         const dayOfWeek = currentDate.getDay() // 0 = Sunday, 6 = Saturday

//         console.log(`\n📅 Checking ${dateKey} (${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek]})`)

//         // Check if it's a scheduled work day
//         const shiftType = employeeTimetableMap.get(dateKey)
//         const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

//         // Skip if it's weekend and no specific schedule
//         if (isWeekend && !shiftType) {
//           console.log(`  ⏭️  Skipping weekend`)
//           continue
//         }

//         // Skip if specifically marked as off
//         if (shiftType === ShiftType.Off) {
//           console.log(`  🏠 Scheduled off`)
//           continue
//         }

//         // Skip if it's a holiday
//         if (employeeHolidaySet.has(dateKey)) {
//           console.log(`  🎉 Public holiday`)
//           continue
//         }

//         // Check if on approved leave
//         const isOnLeave = employee.leaveRequests.some((leave) =>
//           isDateInRange(currentDate, new Date(leave.startDate), new Date(leave.endDate)),
//         )

//         if (isOnLeave) {
//           console.log(`  🏖️  On approved leave`)
//           continue
//         }

//         // This is a working day
//         totalWorkingDays++
//         console.log(`  💼 Working day #${totalWorkingDays}`)

//         // Check attendance - get all records for this date
//         const dayAttendanceRecords = employeeAttendanceMap.get(dateKey) || []

//         console.log(`  📋 Found ${dayAttendanceRecords.length} attendance records for ${dateKey}`)

//         if (dayAttendanceRecords.length === 0) {
//           console.log(`  ❌ ABSENT - No attendance records found for ${dateKey}`)
//           unauthorizedAbsences.push(dateKey)
//           continue
//         }

//         // Get the summary of the day (earliest check-in, latest check-out)
//         const daySummary = getDayAttendanceSummary(dayAttendanceRecords)

//         if (!daySummary) {
//           console.log(`  ❌ ABSENT - Could not process attendance records for ${dateKey}`)
//           unauthorizedAbsences.push(dateKey)
//           continue
//         }

//         if (!daySummary.checkInTime) {
//           console.log(`  ❌ ABSENT - No valid check-in found for ${dateKey}`)
//           unauthorizedAbsences.push(dateKey)
//           continue
//         }

//         // Employee was present
//         presentDays++
//         console.log(`  ✅ PRESENT (${dayAttendanceRecords.length} records) for ${dateKey}`)

//         // Check for late arrival using the earliest check-in
//         const isLate = isEmployeeLate(daySummary.checkInTime, employee.officeTimingIn)
//         if (isLate) {
//           console.log(`  🐌 LATE ARRIVAL`)
//           lateArrivals.push(dateKey)
//         } else {
//           console.log(`  ⏰ ON TIME`)
//         }

//         // Check for early exit using the latest check-out
//         if (daySummary.checkOutTime) {
//           const isEarly = isEmployeeEarly(daySummary.checkOutTime, employee.OfficeTimingOut)
//           if (isEarly) {
//             console.log(`  🏃 EARLY EXIT`)
//             earlyExits.push(dateKey)
//           }
//         }
//       }

//       // Calculate leave deductions based on late arrivals
//       const previousLateCount = lateCountMap.get(employee.userId) || 0
//       const newLateCount = previousLateCount + lateArrivals.length
//       const leavesToDeduct = Math.floor(newLateCount / 3) - Math.floor(previousLateCount / 3)

//       // Calculate attendance percentage
//       const attendancePercentage = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 100

//       console.log(`\n📊 Results for ${employee.fullName}:`)
//       console.log(`   📈 Total working days: ${totalWorkingDays}`)
//       console.log(`   ✅ Present days: ${presentDays}`)
//       console.log(`   📊 Attendance: ${attendancePercentage}%`)
//       console.log(
//         `   ❌ Unauthorized absences: ${unauthorizedAbsences.length} ${unauthorizedAbsences.length > 0 ? `(${unauthorizedAbsences.join(", ")})` : ""}`,
//       )
//       console.log(
//         `   🐌 Late arrivals: ${lateArrivals.length} ${lateArrivals.length > 0 ? `(${lateArrivals.slice(0, 5).join(", ")}${lateArrivals.length > 5 ? "..." : ""})` : ""}`,
//       )
//       console.log(`   🏃 Early exits: ${earlyExits.length}`)
//       console.log(`   📉 Leaves to deduct: ${leavesToDeduct}`)

//       calculationResults.push({
//         userId: employee.userId,
//         fullName: employee.fullName,
//         totalDaysChecked: dateRange.length,
//         totalWorkingDays,
//         presentDays,
//         unauthorizedAbsences,
//         lateArrivals,
//         earlyExits,
//         leavesDeducted: leavesToDeduct,
//         previousLateCount,
//         newLateCount,
//         attendancePercentage,
//       })
//     }

//     // Generate summary
//     const summary = {
//       totalEmployees: employees.length,
//       totalDaysInRange: Math.ceil((reportEndDate.getTime() - reportStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
//       totalWorkingDays: calculationResults.reduce((sum, result) => sum + result.totalWorkingDays, 0),
//       totalPresentDays: calculationResults.reduce((sum, result) => sum + result.presentDays, 0),
//       totalUnauthorizedAbsences: calculationResults.reduce(
//         (sum, result) => sum + result.unauthorizedAbsences.length,
//         0,
//       ),
//       totalLateArrivals: calculationResults.reduce((sum, result) => sum + result.lateArrivals.length, 0),
//       totalEarlyExits: calculationResults.reduce((sum, result) => sum + result.earlyExits.length, 0),
//       totalLeavesDeducted: calculationResults.reduce((sum, result) => sum + result.leavesDeducted, 0),
//       averageAttendancePercentage:
//         calculationResults.length > 0
//           ? Math.round(
//               calculationResults.reduce((sum, result) => sum + result.attendancePercentage, 0) /
//                 calculationResults.length,
//             )
//           : 0,
//     }

//     console.log("\n🎯 === FINAL SUMMARY ===")
//     console.table(summary)

//     return NextResponse.json({
//       success: true,
//       message: "Attendance calculation completed successfully",
//       summary,
//       employeeResults: calculationResults,
//       dateRange: {
//         from: formatDate(reportStartDate),
//         to: formatDate(reportEndDate),
//       },
//     })
//   } catch (error) {
//     console.error("❌ Error in attendance calculation:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to calculate attendance",
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

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
//   officeTimingIn: string | null;
//   OfficeTimingOut: string | null;
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
// function parseTimeToMinutes(timeString: string | null): number {
//   if (!timeString) return 9 * 60; // Default to 9:00 AM if not specified

//   // Handle both "9:00" and "9:00 AM" formats
//   const [timePart, period] = timeString.split(" ");
//   const [hoursStr, minutesStr] = timePart.split(":");

//   let hours = parseInt(hoursStr, 10);
//   const minutes = parseInt(minutesStr || "0", 10);

//   // Handle 12-hour format if period is specified
//   if (period) {
//     if (period.toLowerCase() === "pm" && hours < 12) {
//       hours += 12;
//     } else if (period.toLowerCase() === "am" && hours === 12) {
//       hours = 0;
//     }
//   }

//   return hours * 60 + minutes;
// }

// // Improved function to extract time from datetime and convert to minutes
// function extractTimeFromDateTime(dateTime: Date): number {
//   // Create a new date in local timezone to avoid UTC issues
//   const localDate = new Date(
//     dateTime.getTime() + dateTime.getTimezoneOffset() * 60000
//   );
//   const hours = localDate.getHours();
//   const minutes = localDate.getMinutes();

//   console.log(
//     `    Raw DateTime: ${dateTime.toISOString()}, Local: ${localDate.toLocaleTimeString()}, Hours: ${hours}, Minutes: ${minutes}`
//   );

//   return hours * 60 + minutes;
// }

// // Improved function to check if employee is late with grace period
// function isLate(
//   checkInTime: Date | null,
//   expectedTimeString: string | null
// ): boolean {
//   if (!checkInTime) return false;

//   const expectedMinutes = parseTimeToMinutes(expectedTimeString || "9:00");
//   const actualMinutes = extractTimeFromDateTime(checkInTime);

//   // Allow 15 minutes grace period
//   const graceMinutes = 15;

//   const isLate = actualMinutes > expectedMinutes + graceMinutes;

//   console.log(
//     `    Time check: Expected ${
//       expectedTimeString || "9:00"
//     } (${expectedMinutes}min), ` +
//       `Actual ${checkInTime.getHours()}:${checkInTime
//         .getMinutes()
//         .toString()
//         .padStart(2, "0")} ` +
//       `(${actualMinutes}min), Grace: ${graceMinutes}min, Late: ${isLate}`
//   );

//   return isLate;
// }

// // Improved function to check if employee left early with grace period
// function isEarlyExit(
//   checkOutTime: Date | null,
//   expectedTimeString: string | null
// ): boolean {
//   if (!checkOutTime) return false;

//   const expectedMinutes = parseTimeToMinutes(expectedTimeString || "17:00");
//   const actualMinutes = extractTimeFromDateTime(checkOutTime);

//   // Allow 10 minutes grace period for early exit
//   const graceMinutes = 10;

//   const isEarly = actualMinutes < expectedMinutes - graceMinutes;

//   console.log(
//     `    Time check: Expected ${
//       expectedTimeString || "17:00"
//     } (${expectedMinutes}min), ` +
//       `Actual ${checkOutTime.getHours()}:${checkOutTime
//         .getMinutes()
//         .toString()
//         .padStart(2, "0")} ` +
//       `(${actualMinutes}min), Grace: ${graceMinutes}min, Early: ${isEarly}`
//   );

//   return isEarly;
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
//       console.log(
//         `        Check-in: ${checkInTime.toISOString()} -> ${checkInTime.toLocaleTimeString()}`
//       );

//       if (!earliestCheckIn || checkInTime < earliestCheckIn) {
//         earliestCheckIn = checkInTime;
//       }
//     }

//     if (record.checkLog?.checkOutTime) {
//       const checkOutTime = new Date(record.checkLog.checkOutTime);
//       console.log(
//         `        Check-out: ${checkOutTime.toISOString()} -> ${checkOutTime.toLocaleTimeString()}`
//       );

//       if (!latestCheckOut || checkOutTime > latestCheckOut) {
//         latestCheckOut = checkOutTime;
//       }
//     }
//   }

//   console.log(
//     `    Final times - Check-in: ${
//       earliestCheckIn?.toLocaleTimeString() || "none"
//     }, Check-out: ${latestCheckOut?.toLocaleTimeString() || "none"}`
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

//     // Find or create "Unauthorized Absent" leave type
//     let unauthorizedAbsentLeaveType = await db.leaveType.findFirst({
//       where: { name: "Unauthorized Absent" },
//     });

//     if (!unauthorizedAbsentLeaveType) {
//       unauthorizedAbsentLeaveType = await db.leaveType.create({
//         data: { name: "Unauthorized Absent" },
//       });
//       console.log("Created 'Unauthorized Absent' leave type");
//     }

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
//         officeTimingIn: true,
//         OfficeTimingOut: true,
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

//     // Get previous late counts for the current month
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

//     const timetableMap = new Map<string, Map<string, ShiftType>>();
//     timetables.forEach((entry) => {
//       const userId = entry.userId;
//       const dateKey = formatDate(entry.date);

//       if (!timetableMap.has(userId)) {
//         timetableMap.set(userId, new Map<string, ShiftType>());
//       }
//       timetableMap.get(userId)!.set(dateKey, entry.shiftType);
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
//     const dbUpdates: Promise<unknown>[] = [];

//     // Get work statuses for attendance records
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
//       return NextResponse.json(
//         { error: "Required work status types not found in the database" },
//         { status: 500 }
//       );
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

//         // Skip weekends (Saturday and Sunday) unless specifically scheduled
//         if (
//           (dayOfWeek === 0 || dayOfWeek === 6) &&
//           !employeeTimetableMap.has(dateStr)
//         ) {
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
//         const shiftType = employeeTimetableMap.get(dateStr);
//         console.log(
//           `Employee ${employee.fullName} is scheduled for ${shiftType} on ${dateStr}`
//         );
//         if (shiftType === ShiftType.Off) {
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
//           employee.officeTimingIn
//         );

//         if (isLateArrival) {
//           lateArrivals.push(dateStr);
//         }

//         // Check for early exit using the latest check-out
//         if (daySummary.checkOutTime) {
//           const isEarlyExitVal = isEarlyExit(
//             daySummary.checkOutTime,
//             employee.OfficeTimingOut
//           );

//           if (isEarlyExitVal) {
//             earlyExits.push(dateStr);
//           }
//         }
//       }

//       // Calculate leave deductions based on late arrivals
//       const previousLateCount = previousLateCountsMap.get(employee.userId) || 0;
//       const newLateCount = previousLateCount + lateArrivals.length;
//       const leavesToDeduct =
//         Math.floor(newLateCount / 3) - Math.floor(previousLateCount / 3);

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
//         newLateCount,
//       });
//     }

//     // Execute all database updates
//     await Promise.all(dbUpdates);

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
//       message: "Attendance calculation completed successfully",
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
function parseTimeToMinutes(timeString: string | null): number {
  if (!timeString) return 9 * 60; // Default to 9:00 AM if not specified

  // Handle both "9:00" and "9:00 AM" formats
  const [timePart, period] = timeString.split(" ");
  const [hoursStr, minutesStr] = timePart.split(":");

  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr || "0", 10);

  // Handle 12-hour format if period is specified
  if (period) {
    if (period.toLowerCase() === "pm" && hours < 12) {
      hours += 12;
    } else if (period.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }
  }

  return hours * 60 + minutes;
}

// Improved function to extract time from datetime and convert to minutes
function extractTimeFromDateTime(dateTime: Date): number {
  // Create a new date in local timezone to avoid UTC issues
  const localDate = new Date(
    dateTime.getTime() + dateTime.getTimezoneOffset() * 60000
  );
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();

  console.log(
    `    Raw DateTime: ${dateTime.toISOString()}, Local: ${localDate.toLocaleTimeString()}, Hours: ${hours}, Minutes: ${minutes}`
  );

  return hours * 60 + minutes;
}

// Improved function to check if employee is late with grace period
function isLate(
  checkInTime: Date | null,
  expectedTimeString: string | null
): boolean {
  if (!checkInTime) return false;

  const expectedMinutes = parseTimeToMinutes(expectedTimeString || "9:00");
  const actualMinutes = extractTimeFromDateTime(checkInTime);

  // Allow 15 minutes grace period
  const graceMinutes = 15;

  const isLate = actualMinutes > expectedMinutes + graceMinutes;

  console.log(
    `    Time check: Expected ${
      expectedTimeString || "9:00"
    } (${expectedMinutes}min), ` +
      `Actual ${checkInTime.getHours()}:${checkInTime
        .getMinutes()
        .toString()
        .padStart(2, "0")} ` +
      `(${actualMinutes}min), Grace: ${graceMinutes}min, Late: ${isLate}`
  );

  return isLate;
}

// Improved function to check if employee left early with grace period
function isEarlyExit(
  checkOutTime: Date | null,
  expectedTimeString: string | null
): boolean {
  if (!checkOutTime) return false;

  const expectedMinutes = parseTimeToMinutes(expectedTimeString || "17:00");
  const actualMinutes = extractTimeFromDateTime(checkOutTime);

  // Allow 10 minutes grace period for early exit
  const graceMinutes = 10;

  const isEarly = actualMinutes < expectedMinutes - graceMinutes;

  console.log(
    `    Time check: Expected ${
      expectedTimeString || "17:00"
    } (${expectedMinutes}min), ` +
      `Actual ${checkOutTime.getHours()}:${checkOutTime
        .getMinutes()
        .toString()
        .padStart(2, "0")} ` +
      `(${actualMinutes}min), Grace: ${graceMinutes}min, Early: ${isEarly}`
  );

  return isEarly;
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
      console.log(
        `        Check-in: ${checkInTime.toISOString()} -> ${checkInTime.toLocaleTimeString()}`
      );

      if (!earliestCheckIn || checkInTime < earliestCheckIn) {
        earliestCheckIn = checkInTime;
      }
    }

    if (record.checkLog?.checkOutTime) {
      const checkOutTime = new Date(record.checkLog.checkOutTime);
      console.log(
        `        Check-out: ${checkOutTime.toISOString()} -> ${checkOutTime.toLocaleTimeString()}`
      );

      if (!latestCheckOut || checkOutTime > latestCheckOut) {
        latestCheckOut = checkOutTime;
      }
    }
  }

  console.log(
    `    Final times - Check-in: ${
      earliestCheckIn?.toLocaleTimeString() || "none"
    }, Check-out: ${latestCheckOut?.toLocaleTimeString() || "none"}`
  );

  return {
    checkInTime: earliestCheckIn,
    checkOutTime: latestCheckOut,
    recordCount: records.length,
  };
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
    let unauthorizedAbsentLeaveType = await db.leaveType.findFirst({
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

    const timetableMap = new Map<string, Map<string, ShiftType>>();
    timetables.forEach((entry) => {
      const userId = entry.userId;
      const dateKey = formatDate(entry.date);

      if (!timetableMap.has(userId)) {
        timetableMap.set(userId, new Map<string, ShiftType>());
      }
      timetableMap.get(userId)!.set(dateKey, entry.shiftType);
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

        // Check attendance records for this date
        const dayAttendanceRecords = employeeAttendanceMap.get(dateStr) || [];

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
          employee.officeTimingIn
        );

        if (isLateArrival) {
          lateArrivals.push(dateStr);

          // Commented out database update
          /*
          dbUpdates.push(
            db.attendence.update({
              where: { id: dayAttendanceRecords[0].id },
              data: {
                workStatus: { connect: { id: lateWorkStatus.id } },
              },
            })
          );
          */
        }

        // Check for early exit using the latest check-out
        if (daySummary.checkOutTime) {
          const isEarlyExitVal = isEarlyExit(
            daySummary.checkOutTime,
            employee.OfficeTimingOut
          );

          if (isEarlyExitVal) {
            earlyExits.push(dateStr);

            // Commented out database update
            /*
            if (lateArrivals.includes(dateStr)) {
              dbUpdates.push(
                db.attendence.update({
                  where: { id: dayAttendanceRecords[0].id },
                  data: {
                    workStatus: { connect: { id: lateAndEarlyWorkStatus.id } },
                  },
                })
              );
            } else {
              dbUpdates.push(
                db.attendence.update({
                  where: { id: dayAttendanceRecords[0].id },
                  data: {
                    workStatus: { connect: { id: earlyWorkStatus.id } },
                  },
                })
              );
            }
            */
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
        newLateCount:combinedLateEarlyCount,
      });
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
