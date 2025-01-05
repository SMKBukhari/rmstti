import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const attendance = await db.attendence.findFirst({
      where: {
        userId: userId,
        date: currentDate,
      },
    });

    if (!attendance) {
      return NextResponse.json({ status: "checkedOut" });
    }

    if (attendance.checkInTime && !attendance.checkOutTime) {
      return NextResponse.json({ status: "checkedIn" });
    }

    return NextResponse.json({ status: "checkedOut" });
  } catch (error) {
    console.error("Error fetching attendance status:", error);
    return NextResponse.json(
      { message: "Failed to fetch attendance status" },
      { status: 500 }
    );
  }
}
