import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { attendanceId: string } }
) {
  try {
    const { attendanceId } = params;

    const { status } = await request.json();

    const attendance = await db.attendence.findFirst({
      where: {
        id: attendanceId,
      },
    });

    if (!attendance) {
      return NextResponse.json(
        { message: "Attendance record not found" },
        { status: 404 }
      );
    }

    const workStatusId = await db.workStatus.findFirst({
      where: {
        name: status,
      },
    });

    if (!workStatusId) {
      return NextResponse.json(
        { message: "Work status not found" },
        { status: 404 }
      );
    }

    const updateWorkStatus = await db.attendence.update({
      where: {
        id: attendance.id,
      },
      data: {
        workStatus: {
          connect: {
            id: workStatusId.id,
          },
        },
      },
    });

    return NextResponse.json(updateWorkStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance status:", error);
    return NextResponse.json(
      { message: "Failed to fetch attendance status" },
      { status: 500 }
    );
  }
}
