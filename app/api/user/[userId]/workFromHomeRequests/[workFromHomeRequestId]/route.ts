import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { userId: string; workFromHomeRequestId: string } }
) => {
  try {
    const { userId, workFromHomeRequestId } = params;

    const workFromHomeRequest = await db.workFromHome.findFirst({
      where: {
        id: workFromHomeRequestId,
        userId,
      },
    });

    if (!workFromHomeRequest) {
      return new NextResponse("Work From Home Request not found", {
        status: 400,
      });
    }

    if (
      workFromHomeRequest.status === "Approved" ||
      workFromHomeRequest.status === "Rejected"
    ) {
      return new NextResponse("Request already processed", {
        status: 400,
      });
    }

    await db.workFromHome.delete({
      where: {
        id: workFromHomeRequestId,
      },
    });

    return NextResponse.json("Work From Home request deleted successfully", {
      status: 201,
    });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
