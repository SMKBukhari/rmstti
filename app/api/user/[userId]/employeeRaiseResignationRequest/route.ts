import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const { fullName, role, department, designation, date, reason } =
      await req.json();

    if (!fullName || !role || !department || !designation || !date || !reason) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const user = await db.userProfile.findFirst({
      where: {
        userId,
      },
      include: {
        ResignationRequests: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const admins = await db.userProfile.findMany({
      where: { role: { name: "Admin" }, NOT: { userId: user.userId } },
    });

    const ceo = await db.userProfile.findMany({
      where: { role: { name: "CEO" }, NOT: { userId: user.userId } },
    });

    const notifications = [
      {
        userId,
        title: "Resignation Request Submitted",
        message: `Your resignation request has been submitted successfully. You will be notified once it has been reviewed.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
        link: "/employee/resign",
      },
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "New Resignation Request Raised",
        message: `${fullName} has submitted a resignation request. Please review it.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/admin/resign/manage-resignations`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "New Resignation Request Raised",
        message: `${fullName} has submitted a resignation request. Please review it.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/manage-resignations`,
        type: NotificationType.General,
      })),
    ];

    const raiseResignationRequest = await db.resignationRequests.create({
      data: {
        reason,
        user: {
          connect: {
            userId,
          },
        },
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json(raiseResignationRequest, { status: 201 });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
