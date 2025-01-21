import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync"; // CSV parsing library
import fs from "fs";

const db = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to Buffer for processing
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const csvData = fileBuffer.toString("utf-8");

    // Parse the CSV file
    const records = parse(csvData, {
      columns: true, // Use the first row as column headers
      skip_empty_lines: true,
    });

    // Validate and transform data
    const timetableEntries = records.map((record: any) => {
      if (
        !record.userId ||
        !record.date ||
        !record.shiftStart ||
        !record.shiftEnd ||
        !record.shiftType
      ) {
        throw new Error("Invalid file format or missing fields");
      }

      return {
        userId: record.userId,
        date: new Date(record.date),
        shiftStart: new Date(record.shiftStart),
        shiftEnd: new Date(record.shiftEnd),
        shiftType: record.shiftType,
      };
    });

    // Insert timetable entries into the database
    await db.timeTable.createMany({
      data: timetableEntries,
    });

    return NextResponse.json({
      success: true,
      message: "Timetable uploaded and processed successfully",
    });
  } catch (error) {
    console.error("Error processing uploaded timetable file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload and process timetable" },
      { status: 500 }
    );
  }
}
