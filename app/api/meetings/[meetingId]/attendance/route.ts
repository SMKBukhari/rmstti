import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meetingId } = params;
    const body = await request.json();
    const { attendeeId, isPresent, joinedAt, leftAt } = body;

    // Check if user can mark attendance (organizer or admin)
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const userProfile = await db.userProfile.findUnique({
      where: { userId },
      include: { department: true, role: true },
    });

    const canMarkAttendance =
      meeting.organizerId === userId ||
      userProfile?.role?.name === "CEO" ||
      userProfile?.role?.name === "Admin" ||
      attendeeId === userId; // Users can mark their own attendance

    if (!canMarkAttendance) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const duration =
      joinedAt && leftAt
        ? Math.round(
            (new Date(leftAt).getTime() - new Date(joinedAt).getTime()) /
              (1000 * 60)
          )
        : null;

    const isLate = joinedAt
      ? new Date(joinedAt) > meeting.startDateTime
      : false;
    const lateBy =
      isLate && joinedAt
        ? Math.round(
            (new Date(joinedAt).getTime() - meeting.startDateTime.getTime()) /
              (1000 * 60)
          )
        : null;

    const attendance = await db.meetingAttendance.upsert({
      where: {
        meetingId_userId: {
          meetingId,
          userId: attendeeId,
        },
      },
      update: {
        isPresent,
        joinedAt: joinedAt ? new Date(joinedAt) : null,
        leftAt: leftAt ? new Date(leftAt) : null,
        duration,
        isLate,
        lateBy,
      },
      create: {
        meetingId,
        userId: attendeeId,
        isPresent,
        joinedAt: joinedAt ? new Date(joinedAt) : null,
        leftAt: leftAt ? new Date(leftAt) : null,
        duration,
        isLate,
        lateBy,
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

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
