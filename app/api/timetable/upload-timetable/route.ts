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

    const successRecords = [];
    const errorRecords = [];

    for (const record of records) {
      try {
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
          throw new Error("Missing required fields");
        }

        // Parse dates separately
        const parsedDate = dynamicDateParser(date);
        const parsedShiftStart = dynamicDateParser(`${date} ${shiftStart}`);
        const parsedShiftEnd = dynamicDateParser(`${date} ${shiftEnd}`);

        // For evening shifts ending at 1:00 AM, we need to add a day to the end time
        if (shiftEnd.includes("1:00 AM")) {
          parsedShiftEnd?.setDate(parsedShiftEnd.getDate() + 1);
        }

        if (!parsedDate || !parsedShiftStart || !parsedShiftEnd) {
          console.log(`Date: ${date}, Start: ${shiftStart}, End: ${shiftEnd}`);
          throw new Error("Invalid date format");
        }

        // Find user by CNIC
        const user = await db.userProfile.findFirst({
          where: { cnic: cnic },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Create timetable record
        await db.timeTable.create({
          data: {
            id: randomBytes(16).toString("hex"),
            userId: user.userId,
            employeeName: employeeName,
            date: parsedDate,
            shiftStart: parsedShiftStart,
            shiftEnd: parsedShiftEnd,
            shiftType: shiftType,
          },
        });

        successRecords.push(record);
      } catch (error) {
        errorRecords.push({
          record,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.error(`Error processing record:`, record, error);
      }
    }

    return NextResponse.json({
      message: "TimeTable data processed",
      successCount: successRecords.length,
      errorCount: errorRecords.length,
      errors: errorRecords,
    });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: "Failed to process Time Table data" },
      { status: 500 }
    );
  }
}
