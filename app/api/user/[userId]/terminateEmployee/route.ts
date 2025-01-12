import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const { id } = await req.json();

    if (!id) {
      return new NextResponse("Employee Id is not Found", { status: 400 });
    }

    const employee = await db.userProfile.findFirst({
      where: {
        userId: id,
      },
      include: {
        status: true,
      },
    });

    if (!employee) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    const status = await db.status.findFirst({
      where: {
        name: "Terminated",
      },
    });

    if (!status) {
      return new NextResponse("Status not found", { status: 404 });
    }

    const user = await db.userProfile.findFirst({
      where: {
        userId,
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
        title: "Employee Terminated",
        message: `You have terminated ${employee.fullName}.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
      },
      {
        userId: id,
        title: "Employee Terminated",
        message: `You have been terminated by ${user.fullName}.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
      },
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "Employee Terminated",
        message: `${employee.fullName} has been terminated by ${user.fullName}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/admin/employees`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Employee Terminated",
        message: `${employee.fullName} has been terminated by ${user.fullName}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/employees`,
        type: NotificationType.General,
      })),
    ];

    const terminateEmployee = await db.userProfile.update({
      where: {
        userId: id,
      },
      data: {
        status: {
          connect: {
            id: status?.id,
          },
        },
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json(terminateEmployee, { status: 201 });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
