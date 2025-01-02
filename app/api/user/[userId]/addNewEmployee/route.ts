import { db } from "@/lib/db";
// import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const {
      fullName,
      email,
      password,
      gender,
      contactNumber,
      DOB,
      department,
      designation,
      role,
      salary,
      DOJ,
    } = await req.json();

    const user = await db.userProfile.findFirst({
      where: {
        userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // const admins = await db.userProfile.findMany({
    //   where: {
    //     role: { name: "Admin" },
    //     userId: {
    //       not: user.userId,
    //     },
    //   },
    // });

    // const ceo = await db.userProfile.findMany({
    //   where: { role: { name: "CEO" } },
    // });

    // const manager = await db.userProfile.findFirst({
    //   where: {
    //     department: {
    //       name: department,
    //     },
    //     userId: {
    //       not: user.userId,
    //     },
    //   },
    // });

    // const notifications = [
    //   {
    //     userId,
    //     title: "Leave Request Submitted",
    //     message: `Your leave request for ${leaveType} from ${startDate} to ${endDate} has been submitted.`,
    //     createdBy: NotificationCreator.Account,
    //     type: NotificationType.General,
    //     link: "/admin/leave-management/raise-requests",
    //   },
    //   ...(manager
    //     ? [
    //         {
    //           userId: manager.userId,
    //           title: "New Leave Request Raised",
    //           message: `${user.fullName} has submitted a leave request for ${leaveType} from ${startDate} to ${endDate}.`,
    //           createdBy: NotificationCreator.Employee,
    //           senderImage: user.userImage,
    //           link: `/manager/leave-management/manage-requests`,
    //           type: NotificationType.General,
    //         },
    //       ]
    //     : []),
    //   ...admins.map((admin) => ({
    //     userId: admin.userId,
    //     title: "New Leave Request Raised",
    //     message: `${user.fullName} has submitted a leave request for ${leaveType} from ${startDate} to ${endDate}.`,
    //     createdBy: NotificationCreator.Employee,
    //     senderImage: user.userImage,
    //     link: `/admin/leave-management/manage-requests`,
    //     type: NotificationType.General,
    //   })),
    //   ...ceo.map((ceo) => ({
    //     userId: ceo.userId,
    //     title: "New Leave Request Raised",
    //     message: `${user.fullName} has submitted a leave request for ${leaveType} from ${startDate} to ${endDate}.`,
    //     createdBy: NotificationCreator.Employee,
    //     senderImage: user.userImage,
    //     link: `/ceo/leave-management/manage-requests`,
    //     type: NotificationType.General,
    //   })),
    // ];

    const createNewEmployee = await db.userProfile.create({
      data: {
        fullName,
        email,
        password,
        ConfirmPassword: password,
        role: {
          connect: {
            name: role,
          },
        },
        designation: designation,
        department: {
          connect: {
            name: department,
          },
        },
        isHired: true,
        isVerified: true,
        DOB,
        DOJ,
        contactNumber,
        gender,
        salary,
      },
    });

    // await db.notifications.createMany({
    //   data: notifications,
    // });

    return NextResponse.json(createNewEmployee, { status: 201 });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
