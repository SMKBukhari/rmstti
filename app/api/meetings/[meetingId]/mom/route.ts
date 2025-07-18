import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { meetingId: string } }
// ) {
//   try {
//     const cookieStore = cookies();
//     const userId = (await cookieStore).get("userId")?.value;

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { meetingId } = params;

//     const mom = await db.meeting.findUnique({
//       where: { id: meetingId },
//       select: {
//         meetingMinutes: true,
//         businessFromLastMeeting: true,
//         openIssues: true,
//         newBusiness: true,
//         updatesAndAnnouncements: true,
//         adjourment: true,
//       },
//     });

//     return NextResponse.json({ mom });
//   } catch (error) {
//     console.error("Error fetching meeting mom:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

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
    const {
      openIssues,
      newBusiness,
      updatesAndAnnouncements,
      adjourment,
      meetingMinutes,
    } = body;

    if (
      !newBusiness &&
      !openIssues &&
      !updatesAndAnnouncements &&
      !adjourment
    ) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const mom = await db.meeting.update({
      where: {
        id: meetingId,
      },
      data: {
        meetingMinutes: meetingMinutes,
        openIssues: openIssues,
        newBusiness: newBusiness,
        updatesAndAnnouncements: updatesAndAnnouncements,
        adjourment: adjourment,
      },
    });

    return NextResponse.json({ mom });
  } catch (error) {
    console.error("Error creating meeting note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
