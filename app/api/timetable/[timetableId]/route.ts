import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { timetableId: string } }
) {
  try {
    const { date, shiftStart, shiftEnd } = await request.json();

    const updatedTimetable = await db.timeTable.update({
      where: { id: params.timetableId },
      data: {
        date: new Date(date),
        shiftStart: new Date(shiftStart),
        shiftEnd: new Date(shiftEnd),
      },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      timetable: {
        ...updatedTimetable,
        fullName: updatedTimetable.user.fullName,
      },
    });
  } catch (error) {
    console.error("Error updating timetable:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update timetable" },
      { status: 500 }
    );
  }
}
