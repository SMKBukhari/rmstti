import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { userId: string; requestId: string } }
) => {
  try {
    const { userId, requestId } = params;

    const request = await db.requests.findFirst({
      where: {
        id: requestId,
        userId,
      },
    });

    if (!request) {
      return new NextResponse("Your Request not found", { status: 400 });
    }

    if (
      request.status === "Completed" ||
      request.status === "In Progress" ||
      request.status === "Rejected"
    ) {
      return new NextResponse("Your Request already processed", {
        status: 400,
      });
    }

    await db.requests.delete({
      where: {
        id: request.id,
      },
    });

    return NextResponse.json("Your request deleted successfully", {
      status: 201,
    });
  } catch (error) {
    console.error(`DELETE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string; requestId: string } }
) => {
  try {
    const { requestId } = params;
    const { status } = await req.json();

    if (!["In Progress", "Rejected", "Completed"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const request = await db.requests.findFirst({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return new NextResponse("Request not found", { status: 404 });
    }

    await db.requests.update({
      where: { id: requestId },
      data: { status },
    });

    return NextResponse.json(`Request status updated to ${status}`, {
      status: 200,
    });
  } catch (error) {
    console.error(`UPDATE_REQUEST_STATUS_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
