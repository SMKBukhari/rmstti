// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(
//   request: Request,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     const { userId } = params;
//     const { action, localTime, timezoneOffset } = await request.json();

//     // Convert local time to UTC based on the timezoneOffset
//     const localDate = new Date(localTime);
//     const utcTime = new Date(localDate.getTime() - timezoneOffset * 60000);
//     const currentDate = new Date(utcTime);
//     currentDate.setUTCHours(0, 0, 0, 0); // Set the time to midnight (start of the day)

//     // Check if an attendance record exists for the given day
//     let attendance = await db.attendence.findFirst({
//       where: {
//         userId: userId,
//         date: currentDate,
//       },
//       include: {
//         checkLog: true,
//       },
//     });

//     // If action is "checkIn"
//     if (action === "checkIn") {
//       if (attendance) {
//         const checkLog = attendance.checkLog; // Access the single CheckLog object

//         // If check-out hasn't been done yet, create a check-in log entry
//         if (!checkLog?.checkOutTime) {
//           await db.checkLog.create({
//             data: {
//               checkInTime: utcTime,
//               Attendence: {
//                 connect: { id: attendance.id },
//               },
//             },
//           });

//           return NextResponse.json({ message: "Check-in successful." });
//         } else {
//           // If there was a check-out, create a new attendance and check-in
//           attendance = await db.attendence.create({
//             data: {
//               userId: userId,
//               date: currentDate,
//             },
//             include: {
//               checkLog: true, // Empty check log array
//             },
//           });

//           await db.checkLog.create({
//             data: {
//               checkInTime: utcTime,
//               Attendence: {
//                 connect: { id: attendance.id },
//               },
//             },
//           });

//           return NextResponse.json({
//             message: "New attendance and check-in created.",
//           });
//         }
//       } else {
//         // If no attendance exists, create a new attendance and check-in
//         attendance = await db.attendence.create({
//           data: {
//             userId: userId,
//             date: currentDate,
//           },
//           include: {
//             checkLog: true, // Empty check log array
//           },
//         });

//         await db.checkLog.create({
//           data: {
//             checkInTime: utcTime,
//             Attendence: {
//               connect: { id: attendance.id },
//             },
//           },
//         });

//         return NextResponse.json({ message: "Check-in successful." });
//       }
//     }

//     // If action is "checkOut"
//     if (action === "checkOut") {
//       if (attendance) {
//         // Find the most recent check-in log with no check-out (active check-in)
//         const activeCheckLog = await db.checkLog.findFirst({
//           where: {
//             Attendence: {
//               some: {
//                 userId: userId,
//                 date: currentDate,
//               }
//             },
//             checkOutTime: null, // Active check-in (no check-out time)
//           },
//           orderBy: { createdAt: 'desc' }, // Order by the most recent one
//         });

//         if (activeCheckLog) {
//           // If we have an active check-in, perform the check-out
//           const workingHours = calculateWorkingHours(activeCheckLog.checkInTime, utcTime);
//           await db.checkLog.update({
//             where: {
//               id: activeCheckLog.id,
//             },
//             data: {
//               checkOutTime: utcTime,
//               workingHours: workingHours,
//             },
//           });

//           // const checkInTime = activeCheckLog.checkInTime;
//           // const checkOutTime = utcTime;

//           // // Get the difference in milliseconds
//           // const timeDifference = checkOutTime.getTime() - checkInTime.getTime();

//           // // Convert the difference into hours and minutes
//           // const hours = Math.floor(timeDifference / (1000 * 3600)); // in hours
//           // const minutes = Math.floor(
//           //   (timeDifference % (1000 * 3600)) / (1000 * 60)
//           // ); // in minutes

//           // Update the attendance record with the calculated working hours
//           await db.attendence.update({
//             where: {
//               id: attendance.id,
//             },
//             data: {
//               workingHours: workingHours,
//             },
//           });

          

//           return NextResponse.json({ message: "Check-out successful." });
//         } else {
//           // If there's no active check-in log, return an error
//           return NextResponse.json(
//             { message: "No active check-in found for check-out." },
//             { status: 400 }
//           );
//         }
//       } else {
//         // If no attendance exists, return an error
//         return NextResponse.json(
//           { message: "No attendance record found for the day." },
//           { status: 400 }
//         );
//       }
//     }

//     // If the action is neither check-in nor check-out, return an error
//     return NextResponse.json({ message: "Invalid action." }, { status: 400 });
//   } catch (error) {
//     console.error("Error recording attendance:", error);
//     return NextResponse.json(
//       { message: "Failed to record attendance" },
//       { status: 500 }
//     );
//   }
// }

// function calculateWorkingHours(checkInTime: Date, checkOutTime: Date): string {
//   const timeDifference = checkOutTime.getTime() - checkInTime.getTime();
//   const hours = Math.floor(timeDifference / (1000 * 3600)); // in hours
//   const minutes = Math.floor(
//     (timeDifference % (1000 * 3600)) / (1000 * 60)
//   ); // in minutes
//   return `${hours} hours ${minutes} minutes`;
// }


import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { action, localTime, timezoneOffset } = await request.json();

    // Convert local time to UTC
    const localDate = new Date(localTime);
    const utcTime = new Date(localDate.getTime() - timezoneOffset * 60000);

    if (action === "checkIn") {
      // Create a new attendance record with the actual check-in date
      const attendance = await db.attendence.create({
        data: {
          userId: userId,
          date: utcTime, // Use the actual date and time for this attendance
        },
      });

      // Create a check-in log
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

    if (action === "checkOut") {
      // Find the most recent check-in (whether today or yesterday)
      const activeCheckLog = await db.checkLog.findFirst({
        where: {
          Attendence: {
            some: {
              userId: userId,
            },
          },
          checkOutTime: null, // Ensure there's no check-out
        },
        orderBy: { createdAt: "desc" }, // Most recent check-in
      });

      if (!activeCheckLog) {
        return NextResponse.json(
          { message: "No active check-in found for check-out." },
          { status: 400 }
        );
      }

      // Calculate working hours
      const workingHours = calculateWorkingHours(
        new Date(activeCheckLog.checkInTime),
        utcTime
      );

      // Update the check log with check-out time and working hours
      await db.checkLog.update({
        where: {
          id: activeCheckLog.id,
        },
        data: {
          checkOutTime: utcTime,
          workingHours: workingHours,
        },
      });

      return NextResponse.json({ message: "Check-out successful." });
    }

    return NextResponse.json({ message: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      { message: "Failed to record attendance" },
      { status: 500 }
    );
  }
}

function calculateWorkingHours(checkInTime: Date, checkOutTime: Date): string {
  const timeDifference = checkOutTime.getTime() - checkInTime.getTime();
  const hours = Math.floor(timeDifference / (1000 * 3600)); // in hours
  const minutes = Math.floor(
    (timeDifference % (1000 * 3600)) / (1000 * 60)
  ); // in minutes
  return `${hours} hours ${minutes} minutes`;
}
