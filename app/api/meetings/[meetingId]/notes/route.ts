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

    const notes = await db.meetingNote.findMany({
      where: { meetingId },
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
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching meeting notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const { title, content, noteType = "General" } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Check if user has access to this meeting
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        participants: {
          where: { userId },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const hasAccess =
      meeting.organizerId === userId || meeting.participants.length > 0;

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const note = await db.meetingNote.create({
      data: {
        meetingId,
        authorId: userId,
        title,
        content,
        noteType,
      },
      include: {
        author: {
          select: {
            userId: true,
            fullName: true,
            userImage: true,
          },
        },
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error creating meeting note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
