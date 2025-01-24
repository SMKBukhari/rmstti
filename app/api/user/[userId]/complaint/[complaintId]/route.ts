import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { userId: string; complaintId: string } }
) => {
  try {
    const { userId, complaintId } = params;

    const complaint = await db.complaints.findFirst({
      where: {
        id: complaintId,
        userId,
      },
    });

    if (!complaint) {
      return new NextResponse("Your Complaint not found", { status: 400 });
    }

    if (
      complaint.status === "Completed" ||
      complaint.status === "In Progress" ||
      complaint.status === "Rejected"
    ) {
      return new NextResponse("Your Complaint already processed", {
        status: 400,
      });
    }

    await db.complaints.delete({
      where: {
        id: complaint.id,
      },
    });

    return NextResponse.json("Your Complaint deleted successfully", {
      status: 201,
    });
  } catch (error) {
    console.error(`DELETE_COMPLAINT_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string; complaintId: string } }
) => {
  try {
    const { complaintId } = params;
    const { status } = await req.json();

    if (!["In Progress", "Rejected", "Completed"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const complaint = await db.complaints.findFirst({
      where: {
        id: complaintId,
      },
    });

    if (!complaint) {
      return new NextResponse("Complaint not found", { status: 404 });
    }

    await db.complaints.update({
      where: { id: complaint.id },
      data: { status },
    });

    return NextResponse.json(`Complaint status updated to ${status}`, {
      status: 200,
    });
  } catch (error) {
    console.error(`UPDATE_COMPLAINT_STATUS_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
