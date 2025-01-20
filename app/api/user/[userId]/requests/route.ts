import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { requestTo, category, requestMessage } = await req.json();

    if (!requestTo || !category || !requestMessage) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const user = await db.userProfile.findUnique({
      where: {
        userId,
      },
      include: {
        role: true,
        department: true,
        Requests: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const requestToUser = await db.userProfile.findUnique({
      where: {
        userId: requestTo,
      },
      include: {
        role: true,
        department: true,
      },
    });

    if (!requestToUser) {
      return new NextResponse("Request to user not found", { status: 404 });
    }

    if (requestToUser.userId === user.userId) {
      return new NextResponse("You can't raise request to yourself", {
        status: 400,
      });
    }

    const admins = await db.userProfile.findMany({
      where: {
        role: {
          name: "Admin",
        },
        userId: {
          notIn: [user.userId, requestToUser.userId],
        },
      },
    });

    const ceo = await db.userProfile.findMany({
      where: {
        role: {
          name: "CEO",
        },
        userId: {
          notIn: [user.userId, requestToUser.userId],
        },
      },
    });

    const notifications = [
      {
        userId: user.userId,
        title: "Request Raised",
        message: `You have raised a request to ${requestToUser.fullName} - ${requestToUser.role?.name}`,
        createdBy:
          user.role?.name === "Employee"
            ? NotificationCreator.Employee
            : user.role?.name === "Manager"
            ? NotificationCreator.Manager
            : user.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.General,
      },
      {
        userId: requestToUser.userId,
        title: "Request Raised",
        message: `${user.fullName} - ${user.role?.name} has raised a request to you`,
        createdBy:
          user.role?.name === "Employee"
            ? NotificationCreator.Employee
            : user.role?.name === "Manager"
            ? NotificationCreator.Manager
            : user.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.General,
      },
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "Request Raised",
        message: `${user.fullName} - ${user.role?.name} has raised a request to ${requestToUser.fullName} - ${requestToUser.role?.name}`,
        createdBy:
          user.role?.name === "Employee"
            ? NotificationCreator.Employee
            : user.role?.name === "Manager"
            ? NotificationCreator.Manager
            : user.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Request Raised",
        message: `${user.fullName} - ${user.role?.name} has raised a request to ${requestToUser.fullName} - ${requestToUser.role?.name}`,
        createdBy:
          user.role?.name === "Employee"
            ? NotificationCreator.Employee
            : user.role?.name === "Manager"
            ? NotificationCreator.Manager
            : user.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.General,
      })),
    ];

    const requests = await db.requests.create({
      data: {
        user: {
          connect: {
            userId: user.userId,
          },
        },
        requestTo: requestToUser.fullName + " - " + requestToUser.role?.name,
        RequestCategory: {
          connect: {
            name: category,
          },
        },
        requestMessage,
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json(requests, { status: 201 });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
