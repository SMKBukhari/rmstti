import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { parse as parseDate, format } from "date-fns";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const csvContent = await file.text();
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const parseDateString = (dateStr: string, timeStr?: string) => {
      try {
        if (timeStr) {
          return parseDate(
            `${dateStr} ${timeStr}`,
            "M/d/yyyy h:mm:ss a",
            new Date()
          );
        }
        return parseDate(dateStr, "M/d/yyyy", new Date());
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
      const { cnic, Date: date, Time: time, Checks } = record;

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
      const formattedTime = format(parsedCheckTime, "hh:mm:ss a");

      // Get the last entry of the same CNIC
      const lastEntryIndex = attendanceRecords.findLastIndex(
        (entry) => entry.cnic === cnic
      );
      const lastEntry =
        lastEntryIndex !== -1 ? attendanceRecords[lastEntryIndex] : null;

      console.log(
        `Processing CNIC: ${cnic}, Date: ${formattedDate}, Time: ${formattedTime}, Check: ${Checks}`
      );

      if (Checks === "IN") {
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
          timeIn: formattedTime, // Only timeIn, no timeOut
          checkType: Checks,
        });
      } else if (Checks === "OUT") {
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
          timeOut: formattedTime, // Only timeOut, no timeIn
          checkType: Checks,
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

        await db.checkLog.create({
          data: {
            checkInTime: new Date(`${date} ${timeIn}`),
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
        }

        // Calculate working hours
        const utcTime = new Date(`${date} ${timeOut}`);
        const workingHours = calculateWorkingHours(
          new Date(activeCheckLog!.checkInTime),
          utcTime
        );

        // Update the check log with check-out time and working hours
        await db.checkLog.update({
          where: {
            id: activeCheckLog?.id,
          },
          data: {
            checkOutTime: new Date(`${date} ${timeOut}`),
            workingHours,
          },
        });

        const activeAttendance = await db.attendence.findFirst({
          where: {
            checkLog: {
              id: activeCheckLog?.id,
            },
          },
        });

        await db.attendence.update({
          where: {
            id: activeAttendance?.id,
          },
          data: {
            workingHours: workingHours,
          },
        });
      }
    }

    return NextResponse.json({
      message: `Attendance data processed successfully. Records: ${attendanceRecords.length}`,
      data: attendanceRecords,
    });
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