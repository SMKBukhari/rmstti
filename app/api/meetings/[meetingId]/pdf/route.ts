// app/api/meetings/[meetingId]/pdf/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MeetingPDF, MeetingPDFProps } from "@/lib/pdf/MeetingPdf";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

export async function GET(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  try {
    // Properly access the meetingId from params
    const meetingId = params.meetingId;

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        organizer: true,
        participants: {
          include: {
            user: true,
          },
        },
        notes: {
          include: {
            author: true,
          },
        },
        files: {
          include: {
            uploader: true,
          },
        },
        attendance: {
          include: {
            user: true,
          },
        },
        approvals: {
          include: {
            user: true,
          },
        },
        actionItems: true,
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const pdfData: MeetingPDFProps["meeting"] = {
      title: meeting.title,
      description: meeting.description || undefined,
      startDateTime: meeting.startDateTime.toISOString(),
      endDateTime: meeting.endDateTime.toISOString(),
      location: meeting.location || undefined,
      organizer: { fullName: meeting.organizer.fullName },
      participants: meeting.participants.map((p) => ({
        user: { fullName: p.user.fullName },
        responseStatus: p.responseStatus,
      })),
      notes: meeting.notes.map((n) => ({
        title: n.title || undefined,
        content: n.content,
        author: { fullName: n.author.fullName },
        createdAt: n.createdAt.toISOString(),
      })),
      files: meeting.files.map((f) => ({
        fileName: f.fileName,
        uploader: { fullName: f.uploader.fullName },
      })),
      attendance: meeting.attendance.map((a) => ({
        user: { fullName: a.user.fullName },
        isPresent: a.isPresent,
        duration: a.duration || undefined,
      })),
    };

    // Create the PDF document properly
    const pdfElement = React.createElement(MeetingPDF, { meeting: pdfData });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(pdfElement as any);

    const response = new NextResponse(pdfBuffer);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="meeting-${meeting.id}.pdf"`
    );

    return response;
  } catch (error) {
    console.error("Error generating meeting PDF:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
