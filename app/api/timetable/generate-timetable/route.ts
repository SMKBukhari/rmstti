import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addDays, setHours, setMinutes, startOfWeek } from "date-fns";
import { ShiftType } from "@prisma/client";
import { TimetableEntry } from "@/actions/timeTableActions";

const db = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { startDate } = await req.json();
    if (!startDate) {
      return NextResponse.json(
        { success: false, error: "Start date is required" },
        { status: 400 }
      );
    }

    const magazineEmployees = await db.userProfile.findMany({
      where: {
        department: {
          name: "Magazine Department",
        },
        isHired: true,
        status: {
          name: "Active",
        },
        role: {
          name: {
            not: "Manager",
          },
        },
      },
      select: {
        userId: true,
        fullName: true,
      },
    });

    if (magazineEmployees.length < 2) {
      throw new Error(
        "At least 2 employees are required in the Magazine Department to generate a timetable"
      );
    }

    const timetable: TimetableEntry[] = [];
    let currentDate = startOfWeek(startDate, { weekStartsOn: 1 }); // Start from Monday

    for (let week = 0; week < 4; week++) {
      // Generate for 4 weeks
      for (let day = 0; day < 7; day++) {
        const dayIndex = week * 7 + day;
        const morningEmployee =
          magazineEmployees[dayIndex % magazineEmployees.length];
        const eveningEmployee =
          magazineEmployees[(dayIndex + 1) % magazineEmployees.length];

        const morningShiftStart = setHours(setMinutes(currentDate, 0), 9);
        const morningShiftEnd = setHours(setMinutes(currentDate, 0), 17);
        const eveningShiftStart = setHours(setMinutes(currentDate, 0), 18);
        const eveningShiftEnd = setHours(
          setMinutes(addDays(currentDate, 1), 0),
          1
        );

        timetable.push(
          {
            userId: morningEmployee.userId,
            fullName: morningEmployee.fullName,
            date: currentDate,
            shiftStart: morningShiftStart,
            shiftEnd: morningShiftEnd,
            shiftType: ShiftType.Morning,
          },
          {
            userId: eveningEmployee.userId,
            fullName: eveningEmployee.fullName,
            date: currentDate,
            shiftStart: eveningShiftStart,
            shiftEnd: eveningShiftEnd,
            shiftType: ShiftType.Evening,
          }
        );

        // Add off shifts for employees not working that day
        for (let i = 2; i < magazineEmployees.length; i++) {
          const offEmployee =
            magazineEmployees[(dayIndex + i) % magazineEmployees.length];
          timetable.push({
            userId: offEmployee.userId,
            fullName: offEmployee.fullName,
            date: currentDate,
            shiftStart: currentDate,
            shiftEnd: currentDate,
            shiftType: ShiftType.Off,
          });
        }

        currentDate = addDays(currentDate, 1);
      }
    }

    // Remove fullName from the data before inserting into the database
    const timetableForDb = timetable.map(({ fullName, ...rest }) => rest);

    await db.timeTable.createMany({
      data: timetableForDb,
    });

    return NextResponse.json({ success: true, timetable });
  } catch (error) {
    console.error("Error generating timetable:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate timetable" },
      { status: 500 }
    );
  }
}
