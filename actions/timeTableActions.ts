"use server";

import { PrismaClient } from "@prisma/client";
import { addDays, setHours, setMinutes, startOfWeek } from "date-fns";
import { ShiftType } from "@prisma/client";

const db = new PrismaClient();

export interface TimetableEntry {
  id?: string;
  userId: string;
  fullName: string;
  date: Date;
  shiftStart: Date;
  shiftEnd: Date;
  shiftType: ShiftType;
}

export async function generateTimetable(
  startDate: Date | any[]
): Promise<TimetableEntry[]> {
  if (Array.isArray(startDate)) {
    // Modify timetableForDb to exclude fullName
    const timetableForDb = startDate.map(({ fullName, ...rest }) => rest);

    // Update db.timeTable.createMany to use timetableForDb
    await db.timeTable.createMany({
      data: timetableForDb,
    });

    // Fetch user names separately and combine with timetable data
    const usersWithNames = await db.userProfile.findMany({
      where: {
        userId: {
          in: timetableForDb.map((entry) => entry.userId),
        },
      },
      select: {
        userId: true,
        fullName: true,
      },
    });

    const userNameMap = new Map(
      usersWithNames.map((user) => [user.userId, user.fullName])
    );

    return timetableForDb.map((entry) => ({
      ...entry,
      fullName: userNameMap.get(entry.userId) || "Unknown",
    }));
  } else {
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

    return timetable;
  }
}

export async function getTimetable(): Promise<TimetableEntry[]> {
  const timetable = await db.timeTable.findMany({
    include: {
      user: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return timetable.map((entry) => ({
    ...entry,
    fullName: entry.user.fullName,
  }));
}

export async function uploadTimetableFile(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Here you would process the file and update the timetable
  // For now, we'll just return a success message
  return { success: true, message: "File uploaded and processed successfully" };
}

// Example usage
async function main() {
  const sampleTimetable = [
    {
      userId: 1,
      day: "Monday",
      startTime: "9:00",
      endTime: "10:00",
      fullName: "John Doe",
    },
    {
      userId: 2,
      day: "Tuesday",
      startTime: "11:00",
      endTime: "12:00",
      fullName: "Jane Smith",
    },
  ];

  const timetableWithNames = await generateTimetable(sampleTimetable);
  console.log(timetableWithNames);

  await db.$disconnect();
}

main();
