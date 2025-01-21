// import { NextResponse } from "next/server"
// import { generateTimetable } from "@/actions/timeTableActions"

// export async function POST(req: Request) {
//   console.log("POST request received")
//   try {
//     const { startDate } = await req.json()
//     const timetable = await generateTimetable(new Date(startDate))
//     return NextResponse.json({ success: true, timetable })
//   } catch (error) {
//     console.error("Error in POST handler:", error)
//     return NextResponse.json({ success: false, error: "Failed to generate timetable" }, { status: 500 })
//   }
// }


import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addDays, setHours, setMinutes, startOfWeek } from "date-fns";
import { ShiftType } from "@prisma/client";

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
        department: { name: "Magazine Department" },
        isHired: true,
        status: { name: "Active" },
        role: { name: { not: "Manager" } },
      },
      select: { userId: true, fullName: true },
    });

    if (magazineEmployees.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "At least 2 employees are required to generate a timetable",
        },
        { status: 400 }
      );
    }

    const timetable: any[] = [];
    let currentDate = startOfWeek(new Date(startDate), { weekStartsOn: 1 });

    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        const dayIndex = week * 7 + day;
        const morningEmployee =
          magazineEmployees[dayIndex % magazineEmployees.length];
        const eveningEmployee =
          magazineEmployees[(dayIndex + 1) % magazineEmployees.length];

        timetable.push(
          {
            userId: morningEmployee.userId,
            fullName: morningEmployee.fullName,
            date: currentDate,
            shiftStart: setHours(setMinutes(currentDate, 0), 9),
            shiftEnd: setHours(setMinutes(currentDate, 0), 17),
            shiftType: ShiftType.Morning,
          },
          {
            userId: eveningEmployee.userId,
            fullName: eveningEmployee.fullName,
            date: currentDate,
            shiftStart: setHours(setMinutes(currentDate, 0), 18),
            shiftEnd: setHours(setMinutes(addDays(currentDate, 1), 0), 1),
            shiftType: ShiftType.Evening,
          }
        );

        currentDate = addDays(currentDate, 1);
      }
    }

    const timetableForDb = timetable.map(({ fullName, ...rest }) => rest);
    await db.timeTable.createMany({ data: timetableForDb });

    return NextResponse.json({ success: true, timetable });
  } catch (error) {
    console.error("Error generating timetable:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate timetable" },
      { status: 500 }
    );
  }
}
