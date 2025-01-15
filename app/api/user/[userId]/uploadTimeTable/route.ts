import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parse } from "csv-parse/sync";

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

    // Remove all previous timetables
    await db.timeTable.deleteMany();

    // Process and insert new records
    for (const record of records) {
      const {
        "User ID": userId,
        Date: date,
        "Shift Start": shiftStart,
        "Shift End": shiftEnd,
        "Shift Type": shiftType,
      } = record;

      // Check if user exists
      const user = await db.userProfile.findUnique({ where: { userId } });

      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        continue;
      }

      // Create a new timetable entry
      await db.timeTable.create({
        data: {
          userId: user.userId,
          date: new Date(date),
          shiftStart: new Date(shiftStart),
          shiftEnd: new Date(shiftEnd),
          shiftType: shiftType,
        },
      });
    }

    return NextResponse.json({
      message: "Timetable uploaded successfully",
    });
  } catch (error) {
    console.error("Error processing timetable:", error);

    // Ensure that the error object passed to NextResponse.json() is valid.
    return NextResponse.json(
      { error: "Failed to process timetable" },
      { status: 500 }
    );
  }
}
