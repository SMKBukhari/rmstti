import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(
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

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        organizer: {
          select: {
            userId: true,
            fullName: true,
            email: true,
            userImage: true,
            designation: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        participants: {
          include: {
            user: {
              select: {
                userId: true,
                fullName: true,
                email: true,
                userImage: true,
                designation: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        notes: {
          include: {
            author: {
              select: {
                userId: true,
                fullName: true,
                userImage: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        approvals: {
          include: {
            user: {
              select: {
                userId: true,
                fullName: true,
                userImage: true,
              },
            },
          },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Check if user has access to this meeting
    const userProfile = await db.userProfile.findUnique({
      where: { userId },
      include: { department: true, role: true },
    });

    const hasAccess =
      meeting.organizerId === userId ||
      meeting.participants.some((p) => p.userId === userId) ||
      userProfile?.role?.name === "CEO" ||
      userProfile?.role?.name === "Admin" ||
      (userProfile?.role?.name === "Manager" &&
        meeting.participants.some(
          (p) => p.user.department?.id === userProfile.departmentId
        ));

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ meeting });
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Check if user can edit this meeting
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: { organizer: true },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const userProfile = await db.userProfile.findUnique({
      where: { userId },
      include: { department: true, role: true },
    });

    const canEdit =
      meeting.organizerId === userId ||
      userProfile?.role?.name === "CEO" ||
      userProfile?.role?.name === "Admin";

    if (!canEdit) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updatedMeeting = await db.meeting.update({
      where: { id: meetingId },
      data: {
        ...body,
        startDateTime: body.startDateTime
          ? new Date(body.startDateTime)
          : undefined,
        endDateTime: body.endDateTime ? new Date(body.endDateTime) : undefined,
        isCompleted: body.status === "Completed",
        completedAt: body.status === "Completed" ? new Date() : undefined,
      },
      include: {
        organizer: true,
        participants: {
          include: { user: true },
        },
        notes: {
          include: { author: true },
        },
        approvals: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ meeting: updatedMeeting });
  } catch (error) {
    console.error("Error updating meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user can delete this meeting
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

    const canDelete =
      meeting.organizerId === userId ||
      userProfile?.role?.name === "CEO" ||
      userProfile?.role?.name === "Admin";

    if (!canDelete) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await db.meeting.delete({
      where: { id: meetingId },
    });

    return NextResponse.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
