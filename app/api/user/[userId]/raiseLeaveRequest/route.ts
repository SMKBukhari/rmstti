import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const { leaveType, startDate, endDate, reason } = await req.json();

    if (!leaveType || !startDate || !endDate || !reason) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const getLeaveType = await db.leaveType.findFirst({
      where: {
        name: leaveType,
      },
    });

    if (!getLeaveType) {
      return new NextResponse("Leave Type not found", { status: 400 });
    }

    const raiseLeaveRequest = await db.leaveRequest.create({
      data: {
        leaveType: {
          connect: {
            id: getLeaveType.id,
          },
        },
        startDate,
        endDate,
        reason,
        user: {
          connect: {
            userId,
          },
        },
      },
    });

    return NextResponse.json(raiseLeaveRequest, { status: 201 });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
