import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { userId: string; resignationRequestId: string } }
) => {
  try {
    const { userId, resignationRequestId } = params;

    const resignationRequest = await db.resignationRequests.findFirst({
      where: {
        id: resignationRequestId,
        userId,
      },
    });

    if (!resignationRequest) {
      return new NextResponse("Resignation Request not found", { status: 400 });
    }

    if (
      resignationRequest.status === "Approved" ||
      resignationRequest.status === "Rejected"
    ) {
      return new NextResponse("Resignation Request already processed", {
        status: 400,
      });
    }

    await db.resignationRequests.delete({
      where: {
        id: resignationRequestId,
      },
    });

    return NextResponse.json("Resignation request deleted successfully", {
      status: 201,
    });
  } catch (error) {
    console.error(`RAISE_REQUEST_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string; resignationRequestId: string } }
) => {
  try {
    const { resignationRequestId } = params;
    const { status } = await req.json();

    if (!["Approved", "Rejected"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const resignationRequest = await db.resignationRequests.findFirst({
      where: {
        id: resignationRequestId,
      },
    });

    if (!resignationRequest) {
      return new NextResponse("Resignation Request not found", { status: 400 });
    }

    await db.resignationRequests.update({
      where: { id: resignationRequestId },
      data: { status },
    });

    if (status === "Approved") {
      await db.userProfile.update({
        where: { userId: resignationRequest.userId },
        data: {
          status: {
            connect: {
              name: "Resigned",
            },
          },
        },
      });
    }

    if (status === "Rejected") {
      await db.userProfile.update({
        where: { userId: resignationRequest.userId },
        data: {
          status: {
            connect: {
              name: "Active",
            },
          },
        },
      });
    }

    return NextResponse.json(
      `Resignation request ${status.toLowerCase()} successfully.`,
      { status: 200 }
    );
  } catch (error) {
    console.error(`PATCH_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
