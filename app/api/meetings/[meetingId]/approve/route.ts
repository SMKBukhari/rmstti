// app/api/meetings/[meetingId]/approve/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { meetingId: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meetingId } = params;
    const { approved, comments } = await request.json();

    // Verify the meeting exists and is completed
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      select: {
        status: true,
        meetingMinutes: true,
        organizerId: true,
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (meeting.status !== "Completed") {
      return NextResponse.json(
        { error: "Meeting must be completed before approval" },
        { status: 400 }
      );
    }

    if (!meeting.meetingMinutes) {
      return NextResponse.json(
        { error: "Minutes of Meeting must be added before approval" },
        { status: 400 }
      );
    }

    // Check if user is a participant with approval rights
    const participant = await db.meetingParticipant.findUnique({
      where: {
        meetingId_userId: {
          meetingId,
          userId,
        },
      },
      select: {
        role: true,
        canEditNotes: true,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant in this meeting" },
        { status: 403 }
      );
    }

    // // Only allow approval from organizers, co-organizers, or admins
    // const isOrganizer = meeting.organizerId === userId;
    // const isCoOrganizer = participant.role === "CoOrganizer";
    // const canApprove = isOrganizer || isCoOrganizer || participant.canEditNotes;

    // if (!canApprove) {
    //   return NextResponse.json(
    //     { error: "You don't have permission to approve this meeting" },
    //     { status: 403 }
    //   );
    // }

    // Check if user has already approved
    const existingApproval = await db.meetingApproval.findUnique({
      where: {
        meetingId_userId: {
          meetingId,
          userId,
        },
      },
    });

    if (existingApproval) {
      return NextResponse.json(
        { error: "You have already submitted your approval" },
        { status: 400 }
      );
    }

    // Create the approval record
    const approval = await db.meetingApproval.create({
      data: {
        meetingId,
        userId,
        isApproved: approved,
        comments: comments || null,
        approvedAt: new Date(),
      },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            userImage: true,
          },
        },
      },
    });

    // Check if all required approvals are complete
    const allParticipants = await db.meetingParticipant.findMany({
      where: { meetingId },
      select: { userId: true },
    });

    const approvals = await db.meetingApproval.findMany({
      where: { meetingId },
    });

    // If all participants have approved, mark meeting as fully approved
    if (approvals.length === allParticipants.length) {
      const allApproved = approvals.every((a) => a.isApproved);

      await db.meeting.update({
        where: { id: meetingId },
        data: {
          isCompleted: allApproved,
          completedAt: allApproved ? new Date() : null,
        },
      });
    }

    return NextResponse.json({ approval });
  } catch (error) {
    console.error("Error approving meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
