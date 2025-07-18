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

    const files = await db.meetingFile.findMany({
      where: { meetingId },
      include: {
        uploader: {
          select: {
            userId: true,
            fullName: true,
            userImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error fetching meeting files:", error);
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
    const { fileName, fileUrl, fileSize, fileType, publicId, description } =
      body;

    if (!fileName || !fileUrl) {
      return NextResponse.json(
        { error: "File name and URL are required" },
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

    const file = await db.meetingFile.create({
      data: {
        meetingId,
        uploaderId: userId,
        fileName,
        fileUrl,
        fileSize: fileSize || 0,
        fileType: fileType || "application/octet-stream",
        publicId,
        description,
      },
      include: {
        uploader: {
          select: {
            userId: true,
            fullName: true,
            userImage: true,
          },
        },
      },
    });

    return NextResponse.json({ file });
  } catch (error) {
    console.error("Error uploading meeting file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
