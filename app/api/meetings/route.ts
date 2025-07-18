import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile to determine role and department
    const userProfile = await db.userProfile.findUnique({
      where: { userId },
      include: { department: true, role: true },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    let whereClause: any = {};

    // Role-based access control
    switch (userProfile.role?.name) {
      case "CEO":
      case "Admin":
        // Can see all meetings
        whereClause = {};
        break;

      case "Manager":
        // Can see meetings for their department
        whereClause = {
          OR: [
            { organizerId: userId },
            {
              participants: {
                some: {
                  user: {
                    departmentId: userProfile.departmentId,
                  },
                },
              },
            },
          ],
        };
        break;

      case "Employee":
      default:
        // Can only see meetings they're invited to
        whereClause = {
          OR: [
            { organizerId: userId },
            {
              participants: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        };
        break;
    }

    const meetings = await db.meeting.findMany({
      where: whereClause,
      include: {
        organizer: true,
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
      orderBy: { startDateTime: "desc" },
    });

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile to determine role and department
    const userProfile = await db.userProfile.findUnique({
      where: { userId },
      include: { department: true, role: true },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      venue,
      priority = "Medium",
      visibilityType,
      participantIds = [],
      departmentIds = [],
      linkedMeetingId,
    } = body;

    // Validate required fields
    if (!title || !startDateTime || !endDateTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the meeting
    const meeting = await db.meeting.create({
      data: {
        title,
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        organizerId: userId,
        venue,
        priority,
        visibilityType,
      },
    });

    // Link to another meeting if provided
    if (linkedMeetingId) {
      const linkedMeeting = await db.meeting.findUnique({
        where: { id: linkedMeetingId },
      });

      if (!linkedMeeting) {
        return NextResponse.json(
          { error: "Linked meeting not found" },
          { status: 404 }
        );
      }

      await db.meeting.update({
        where: { id: meeting.id },
        data: {
          businessFromLastMeeting: linkedMeeting.newBusiness || null,
        },
      });
    }

    // Add individual participants
    if (participantIds.length > 0) {
      const participantData = participantIds.map((participantId: string) => ({
        meetingId: meeting.id,
        userId: participantId,
        canSeeOthers: visibilityType === "CC",
      }));

      await db.meetingParticipant.createMany({
        data: participantData,
      });
    }

    // Add the organizer as a participant
    await db.meetingParticipant.create({
      data: {
        meetingId: meeting.id,
        userId: userId,
        role: "Organizer",
        responseStatus: "Accepted",
        responseAt: new Date(),
        canSeeOthers: visibilityType === "CC",
      },
    });

    // Add department participants
    if (departmentIds.length > 0) {
      const departmentEmployees = await db.userProfile.findMany({
        where: {
          departmentId: {
            in: departmentIds,
          },
        },
        select: { userId: true },
      });

      const additionalParticipants = departmentEmployees
        .filter(
          (emp) => !participantIds.includes(emp.userId) && emp.userId !== userId
        )
        .map((emp) => ({
          meetingId: meeting.id,
          userId: emp.userId,
          canSeeOthers: visibilityType === "CC",
        }));

      if (additionalParticipants.length > 0) {
        await db.meetingParticipant.createMany({
          data: additionalParticipants,
        });
      }
    }

    // Send notifications and emails (implement separately)
    // await sendMeetingInvitations(meeting.id)

    // Fetch the complete meeting data
    const completeMeeting = await db.meeting.findUnique({
      where: { id: meeting.id },
      include: {
        organizer: true,
        participants: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ meeting: completeMeeting });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
