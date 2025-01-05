import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { action } = await request.json();

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let attendance = await db.attendence.findFirst({
      where: {
        userId: userId,
        date: currentDate,
      },
    });

    if (action === "checkIn") {
      if (attendance && attendance.checkInTime) {
        return NextResponse.json(
          { message: "Already checked in for today." },
          { status: 400 }
        );
      }

      attendance = await db.attendence.upsert({
        where: {
          id: attendance?.id || '',
        },
        update: {
          checkInTime: new Date(),
        },
        create: {
          userId: userId,
          date: currentDate,
          checkInTime: new Date(),
        },
      });

      return NextResponse.json({ message: "Check-in successful." });
    } else if (action === "checkOut") {
      if (!attendance || !attendance.checkInTime) {
        return NextResponse.json(
          { message: "Please check in first." },
          { status: 400 }
        );
      }

      if (attendance.checkOutTime) {
        return NextResponse.json(
          { message: "Already checked out for today." },
          { status: 400 }
        );
      }

      const checkOutTime = new Date();
      attendance = await db.attendence.update({
        where: {
          id: attendance.id,
        },
        data: {
          checkOutTime: checkOutTime,
          workingHours: calculateWorkingHours(
            attendance.checkInTime,
            checkOutTime
          ),
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
  const diff = checkOutTime.getTime() - checkInTime.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

