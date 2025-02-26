import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const { startDate, endDate, reason } = await req.json();

    if (!startDate || !endDate || !reason) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const user = await db.userProfile.findFirst({
      where: {
        userId,
      },
      include: {
        WorkFromHome: true,
        department: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const admins = await db.userProfile.findMany({
      where: { role: { name: "Admin" } },
    });

    const ceo = await db.userProfile.findMany({
      where: { role: { name: "CEO" } },
    });

    const manager = await db.userProfile.findFirst({
      where: {
        department: {
          name: user.department?.name,
        },
      },
    });

    const notifications = [
      {
        userId,
        title: "Work From Home Request Raised",
        message: `You have submitted a work from home request from ${format(
          new Date(startDate),
          "MMMM do, yyyy"
        )} to ${format(new Date(endDate), "MMMM do, yyyy")}.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
        link: "/employee/workFromHome",
      },
      ...(manager
        ? [
            {
              userId: manager.userId,
              title: "New Work From Home Request Raised",
              message: `${
                user.fullName
              } has submitted a work from home request from ${format(
                new Date(startDate),
                "MMMM do, yyyy"
              )} to ${format(new Date(endDate), "MMMM do, yyyy")}.`,
              createdBy: NotificationCreator.Employee,
              senderImage: user.userImage,
              link: `/manager/workFromHome`,
              type: NotificationType.General,
            },
          ]
        : []),
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "New Work From Home Request Raised",
        message: `${
          user.fullName
        } has submitted a work from home request from ${format(
          new Date(startDate),
          "MMMM do, yyyy"
        )} to ${format(new Date(endDate), "MMMM do, yyyy")}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/admin/workFromHome`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "New Work From Home Request Raised",
        message: `${
          user.fullName
        } has submitted a work from home request from ${format(
          new Date(startDate),
          "MMMM do, yyyy"
        )} to ${format(new Date(endDate), "MMMM do, yyyy")}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/workFromHome`,
        type: NotificationType.General,
      })),
    ];

    const raiseWorkFromHomeRequest = await db.workFromHome.create({
      data: {
        startDate,
        endDate,
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

    return NextResponse.json(raiseWorkFromHomeRequest, { status: 201 });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
