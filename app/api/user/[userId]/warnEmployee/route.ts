import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const {
      id,
      fullName,
      role,
      department,
      designation,
      senderName,
      senderDesignation,
      title,
      warningMessage,
    } = await req.json();

    if (
      !id ||
      !fullName ||
      !role ||
      !department ||
      !designation ||
      !senderName ||
      !senderDesignation ||
      !title ||
      !warningMessage
    ) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const employee = await db.userProfile.findFirst({
      where: {
        userId: id,
      },
      include: {
        Warnings: true,
      },
    });

    if (!employee) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    const user = await db.userProfile.findFirst({
      where: {
        userId,
      },
      include: {
        role: true,
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
        title: "Warning Sent",
        message: `You have sent a warning to ${employee.fullName}.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
      },
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "Warning Sent",
        message: `${user.fullName} has sent a warning to ${employee.fullName}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/admin/employees`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Warning Sent",
        message: `${user.fullName} has sent a warning to ${employee.fullName}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/employees`,
        type: NotificationType.General,
      })),
    ];

    const warnEmployee = await db.warnings.create({
      data: {
        title,
        message: warningMessage,
        senderName,
        senderDesignation,
        createdBy:
          user.role?.name === "CEO"
            ? NotificationCreator.CEO
            : user.role?.name === "Admin"
            ? NotificationCreator.Admin
            : user.role?.name === "Manager"
            ? NotificationCreator.Manager
            : NotificationCreator.Account,
        user: {
          connect: {
            userId: id,
          },
        },
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json(warnEmployee, { status: 201 });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
