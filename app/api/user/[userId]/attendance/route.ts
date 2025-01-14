import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { action, localTime, timezoneOffset } = await request.json();

    // Convert local time to UTC based on the timezoneOffset
    const localDate = new Date(localTime);
    const utcTime = new Date(localDate.getTime() - timezoneOffset * 60000);
    const currentDate = new Date(utcTime);
    currentDate.setUTCHours(0, 0, 0, 0); // Set the time to midnight (start of the day)

    // Check if an attendance record exists for the given day
    let attendance = await db.attendence.findFirst({
      where: {
        userId: userId,
        date: currentDate,
      },
      include: {
        checkLog: true,
      },
    });

    // If action is "checkIn"
    if (action === "checkIn") {
      // If attendance already exists and has no check-out, log the check-in
      if (attendance) {
        const checkLog = attendance.checkLog; // Access the single CheckLog object

        // If check-out hasn't been done yet, create a check-in log entry
        if (!checkLog?.checkOutTime) {
          await db.checkLog.create({
            data: {
              checkInTime: utcTime,
              Attendence: {
                connect: { id: attendance.id },
              },
            },
          });

          return NextResponse.json({ message: "Check-in successful." });
        } else {
          // If there was a check-out, create a new attendance and check-in
          attendance = await db.attendence.create({
            data: {
              userId: userId,
              date: currentDate,
            },
            include: {
              checkLog: true, // Empty check log array
            },
          });

          await db.checkLog.create({
            data: {
              checkInTime: utcTime,
              Attendence: {
                connect: { id: attendance.id },
              },
            },
          });

          return NextResponse.json({
            message: "New attendance and check-in created.",
          });
        }
      } else {
        // If no attendance exists, create a new attendance and check-in
        attendance = await db.attendence.create({
          data: {
            userId: userId,
            date: currentDate,
          },
          include: {
            checkLog: true, // Empty check log array
          },
        });

        await db.checkLog.create({
          data: {
            checkInTime: utcTime,
            Attendence: {
              connect: { id: attendance.id },
            },
          },
        });

        return NextResponse.json({ message: "Check-in successful." });
      }
    }

    // If action is "checkOut"
    if (action === "checkOut") {
      if (attendance) {
        const checkLog = attendance.checkLog; // Access the single CheckLog object

        // If attendance exists and hasn't been checked out yet
        if (checkLog?.checkOutTime === null) {
          // If there is a check-in without a check-out, update it with check-out time
          await db.checkLog.update({
            where: {
              id: checkLog.id,
            },
            data: {
              checkOutTime: utcTime,
            },
          });

          const checkInTime = checkLog.checkInTime;
          const checkOutTime = utcTime;

          // Get the difference in milliseconds
          const timeDifference = checkOutTime.getTime() - checkInTime.getTime();

          // Convert the difference into hours and minutes
          const hours = Math.floor(timeDifference / (1000 * 3600)); // in hours
          const minutes = Math.floor(
            (timeDifference % (1000 * 3600)) / (1000 * 60)
          ); // in minutes

          // Update the attendance record with the calculated working hours
          await db.attendence.update({
            where: {
              id: attendance.id,
            },
            data: {
              workingHours: `${hours} hours ${minutes} minutes`,
            },
          });

          return NextResponse.json({ message: "Check-out successful." });
        } else {
          // If there's no open check-in log, return an error
          return NextResponse.json(
            { message: "No active check-in found for check-out." },
            { status: 400 }
          );
        }
      } else {
        // If no attendance exists, return an error
        return NextResponse.json(
          { message: "No attendance record found for the day." },
          { status: 400 }
        );
      }
    }

    // If the action is neither check-in nor check-out, return an error
    return NextResponse.json({ message: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      { message: "Failed to record attendance" },
      { status: 500 }
    );
  }
}
