import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import meetingAI from "@/lib/meetingAI"; // Declare the meetingAI variable
import { NotificationCreator } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value;

    const { meetingId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    if (
      !["Scheduled", "InProgress", "Completed", "Cancelled"].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check if meeting needs approval and has enough approvals
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        approvals: true,
        participants: true,
        organizer: true,
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Check if user can change status
    const user = await db.userProfile.findUnique({
      where: { userId },
      include: { role: true },
    });

    const canChangeStatus =
      meeting.organizerId === userId ||
      (user && ["CEO", "Admin"].includes(user.role?.name || "")) ||
      meeting.participants.some((p) => p.userId === userId);

    if (!canChangeStatus) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // // If trying to start meeting that needs approval
    // if (status === "InProgress" && meeting.needsApproval) {
    //   const approvedCount = meeting.approvals.filter(
    //     (a) => a.isApproved
    //   ).length;
    //   if (approvedCount < meeting.approvalThreshold) {
    //     return NextResponse.json(
    //       {
    //         error: "Insufficient approvals",
    //         required: meeting.approvalThreshold,
    //         current: approvedCount,
    //       },
    //       { status: 403 }
    //     );
    //   }
    // }

    const updatedMeeting = await db.meeting.update({
      where: { id: meetingId },
      data: {
        status,
        ...(status === "InProgress" && { actualStartTime: new Date() }),
        ...(status === "Completed" && { actualEndTime: new Date() }),
      },
    });

    // Handle other status changes
    await handleStatusChange(meetingId, status, userId);

    // // Auto-generate AI summary when meeting is completed
    // if (status === "Completed") {
    //   try {
    //     // This would trigger AI summary generation in the background
    //     await fetch(
    //       `${process.env.NEXTAUTH_URL}/api/meetings/${params.meetingId}/ai-summary`,
    //       {
    //         method: "POST",
    //       }
    //     );
    //   } catch (error) {
    //     console.error("Error triggering AI summary:", error);
    //   }
    // }

    return NextResponse.json({
      success: true,
      status: 200,
      meeting: updatedMeeting,
      message: `Meeting status updated to ${status}`,
    });
  } catch (error) {
    console.error(
      "Error updating meeting status:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Failed to update meeting status" },
      { status: 500 }
    );
  }
}

async function handleStatusChange(
  meetingId: string,
  newStatus: string,
  userId: string,
  reason?: string
) {
  const meeting = await db.meeting.findUnique({
    where: { id: meetingId },
    include: {
      participants: {
        include: { user: true },
      },
      organizer: true,
    },
  });

  if (!meeting) return;

  // Handle specific status changes
  switch (newStatus) {
    case "InProgress":
      // Send real-time notifications
      await db.notifications.createMany({
        data: meeting.participants.map((p) => ({
          userId: p.userId,
          title: "Meeting Started",
          message: `"${meeting.title}" has started. ${
            p.responseStatus === "Accepted"
              ? "You have been marked as present."
              : "Join if you can!"
          }`,
          type: "Event",
          createdBy: NotificationCreator.Account,
        })),
      });

      break;

    case "Completed":
      // Send completion notifications
      await db.notifications.createMany({
        data: meeting.participants.map((p) => ({
          userId: p.userId,
          title: "Meeting Completed",
          message: `"${meeting.title}" has been completed. Summary and action items are being generated.`,
          type: "Event",
          createdBy: NotificationCreator.Account,
          link: `/meetings/${meetingId}`,
        })),
      });
      break;

    case "Cancelled":
      // Send cancellation notifications
      await db.notifications.createMany({
        data: meeting.participants.map((p) => ({
          userId: p.userId,
          title: "Meeting Cancelled",
          message: `"${meeting.title}" has been cancelled. ${
            reason ? `Reason: ${reason}` : ""
          }`,
          type: "Event",
          createdBy: NotificationCreator.Account,
        })),
      });
      break;
  }
}
