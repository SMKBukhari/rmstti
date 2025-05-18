import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { parse as parseDate, format } from "date-fns";
import { db } from "@/lib/db";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const csvContent = await file.text();
    const cacheKey = `attendance:${csvContent}`;

    // Check Redis cache first with proper type handling
    const cachedResponse = await redis.get<string>(cacheKey);

    if (cachedResponse) {
      console.log("Serving from cache");
      try {
        const parsedData = JSON.parse(cachedResponse);
        return NextResponse.json(parsedData);
      } catch (e) {
        console.error("Error parsing cached response", e);
        // Continue with processing if cache is corrupted
      }
    }

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // const parseDateString = (dateStr: string, timeStr?: string) => {
    //   try {
    //     if (timeStr) {
    //       // Combine date and time, then parse
    //       const combined = `${dateStr} ${timeStr}`;
    //       return parseDate(combined, "d/M/yyyy h:mm:ss a", new Date());
    //     }
    //     return parseDate(dateStr, "d/M/yyyy", new Date());
    //   } catch (error) {
    //     console.error(`Error parsing date: ${dateStr} ${timeStr || ""}`, error);
    //     return null;
    //   }
    // };
    const parseDateString = (dateStr: string, timeStr?: string) => {
      try {
        if (timeStr) {
          // Combine date and time, then parse in local time
          const combined = `${dateStr} ${timeStr}`;
          const parsed = parseDate(combined, "d/M/yyyy h:mm:ss a", new Date());

          // Create a new date with the same local time but marked as UTC
          return new Date(
            Date.UTC(
              parsed.getFullYear(),
              parsed.getMonth(),
              parsed.getDate(),
              parsed.getHours(),
              parsed.getMinutes(),
              parsed.getSeconds()
            )
          );
        }
        return parseDate(dateStr, "d/M/yyyy", new Date());
      } catch (error) {
        console.error(`Error parsing date: ${dateStr} ${timeStr || ""}`, error);
        return null;
      }
    };

    // Process records with consecutive check handling
    const attendanceRecords: {
      cnic: string;
      date: string;
      timeIn?: string;
      timeOut?: string;
      checkType: string;
    }[] = [];

    for (const record of records) {
      // Note: Using lowercase column names to match CSV
      const { cnic, date, time, checks } = record;

      const employee = await db.userProfile.findFirst({
        where: {
          cnic,
        },
      });

      if (!employee) {
        console.error(`⚠️ Skipping CNIC ${cnic} - Employee not found`);
        continue;
      }

      const parsedDate = parseDateString(date);
      const parsedCheckTime = parseDateString(date, time);

      if (!parsedDate || !parsedCheckTime) {
        console.error(
          `Invalid date format for record: ${JSON.stringify(record)}`
        );
        continue;
      }

      const formattedDate = format(parsedDate, "yyyy-MM-dd");
      // const formattedTime = format(parsedCheckTime, "hh:mm:ss a");
      const formattedTime = format(parsedCheckTime, "hh:mm:ss a");

      // Get the last entry of the same CNIC
      const lastEntryIndex = attendanceRecords.findLastIndex(
        (entry) => entry.cnic === cnic
      );
      const lastEntry =
        lastEntryIndex !== -1 ? attendanceRecords[lastEntryIndex] : null;

      console.log(
        `Processing CNIC: ${cnic}, Date: ${formattedDate}, Time: ${formattedTime}, Check: ${checks}`
      );

      if (checks === "IN") {
        if (lastEntry && lastEntry.timeIn) {
          console.log(
            `⏳ Duplicate IN found for CNIC: ${cnic} at ${lastEntry.timeIn}. Removing previous entry and adding new IN at ${formattedTime}`
          );
          attendanceRecords.splice(lastEntryIndex, 1); // Remove previous IN
        }
        console.log(`✅ Adding IN entry for CNIC: ${cnic} at ${formattedTime}`);
        attendanceRecords.push({
          cnic,
          date: formattedDate,
          timeIn: formattedTime,
          checkType: checks,
        });
      } else if (checks === "OUT") {
        if (lastEntry && lastEntry.timeOut) {
          console.log(
            `🚫 Skipping duplicate OUT for CNIC: ${cnic} at ${formattedTime}, as last entry was also OUT at ${lastEntry.timeOut}`
          );
          continue; // Skip the second OUT
        }
        console.log(
          `✅ Adding OUT entry for CNIC: ${cnic} at ${formattedTime}`
        );
        attendanceRecords.push({
          cnic,
          date: formattedDate,
          timeOut: formattedTime,
          checkType: checks,
        });
      }
    }

    console.log(`\n🔍 Final Processed Attendance Records:`);
    console.table(attendanceRecords);

    // Process and save attendance records
    for (const record of attendanceRecords) {
      const { cnic, date, timeIn, timeOut } = record;   

      // Find the user by CNIC
      const user = await db.userProfile.findFirst({
        where: {
          cnic,
        },
      });

      if (!user) {
        console.error(`User not found for CNIC: ${cnic}`);
        continue;
      }

      const userName = user.fullName;

      console.table({
        userName,
        cnic,
        date,
        timeIn,
        timeOut,
        checkType: record.checkType,
      });

      if (record.checkType === "IN") {
        const attendance = await db.attendence.create({
          data: {
            userId: user.userId,
            date: new Date(date),
          },
        });

        const checkInDate = new Date(`${date} ${timeIn}`);

        await db.checkLog.create({
          data: {
            checkInTime: checkInDate, // For calculations
            checkInTimeString: timeIn, // Original format
            Attendence: {
              connect: { id: attendance.id },
            },
          },
        });

        console.log(
          `✅ Check-in recorded for ${userName} on ${date} at ${timeIn}`
        );
      }

      if (record.checkType === "OUT") {
        const activeCheckLog = await db.checkLog.findFirst({
          where: {
            Attendence: {
              some: {
                userId: user.userId,
              },
            },
            checkOutTime: null, // Ensure there's no check-out
          },
          orderBy: { createdAt: "desc" }, // Most recent check-in
        });

        if (!activeCheckLog) {
          console.error(
            `❌ No active check-in found for ${userName} on ${date}`
          );
          continue;
        }

        // Calculate working hours
        const utcTime = new Date(`${date} ${timeOut}`);
        const workingHours = calculateWorkingHours(
          new Date(activeCheckLog.checkInTime),
          utcTime
        );

        // Update the check log with check-out time and working hours
        const checkOutDate = new Date(`${date} ${timeOut}`);

        await db.checkLog.update({
          where: { id: activeCheckLog.id },
          data: {
            checkOutTime: checkOutDate, // For calculations
            checkOutTimeString: timeOut, // Original format
            workingHours,
          },
        });
        const activeAttendance = await db.attendence.findFirst({
          where: {
            checkLog: {
              id: activeCheckLog.id,
            },
          },
        });

        if (activeAttendance) {
          await db.attendence.update({
            where: {
              id: activeAttendance.id,
            },
            data: {
              workingHours: workingHours,
            },
          });
        }

        console.log(
          `✅ Check-out recorded for ${userName} on ${date} at ${timeOut}`
        );
      }
    }

    // After successful processing, cache the result
    const responseData = {
      message: `Attendance data processed successfully. Records: ${attendanceRecords.length}`,
      data: attendanceRecords,
    };

    // Cache for 1 hour (3600 seconds) with error handling
    try {
      await redis.setex(cacheKey, 3600, JSON.stringify(responseData));
    } catch (e) {
      console.error("Failed to cache response", e);
      // Don't fail the request if caching fails
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: "Failed to process attendance data" },
      { status: 500 }
    );
  }
}

function calculateWorkingHours(checkInTime: Date, checkOutTime: Date): string {
  const timeDifference = checkOutTime.getTime() - checkInTime.getTime();
  const hours = Math.floor(timeDifference / (1000 * 3600)); // in hours
  const minutes = Math.floor((timeDifference % (1000 * 3600)) / (1000 * 60)); // in minutes
  return `${hours} hours ${minutes} minutes`;
}
