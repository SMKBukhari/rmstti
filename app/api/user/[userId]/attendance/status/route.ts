import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Get today's date at 00:00:00 (midnight)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);  // Reset to midnight

    // End of today (23:59:59.999) for range query
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch the most recent attendance record for the user within today
    const attendance = await db.attendence.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gte: currentDate,  // Greater than or equal to start of today
          lte: endOfDay,     // Less than or equal to end of today
        },
      },
      orderBy: {
        createdAt: 'desc',  // Order by most recent first
      },
      include: {
        checkLog: true,  // Include check log information
      },
    });


    if (!attendance || !attendance.checkLog) {
      return NextResponse.json({ status: "checkedOut" });
    }

    const checkLog = attendance.checkLog;

    if (checkLog.checkInTime && !checkLog.checkOutTime) {
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
