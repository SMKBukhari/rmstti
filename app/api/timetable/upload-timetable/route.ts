import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parse } from "csv-parse/sync";
import { dynamicDateParser } from "@/lib/dynamicDateParse";
import { randomBytes } from "crypto";

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

    for (const record of records) {
      const {
        CNIC: cnic,
        "Employee Name": employeeName,
        Date: date,
        "Shift Start": shiftStart,
        "Shift End": shiftEnd,
        "Shift Type": shiftType,
      } = record;

      // Validation
      if (
        !cnic ||
        !employeeName ||
        !date ||
        !shiftStart ||
        !shiftEnd ||
        !shiftType
      ) {
        console.error(
          `Missing required fields for record: ${JSON.stringify(record)}`
        );
        continue;
      }

      const parsedDate = dynamicDateParser(date);
      const parsedShiftStart = dynamicDateParser(`${date} ${shiftStart}`);
      const parsedShiftEnd = dynamicDateParser(`${date} ${shiftEnd}`);

      if (!parsedDate || !parsedShiftStart || !parsedShiftEnd) {
        console.error(
          `Invalid date format for record: ${JSON.stringify(record)}`
        );
        continue;
      }

      // Find user by CNIC
      const user = await db.userProfile.findFirst({
        where: { cnic: cnic },
      });

      if (!user) {
        console.error(`User not found for CNIC: ${cnic}`);
        continue;
      }

      const timeTableId = randomBytes(16).toString("hex");

      // Base timeTable data
      const timeTableData = {
        id: randomBytes(16).toString("hex"),
        userId: user?.userId,
        employeeName: employeeName,
        date: parsedDate, // Use parsed date
        shiftStart: parsedShiftStart, // Use parsed shift start
        shiftEnd: parsedShiftEnd, // Use parsed shift end
        shiftType: shiftType,
      };

      console.log(`Parsed Date: ${parsedDate}`);
      console.log(`Parsed Shift Start: ${parsedShiftStart}`);
      console.log(`Parsed Shift End: ${parsedShiftEnd}`);

      // Create or update Attendance record
      try {
        await db.timeTable.create({
          data: timeTableData,
        });
        console.log(`Successfully created timetable record: ${timeTableId}`);
      } catch (error) {
        console.error(`Error upserting record with ID ${timeTableId}:`, error);
      }
    }

    return NextResponse.json({
      message: "TimeTable data uploaded successfully",
    });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: "Failed to process Time Table data" },
      { status: 500 }
    );
  }
}
