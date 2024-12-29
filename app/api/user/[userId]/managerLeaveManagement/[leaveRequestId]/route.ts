import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { userId: string; leaveRequestId: string } }
) => {
  try {
    const { userId, leaveRequestId } = params;

    const leaveRequest = await db.leaveRequest.findFirst({
      where: {
        id: leaveRequestId,
        userId,
      },
    });

    if (!leaveRequest) {
      return new NextResponse("Leave Request not found", { status: 400 });
    }

    if (
      leaveRequest.status === "Approved" ||
      leaveRequest.status === "Rejected"
    ) {
      return new NextResponse("Leave Request already processed", {
        status: 400,
      });
    }

    await db.leaveRequest.delete({
      where: {
        id: leaveRequestId,
      },
    });

    return NextResponse.json("Leave request deleted successfully", {
      status: 201,
    });
  } catch (error) {
    console.error(`DELETE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
