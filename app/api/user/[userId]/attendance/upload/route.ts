import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parse } from "csv-parse/sync";

export async function POST(
  req: NextRequest,
) {
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

    for (const record of records) {
      const {
        "Attendance ID": attendanceId,
        "User Name": fullName,
        email: email,
        Date: date,
        "Working Hours": workingHours,
        "Work Status": workStatusName,
        "CheckLog ID": checkLogId,
        "Check In Time": checkInTime,
        "Check Out Time": checkOutTime,
      } = record;

      // Find or create the work status
      const workStatus = await db.workStatus.upsert({
        where: { name: workStatusName },
        create: { name: workStatusName },
        update: {},
      });

      // Find the user by email and fullName
      let user = await db.userProfile.findFirst({
        where: { 
          email: email,
          fullName: fullName
        },
      });

      // If user not found, try to find by email only
      if (!user) {
        user = await db.userProfile.findUnique({
          where: { email: email },
        });
      }

      // If still not found, create a new user
      if (!user) {
        console.log(`Creating new user for email: ${email}, fullName: ${fullName}`);
        user = await db.userProfile.create({
          data: {
            email: email,
            fullName: fullName,
            // Add other required fields with default values
            password: "12345678", // You should generate a random password or handle this differently
            contactNumber: "N/A",
            gender: "Other", // Default value, update as needed
          },
        });
      }

      // Base attendance data
      const attendanceData = {
        id: attendanceId,
        date: new Date(date),
        workingHours: workingHours || null,
        userId: user.userId,
        workStatusId: workStatus.id,
      };

      // Only create CheckLog if work status is not "Absent" and we have check-in time
      let checkLogIdd = null;
      if (workStatusName !== "Absent" && checkInTime) {
        try {
          const checkLog = await db.checkLog.upsert({
            where: { id: checkLogId },
            create: {
              id: checkLogId,
              checkInTime: new Date(checkInTime),
              checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
            },
            update: {
              checkInTime: new Date(checkInTime),
              checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
            },
          });
          checkLogIdd = checkLog.id;
        } catch (error) {
          console.error(
            `Error creating check log for attendance ${attendanceId}:`,
            error
          );
          // Continue with attendance creation even if check log fails
        }
      }

      // Create or update Attendance record
      try {
        await db.attendence.upsert({
          where: { id: attendanceId },
          create: {
            ...attendanceData,
            checkLodId: checkLogIdd,
          },
          update: {
            ...attendanceData,
            checkLodId: checkLogIdd,
          },
        });
      } catch (error) {
        console.error(
          `Error creating attendance record ${attendanceId}:`,
          error
        );
        continue;
      }
    }

    return NextResponse.json({
      message: "Attendance data uploaded successfully",
    });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: "Failed to process attendance data" },
      { status: 500 }
    );
  }
}

