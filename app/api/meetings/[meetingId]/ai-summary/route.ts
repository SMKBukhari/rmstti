import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meetingAI } from "@/lib/ai/meeting-ai";
import { cookies } from "next/headers";
import { NotificationCreator } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  try {
    const { meetingId } = params;
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        notes: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
        participants: {
          include: { user: true },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Check access permissions
    const hasAccess =
      meeting.organizerId === userId ||
      meeting.participants.some((p) => p.userId === userId);

    if (!hasAccess) {
      const user = await db.userProfile.findUnique({
        where: { userId },
        include: { role: true },
      });

      if (!user || !["CEO", "Admin"].includes(user.role?.name || "")) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    if (meeting.notes.length === 0) {
      return NextResponse.json(
        { error: "No notes available for AI processing" },
        { status: 400 }
      );
    }

    const allNotes = meeting.notes.map((note) => note.content).join("\n\n");
    const participantNames = meeting.participants.map((p) => p.user.fullName);

    // Generate AI insights
    const [aiSummary, actionItems, sentiment, keyPoints] = await Promise.all([
      meetingAI.generateMeetingSummary(allNotes, participantNames),
      meetingAI.extractActionItems(allNotes),
      meetingAI.analyzeSentiment(allNotes),
      meetingAI.extractKeyPoints(allNotes),
    ]);

    // Update meeting with AI insights
    const updatedMeeting = await db.meeting.update({
      where: { id: meetingId },
      data: {
        aiSummary,
        aiActionItems: JSON.stringify(actionItems),
        aiInsights: JSON.stringify(sentiment),
        aiKeyPoints: JSON.stringify(keyPoints),
        aiProcessed: true,
        aiProcessedAt: new Date(),
      },
    });

    // Create action items as separate records
    if (actionItems.length > 0) {
      // Delete existing action items
      await db.meetingActionItem.deleteMany({
        where: { meetingId: meetingId },
      });

      // Create new action items
      await db.meetingActionItem.createMany({
        data: actionItems.map((item: string) => ({
          meetingId: meetingId,
          description: item,
          priority: "Medium",
          status: "Pending",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        })),
      });
    }

    // Send notification to participants about AI summary
    await db.notifications.createMany({
      data: meeting.participants.map((p) => ({
        userId: p.userId,
        title: "AI Summary Generated",
        message: `AI summary and action items have been generated for "${meeting.title}".`,
        type: "Event",
        createdBy: NotificationCreator.Account,
      })),
    });

    return NextResponse.json({
      aiSummary,
      actionItems,
      sentiment,
      keyPoints,
      message: "AI summary generated successfully",
    });
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return NextResponse.json(
      { error: "Failed to generate AI summary" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  try {
    const { meetingId } = params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      select: {
        id: true,
        aiSummary: true,
        aiActionItems: true,
        aiInsights: true,
        aiKeyPoints: true,
        aiProcessed: true,
        aiProcessedAt: true,
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const actionItems = await db.meetingActionItem.findMany({
      where: { meetingId: meetingId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      aiSummary: meeting.aiSummary,
      actionItems: meeting.aiActionItems
        ? JSON.parse(meeting.aiActionItems)
        : [],
      sentiment: meeting.aiInsights ? JSON.parse(meeting.aiInsights) : null,
      keyPoints: meeting.aiKeyPoints ? JSON.parse(meeting.aiKeyPoints) : [],
      actionItemRecords: actionItems,
      aiProcessed: meeting.aiProcessed,
      aiProcessedAt: meeting.aiProcessedAt,
    });
  } catch (error) {
    console.error("Error fetching AI summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI summary" },
      { status: 500 }
    );
  }
}
